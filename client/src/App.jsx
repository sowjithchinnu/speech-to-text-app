import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an audio file");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/transcribe",
        formData
      );

      setTranscription(response.data.text);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Arial",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "450px",
          background: "#111",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "30px",
          }}
        >
          Speech To Text 🎤
        </h1>

        <label
          style={{
            display: "inline-block",
            background: "#2563eb",
            padding: "12px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Choose Audio File
          <input
            type="file"
            accept="audio/*"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {file && (
          <p
            style={{
              marginBottom: "20px",
              color: "#60a5fa",
              wordBreak: "break-word",
            }}
          >
            {file.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "10px",
            background: "#2563eb",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Transcribing..." : "Upload Audio"}
        </button>

        {transcription && (
          <div
            style={{
              marginTop: "30px",
              textAlign: "left",
              background: "#1a1a1a",
              padding: "20px",
              borderRadius: "10px",
              lineHeight: "1.7",
            }}
          >
            <h3>Transcription:</h3>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;