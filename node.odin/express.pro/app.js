const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello, world!"));

const PORT = 3000;
app.listen(PORT, (error) => {
  // This is important!
  // Without this, any startup errors will silently fail
  // instead of giving you a helpful error message.
    if (error) {
        throw error;
    }
    console.log(`My first Express app - listening on port ${PORT}!`);
});

app.set("views", Path2D.join(__dirname, "views"));
app.set("view engine", "ejs");
const path= required("node:path");
// app.js
app.get("/", (req, res) => {
    res.render("index", { message: "EJS rocks!" });
});
