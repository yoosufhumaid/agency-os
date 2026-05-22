import StatusSelect from "./StatusSelect";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import Link from "next/link";
import NewProjectForm from "./NewProjectForm";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/signin");

  const [{ data: projects }, { data: clients }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, status, progress, deadline, client_id")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("profiles").select("id, full_name").eq("role", "client"),
  ]);

  const clientIds = [...new Set((projects ?? []).map((p: any) => p.client_id).filter(Boolean))];
  const { data: clientProfiles } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name")
    .in("id", clientIds);

  const projectsList = (projects ?? []).map((p: any) => ({
    ...p,
    client: clientProfiles?.find((c: any) => c.id === p.client_id) ?? null,
  }));
  const clientsList = clients ?? [];

  const total = projectsList.length;
  const completed = projectsList.filter((p: any) => p.status === "completed").length;
  const active = projectsList.filter((p: any) => p.status === "active").length;
  const today = new Date().toISOString().slice(0, 10);
  const overdue = projectsList.filter((p: any) => p.deadline && p.deadline < today && p.status !== "completed").length;

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e] p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Projects</h1>
          <details className="">
            <summary className="inline-flex items-center gap-2 rounded-full bg-[#7c6cfa] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a57e6]">New Project</summary>
            <div className="mt-4">
              <NewProjectForm clients={clientsList} />
            </div>
          </details>
        </header>

        <section className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Projects</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{total}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{active}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{completed}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Overdue</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{overdue}</p>
          </div>
        </section>

        <section className="bg-white border border-black/5 rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-[#f1efff] text-slate-500 text-sm">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {projectsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-slate-400">No projects yet</td>
                  </tr>
                ) : (
                  projectsList.map((project: any) => (
                    <tr key={project.id} className="border-t border-black/5 bg-white text-slate-700">
                      <td className="px-4 py-4 text-slate-700">{project.name}</td>
                      <td className="px-4 py-4 text-slate-700">{project.client?.full_name ?? "—"}</td>
                      <td className="px-4 py-4"><StatusSelect projectId={project.id} currentStatus={project.status} /></td>
                      <td className="px-4 py-4 w-48">
                        <div className="bg-[#ede9ff] h-3 rounded-full overflow-hidden">
                          <div style={{ width: `${project.progress ?? 0}%` }} className="h-3 bg-[#7c6cfa]" />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-700">{project.deadline ?? "TBA"}</td>
                      <td className="px-4 py-4">
                        <Link href={`/dashboard/owner/projects/${project.id}/tasks`} className="inline-flex items-center gap-2 rounded-full bg-[#7c6cfa] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a57e6]">View Tasks</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
