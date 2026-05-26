import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function AuthPanel({ user, onUserChange, setMessage, loading, setLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleAuth = async () => {
    setMessage("");
    setLoading(true);

    if (!email || !password) {
      setMessage("Please provide both email and password.");
      setLoading(false);
      return;
    }

    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setStatusMessage(error.message);
      } else {
        const ok = "Signup successful. Please check your email to confirm.";
        setMessage(ok);
        setStatusMessage(ok);
        onUserChange(data.user || null);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setStatusMessage(error.message);
      } else {
        const ok = "Logged in successfully.";
        setMessage(ok);
        setStatusMessage(ok);
        onUserChange(data.user || null);
      }
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Logged out successfully.");
      onUserChange(null);
    }

    setLoading(false);
  };

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Account</h2>
          <p className="mt-2 text-sm text-slate-400">
            {user
              ? "Manage your session and view your profile."
              : "Sign in (optional) to save transcriptions — uploads work without login."}
          </p>
        </div>

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="rounded-3xl bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Logout
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsRegister((current) => !current)}
            className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {isRegister ? "Switch to Login" : "Create Account"}
          </button>
        )}
      </div>

      {user ? (
        <div className="mt-6 rounded-3xl bg-slate-900/80 px-5 py-4 text-slate-200">
          <p className="font-medium text-slate-50">Signed in as</p>
          <p className="mt-1 text-sm text-cyan-300">{user.email}</p>
          <p className="mt-2 text-sm text-slate-400">User ID: {user.id}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr]">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-cyan-500/40"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-cyan-500/40"
          />
          <button
            type="button"
            onClick={handleAuth}
            disabled={loading}
            className="mt-2 rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:col-span-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRegister ? "Sign Up" : "Login"}
          </button>
        </div>
      )}
      {statusMessage && (
        <div className="mt-6 rounded-3xl border border-cyan-500/15 bg-slate-950/90 px-5 py-4 text-sm text-slate-200">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
