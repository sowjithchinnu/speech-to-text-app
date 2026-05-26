export default function Dropzone({
  file,
  fileInputRef,
  dragActive,
  setDragActive,
  onFileChange,
  onUpload,
  loading,
  user,
}) {
  const dragClasses = dragActive
    ? "border-cyan-400/70 bg-slate-900/90"
    : "border-white/10 bg-slate-900";

  const dropMessage = file
    ? `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`
    : "Drag audio here or click to browse";

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-cyan-500/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Upload audio</h2>
          <p className="mt-2 text-sm text-slate-400">
            Drag audio files into the area or use the picker below. Only audio is accepted.
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
          🎧
        </div>
      </div>

      <div
        className={`mt-8 rounded-[1.75rem] border-2 px-4 py-8 text-center transition sm:px-5 sm:py-10 ${dragClasses}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          const dropped = event.dataTransfer.files?.[0];
          if (dropped) {
            onFileChange({ target: { files: [dropped] } });
          }
        }}
      >
        <p className="text-lg font-medium text-slate-100">{dropMessage}</p>
        <p className="mt-2 text-sm text-slate-400">Accepted format: audio/*</p>
      </div>

      <label className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-3xl border border-white/10 bg-slate-900 px-5 py-4 text-sm text-slate-200 transition hover:border-cyan-500/40">
        <span className="font-medium text-slate-100">Browse files</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={onFileChange}
          className="sr-only"
        />
      </label>

      {file && (
        <div className="mt-4 rounded-3xl bg-slate-800/90 px-4 py-3 text-sm text-slate-300">
          <p className="font-medium text-slate-100">{file.name}</p>
          <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      <button
        type="button"
        onClick={onUpload}
        disabled={loading}
        className="mt-8 inline-flex w-full items-center justify-center rounded-3xl bg-cyan-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Transcribing..." : "Upload & Transcribe"}
      </button>
    </div>
  );
}
