"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signin");
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="inline-flex items-center justify-center rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400"
    >
      Sign out
    </button>
  );
}
