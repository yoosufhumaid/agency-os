"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

type Task = any;

export default function TaskFilter({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<"all" | "flagged" | "completed">("all");

  const filtered = useMemo(() => {
    if (filter === "flagged") return tasks.filter((t: any) => t.flagged);
    if (filter === "completed") return tasks.filter((t: any) => t.status === "done");
    return tasks;
  }, [filter, tasks]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === "all" ? "bg-[#7c6cfa] text-white" : "bg-white border border-black/5 text-[#1a1a2e]"}`}>All</button>
        <button onClick={() => setFilter("flagged")} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === "flagged" ? "bg-[#7c6cfa] text-white" : "bg-white border border-black/5 text-[#1a1a2e]"}`}>Flagged</button>
        <button onClick={() => setFilter("completed")} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === "completed" ? "bg-[#7c6cfa] text-white" : "bg-white border border-black/5 text-[#1a1a2e]"}`}>Completed</button>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-black/5 rounded-2xl p-6 text-slate-500">No tasks found</div>
        ) : (
          filtered.map((task: any) => (
            <div key={task.id} className="bg-white border border-black/5 rounded-2xl p-4 flex items-start justify-between">
              <div className="flex items-start gap-4">
                {task.flagged ? <div className="text-rose-400">🚩</div> : <div style={{ width: 18 }} />}
                <div>
                  <div className="text-lg font-semibold text-[#1a1a2e]">{task.title}</div>
                  <div className="text-sm text-slate-500">{task.project?.name ?? "Unknown project"}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-500">{task.assignee?.full_name ?? "Unassigned"}</div>
                <div className="text-sm text-slate-500">{task.due_date ?? "No deadline"}</div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${
                    task.status === "done" ? "bg-emerald-100 text-emerald-700" : task.status === "in_progress" ? "bg-blue-100 text-blue-700" : task.status === "blocked" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                  }`}>{task.status}</span>
                </div>
                <Link href={`/dashboard/owner/projects/${task.project?.id}/tasks`} className="text-sm text-[#7c6cfa]">Open</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
