"use client";

import { useTransition } from "react";
import { updateTaskStatus } from "./actions";

export default function TaskStatusSelect({ taskId, currentStatus }: { taskId: string; currentStatus: string }) {
  const [, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      onChange={(e) => {
        const newStatus = e.target.value;
        startTransition(() => updateTaskStatus(taskId, newStatus));
      }}
      className={`rounded-full px-3 py-1 text-xs font-semibold border-0 cursor-pointer focus:outline-none ${
        currentStatus === "done" ? "bg-emerald-100 text-emerald-700" :
        currentStatus === "in_progress" ? "bg-blue-100 text-blue-700" :
        currentStatus === "blocked" ? "bg-rose-100 text-rose-700" :
        "bg-slate-100 text-slate-700"
      }`}
    >
      <option value="todo">todo</option>
      <option value="in_progress">in_progress</option>
      <option value="done">done</option>
      <option value="blocked">blocked</option>
    </select>
  );
}