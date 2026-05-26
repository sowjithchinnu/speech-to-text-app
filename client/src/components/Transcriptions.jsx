import { useState } from "react";

export default function Transcriptions({
  history = [],
  fetchHistory,
  copyText,
  deleteTranscription,
  apiBase,
  user,
}) {
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  if (!history || history.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-white">Previous Transcriptions</h2>
        <p className="mt-3 text-sm text-slate-400">No transcriptions yet — upload some audio to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-xl">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Previous Transcriptions</h2>
          <p className="mt-1 text-sm text-slate-400">Your uploads (click a card to expand the full transcription).</p>
        </div>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">
          {history.length} saved
        </span>
      </div>

      <div className="space-y-4">
        {history.map((item) => {
          const isGuest = item.userId === "guest";
          const isExpanded = !!expanded[item._id];
          const excerpt = item.transcription?.slice(0, 240) ?? "";

          return (
            <div key={item._id} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-slate-900/80 p-5 hover:scale-[1.01] transition">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-cyan-300">{item.fileName}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <time className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</time>
                    {isGuest && <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-300">Guest</span>}
                    <span className="ml-2 text-xs text-slate-500">{item.transcription?.length ?? 0} chars</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={item.audioPath ? `${apiBase}/uploads/${item.audioPath}` : "#"}
                    download
                    className="rounded-3xl bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => copyText(item.transcription)}
                    className="rounded-3xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => deleteTranscription(item._id)}
                    className="rounded-3xl bg-rose-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-rose-400"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {item.audioPath && (
                <audio controls className="mt-4 w-full rounded-xl bg-slate-800 p-2" src={`${apiBase}/uploads/${item.audioPath}`} />
              )}

              <div className="mt-4 text-sm leading-7 text-slate-300">
                <p className={isExpanded ? "whitespace-pre-wrap break-words" : "whitespace-pre-line overflow-hidden break-words"}>
                  {isExpanded ? item.transcription : excerpt + (item.transcription && item.transcription.length > 240 ? "..." : "")}
                </p>

                {item.transcription && item.transcription.length > 240 && (
                  <button onClick={() => toggle(item._id)} className="mt-3 text-sm text-cyan-300">
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
