const express = require("express");
const { sql, poolPromise } = require("../db");
const isAuth = require("../middleware/auth");

const router = express.Router();

// SEND MESSAGE
router.post("/send", isAuth, async (req, res) => {
    const senderId = req.session.user.id;
    const { receiverId, content } = req.body;

    const pool = await poolPromise;

    await pool.request()
        .input("sender", sql.Int, senderId)
        .input("receiver", sql.Int, receiverId)
        .input("content", sql.Text, content)
        .query(`
            INSERT INTO messages (sender_id, receiver_id, content)
            VALUES (@sender, @receiver, @content)
        `);

    res.send("Message sent");
});

// GET CHAT
router.get("/:userId", isAuth, async (req, res) => {
    const currentUser = req.session.user.id;
    const otherUser = parseInt(req.params.userId);

    const pool = await poolPromise;

    const result = await pool.request()
        .input("a", sql.Int, currentUser)
        .input("b", sql.Int, otherUser)
        .query(`
            SELECT sender_id, receiver_id, content, created_at
            FROM messages
            WHERE (sender_id=@a AND receiver_id=@b)
                OR (sender_id=@b AND receiver_id=@a)
            ORDER BY created_at ASC
        `);

    res.json(result.recordset);
});

module.exports = router;