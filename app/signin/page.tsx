"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setMessage("Signed in successfully. Redirecting to your dashboard...");
    setEmail("");
    setPassword("");

    // Small delay to ensure the auth cookie is written before navigating.
    // window.location.href causes a hard reload that races with cookie writing.
    // Using a timeout gives the browser time to persist the session cookie first.
    setTimeout(() => {
      window.location.replace("/dashboard");
    }, 500);
  };

  return (
    <main className="min-h-screen bg-[#08080f] text-zinc-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/80 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-white">Agency</span>
              <span className="text-2xl font-semibold" style={{ color: "#7c6cfa" }}>OS</span>
            </div>
            <p className="mt-2 text-sm text-zinc-300">Owner · Employee · Client</p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">AgencyOS access</p>
          <h1 className="text-3xl font-semibold text-white">Sign in to your workspace</h1>
          <p className="text-sm text-zinc-400">
            Use your agency email and password to log in. Owners, employees, and clients share a single secure login flow.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm text-zinc-300">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@agency.com"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-[#7c6cfa] focus:ring-2 focus:ring-[#7c6cfa]/30"
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none transition focus:border-[#7c6cfa] focus:ring-2 focus:ring-[#7c6cfa]/30"
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#7c6cfa] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6a57e6]"
          >
            Sign in
          </button>

          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </form>
      </div>
    </main>
  );
}
