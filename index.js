const express = require('express')
const fs = require('fs')
const app = express()
const path = require('path')

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/video.html', function(req, res) {
    res.sendFile(path.join(__dirname, '/video.html'))
})

app.get('/video', function(req, res) {
    const range = req.headers.range
    console.log(range)
    if (!range) {
        res.status(404).send("Requires Range header")
    }

    const videoPath = "f4ce5a07cf1c383989cc15652d71918d.mp4";
    const videoSize = fs.statSync(path.join(__dirname, videoPath)).size;

    // Parse Range
    // Example: "bytes=4444-"
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

    const contentLength = end - start + 1
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Range": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    }

    res.writeHead(206, headers)

    const videoStream = fs.createReadStream(path.join(__dirname, videoPath), { start, end});

    videoStream.pipe(res);
})

app.listen(8000, function() {
    console.log('listening on port 8000')
});