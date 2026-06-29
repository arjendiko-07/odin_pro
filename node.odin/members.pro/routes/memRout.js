const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../config/db");

router.get("/join", (req, res) => {
    if (!req.user) return res.redirect("/auth/login");
    res.render("join");
});

router.post("/join", async (req, res) => {
    if (!req.user) return res.redirect("/auth/login");

    const { passcode } = req.body;
    const SECRET_CODE = "star7";

    if (passcode !== SECRET_CODE) return res.send("Wrong passcode");

    const pool = await poolPromise;
    await pool.request()
        .input("Id", sql.Int, req.user.Id)
        .query("UPDATE users SET IsMember = 1 WHERE Id = @Id");

    res.redirect("/");
});

module.exports = router;