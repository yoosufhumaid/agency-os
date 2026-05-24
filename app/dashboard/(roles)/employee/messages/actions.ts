"use server"

import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const receiverId = formData.get("receiverId") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;

  const { error: insertError } = await supabaseAdmin.from("messages").insert({
    sender_id: session.user.id,
    receiver_id: receiverId,
    project_id: null,
    subject,
    body,
    is_read: false,
  });

  if (!insertError) {
    const { data: receiverProfile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", receiverId)
      .single();

    if ((receiverProfile as any)?.email) {
      await resend.emails.send({
        from: "AgencyOS <onboarding@resend.dev>",
        to: (receiverProfile as any).email,
        subject: `New message: ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1a1a2e;">You have a new message</h2>
            <p style="color: #64748b;">You received a new message on AgencyOS.</p>
            <div style="background: #f8f7ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 0;"><strong>Message:</strong> ${body}</p>
            </div>
            <p style="color: #64748b; font-size: 14px;">Log in to AgencyOS to reply.</p>
          </div>
        `,
      });
    }
  }

  revalidatePath("/dashboard/employee/messages");
}

export async function markAsRead(messageId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  await supabaseAdmin
    .from("messages")
    .update({ is_read: true })
    .eq("id", messageId)
    .eq("receiver_id", session.user.id);

  revalidatePath("/dashboard/employee/messages");
}