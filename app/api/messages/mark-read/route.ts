import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const { messageId } = await request.json();
    if (!messageId) return NextResponse.json({ ok: false }, { status: 400 });

    const supabase = await createClient();
    await supabase.from("messages").update({ is_read: true }).eq("id", messageId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
