import { useState } from "react";
import axios from "axios";
import {
  FaMicrophone,
  FaCopy,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";

function App() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an audio file");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:3000/transcribe",
        formData
      );

      setTranscription(response.data.text);
      setMessage("Transcription completed successfully ✅");
    } catch (error) {
      console.log(error);
      setMessage("Transcription failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(transcription);
    setMessage("Copied to clipboard 📋");
  };

  const clearText = () => {
    setTranscription("");
    setFile(null);
    setMessage("Cleared 🧹");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#111",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
          color: "white",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "48px",
            marginBottom: "30px",
          }}
        >
          Speech To Text <FaMicrophone />
        </h1>

        <div style={{ textAlign: "center" }}>
          <label
            style={{
              display: "inline-block",
              background: "#2563eb",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: "pointer",
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
                marginTop: "15px",
                color: "#60a5fa",
              }}
            >
              {file.name}
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "25px",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: loading ? "#444" : "#2563eb",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Transcribing..." : "Upload Audio"}
        </button>

        {message && (
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: "#4ade80",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        )}

        {transcription && (
          <div
            style={{
              marginTop: "30px",
              background: "#1a1a1a",
              padding: "25px",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2>Transcription</h2>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={copyText}
                  style={{
                    background: "#2563eb",
                    border: "none",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <FaCopy />
                </button>

                <button
                  onClick={clearText}
                  style={{
                    background: "#dc2626",
                    border: "none",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <p
              style={{
                lineHeight: "1.8",
                color: "#ddd",
              }}
            >
              {transcription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;