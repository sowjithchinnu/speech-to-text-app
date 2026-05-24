const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-large-v3",
      response_format: "json",
      language: "en",
    });

    fs.unlinkSync(req.file.path);

    res.json({
      text: transcription.text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Transcription failed",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});