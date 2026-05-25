import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AuthPanel from "./components/AuthPanel";
import Dropzone from "./components/Dropzone";
import Transcriptions from "./components/Transcriptions";
import supabase from "./lib/supabaseClient";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

function App() {
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      fetchHistory(sessionUser?.id ?? "guest");
    };

    initializeSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      fetchHistory(currentUser?.id ?? "guest");
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) {
      return;
    }

    if (!selected.type.startsWith("audio/")) {
      setMessage("Only audio files are accepted.");
      return;
    }

    setFile(selected);
    setMessage("");
    setTranscription("");
  };

  const fetchHistory = async (currentUserId) => {
    const id = currentUserId ?? user?.id ?? "guest";

    try {
      const response = await axios.get(`${API_BASE}/transcriptions`, {
        params: { userId: id },
      });
      setHistory(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load transcription history.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an audio file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("userId", user?.id ?? "guest");

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(`${API_BASE}/transcribe`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTranscription(response.data.transcription);
      setMessage("Transcription completed successfully!");
      fetchHistory(user?.id ?? "guest");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Transcription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTranscription = async (id) => {
    try {
      await axios.delete(`${API_BASE}/transcriptions/${id}`);
      setMessage("Deleted transcription.");
      fetchHistory(user?.id ?? "guest");
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete transcription.");
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Copied transcription to clipboard.");
    } catch (error) {
      console.error(error);
      setMessage("Copy failed. Please try again.");
    }
  };

  const resetForNext = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setFile(null);
    setTranscription("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/85 shadow-[0_25px_80px_-45px_rgba(56,189,248,0.85)] backdrop-blur-xl">
          <div className="bg-slate-950/80 px-8 py-10 text-center sm:px-14">
            <p className="mb-4 inline-flex items-center rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-300">
              AI-driven speech transcription
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              AI Speech to Text
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Upload audio, transcribe instantly, and manage your transcription history with a clean modern interface.
            </p>
          </div>

          <div className="grid gap-8 px-6 pb-10 pt-8 sm:grid-cols-[1.6fr_1fr] sm:px-10">
            <section className="space-y-8">
              <AuthPanel user={user} onUserChange={setUser} setMessage={setMessage} setLoading={setLoading} />

              <Dropzone
                file={file}
                fileInputRef={fileInputRef}
                dragActive={dragActive}
                setDragActive={setDragActive}
                onFileChange={handleFileChange}
                onUpload={handleUpload}
                loading={loading}
                user={user}
              />

              {message && (
                <div className="rounded-3xl border border-cyan-500/15 bg-slate-950/90 px-5 py-4 text-sm text-slate-200">
                  {message}
                </div>
              )}

              {transcription && (
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/20">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">Latest Transcription</h2>
                      <p className="mt-2 text-sm text-slate-400">Review the text output from the most recent upload.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => copyText(transcription)}
                        className="rounded-3xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                      >
                        Copy Text
                      </button>
                      <button
                        type="button"
                        onClick={resetForNext}
                        className="rounded-3xl bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
                      >
                        Convert Next
                      </button>
                    </div>
                  </div>
                  <p className="mt-6 whitespace-pre-line break-words text-base leading-8 text-slate-300">
                    {transcription}
                  </p>
                </div>
              )}
            </section>

            <aside className="space-y-6">
              <Transcriptions
                history={history}
                fetchHistory={fetchHistory}
                copyText={copyText}
                deleteTranscription={deleteTranscription}
                apiBase={API_BASE}
                user={user}
              />
            </aside>
          </div>

          <div className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-400 sm:px-10">
            Built with React, Node.js, MongoDB & Groq AI 🚀
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
