import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import SignOutButton from "./SignOutButton";

type OwnerProject = {
  id: string;
  name: string;
  status: string;
  due_date: string | null;
  progress: number;
  client?: { full_name: string } | null;
};

type OwnerTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  project?: { name: string } | null;
};

type OwnerMessage = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: { full_name: string } | null;
};

type OwnerAttendance = {
  id: string;
  employee_id: string;
  check_in: string | null;
  status: string;
  day: string;
};

export default async function OwnerDashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/signin");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", session.user.id)
    .single();

  const ownerName = profileData?.full_name ?? session.user.email;

  const [{ data: projects }, { data: tasks }, { data: employeeProfiles }, { data: attendance }, { data: messages }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id, name, status, due_date, progress, client:profiles(full_name)")
        .order("due_date", { ascending: true }),
      supabase
        .from("tasks")
        .select("id, title, status, priority, due_date, project_id, project:projects(name)")
        .order("due_date", { ascending: true }),
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "employee"),
      supabase
        .from("attendance")
        .select("id, employee_id, check_in, status, day")
        .eq("day", new Date().toISOString().slice(0, 10)),
      supabase
        .from("messages")
        .select("id, sender_id, content, created_at, sender:profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

  const projectsList = projects as OwnerProject[] | null;
  const tasksList = tasks as OwnerTask[] | null;
  const employeeList = employeeProfiles as { id: string; full_name: string }[] | null;
  const attendanceList = attendance as OwnerAttendance[] | null;
  const messageList = messages as OwnerMessage[] | null;

  const totalProjects = projectsList?.length ?? 0;
  const openTasks = tasksList?.filter((task) => task.status !== "done").length ?? 0;
  const flaggedTasks = tasksList?.filter((task) => task.priority === "high" || task.status === "blocked").length ?? 0;
  const clockedIn = attendanceList?.filter((record) => record.status === "present").length ?? 0;

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e]">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Owner dashboard</p>
              <h1 className="text-4xl font-semibold text-[#1a1a2e] sm:text-5xl">Agency leadership center</h1>
              <p className="max-w-2xl text-slate-600">
                Welcome back, {ownerName}. Manage your projects, assign tasks, review messages, and keep the team aligned.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 rounded-3xl border border-black/5 bg-slate-50 p-5 lg:items-end">
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="text-lg font-semibold text-[#1a1a2e]">{ownerName}</p>
              <SignOutButton />
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total projects</p>
            <p className="mt-4 text-4xl font-semibold text-[#1a1a2e]">{totalProjects}</p>
          </div>
          <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Open tasks</p>
            <p className="mt-4 text-4xl font-semibold text-[#1a1a2e]">{openTasks}</p>
          </div>
          <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Flagged tasks</p>
            <p className="mt-4 text-4xl font-semibold text-[#1a1a2e]">{flaggedTasks}</p>
          </div>
          <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Clocked in</p>
            <p className="mt-4 text-4xl font-semibold text-[#1a1a2e]">{clockedIn}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Projects</p>
                  <h2 className="mt-3 text-2xl font-semibold text-[#1a1a2e]">Active projects</h2>
                </div>
                <Link
                  href="/dashboard/projects"
                  className="rounded-full border border-black/10 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#1a1a2e] transition hover:border-[#5a4ee0]/40 hover:bg-slate-100"
                >
                  View all
                </Link>
              </div>
              <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-black/5 bg-slate-50">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-black/5 bg-[#f1efff] px-6 py-4 text-sm uppercase tracking-[0.25em] text-slate-500">
                  <span>Name</span>
                  <span>Client</span>
                  <span>Status</span>
                  <span>Deadline</span>
                </div>
                <div className="space-y-3 px-6 py-5">
                  {(projectsList ?? []).map((project) => (
                    <div key={project.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 rounded-3xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                      <span>{project.name}</span>
                      <span>{project.client?.full_name ?? "—"}</span>
                      <span className="inline-flex items-center rounded-full bg-[#ede9ff] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#5a4ee0]">
                        {project.status}
                      </span>
                      <span>{project.due_date ?? "TBA"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Tasks</p>
                  <h2 className="mt-3 text-2xl font-semibold text-[#1a1a2e]">Upcoming work</h2>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                {(tasksList ?? []).slice(0, 6).map((task) => (
                  <div key={task.id} className="flex flex-col rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{task.project?.name ?? "Unassigned project"}</p>
                      <h3 className="mt-2 text-lg font-semibold text-[#1a1a2e]">{task.title}</h3>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500 sm:mt-0">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1">{task.due_date ?? "No deadline"}</span>
                      {task.priority === "high" || task.status === "blocked" ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-rose-700">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                          Flagged
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Attendance</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#1a1a2e]">Today&apos;s check-ins</h2>
              <div className="mt-6 space-y-3">
                {(attendanceList ?? []).map((record) => (
                  <div key={record.id} className="rounded-3xl border border-black/5 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                    <p className="font-medium text-[#1a1a2e]">Employee ID {record.employee_id}</p>
                    <p className="mt-1 text-slate-500">{record.status} • {record.check_in ?? "No check-in"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recent messages</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#1a1a2e]">Latest updates</h2>
              <div className="mt-6 space-y-4">
                {(messageList ?? []).map((message) => (
                  <div key={message.id} className="rounded-3xl border border-black/5 bg-slate-50 px-4 py-4 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{message.sender?.full_name ?? message.sender_id}</p>
                    <p className="mt-2 text-sm text-slate-700 line-clamp-2">{message.content}</p>
                    <p className="mt-3 text-xs text-slate-400">{new Date(message.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-dashed border-black/10 bg-slate-50 p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-[#5a4ee0]">AI Daily Summary</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#1a1a2e]">Coming soon</h2>
              <p className="mt-4 text-slate-500">This space will surface automated intelligence on delivery status, risks, and opportunities.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
