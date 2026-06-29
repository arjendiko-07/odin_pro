const { poolPromise, sql } = require("../db/db");

async function followUser(req, res) {
    const followerId = req.session.user.uid; 
    const { userId } = req.body;

    try {
        const pool = await poolPromise;

        await pool.request()
            .input("followerId", sql.Int, followerId)
            .input("followingId", sql.Int, userId)
            .query(`
                INSERT INTO follows (follower_id, following_id, status)
                VALUES (@followerId, @followingId, 'accepted')
            `);

        res.json({ success: true });
    } catch (err) {
        console.error("Follow error:", err);
        res.status(500).json({ success: false, error: "Failed to follow" });
    }
}

async function unfollowUser(req, res) {
    const followerId = req.session.user.uid; // correct column name
    const { userId } = req.body;

    try {
        const pool = await poolPromise;

        await pool.request()
            .input("followerId", sql.Int, followerId)
            .input("followingId", sql.Int, userId)
            .query(`
                DELETE FROM follows
                WHERE follower_id = @followerId AND following_id = @followingId
            `);

        res.json({ success: true });
    } catch (err) {
        console.error("Unfollow error:", err);
        res.status(500).json({ success: false, error: "Failed to unfollow" });
    }
}

async function searchUsers(req, res) {
    const query = req.query.q || req.body.q;//use req.query.q or req.body.q depending on which exists

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("query", sql.NVarChar, `%${query}%`)
            .query(`
                SELECT uid, username, profile_picture
                FROM users
                WHERE username LIKE @query
            `);

        res.render("searchResults", { users: result.recordset });
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).send("Search failed");
    }
}

module.exports = { followUser, unfollowUser, searchUsers };