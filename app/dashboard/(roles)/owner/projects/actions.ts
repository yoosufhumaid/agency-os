"use server"

import { createClient } from "@/lib/supabaseServer"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get("name") as string
  const clientId = formData.get("clientId") as string
  const deadline = formData.get("deadline") as string

  await supabase.from("projects").insert([{
    name,
    client_id: clientId,
    status: "active",
    deadline: deadline || null,
    progress: 0,
  }])

  revalidatePath("/dashboard/owner/projects")
}

export async function updateProjectStatus(projectId: string, status: string) {
  await supabaseAdmin.from("projects").update({ status }).eq("id", projectId);
  revalidatePath("/dashboard/owner/projects");
}