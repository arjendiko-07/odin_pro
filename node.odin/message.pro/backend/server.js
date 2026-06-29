const express = require("express");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const profileRoutes = require("./routes/profile");

const app = express();
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    }
}));

// serve frontend folder as static files
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use("/profile", profileRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));

app.get("/", (req, res) => {
    res.send("Messaging API is running");
});