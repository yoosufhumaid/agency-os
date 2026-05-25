import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import InviteForm from "./InviteForm";
import { removeTeamMember } from "./actions";
import RemoveButton from "./RemoveButton";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/signin");

  const { data: profiles } = await supabaseAdmin.from("profiles").select("id, email, full_name, role").neq("role", "owner");
  const members = profiles ?? [];
  const employees = members.filter((member: any) => member.role === "employee");
  const clients = members.filter((member: any) => member.role === "client");

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e] p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Team</h1>
            <p className="mt-2 text-sm text-slate-500">Manage invited employees and clients for your agency.</p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Employees</p>
            <p className="mt-2 text-3xl font-semibold text-[#1a1a2e]">{employees.length}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Clients</p>
            <p className="mt-2 text-3xl font-semibold text-[#1a1a2e]">{clients.length}</p>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a1a2e]">Employees</h2>
            <div className="mt-4 space-y-3">
              {employees.length === 0 ? (
                <div className="text-slate-500">No employee team members yet.</div>
              ) : (
                employees.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between rounded-2xl border border-black/5 bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-[#1a1a2e]">{member.full_name}</p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                    <RemoveButton userId={member.id} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a1a2e]">Clients</h2>
            <div className="mt-4 space-y-3">
              {clients.length === 0 ? (
                <div className="text-slate-500">No client team members yet.</div>
              ) : (
                clients.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between rounded-2xl border border-black/5 bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-[#1a1a2e]">{member.full_name}</p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                   <RemoveButton userId={member.id} />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1a1a2e] mb-4">Invite Team Member</h2>
          <InviteForm />
        </section>
      </div>
    </main>
  );
}
