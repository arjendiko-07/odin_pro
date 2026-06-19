const express=require("express");
const router = express.Router();
const prisma=require("../config/prisma");

router.get("/new", (req, res)=>{
    if(!req.user)return res.redirect("/auth/login");
    //guard: must be logged in to see the form, inline "if" without braces, works fine for single-line guards
    res.render("createMss");
});

router.post("/new", async(req, res)=>{
    if(!req.user)return res.redirect("/auth/login");//same guard on the POST route- prevents direct API calls withot login

    const {title, text}=req.body;//gets title and text from the submitted from

    await prisma.message.create({
        data: {
            title,
            text,
            userId: req.user.id,//links the message to the logged-in useer,
        },
    });

    res.redirect("/");//after posting, go back to home to see the new message
});

module.exports=router;