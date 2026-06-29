require("dotenv").config();
console.log("SECRET:", process.env.SESSION_SECRET);
const express = require("express");//loads the express framework
const session=require("express-session");//loads express-session handles user login sessions
const passport=require("passport");//loads passport.js -handles the actual authentication logic(checking username/passsword, managing login/logout)

const authRout=require("./routes/authRout");//routes for login/register pages(authentication)
const mssRout=require("./routes/messRout");//routes for messages
const indexRout=require("./routes/indexRout");//routes for the home index
const memRout = require("./routes/memRout");//routes for memeber only


const app= express();//creates the express application

app.set("view engine", "ejs");//tells express to use ejs for rendering html templates

app.use(express.urlencoded({extended: false}));//parses from data into req,body
app.use(express.static("public"));//serves statistic files from the public folder

app.use(
    session({
        secret: process.env.SESSION_SECRET,//the key used to sign/encrypt the session cookie, random string stored in .env
        resave: false,//dont resave the session if nothing changed
        saveUninitialized: false,//dont create a session until something is stored in it
    })
);

app.use(passport.initialize());//must come after session middleware, sets up passport on every request
app.use(passport.session());//tells passport to use express sessions to remember logged-in users

app.use("/", indexRout);//all requests to "/" go to indexRout
app.use("/auth", authRout);
app.use("/messages", mssRout);

app.use("/member", memRout);

app.listen(3000, ()=>{
    console.log("Server running on http://localhost:3000");
});