//gets, creates, updates, and deletes posts
const { getPool, sql } = require('../config/db');

async function getAllPosts(req, res) {
    try {
        const pool = await getPool();

        const result = await pool
            .request()
            .query('SELECT * FROM posts WHERE is_published = 1 ORDER BY created_at DESC');

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getPost(req, res) {
    try {
        const pool = await getPool();

        const result = await pool
            .request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM posts WHERE id = @id');

        if (!result.recordset[0]) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Create a new post (author only)
async function createPost(req, res) {
    const { title, content, is_published } = req.body;
    const author_id = req.user.id;

    try {
        const pool = await getPool();

        await pool
            .request()
            .input('title', sql.NVarChar, title)
            .input('content', sql.NVarChar, content)
            .input('is_published', sql.Bit, is_published ? 1 : 0)
            .input('author_id', sql.Int, author_id)
            .query(`
                INSERT INTO posts (title, content, is_published, author_id)
                VALUES (@title, @content, @is_published, @author_id)
            `);

        res.status(201).json({ message: 'Post created' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Edit a post
async function updatePost(req, res) {
    const { title, content, is_published } = req.body;

    try {
        const pool = await getPool();

        await pool
            .request()
            .input('id', sql.Int, req.params.id)
            .input('title', sql.NVarChar, title)
            .input('content', sql.NVarChar, content)
            .input('is_published', sql.Bit, is_published ? 1 : 0)
            .query(`
                UPDATE posts
                SET title = @title,
                    content = @content,
                    is_published = @is_published
                WHERE id = @id
            `);

        res.json({ message: 'Post updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Delete a post
async function deletePost(req, res) {
    try {
        const pool = await getPool();

        await pool
            .request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM posts WHERE id = @id');

        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getAllPostsForAuthor(req, res){
    try{
        const pool =await getPool();
        const result = await pool.request().query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(result.recordset);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

module.exports = {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getAllPostsForAuthor
};