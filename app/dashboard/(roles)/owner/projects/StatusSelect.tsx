"use client";

import { useTransition } from "react";
import { updateProjectStatus } from "./actions";

export default function StatusSelect({ projectId, currentStatus }: { projectId: string; currentStatus: string }) {
  const [, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      onChange={(e) => {
        const newStatus = e.target.value;
        startTransition(() => updateProjectStatus(projectId, newStatus));
      }}
      className={`rounded-full px-3 py-1 text-xs font-semibold border-0 cursor-pointer focus:outline-none ${
        currentStatus === "completed" ? "bg-emerald-100 text-emerald-700" :
        currentStatus === "active" ? "bg-[#ede9ff] text-[#5a4ee0]" :
        currentStatus === "on_hold" ? "bg-yellow-100 text-yellow-700" :
        "bg-rose-100 text-rose-700"
      }`}
    >
      <option value="active">active</option>
      <option value="on_hold">on_hold</option>
      <option value="completed">completed</option>
      <option value="cancelled">cancelled</option>
    </select>
  );
}