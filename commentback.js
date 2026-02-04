const multer = require("multer");
const express = require("express");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3290;

app.use(cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000", "http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allprevreview = path.resolve(__dirname, "uploads");  // join se better resolve ha.
app.use("/uploads", express.static(allprevreview));


cloudinary.config({
    cloud_name: process.env.cloud_folder,
    api_key: process.env.cloud_key,
    api_secret: process.env.cloud_secret
});

cloudinary.api.ping()
    .then(result => {
        console.log("Cloudi Connected successfully");
    })
    .catch(err => {
        console.error("C connection  stops:", err.message);
    });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith("video/");
        return {
            folder: "media_uploads",
            resource_type: isVideo ? "video" : "image",
            allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "mp4", "webm", "ogg", "mov"]
        };
    }
});

const uploads = multer({
    storage: storage,
    limits: {
        fileSize: 150 * 1024 * 1024 // 150MB
    },
    fileFilter(req, file, cb) {
        if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images and videos are allowed"));
        }
    }
});


// main   routing is here...
app.get("/", (req, res) => {
    res.status(200).json({
        status: "running",
        message: "works perfectly",
        port: PORT,
        endpoints: {
            upload: "POST /upload-cloud"
        }
    });
});

app.post("/upload-cloud", (req, res, next) => {
    next();
}, uploads.single("media"), (req, res) => {
    try {
        if (!req.file) {
            console.log("No file in request");
            return res.status(400).json({ Error: "No file upload" });
        }

        res.status(200).json({
            url: req.file.path,
            secure_url: req.file.path,
            public_id: req.file.filename,
            resource_type: req.file.mimetype.startsWith("video/") ? "video" : "image",
            format: req.file.format,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.message);

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
            error: "Files too large max 150MB compress it. then try"
        });
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: err.message
        });
    }

    res.status(500).json({
        error: err.message || "Server error"
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        method: req.method,
        path: req.path,
        availableRoutes: [
            "GET /",
            "POST /upload-cloud"
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Web working perfectly Run on http://localhost:${PORT}`);
});