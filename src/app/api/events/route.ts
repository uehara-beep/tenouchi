import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const { data, error } = await supabase.from("family_events").select("*").eq("user_id", userId).order("date", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data });
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from("family_events").insert({ user_id: body.userId, title: body.title, date: body.date, category: body.category || "birthday", person: body.person || "", notes: body.notes || "" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data });
}
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await supabase.from("family_events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
