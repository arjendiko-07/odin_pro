const express = require("express");
const bcrypt = require("bcrypt");
const { sql, poolPromise } = require("../db");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const pool = await poolPromise;

    await pool.request()
        .input("username", sql.VarChar, username)
        .input("password", sql.VarChar, hashed)
        .query(`
            INSERT INTO users (username, password)
            VALUES (@username, @password)
        `);

    res.send("User created");
});

// LOGIN
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const pool = await poolPromise;

    const result = await pool.request()
        .input("username", sql.VarChar, username)
        .query(`
            SELECT * FROM users WHERE username=@username
        `);

    const user = result.recordset[0];

    if (!user) return res.status(404).send("User not found");

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).send("Wrong password");

    req.session.user = {
        id: user.id,
        username: user.username
    };

    res.send("Logged in");
});

module.exports = router;