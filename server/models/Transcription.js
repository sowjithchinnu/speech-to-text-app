import mongoose from "mongoose";

const transcriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    audioPath: {
      type: String,
      required: true,
    },
    transcription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transcription", transcriptionSchema);
