import TaskStatusSelect from "./TaskStatusSelect";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import NewTaskForm from "./NewTaskForm";

export default async function ProjectTasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/signin");

  const { data: project } = await (supabase as any)
    .from("projects")
    .select("id, name, status")
    .eq("id", id)
    .single();

  const [{ data: tasks }, { data: employees }] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, status, flagged, due_date, assigned_to")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("profiles").select("id, full_name").eq("role", "employee"),
  ]);

  const assigneeIds = [...new Set((tasks ?? []).map((t: any) => t.assigned_to).filter(Boolean))];
  const { data: assigneeProfiles } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name")
    .in("id", assigneeIds);

  const tasksList = (tasks ?? []).map((task: any) => ({
    ...task,
    assignee: assigneeProfiles?.find((profile: any) => profile.id === task.assigned_to) ?? null,
  }));
  const employeesList = employees ?? [];

  const total = tasksList.length;
  const flagged = tasksList.filter((t: any) => t.flagged).length;
  const completed = tasksList.filter((t: any) => t.status === "done").length;
  const pending = tasksList.filter((t: any) => t.status !== "done").length;

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e] p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center gap-4">
          <Link href="/dashboard/owner/projects" className="text-sm text-slate-500">← Back to projects</Link>
          <h1 className="text-2xl font-semibold">{project?.name}</h1>
          <span className="ml-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-white text-[#1a1a2e] border border-black/5">{project?.status}</span>
        </div>

        <section className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm text-[#1a1a2e]">
            <p className="text-sm text-slate-500">Total Tasks</p>
            <p className="mt-2 text-2xl font-semibold">{total}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm text-[#1a1a2e]">
            <p className="text-sm text-slate-500">Flagged</p>
            <p className="mt-2 text-2xl font-semibold">{flagged}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm text-[#1a1a2e]">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-2xl font-semibold">{completed}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm text-[#1a1a2e]">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-2 text-2xl font-semibold">{pending}</p>
          </div>
        </section>

        <section className="space-y-4">
          <details>
            <summary className="inline-flex items-center gap-2 rounded-full bg-[#7c6cfa] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a57e6]">New Task</summary>
            <div className="mt-4">
              <NewTaskForm projectId={id} employees={employeesList} />
            </div>
          </details>

          <div className="grid gap-4">
            {tasksList.length === 0 ? (
              <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm text-slate-500">No tasks yet</div>
            ) : (
              tasksList.map((task: any) => (
                <div key={task.id} className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1a1a2e]">{task.title}</h3>
                      <p className="text-sm text-slate-500">{task.assignee?.full_name ?? "Unassigned"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <TaskStatusSelect taskId={task.id} currentStatus={task.status} />
                      {task.flagged ? <span className="text-rose-500">🚩</span> : null}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-slate-500">Due: {task.due_date ?? "No deadline"}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
