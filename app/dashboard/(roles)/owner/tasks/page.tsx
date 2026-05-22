import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import TaskFilter from "./TaskFilter";

export default async function OwnerAllTasksPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/signin");

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, status, flagged, due_date, assigned_to, project:projects(id, name)")
    .order("due_date", { ascending: true });

  const assigneeIds = [...new Set((tasks ?? []).map((t: any) => t.assigned_to).filter(Boolean))];
  const { data: assigneeProfiles } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name")
    .in("id", assigneeIds);

  const tasksList = (tasks ?? []).map((t: any) => ({
    ...t,
    assignee: assigneeProfiles?.find((p: any) => p.id === t.assigned_to) ?? null,
  }));

  const total = tasksList.length;
  const flagged = tasksList.filter((t: any) => t.flagged).length;
  const inProgress = tasksList.filter((t: any) => t.status === "in_progress").length;
  const completed = tasksList.filter((t: any) => t.status === "done").length;

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e] p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Tasks</h1>
        </header>

        <section className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Tasks</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{total}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Flagged</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{flagged}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">In Progress</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{inProgress}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{completed}</p>
          </div>
        </section>

        <section className="bg-white border border-black/5 rounded-2xl p-6">
          <TaskFilter tasks={tasksList} />
        </section>
      </div>
    </main>
  );
}