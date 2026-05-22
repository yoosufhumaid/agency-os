import Link from "next/link";
import { redirect } from "next/navigation";
import {
  createTask,
  getEmployeeDashboardData,
  getOwnerEmployees,
  getOwnerProjects,
  getOwnerTasks,
  getUserProfile,
  updateTaskStatus,
} from "@/lib/supabaseServer";

async function createTaskAction(formData: FormData) {
  "use server";
  const { profile } = await getUserProfile();
  if (!profile || profile.role !== "owner") return;

  const projectId = formData.get("project_id")?.toString() ?? "";
  const assignedTo = formData.get("assigned_to")?.toString() ?? "";
  const title = formData.get("title")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const priority = formData.get("priority")?.toString() ?? "medium";
  const dueDate = formData.get("due_date")?.toString() ?? "";

  if (!projectId || !title) return;

  await createTask({
    projectId,
    assignedTo: assignedTo || undefined,
    title,
    description,
    priority,
    dueDate: dueDate || undefined,
  });
}

async function updateTaskAction(formData: FormData) {
  "use server";
  const taskId = formData.get("task_id")?.toString() ?? "";
  const status = formData.get("status")?.toString() ?? "todo";

  if (!taskId) return;

  await updateTaskStatus(taskId, status);
}

export default async function TasksPage() {
  const { session, profile } = await getUserProfile();
  if (!session || !profile) {
    redirect("/signin");
  }

  const tasks = profile.role === "owner" ? await getOwnerTasks(profile.id) : await getEmployeeDashboardData(profile.id);
  const projects = profile.role === "owner" ? await getOwnerProjects(profile.id) : [];
  const employees = profile.role === "owner" ? await getOwnerEmployees() : [];

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e]">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Task hub</p>
            <h1 className="text-4xl font-semibold text-[#1a1a2e] sm:text-5xl">Tasks and assignments</h1>
            <p className="max-w-2xl text-slate-600">
              {profile.role === "owner"
                ? "Create tasks for your team and keep delivery moving."
                : "Review your assigned tasks and update your status as work progresses."}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-slate-50 px-5 py-3 text-sm font-semibold text-[#1a1a2e] transition hover:border-[#5a4ee0]/40 hover:bg-slate-100"
          >
            Back to dashboard
          </Link>
        </div>

        {profile.role === "owner" ? (
          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a1a2e]">New task</h2>
            <form action={createTaskAction} className="mt-6 grid gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-500">
                  Project
                  <select name="project_id" required className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none">
                    <option value="">Select project</option>
                    {(projects || []).map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-slate-500">
                  Assign to
                  <select name="assigned_to" className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none">
                    <option value="">Unassigned</option>
                    {(employees || []).map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.full_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm text-slate-500">
                Task title
                <input name="title" required className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none" />
              </label>

              <label className="grid gap-2 text-sm text-slate-500">
                Description
                <textarea name="description" rows={4} className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none" />
              </label>

              <div className="grid gap-4 lg:grid-cols-3">
                <label className="grid gap-2 text-sm text-slate-500">
                  Priority
                  <select name="priority" defaultValue="medium" className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-slate-500">
                  Due date
                  <input name="due_date" type="date" className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none" />
                </label>
                <div />
              </div>

              <button type="submit" className="inline-flex w-full items-center justify-center rounded-2xl bg-[#5a4ee0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b42d9]">
                Create task
              </button>
            </form>
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Your tasks</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#1a1a2e]">Assigned tasks</h2>
            </div>
            <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-600">{tasks?.length ?? 0} tasks</span>
          </div>

          <div className="mt-8 space-y-4">
            {(tasks ?? []).length ? (
              (tasks ?? []).map((task) => (
                <div key={task.id} className="rounded-3xl border border-black/5 bg-slate-50 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{task.project?.name ?? "Project"}</p>
                      <h3 className="mt-2 text-xl font-semibold text-[#1a1a2e]">{task.title}</h3>
                      {profile.role === "owner" ? (
                        <p className="mt-2 text-sm text-slate-500">Assigned to {task.assignee?.full_name ?? "unassigned"}</p>
                      ) : null}
                    </div>
                    <div className="space-y-2 text-right">
                      <span className="inline-flex rounded-full bg-[#ede9ff] px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#5a4ee0]">
                        {task.status}
                      </span>
                      <p className="text-sm text-slate-500">Due {task.due_date ?? "TBA"}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {profile.role === "owner" ? (
                      <form action={updateTaskAction} className="grid gap-2 rounded-3xl border border-black/10 bg-white p-4">
                        <input type="hidden" name="task_id" value={task.id} />
                        <label className="grid gap-2 text-sm text-slate-500">
                          Update status
                          <select name="status" defaultValue={task.status} className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none">
                            <option value="todo">Todo</option>
                            <option value="in_progress">In progress</option>
                            <option value="done">Done</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </label>
                        <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-[#5a4ee0] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4b42d9]">
                          Save status
                        </button>
                      </form>
                    ) : (
                      <div className="grid gap-2 rounded-3xl border border-black/10 bg-slate-100 p-4">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Update status</p>
                        <form action={updateTaskAction} className="grid gap-3">
                          <input type="hidden" name="task_id" value={task.id} />
                          <button name="status" value="in_progress" className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-sm text-[#1a1a2e] transition hover:bg-slate-200">
                            Mark in progress
                          </button>
                          <button name="status" value="done" className="rounded-2xl border border-black/10 bg-[#5a4ee0] px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-[#4b42d9]">
                            Mark done
                          </button>
                          <button name="status" value="blocked" className="rounded-2xl border border-black/10 bg-[#f3d1d8] px-4 py-3 text-left text-sm font-semibold text-[#9d2f45] transition hover:bg-[#f1b2c2]">
                            Flag blocked
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-3xl border border-dashed border-black/10 bg-slate-50 p-6 text-sm text-slate-500">
                No tasks found for your role yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
