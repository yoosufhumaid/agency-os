import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/signin");

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !data) {
    return (
      <div style={{ padding: 40, color: "white", background: "#000", minHeight: "100vh" }}>
        <h1>Profile Error</h1>
        <p>User ID: {session.user.id}</p>
        <p>Email: {session.user.email}</p>
        <p>Error: {error?.message ?? "No profile found"}</p>
      </div>
    );
  }

  const role = (data as { role: string }).role;

  if (role === "owner") redirect("/dashboard/owner");
  if (role === "employee") redirect("/dashboard/employee");
  if (role === "client") redirect("/dashboard/client");

  return (
    <div style={{ padding: 40, color: "white", background: "#000", minHeight: "100vh" }}>
      <h1>Unknown Role</h1>
      <p>Role found: {role}</p>
      <p>User ID: {session.user.id}</p>
    </div>
  );
}