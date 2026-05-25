"use server"

import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { revalidatePath } from "next/cache"

export async function markAttendance(formData: FormData) {
  await supabaseAdmin.from("attendance").upsert({
    user_id: formData.get("userId") as string,
    date: formData.get("date") as string,
    checked_in_at: (formData.get("checkedInAt") as string) || null,
    status: formData.get("status") as string,
  }, {
    onConflict: "user_id, date",
  })

  revalidatePath("/dashboard/owner/attendance")
}