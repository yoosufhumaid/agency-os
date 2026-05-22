import { createClient } from "@/lib/supabaseServer";
import Sidebar from "../Sidebar";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const { data: messages } = await supabase
    .from("messages")
    .select("id")
    .eq("receiver_id", session?.user?.id ?? "")
    .eq("is_read", false);

  const unreadCount = messages?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e]">
      <div className="mx-auto flex min-h-screen max-w-full">
        <aside className="hidden w-[280px] shrink-0 border-r border-black/5 bg-white px-5 py-6 md:flex md:flex-col">
          <div className="mb-10 px-2">
            <div className="text-2xl font-semibold text-[#1a1a2e]">Agency<span className="text-[#5a4ee0]">OS</span></div>
            <p className="mt-3 text-sm text-slate-500">A premium workspace with clean role navigation.</p>
          </div>
          <Sidebar unreadCount={unreadCount} />
        </aside>

        <main className="flex-1 bg-[#f8f7ff] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}