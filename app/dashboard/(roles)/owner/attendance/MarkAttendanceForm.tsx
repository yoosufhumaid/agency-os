"use client";

import React from "react";
import { markAttendance } from "./actions";

export default function MarkAttendanceForm({ employees, today }: { employees: { id: string; full_name: string }[]; today: string }) {
  return (
    <form action={markAttendance} className="bg-white border border-black/5 rounded-2xl p-6 space-y-4">
      <div>
        <label className="text-sm text-slate-500">Employee</label>
        <select name="userId" className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]">
          <option value="">Select employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>{e.full_name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-slate-500">Status</label>
        <select name="status" className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]">
          <option value="present">present</option>
          <option value="late">late</option>
          <option value="absent">absent</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-slate-500">Check-in time</label>
        <input name="checkedInAt" type="time" className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" />
      </div>

      <div>
        <label className="text-sm text-slate-500">Date</label>
        <input name="date" type="date" defaultValue={today} className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" />
      </div>

      <div>
        <button type="submit" className="bg-[#7c6cfa] hover:bg-[#6a57e6] rounded-full px-5 py-2 text-sm font-semibold text-white">Record Attendance</button>
      </div>
    </form>
  );
}
