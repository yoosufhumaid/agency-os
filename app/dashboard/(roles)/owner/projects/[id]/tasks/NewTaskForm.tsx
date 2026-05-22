"use client";

import React from "react";
import { createTask } from "./actions";

type Employee = { id: string; full_name: string };

export default function NewTaskForm({ projectId, employees }: { projectId: string; employees: Employee[] }) {
  return (
    <form action={createTask} className="bg-white border border-black/5 rounded-2xl p-6">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="status" value="todo" />
      <div className="grid gap-4">
        <label className="text-sm text-slate-500">Title</label>
        <input name="title" className="bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" required />

        <label className="text-sm text-slate-500">Assign to</label>
        <select name="assignedTo" className="bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]">
          <option value="">Unassigned</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>{e.full_name}</option>
          ))}
        </select>

        <label className="text-sm text-slate-500">Due date</label>
        <input name="dueDate" type="date" className="bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" />

        <label className="inline-flex items-center gap-2 text-sm text-slate-500">
          <input name="flagged" type="checkbox" className="accent-red-500" /> Flagged
        </label>

        <div className="pt-2">
          <button type="submit" className="bg-[#7c6cfa] hover:bg-[#6a57e6] rounded-full px-5 py-2 text-sm font-semibold text-white">Create Task</button>
        </div>
      </div>
    </form>
  );
}
