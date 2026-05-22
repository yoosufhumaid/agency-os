"use client";

import { FormEvent, useState } from "react";
import { inviteTeamMember } from "./actions";

export default function InviteForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await inviteTeamMember(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setMessage("Invitation sent successfully.");
      (event.target as HTMLFormElement).reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-black/5 rounded-2xl p-6 space-y-4">
      <div>
        <label className="block text-sm text-slate-500">Full name</label>
        <input name="full_name" type="text" required className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" />
      </div>
      <div>
        <label className="block text-sm text-slate-500">Email</label>
        <input name="email" type="email" required className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]" />
      </div>
      <div>
        <label className="block text-sm text-slate-500">Role</label>
        <select name="role" defaultValue="employee" className="mt-1 w-full bg-slate-50 border border-black/10 rounded-xl px-4 py-2 text-[#1a1a2e]">
          <option value="employee">employee</option>
          <option value="client">client</option>
        </select>
      </div>
      <div>
        <button type="submit" className="bg-[#7c6cfa] hover:bg-[#6a57e6] rounded-full px-5 py-2 text-sm font-semibold text-white">Invite member</button>
      </div>
      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </form>
  );
}
