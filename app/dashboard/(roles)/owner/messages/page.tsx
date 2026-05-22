import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import MessageList from "./MessageList";
import ComposeForm from "./ComposeForm";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/signin");

  const [{ data: messages }, { data: profiles }, { data: projects }] = await Promise.all([
    supabase
      .from("messages")
      .select("id, subject, body, is_read, created_at, sender_id, project_id")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("profiles").select("id, full_name, role"),
    supabase.from("projects").select("id, name"),
  ]);

  const senderIds = [...new Set((messages ?? []).map((m: any) => m.sender_id).filter(Boolean))];
  const { data: senderProfiles } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name")
    .in("id", senderIds);

  const messagesList = (messages ?? []).map((m: any) => ({
    ...m,
    sender: senderProfiles?.find((p: any) => p.id === m.sender_id) ?? null,
    project: (projects ?? []).find((p: any) => p.id === m.project_id) ?? null,
  }));

  const profilesList = profiles ?? [];
  const projectsList = projects ?? [];

  const total = messagesList.length;
  const unread = messagesList.filter((m: any) => !m.is_read).length;
  const projectsWithMessages = new Set(messagesList.map((m: any) => m.project_id).filter(Boolean)).size;

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e] p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Messages</h1>
          <details>
            <summary className="inline-flex items-center gap-2 rounded-full bg-[#7c6cfa] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a57e6]">Compose</summary>
            <div className="mt-4">
              <ComposeForm profiles={profilesList} projects={projectsList} />
            </div>
          </details>
        </header>

        <section className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Messages</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{total}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Unread</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{unread}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Projects with messages</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{projectsWithMessages}</p>
          </div>
        </section>

        <section>
          <MessageList messages={messagesList} />
        </section>
      </div>
    </main>
  );
}