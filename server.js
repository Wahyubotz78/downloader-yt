const express = require("express");
const ytdl = require("ytdl-core");
const path = require("path");

const app = express();
const PORT = 3000;

// Set folder views dan public
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Halaman utama
app.get("/", (req, res) => {
    res.render("index", { error: null });
});

// Proses download
app.get("/download", async (req, res) => {
    const videoURL = req.query.url;
    
    if (!ytdl.validateURL(videoURL)) {
        return res.render("index", { error: "URL tidak valid!" });
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
        ytdl(videoURL, { format: "mp4" }).pipe(res);
    } catch (err) {
        res.render("index", { error: "Gagal mengunduh video!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
