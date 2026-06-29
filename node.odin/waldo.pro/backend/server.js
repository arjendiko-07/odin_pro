require('dotenv').config();
const express = require('express');
const cors=require('cors');
const {v4: uuidv4}=require('uuid');//generates a random unique string, we use this as the session token so each game is uniqely identifiable
const {pool, poolConnect, sql}=require('./db');

const app=express();
app.use(cors());//allows the frontend (on a different port) to talk to this backend, without this the browser would block the request
app.use(express.json());//tells express to parse incoming request bodies as json, without this, req.body would be undefined

//wait for db before handling any request
app.use(async(req, res, next)=>{
    await poolConnect;
    next();//next() means "ok, continue to the actual route handler"
});

//get images, returns each unique image URL and the list of characters in it, the frontend uses this to build the image picker and know who to find

app.get('/images', async(req, res)=>{//returns each unique image url and the character in it
    try{
        const result=await pool.request().query('SELECT id, name, img_url FROM characters ORDER BY img_url, id');
        //fetches every character row, stored by image then by id


        //group character by image url into an object
        const images={};
        for (const row of result.recordset){
            if(!images[row.img_url]) images[row.img_url]=[];
            //if this image url hasnt been seen yet, create an empty array for it
            images[row.img_url].push({id:row.id, name: row.name});
        }
        
        //turn into an array: [{ url, characters: [...] }, ...]
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

//post, called when the user starts a game, creates a session row and returns a token the frontend stores in memory
app.post('/session/start', async(req, res)=>{
    const{imageUrl }=req.body;
    if(!imageUrl)return res.status(400).json({error: 'imageUrl required'});

    try{
        const token=uuidv4(); //random unique ID for this players game

        await pool.request().input('token', sql.NVarChar, token).input('img', sql.NVarChar, imageUrl).query(`
            INSERT INTO sessions(token, image_url, found)
            VALUES(@token, @img, '[]')
            `);//creates a new empty session row an automatic start_time
        res.json({token});
        //sends the token back to the frontend
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to start session'});
    }
});

//post, called when the user selects a character from the dropdown, checks if they clicked close enough to the real position.

app.post('/check', async(req, res)=>{

    const{token, characterId, xPercent, yPercent}=req.body;

    if(!token || !characterId || xPercent == null || yPercent == null)
        return res.status(400).json({error: 'Missing fields'});
    //xPercent == null catches both null and undefined(user didnt send it)
    try{
        const sessionResult=await pool.request().input('token', sql.NVarChar, token).query('SELECT * FROM sessions WHERE token =@token');
        if(!sessionResult.recordset.length)
            return res.status(404).json({error:'Session not found'});//if they alredy found this character, dont count it again

        const session = sessionResult.recordset[0];//recordset is the array of rows -[0]gets the first (and only) one

        //parse the found array from json text back into a js array
        const found= JSON.parse(session.found);
        if(found.includes(characterId))//if character alredy found dont count it again
            return res.json({correct:false, message:'Alredy found!'});


        //load the character real position
        const charResult = await pool.request().input('id', sql.Int, characterId).input('img', sql.NVarChar, session.image_url).query(`
            SELECT * FROM characters
            WHERE id=@id AND img_url=@img
            `);//loads the real position of the character they guessed

        if (!charResult.recordset.length)
            return res.status(404).json({error: 'Character not found'});

        const char =charResult.recordset[0];

        //check if the click is within tolerance on both axes
        const xClose=Math.abs(xPercent -char.x_percent)<=char.tolerance;
        const yClose=Math.abs(yPercent-char.y_percent)<=char.tolerance;

        if(!xClose || !yClose){
            return res.json({correct:false, message:'Not quite, try again!'});

        }
        //correct, add to found
        found.push(characterId);
        const foundJson=JSON.stringify(found);

        //load all characters for this image to check if game is compleate
        const allCharsResult=await pool.request().input('img', sql.NVarChar, session.image_url).query('SELECT id FROM characters WHERE img_url=@img');

        const allIds = allCharsResult.recordset.map(r=>r.id);
        const gameComplete = allIds.every(id=>found.includes(id));
        
        //every() returns true only if ALL ids are in the found array
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
            //sends back the real position so the frontend can place the marker exacly
        });

    }catch(err){
        console.error(err);
        res.status(500).json({error:'Check failed'});
    }
});

//get, returns top 10 fastest times for a given image, we encode the imageURL as base64 in the URL to avoid slash issues
app.get('/leaderboard/:imageUrlB64', async(req, res)=>{
    
    //the frontend sends the imageUrl encoded as base64 to avoid issues with
    const imageUrl=Buffer.from(req.params.imageUrlB64, 'base64').toString();
    //decode it back to the original string
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
            //datedif calculates how many seconds the game took
            //top 10 limits to the 10 fastest times
            //we only include rows where end_time and player_name are set
            //(meaning: game was compleated and name was submitted)

            res.json(result.recordset);
        }catch(err){
            console.error(err);
            res.status(500).json({error: 'Failed to load leaderborad'});
    }
});

//post, leaderboard, called after the game ends, saves the players name and their sessions
app.post('/leaderboard', async(req, res)=>{
    const{token, playerName}=req.body;

    if(!token || !playerName)
        return res.status(400).json({error: 'token and playername required'});

    try{
        await pool.request().input('name', sql.NVarChar, playerName).input('token', sql.NVarChar, token).query(`
            UPDATE sessions
            SET player_name=@name
            WHERE token = @token AND end_time IS NOT NULL
            `);
            //we only update if end_time is set -stops someone saving a name, before they`ve actually finished the game

            res.json({saved: true});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to save name'});
    }
});

//start server

const PORT=process.env.PORT || 3000;
//use port from .env if set, otherwise default to 3000
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));
