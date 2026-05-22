"use server";

import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  await supabaseAdmin.from("tasks").insert({
    project_id: projectId,
    title: formData.get("title") as string,
    assigned_to: (formData.get("assignedTo") as string) || null,
    status: "todo",
    due_date: (formData.get("dueDate") as string) || null,
    flagged: formData.get("flagged") === "on",
  });
  revalidatePath(`/dashboard/owner/projects/${projectId}/tasks`);
}

export async function updateTaskStatus(taskId: string, status: string) {
  await supabaseAdmin.from("tasks").update({ status }).eq("id", taskId);
  revalidatePath(`/dashboard/owner/projects`);
}