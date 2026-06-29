const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../config/db");

router.get("/", async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT m.Id, m.Title, m.MessageText, m.CrearedAt, u.FirstName
        FROM Messages m
        JOIN users u ON m.UserId = u.Id
        ORDER BY m.CrearedAt DESC
    `);

    res.render("index", {
        user: req.user,
        messages: result.recordset,
    });
});

router.post("/delete/:id", async (req, res) => {
    if (!req.user) return res.status(403).send("Forbidden");

    const pool = await poolPromise;
    await pool.request()
        .input("Id", sql.Int, parseInt(req.params.id))
        .query("DELETE FROM Messages WHERE Id = @Id");

    res.redirect("/");
});

module.exports = router;