//same as postController but for comments
const { getPool, sql } = require('../config/db');

// GET /posts/:postId/comments
async function getComments(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request()
        .input('postId', sql.Int, req.params.postId)
        .query('SELECT * FROM comments WHERE post_id = @postId ORDER BY created_at ASC');

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// POST /posts/:postId/comments — anyone can comment
async function createComment(req, res) {
    const { text, username } = req.body;

    try {
        const pool = await getPool();
        await pool.request()
            .input('text', sql.NVarChar, text)
            .input('username', sql.NVarChar, username)
            .input('postId', sql.Int, req.params.postId)
            .query(`
                INSERT INTO comments (text, username, post_id)
                VALUES (@text, @username, @postId)
        `);

        res.status(201).json({ message: 'Comment added' });
        } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// DELETE /comments/:commentId (author only)
async function deleteComment(req, res) {
    try {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, req.params.commentId)
            .query('DELETE FROM comments WHERE id = @id');

        res.json({ message: 'Comment deleted' });
        } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { getComments, createComment, deleteComment };