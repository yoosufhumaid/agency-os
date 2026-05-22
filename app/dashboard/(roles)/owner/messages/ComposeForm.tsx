"use client";

import React from "react";
import { sendMessage } from "./actions";

export default function ComposeForm({ profiles, projects }: { profiles: any[]; projects: any[] }) {
  return (
    <form action={sendMessage} className="bg-white border border-black/5 rounded-2xl p-6 space-y-4">
      <div>
        <label className="text-sm text-slate-500">Subject</label>
        <input name="subject" className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" required />
      </div>

      <div>
        <label className="text-sm text-slate-500">To</label>
        <select name="receiverId" className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]">
          <option value="">Select recipient</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>{p.full_name} {p.role ? `• ${p.role}` : ""}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-slate-500">CC (comma-separated names)</label>
        <input name="cc" className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" />
      </div>

      <div>
        <label className="text-sm text-slate-500">Project</label>
        <select name="projectId" className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]">
          <option value="">Select project</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>{proj.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-slate-500">Body</label>
        <textarea name="body" rows={4} className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" required />
      </div>

      <div>
        <button type="submit" className="bg-[#7c6cfa] hover:bg-[#6a57e6] rounded-full px-5 py-2 text-sm font-semibold text-white">Send</button>
      </div>
    </form>
  );
}
