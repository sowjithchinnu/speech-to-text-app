const express = require("express")
const cors = require("cors")
const multer = require("multer")

const app = express()

app.use(cors())
app.use(express.json())

// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const upload = multer({ storage })

// Test Route
app.get("/", (req, res) => {
    res.send("Backend running...")
})

// Upload Route
app.post("/upload", upload.single("audio"), (req, res) => {
    res.json({
        message: "File uploaded successfully",
        file: req.file,
    })
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})