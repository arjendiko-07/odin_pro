const express = require("express");
const path = require("path");
const session = require("express-session");
const { poolPromise, sql } = require("./db/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.get("/", (req, res) => res.render("login"));
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));

app.get("/home", async (req, res) => {
    if (!req.session.user) return res.redirect("/login");

    try {
        const pool = await poolPromise;

        
        const postsResult = await pool.request().query(`
            SELECT
                posts.pid,
                posts.content,
                posts.image_url,
                users.username,
                users.profile_picture,
                (SELECT COUNT(*) FROM likes WHERE likes.pid = posts.pid) AS like_count
            FROM posts
            JOIN users ON posts.uid = users.uid
            ORDER BY posts.pid DESC
        `);

        // All comments with the commenter's username
        const commentsResult = await pool.request().query(`
            SELECT comments.pid, comments.content, users.username
            FROM comments
            JOIN users ON comments.uid = users.uid
        `);

        // Attach comments to their post
        const posts = postsResult.recordset.map(post => ({
            ...post,
            comments: commentsResult.recordset.filter(c => c.pid === post.pid)
        }));

        // All users except the logged-in one
        const usersResult = await pool.request()
            .input("uid", sql.Int, req.session.user.uid)
            .query(`
                SELECT uid, username, profile_picture,
                CASE WHEN EXISTS (
                    SELECT 1 FROM follows
                    WHERE follower_id = @uid AND following_id = users.uid
                ) THEN 1 ELSE 0 END AS isFollowing
                FROM users
                WHERE uid != @uid
            `);

        res.render("homepage", {
            user: req.session.user,
            posts,
            users: usersResult.recordset
        });
    } catch (err) {
        console.error("HOME ERROR:", err);
        res.status(500).send("Something went wrong loading homepage");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));