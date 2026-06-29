const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../config/db");

router.get("/new", (req, res) => {
    if (!req.user) return res.redirect("/auth/login");
    res.render("createMss");
});

router.post("/new", async (req, res) => {
    if (!req.user) return res.redirect("/auth/login");

    const { title, text } = req.body;
    const pool = await poolPromise;
    await pool.request()
        .input("Title", sql.NVarChar, title)
        .input("MessageText", sql.NVarChar, text)
        .input("UserId", sql.Int, req.user.Id)
        .query("INSERT INTO Messages (Title, MessageText, UserId) VALUES (@Title, @MessageText, @UserId)");

    res.redirect("/");
});

module.exports = router;