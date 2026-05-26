import { File } from "node:buffer";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "node:path";
import mongoose from "mongoose";

import Groq from "groq-sdk";
import Transcription from "./models/Transcription.js";

dotenv.config();

const requiredEnvs = ["MONGO_URI", "GROQ_API_KEY"];
const missingEnvs = requiredEnvs.filter((key) => !process.env[key]);
if (missingEnvs.length > 0) {
  console.error("Missing required environment variables:", missingEnvs.join(", "));
  process.exit(1);
}

const uploadsPath = new URL("./uploads", import.meta.url).pathname;
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsPath));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const storage = multer.diskStorage({
  destination: uploadsPath,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({ storage });

app.get("/", (_req, res) => res.send("Server Running ✅"));

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const userId = req.body.userId || "guest";
    if (!req.file) {
      return res.status(400).json({ message: "No audio uploaded" });
    }

    const transcription = await groq.audio.transcriptions.create({
      file: new File([fs.readFileSync(req.file.path)], req.file.originalname),
      model: "whisper-large-v3",
    });

    const savedTranscription = await Transcription.create({
      userId,
      fileName: req.file.originalname,
      audioPath: req.file.filename,
      transcription: transcription.text,
    });

    res.json({ success: true, transcription: transcription.text, savedTranscription });
  } catch (error) {
    console.log("POST /transcribe error:", error);
    res.status(500).json({ message: error.message || "Transcription failed" });
  }
});

app.get("/transcriptions", async (req, res) => {
  try {
    const userId = req.query.userId || "guest";
    const transcriptions = await Transcription.find({ userId }).sort({ createdAt: -1 });
    res.json(transcriptions);
  } catch (error) {
    console.log("GET /transcriptions error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch transcriptions" });
  }
});

app.delete("/transcriptions/:id", async (req, res) => {
  try {
    await Transcription.findByIdAndDelete(req.params.id);
    res.json({ message: "Transcription deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete transcription" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));