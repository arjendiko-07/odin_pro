const express = require('express');//imports express
const router = express.Router();//creates a router object
const { login } = require('../controllers/authController');//imports the login controller function

router.post('/login', login);//the full route becomes POST /auth/login

module.exports=router;