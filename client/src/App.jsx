function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">
        Speech To Text App
      </h1>

      <div className="bg-zinc-900 p-10 rounded-2xl shadow-lg w-[400px]">
        <input
          type="file"
          accept="audio/*"
          className="mb-4 block w-full"
        />

        <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl w-full">
          Upload Audio
        </button>
      </div>
    </div>
  )
}

export default App