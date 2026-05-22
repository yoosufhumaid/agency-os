import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js";
import type { Database } from "./database.types";

type ProfileRow = Database["public"]["tables"]["profiles"]["Row"];
type ProjectRow = Database["public"]["tables"]["projects"]["Row"];
type TaskRow = Database["public"]["tables"]["tasks"]["Row"];
type AttendanceRow = Database["public"]["tables"]["attendance"]["Row"];

type UserProfileResult = {
  session: Session | null;
  profile: ProfileRow | null;
  sessionError: unknown;
  profileError: unknown;
};

type OwnerDashboardProjectRow = ProjectRow & {
  client?: {
    full_name: string;
  } | null;
};

type OwnerDashboardTaskRow = TaskRow & {
  project?: {
    name: string;
  } | null;
  assignee?: {
    full_name: string;
  } | null;
};

type ClientProjectRow = ProjectRow & {
  client?: {
    full_name: string;
  } | null;
};

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {}
        },
      },
    }
  );
}

export async function getUserProfile(): Promise<UserProfileResult> {
  const supabase = await createClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const session = sessionData?.session;

  if (!session) {
    return { session: null, profile: null, sessionError, profileError: null };
  }

  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, company, role, avatar_url")
    .eq("id", session.user.id)
    .single();

  const profile = data as ProfileRow | null;

  return {
    session,
    profile,
    sessionError,
    profileError,
  };
}

export async function getOwnerDashboardData(ownerId: string): Promise<{
  projects: OwnerDashboardProjectRow[];
  pendingTasks: OwnerDashboardTaskRow[];
  unreadMessages: number;
  attendance: { today: number; late: number };
  metrics: { totalProjects: number; totalTasks: number; pendingMessages: number };
  projectsError: any;
}> {
  const supabase = await createClient();

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, name, status, progress, due_date, client:profiles(full_name)")
    .eq("owner_id", ownerId)
    .order("due_date", { ascending: true });

  const projectsTyped = projects as OwnerDashboardProjectRow[] | null;
  const projectIds = projectsTyped?.map((project) => project.id) ?? [];

  const [{ data: pendingTasks }, { count: unreadMessages }, totalAttendance, lateAttendance] = await Promise.all([
    projectIds.length
      ? supabase
          .from("tasks")
          .select("id, title, status, priority, due_date, project_id, project:projects(name)")
          .eq("completed", false)
          .in("project_id", projectIds)
          .order("due_date", { ascending: true })
          .limit(6)
      : Promise.resolve({ data: [] as OwnerDashboardTaskRow[], error: null }),
    projectIds.length
      ? supabase
          .from("messages")
          .select("id, project_id, sender_id, content, created_at")
          .in("project_id", projectIds)
          .is("is_read", false)
      : Promise.resolve({ count: 0 } as any),
    supabase
      .from("attendance")
      .select("id", { count: "exact", head: true })
      .eq("day", new Date().toISOString().slice(0, 10)),
    supabase
      .from("attendance")
      .select("id", { count: "exact", head: true })
      .eq("day", new Date().toISOString().slice(0, 10))
      .neq("status", "present"),
  ]);

  const pendingTasksTyped = pendingTasks as OwnerDashboardTaskRow[] | null;

  return {
    projects: projectsTyped ?? [],
    pendingTasks: pendingTasksTyped ?? [],
    unreadMessages: Number(unreadMessages ?? 0),
    attendance: {
      today: Number(totalAttendance?.count ?? 0),
      late: Number(lateAttendance?.count ?? 0),
    },
    metrics: {
      totalProjects: projectsTyped?.length ?? 0,
      totalTasks: pendingTasksTyped?.length ?? 0,
      pendingMessages: Number(unreadMessages ?? 0),
    },
    projectsError,
  };
}

export async function getOwnerClients() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id, full_name, company").eq("role", "client");
  return data as ProfileRow[] | null;
}

export async function getOwnerEmployees() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id, full_name").eq("role", "employee");
  return data as ProfileRow[] | null;
}

export async function getOwnerProjects(ownerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, name, description, status, budget, start_date, due_date, progress, client:profiles(full_name)")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  return data as Array<OwnerDashboardProjectRow> | null;
}

export async function createProject(ownerId: string, payload: {
  clientId: string;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  startDate?: string;
  dueDate?: string;
}) {
  const supabase = await createClient();
  const insertPayload: any = {
    owner_id: ownerId,
    client_id: payload.clientId,
    name: payload.name,
    description: payload.description ?? null,
    status: payload.status,
    budget: payload.budget ?? null,
    start_date: payload.startDate ?? null,
    due_date: payload.dueDate ?? null,
    progress: 0,
  };

  const insertResult = (await supabase.from("projects").insert(insertPayload)) as { data: ProjectRow[] | null; error: any };
  const { data, error } = insertResult;
  return { data, error };
}

export async function updateProjectStatus(projectId: string, status: string, progress: number) {
  const supabase = await createClient();
  const updatePayload: any = { status, progress };
  const { data, error } = await (supabase as any)
    .from("projects")
    .update(updatePayload)
    .eq("id", projectId);
  return { data, error };
}

export async function getOwnerTasks(ownerId: string) {
  const supabase = await createClient();
  const { data: projectIdsData } = await supabase.from("projects").select("id").eq("owner_id", ownerId);
  const projectIds = (projectIdsData as { id: string }[] | null)?.map((project) => project.id) ?? [];

  if (!projectIds.length) {
    return [] as Array<TaskRow & { project?: { name: string }; assignee?: { full_name: string } }>;
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, description, status, priority, due_date, completed, project_id, project:projects(name), assigned_to, assignee:profiles(id, full_name)")
    .in("project_id", projectIds)
    .order("due_date", { ascending: true });

  return tasks as Array<OwnerDashboardTaskRow> | null;
}

export async function createTask(payload: {
  projectId: string;
  assignedTo?: string;
  title: string;
  description?: string;
  priority: string;
  dueDate?: string;
}) {
  const supabase = await createClient();
  const insertPayload: any = {
    project_id: payload.projectId,
    assigned_to: payload.assignedTo ?? null,
    title: payload.title,
    description: payload.description ?? null,
    status: "todo",
    priority: payload.priority,
    due_date: payload.dueDate ?? null,
    completed: false,
  };

  const insertResult = (await supabase.from("tasks").insert(insertPayload)) as { data: TaskRow[] | null; error: any };
  const { data, error } = insertResult;
  return { data, error };
}

export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = await createClient();
  const completed = status === "done";
  const updatePayload: any = { status, completed };
  const { data, error } = await (supabase as any).from("tasks").update(updatePayload).eq("id", taskId);
  return { data, error };
}

export async function getEmployeeDashboardData(employeeId: string) {
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, status, priority, due_date, completed, project:projects(name)")
    .eq("assigned_to", employeeId)
    .order("due_date", { ascending: true });

  return tasks as Array<OwnerDashboardTaskRow> | null;
}

export async function getClientDashboardData(clientId: string) {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, status, progress, start_date, due_date, client:profiles(full_name)")
    .eq("client_id", clientId)
    .order("due_date", { ascending: true });

  return projects as Array<ClientProjectRow> | null;
}
