//sets up express, connects all the routes together, and enables CORS
require('dotenv').config();//loads variables from the .env file into process.env
const express = require('express');//import express framework
const cors = require('cors');//imports CROS middleware (allows requests from other domains)
const path = require("path");
const app = express();


//route modules
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();//create an express applictaion

app.use(cors());//enables cross=origin recourse sharing
app.use(express.json());//allows express to parse incoming json request bodies

app.use('/auth', authRoutes);//routes with /auth will be handled by authRoutes
app.use('/post', postRoutes);//routes starting with /post will be handled by postRoutes
app.use('/comments', commentRoutes);

module.exports=app;