const express = require("express");
//loads the express library so we can use it, require() is node`s way of importing - equivalent to React`s import

const path = require("path"); // import path module
const app = express(); //creates the espress aplication

// import router
const indexRouter = require("./routes/indexRouter");
// tell express where ejs files are, loads the router file 
app.set("views", path.join(__dirname, "views"));
//tells express where to find the ejs tmplate files, __dirname=the folder where app.js lives
//path.join builds the full path

app.set("view engine", "ejs");//tells express to use ejs as template engine
//when we call res.render("index"), express looks for views/index.ejs


app.use(express.urlencoded({ extended: true }));//extended: true allows nested objects in form data
//middleware that reads html from submissions and puts the data into req.body, without this req.body would be undefined when a form is submitted


app.use(express.static(path.join(__dirname, "public")));
//serves files from the public folder directly to the browser, this is how your style.css is accessible at style.css in the browser

app.use("/", indexRouter);//hands all incoming requests to the rooter, "/" means all routers


const PORT = 3000;//the port number


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); //start the server and logs a message when its redy
});