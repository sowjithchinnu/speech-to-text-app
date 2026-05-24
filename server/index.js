const express = require("express")
const cors = require("cors")
const multer = require("multer")
const fs = require("fs")
const Groq = require("groq-sdk")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

// GROQ CLIENT
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// MULTER STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage })

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running...")
})

// TRANSCRIPTION ROUTE
app.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-large-v3",
      response_format: "json",
    })

    res.json({
      text: transcription.text,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: "Transcription failed",
    })
  }
})

// START SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000")
})