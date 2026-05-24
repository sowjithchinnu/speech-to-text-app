import axios from "axios"
import { useState } from "react"

function App() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState("")

  const handleUpload = async () => {
    const formData = new FormData()

    formData.append("audio", file)

    const response = await axios.post(
      "http://127.0.0.1:3000/upload",
      formData
    )

    setText(response.data.text)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold mb-10">
        Speech To Text 🎤
      </h1>

      <div className="bg-zinc-900 p-8 rounded-2xl w-[400px]">
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-5"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 px-4 py-2 rounded-xl w-full"
        >
          Upload Audio
        </button>

        {text && (
          <div className="mt-6">
            <h2 className="font-bold mb-2">
              Transcription:
            </h2>

            <p>{text}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App