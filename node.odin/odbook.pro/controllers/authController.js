const bcrypt = require("bcrypt");//this is for hashing passwords
const { poolPromise, sql } = require("../db/db");//imports poolPromise and sql from db


//puts the new data in the database
async function signup(req, res) {
    const { username, name, age, profile_picture, bio, password } = req.body;//this is a shorter way of writing a class

    try {
        const password_hash = await bcrypt.hash(password, 10);//hashes password
        const pool = await poolPromise;//waits until sql server is connected

        await pool.request()//creates a sql request,basically makes a query  
            .input("username", sql.NVarChar, username)
            .input("name", sql.NVarChar, name)
            .input("age", sql.Int, age)
            .input("password_hash", sql.NVarChar, password_hash)
            .input("profile_picture", sql.NVarChar, profile_picture)
            .input("bio", sql.NVarChar, bio)
            .query(`
                INSERT INTO users (username, name, age, password_hash, profile_picture, bio)
                VALUES (@username, @name, @age, @password_hash, @profile_picture, @bio)
            `);

        res.redirect("/login");
    } catch (err) {
        console.error("Signup error:", err);
        res.redirect("/signup?error=Signup+failed.+Username+may+already+exist.");
    }
}


//logs you in with the alredy existing creditials
async function login(req, res) {
    const { username, password } = req.body;//gets username, password from the login form

    try {
        const pool = await poolPromise;//waits for sql server

        const result = await pool.request()
            .input("username", sql.NVarChar, username)
            .query(`SELECT * FROM users WHERE username = @username`);//looks for that username

        const user = result.recordset[0];//puts the user into an array as the first user

        if (!user) return res.redirect("/login?error=User+not+found.");//stops if user===null

        const match = await bcrypt.compare(password, user.password_hash);//compares the hashed passwords
        if (!match) return res.redirect("/login?error=Wrong+password.");

        // Store user in session using correct column name uid
        req.session.user = {//creates a session object
            uid: user.uid,
            username: user.username,
            name: user.name,
            bio: user.bio,
            profile_picture: user.profile_picture
        };

        res.redirect("/home");//gets us to home with the sessions data
    } catch (err) {
        console.error("Login error:", err);
        res.redirect("/login?error=Login+failed.+Please+try+again.");
    }
}

function logout(req, res) {
    req.session.destroy(() => res.redirect("/login"));//desttroys session and get us back to login
}

module.exports = { signup, login, logout };