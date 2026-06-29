const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

    function sendFile(filePath, statusCode = 200) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, {"Content-Type": "text/plain"});
                return res.end("Server Error");
            }

            res.writeHead(statusCode, {"Content-Type": "text/html"});
            res.end(data);
        });
    }

    if (req.url === "/") {
        sendFile("index.html");
    }
    else if (req.url === "/about") {
        sendFile("about.html");
    }
    else if (req.url === "/contact") {
        sendFile("contact.html");
    }
    else {
        sendFile("404.html", 404);
    }

});

server.listen(8080, () => {
    console.log("Server running on port 8080");
});