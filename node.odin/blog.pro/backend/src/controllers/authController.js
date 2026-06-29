//checks the username/password and sends back responses
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {getPool, sql}=require('../config/db');

async function login(req, res){
    const {username, password}=req.body;

    try{
        const pool=await getPool();
        
        const result = await pool.request().input('username', sql.NVarChar, username).query('SELECT * FROM users WHERE username=@username');
        //look up the user by username
        const user= result.recordset[0];

        if(!user) return res.status(404).json({message: 'wrong password'});

        const token = jwt.sign(
            {id:user.id, is_author: user.is_author},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}//token expires after one day
        );

        res.json({token});

    }catch(err){
        res.status(500).json({message: err.message});
    }
}

module.exports={login};