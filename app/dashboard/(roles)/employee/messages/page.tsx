import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import MessageList from "./MessageList";
import ComposeForm from "./ComposeForm";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/signin");

  const { data: messages } = await supabase
    .from("messages")
    .select("id, subject, body, is_read, created_at, sender_id, project_id")
    .eq("receiver_id", session.user.id)
    .order("created_at", { ascending: false });

  const owners = await supabaseAdmin.from("profiles").select("id, full_name").eq("role", "owner");
  const profilesList = owners.data ?? [];

  const senderIds = [...new Set((messages ?? []).map((m: any) => m.sender_id).filter(Boolean))];
  const senderProfiles = senderIds.length
    ? (await supabaseAdmin.from("profiles").select("id, full_name").in("id", senderIds)).data ?? []
    : [];

  const projectIds = [...new Set((messages ?? []).map((m: any) => m.project_id).filter(Boolean))];
  const projects = projectIds.length
    ? (await supabase.from("projects").select("id, name").in("id", projectIds)).data ?? []
    : [];

  const messagesList = (messages ?? []).map((m: any) => ({
    ...m,
    sender: senderProfiles.find((p: any) => p.id === m.sender_id) ?? null,
    project: projects.find((p: any) => p.id === m.project_id) ?? null,
  }));

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e] p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Messages</h1>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <ComposeForm profiles={profilesList} />
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a1a2e] mb-4">Inbox</h2>
            <MessageList messages={messagesList} />
          </div>
        </section>
      </div>
    </main>
  );
}