const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

router.get("/join", (req, res) => {
    if (!req.user) {
        return res.redirect("/auth/login");
        //if not logged in, cant join
    }

    res.render("join");
});

router.post("/join", async (req, res) => {
    if (!req.user) {
        return res.redirect("/auth/login");
        //same guard, must be logged in to submit the form too
    }

    const { passcode } = req.body;//gets the passcode the user typed from the form

    const SECRET_CODE = "star7";//the correct passcode to become a member

    if (passcode !== SECRET_CODE) {
        return res.send("Wrong passcode");//if wrong stop here
    }

    await prisma.user.update({
        where: {
            id: req.user.id,//finds the currently logged-in user
        },
        data: {
            isMember: true,//flips their flag to true in the database
        },
    });

    res.redirect("/");//after becoming a member, go home page, theyll now see author/date info on messages
});

module.exports = router;