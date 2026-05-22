import Link from "next/link";
import { redirect } from "next/navigation";
import { createProject, getOwnerClients, getOwnerProjects, getUserProfile, updateProjectStatus } from "@/lib/supabaseServer";

async function createProjectAction(formData: FormData) {
  "use server";
  const { profile } = await getUserProfile();
  if (!profile || profile.role !== "owner") return;

  const clientId = formData.get("client_id")?.toString() ?? "";
  const name = formData.get("name")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const status = formData.get("status")?.toString() ?? "planning";
  const budget = Number(formData.get("budget") ?? 0);
  const startDate = formData.get("start_date")?.toString() ?? "";
  const dueDate = formData.get("due_date")?.toString() ?? "";

  if (!clientId || !name) return;

  await createProject(profile.id, {
    clientId,
    name,
    description,
    status,
    budget: budget || undefined,
    startDate: startDate || undefined,
    dueDate: dueDate || undefined,
  });
}

async function updateProjectAction(formData: FormData) {
  "use server";
  const projectId = formData.get("project_id")?.toString() ?? "";
  const status = formData.get("status")?.toString() ?? "planning";
  const progress = Number(formData.get("progress") ?? 0);

  if (!projectId) return;

  await updateProjectStatus(projectId, status, Math.min(100, Math.max(0, progress)));
}

export default async function ProjectsPage() {
  const { session, profile } = await getUserProfile();
  if (!session || profile?.role !== "owner") {
    redirect("/signin");
  }

  const clients = (await getOwnerClients()) ?? [];
  const projects = (await getOwnerProjects(profile.id)) ?? [];

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e]">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Project management</p>
            <h1 className="text-4xl font-semibold text-[#1a1a2e] sm:text-5xl">Your projects</h1>
            <p className="max-w-2xl text-slate-600">
              Create new client engagements, track status, and update project progress from one place.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-slate-50 px-5 py-3 text-sm font-semibold text-[#1a1a2e] transition hover:border-[#5a4ee0]/40 hover:bg-slate-100"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a1a2e]">Active projects</h2>
            <div className="mt-6 space-y-4">
              {projects.length ? (
                projects.map((project) => (
                  <div key={project.id} className="rounded-3xl border border-black/5 bg-slate-50 p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{project.client?.full_name ?? "Client"}</p>
                        <h3 className="mt-2 text-xl font-semibold text-[#1a1a2e]">{project.name}</h3>
                        <p className="mt-2 text-sm text-slate-500">{project.description ?? "No description provided."}</p>
                      </div>
                      <div className="space-y-3 text-right">
                        <span className="inline-flex rounded-full bg-[#ede9ff] px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#5a4ee0]">
                          {project.status}
                        </span>
                        <p className="text-sm text-slate-500">Due {project.due_date ?? "TBA"}</p>
                        <p className="text-sm text-slate-500">Budget ${project.budget ?? 0}</p>
                      </div>
                    </div>
                    <form action={updateProjectAction} className="mt-6 grid gap-4 sm:grid-cols-3">
                      <input type="hidden" name="project_id" value={project.id} />
                      <label className="grid gap-2 text-sm text-slate-500">
                        Status
                        <select name="status" defaultValue={project.status} className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none">
                          <option value="planning">Planning</option>
                          <option value="active">Active</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                          <option value="paused">Paused</option>
                        </select>
                      </label>
                      <label className="grid gap-2 text-sm text-slate-500">
                        Progress
                        <input type="number" name="progress" defaultValue={project.progress} min={0} max={100} className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none" />
                      </label>
                      <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-[#5a4ee0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b42d9]">
                        Save
                      </button>
                    </form>
                  </div>
                ))
              ) : (
                <p className="rounded-3xl border border-dashed border-black/10 bg-slate-50 p-6 text-sm text-slate-500">
                  No projects found. Create a new project on the right.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1a1a2e]">Create a project</h2>
            <form action={createProjectAction} className="mt-6 space-y-4">
              <label className="grid gap-2 text-sm text-slate-500">
                Client
                <select name="client_id" required className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none">
                  <option value="">Select client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name ?? client.company ?? "Client"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-slate-500">
                Project name
                <input name="name" required className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none" />
              </label>
              <label className="grid gap-2 text-sm text-slate-500">
                Description
                <textarea name="description" rows={4} className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none" />
              </label>
              <label className="grid gap-2 text-sm text-slate-500">
                Status
                <select name="status" defaultValue="planning" className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none">
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-slate-500">
                Budget
                <input name="budget" type="number" step="0.01" className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-500">
                  Start date
                  <input name="start_date" type="date" className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none" />
                </label>
                <label className="grid gap-2 text-sm text-slate-500">
                  Due date
                  <input name="due_date" type="date" className="rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-[#1a1a2e] outline-none" />
                </label>
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-2xl bg-[#5a4ee0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b42d9]">
                Create project
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
