require('dotenv').config();
const express = require('express');
const cors=require('cors');
const {v4: uuidv4}=require('uuid');
const {pool, poolConnect, sql}=require('./db');
const path=require('path');

const app=express();
app.use(cors());
app.use(express.json());

// serve the frontend files (index.html, app.js, style.css) and the images folder
app.use(express.static(path.join(__dirname, 'public')));

//wait for db before handling any request
app.use(async(req, res, next)=>{
    await poolConnect;
    next();
});

app.get('/images', async(req, res)=>{
    try{
        const result=await pool.request().query('SELECT id, name, img_url FROM characters ORDER BY img_url, id');

        const images={};
        for (const row of result.recordset){
            if(!images[row.img_url]) images[row.img_url]=[];
            images[row.img_url].push({id:row.id, name: row.name});
        }
        
        const list=Object.entries(images).map(([url, characters])=>({
            url,
            characters
        }));

        res.json(list);
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to load images'});
    }
});

app.post('/session/start', async(req, res)=>{
    const{imageUrl }=req.body;
    if(!imageUrl)return res.status(400).json({error: 'imageUrl required'});

    try{
        const token=uuidv4();

        await pool.request().input('token', sql.NVarChar, token).input('img', sql.NVarChar, imageUrl).query(`
            INSERT INTO sessions(token, image_url, found)
            VALUES(@token, @img, '[]')
            `);
        res.json({token});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to start session'});
    }
});

app.post('/check', async(req, res)=>{

    const{token, characterId, xPercent, yPercent}=req.body;

    if(!token || !characterId || xPercent == null || yPercent == null)
        return res.status(400).json({error: 'Missing fields'});

    try{
        const sessionResult=await pool.request().input('token', sql.NVarChar, token).query('SELECT * FROM sessions WHERE token =@token');
        if(!sessionResult.recordset.length)
            return res.status(404).json({error:'Session not found'});

        const session = sessionResult.recordset[0];

        const found= JSON.parse(session.found);
        if(found.includes(characterId))
            return res.json({correct:false, message:'Already found!'});

        const charResult = await pool.request().input('id', sql.Int, characterId).input('img', sql.NVarChar, session.image_url).query(`
            SELECT * FROM characters
            WHERE id=@id AND img_url=@img
            `);

        if (!charResult.recordset.length)
            return res.status(404).json({error: 'Character not found'});

        const char =charResult.recordset[0];

        const xClose=Math.abs(xPercent -char.x_percent)<=char.tolerance;
        const yClose=Math.abs(yPercent-char.y_percent)<=char.tolerance;

        if(!xClose || !yClose){
            return res.json({correct:false, message:'Not quite, try again!'});
        }

        found.push(characterId);
        const foundJson=JSON.stringify(found);

        const allCharsResult=await pool.request().input('img', sql.NVarChar, session.image_url).query('SELECT id FROM characters WHERE img_url=@img');

        const allIds = allCharsResult.recordset.map(r=>r.id);
        const gameComplete = allIds.every(id=>found.includes(id));
        
        if(gameComplete){
            await pool.request().input('found', sql.NVarChar, foundJson).input('token', sql.NVarChar, token).query(`
                UPDATE sessions
                SET found=@found, end_time=GETDATE()
                WHERE token =@token
                `);
        }else{
            await pool.request().input('found', sql.NVarChar, foundJson).input('token', sql.NVarChar, token).query('UPDATE sessions SET found = @found WHERE token=@token');
        }

        res.json({
            correct: true,
            gameComplete,
            markerX: char.x_percent,
            markerY: char.y_percent,
        });

    }catch(err){
        console.error(err);
        res.status(500).json({error:'Check failed'});
    }
});

app.get('/leaderboard/:imageUrlB64', async(req, res)=>{
    const imageUrl=Buffer.from(req.params.imageUrlB64, 'base64').toString();
    try{
        const result=await pool.request().input('img', sql.NVarChar, imageUrl).query(`
            SELECT TOP 10
            player_name,
            DATEDIFF(SECOND, start_time, end_time)AS seconds
            FROM sessions
            WHERE image_url=@img
            AND end_time IS NOT NULL
            AND player_name IS NOT NULL
            ORDER BY seconds ASC
            `);
            res.json(result.recordset);
        }catch(err){
            console.error(err);
            res.status(500).json({error: 'Failed to load leaderboard'});
    }
});

app.post('/leaderboard', async(req, res)=>{
    const{token, playerName}=req.body;

    if(!token || !playerName)
        return res.status(400).json({error: 'token and playerName required'});

    try{
        await pool.request().input('name', sql.NVarChar, playerName).input('token', sql.NVarChar, token).query(`
            UPDATE sessions
            SET player_name=@name
            WHERE token = @token AND end_time IS NOT NULL
            `);
            res.json({saved: true});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to save name'});
    }
});

const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));