"use client";

import React from "react";
import { createProject } from "./actions";

type ClientProfile = { id: string; full_name: string };

export default function NewProjectForm({ clients }: { clients: ClientProfile[] }) {
  return (
    <form action={createProject} className="bg-white border border-black/5 rounded-2xl p-6">
      <div className="grid gap-4">
        <label className="text-sm text-slate-500">Project name</label>
        <input name="name" className="bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" required />

        <label className="text-sm text-slate-500">Client</label>
        <select name="clientId" className="bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]">
          <option value="">Select client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.full_name}</option>
          ))}
        </select>

        <label className="text-sm text-slate-500">Status</label>
        <select name="status" defaultValue="active" className="bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]">
          <option value="active">active</option>
          <option value="on_hold">on_hold</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>

        <label className="text-sm text-slate-500">Deadline</label>
        <input name="deadline" type="date" className="bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" />

        <div className="pt-2">
          <button type="submit" className="bg-[#7c6cfa] hover:bg-[#6a57e6] rounded-full px-5 py-2 text-sm font-semibold text-white">Create Project</button>
        </div>
      </div>
    </form>
  );
}
