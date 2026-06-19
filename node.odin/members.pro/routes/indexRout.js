const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");//loads prisma clients for DB queries

router.get("/", async (req, res) => {
    const messages = await prisma.message.findMany({
        include: { user: true },//include tells prisma to also fetch the related user for each message
        orderBy: { createdAt: "desc" },//sorts messages newest first
    });

    const user = req.user;//req.user is set by Passport after a successful login
    const isMember = user?.isMember || false;//
    const isAdmin = user?.isAdmin || false;//same pattern for admin status

    res.render("index", {
        user,
        messages,
        isMember,
        isAdmin,
        //all these variables become available inside index.ejs
    });
});

router.post("/delete/:id", async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).send("Forbidden");
        //403="you dont have premission", keeps the logins who arent admins out
    }

    const messageId = parseInt(req.params.id);
    //req.params.id comes as a string from URL so we use parseInt to convert it to number

    await prisma.message.delete({
        where: {
            id: messageId,//delets the specific message with this id
        },
    });

    res.redirect("/");//after deleting, go back to home page to see updated list
});

module.exports = router;