import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabaseServer";

export default async function DashboardPage() {
  const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
    if (!session) {
      redirect("/signin");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error || !data) {
      // Profile not found - don't redirect to signin, show error
      // This prevents the redirect loop
      return (
        <div style={{ padding: 40, color: "white", background: "#000", minHeight: "100vh" }}>
          <h1>Profile Error</h1>
          <p>User ID: {session.user.id}</p>
          <p>Email: {session.user.email}</p>
          <p>Error: {error?.message ?? "No profile found"}</p>
          <p>This means your user exists in auth but has no matching row in the profiles table.</p>
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

  return (
    <div style={{ padding: 40, color: "white", background: "#000", minHeight: "100vh" }}>
      <h1>Debug Info</h1>
      <p>User: {user ? user.email : "NULL"}</p>
      <p>User ID: {user ? user.id : "NULL"}</p>
      <p>User Error: {userError ? userError.message : "none"}</p>
      <p>Profile: {profile ? JSON.stringify(profile) : "NULL"}</p>
      <p>Profile Error: {profileError ? profileError.message : "none"}</p>
    </div>
  );
}