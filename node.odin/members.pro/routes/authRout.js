const express=require("express");
const router =express.Router();//standart router setup
const passport = require("../config/passport");//loads the passport configuration
const prisma=require("../config/prisma");//loads the prisma file for db operations
const bcrypt=require("bcrypt");//loads bycrypt for password hashing 

router.get("/signup", (req, res)=>{
    res.render("signup");//just shows the signup form
});

router.post("/signup", async(req, res)=>{
    const {firstName, lastName, email, password}=req.body;
    //destructures from fields from the submitted form data, these attributes must match the name attribute in signup.ejs

    const hashedPassword=await bcrypt.hash(password, 10);
    //hashes the plain text password before storing it

    await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,//stores the hashed passwords
        },
    });

    res.redirect("/auth/login");//after creating the account, send the user to the login page
});

router.get("/login", (req, res)=>{
    res.render("login");//just shows the login form
});

router.post(
    "/login",
    passport.authenticate("local", {
        //"local" refers to the localStrategy you deffine in config/passport.js
        successRedirect: "/",//if login is succesful send user to home page
        failureRedirect: "/auth/login",//if login fails send back to login page
    })
);

router.get("/logout", (req, res)=>{
    req.logout(()=>{
        //req.logout() is provided by Passport, it clears the user from the session, the callback is required in a newer version pf passport
        res.redirect("/");//after loging out go back to home page
    });
});

module.exports=router;