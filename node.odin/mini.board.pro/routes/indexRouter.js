const express = require("express"); //loads express so we can use its features
const router = express.Router(); // create a  mini-app that handels routers, instead of defining all routes in app.js we organize them here


const messages = [//this is basically the database 
    {
        text: "Good evening!",
        user: "Mizu",
        added: new Date()//creates a timestamp of the current moment
    },
    {
        text: "Heyy!!",
        user: "Ron",
        added: new Date()
    }
];

// HOME PAGE
router.get("/", (req, res) => {//req=the incoming request object(has url, body, params, etc), res=the response object(how you send something back)
    res.render("index", {
        title: "Mini Message Board",
        messages: messages//passes data into the ejs template
       //left side=name availale inside ejs, right side=the js variable 
    });
});

// NEW MESSAGE FORM PAGE
router.get("/new", (req, res) => {//handles get request to "/new", just shows the form
    res.render("form");
});

// HANDLE FORM SUBMISSION
router.post("/new", (req, res) => {//handels post requests to "/new", same url as above but different http method (get vs post)

    const messageUser = req.body.messageUser;//req.body contains the form data(thanks to express.urlencoded in app.js)
    const messageText = req.body.messageText;//same for the textarea - matches name="messageText" in form.ejs

    message.push({
        text: messageText,
        user: messageUser,
        added: new Date()
        //addds the new message to the array with a timestamp
    });

    res.redirect("/"); //sends the user back to the home page after submitting
});

// SINGLE MESSAGE PAGE
router.get("/message/:id", (req, res) => {
//":id" is a url parameter -it captures whatever is in that position
    const id = parseInt(req.params.id);//req.params.id is always a string, parseInt converts it to a number

    const singleMessage = messages[id];

    if (!singleMessage) {
        return res.status(404).send("Message not found");
    }

    res.render("message", {
        message: singleMessage//pass the found message into the message.ejs template
    });
});

module.exports = router;