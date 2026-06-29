const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const { sql, poolPromise } = require("../config/db");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await poolPromise;
    await pool.request()
        .input("FirstName", sql.NVarChar, firstName)
        .input("LastName", sql.NVarChar, lastName)
        .input("Email", sql.NVarChar, email)
        .input("PasswordHash", sql.NVarChar, hashedPassword)
        .query("INSERT INTO users (FirstName, LastName, Email, PasswordHash) VALUES (@FirstName, @LastName, @Email, @PasswordHash)");

    res.redirect("/auth/login");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/auth/login",
    })
);

router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});

module.exports = router;