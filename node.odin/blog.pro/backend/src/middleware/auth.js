//check if a request has valid jwt token before letting it through to protect routes
const jwt = require('jsonwebtoken');//imorts the library

function verifyToken(req, res, next){
    const authHeader = req.headers['authorization'];//gets the authorization header
    const token = authHeader && authHeader.split(' ')[1];//if authHeader exists split it by parts 

    if(!token)return res.status(401).json({message: 'No token provided'});//if no token was found return unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{//verify the token using the secret key
        if(err) return res.status(403).json({message: 'Invalid token'});//
        req.user=user;
        next();
    });
}

module.exports=verifyToken;