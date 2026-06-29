const { poolPromise, sql } = require("../db/db");

async function createPost(req, res) {
    const { content, image_url } = req.body;
    const uid = req.session.user.uid; // correct column name

    try {
        const pool = await poolPromise;

        await pool.request()
            .input("uid", sql.Int, uid)
            .input("content", sql.NVarChar, content)
            .input("image_url", sql.NVarChar, image_url)
            .query(`
                INSERT INTO posts (uid, content, image_url)
                VALUES (@uid, @content, @image_url)
            `);

        res.json({ success: true });
    } catch (err) {
        console.error("Create post error:", err);
        res.status(500).json({ success: false, error: "Failed to create post" });
    }
}

async function likePost(req, res) {
    const uid = req.session.user.uid; // correct column name
    const { postId } = req.body;

    try {
        const pool = await poolPromise;

        await pool.request()
            .input("uid", sql.Int, uid)
            .input("pid", sql.Int, postId)
            .query(`INSERT INTO likes (uid, pid) VALUES (@uid, @pid)`);

        // Return updated like count so button updates without reload
        const countResult = await pool.request()
            .input("pid", sql.Int, postId)
            .query(`SELECT COUNT(*) AS likes FROM likes WHERE pid = @pid`);

        res.json({ success: true, likes: countResult.recordset[0].likes });
    } catch (err) {
        console.error("Like post error:", err);
        res.status(500).json({ success: false, error: "Failed to like post" });
    }
}

async function commentPost(req, res) {
    const uid = req.session.user.uid; // correct column name
    const { pid, content } = req.body;

    try {
        const pool = await poolPromise;

        await pool.request()
            .input("uid", sql.Int, uid)
            .input("pid", sql.Int, pid)
            .input("content", sql.NVarChar, content)
            .query(`INSERT INTO comments (uid, pid, content) VALUES (@uid, @pid, @content)`);

        res.json({ success: true });
    } catch (err) {
        console.error("Comment error:", err);
        res.status(500).json({ success: false, error: "Failed to comment" });
    }
}

module.exports = { createPost, likePost, commentPost };