const express = require("express");
const { sql, poolPromise } = require("../db");
const isAuth = require("../middleware/auth");

const router = express.Router();

// UPDATE PROFILE
router.post("/update", isAuth, async (req, res) => {
    const userId = req.session.user.id;
    const { bio } = req.body;

    const pool = await poolPromise;

    await pool.request()
        .input("bio", sql.Text, bio)
        .input("id", sql.Int, userId)
        .query(`
            UPDATE users SET bio=@bio WHERE id=@id
        `);

    res.send("Profile updated");
});

module.exports = router;