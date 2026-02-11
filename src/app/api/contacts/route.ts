import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const { data, error } = await getSupabase().from("contacts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ contacts: data || [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, ...contactData } = body;
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const { data, error } = await getSupabase().from("contacts").insert({ user_id: userId, ...contactData }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ contact: data });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, userId, ...updates } = body;
  if (!id || !userId) return NextResponse.json({ error: "id and userId required" }, { status: 400 });
  const { data, error } = await getSupabase().from("contacts").update(updates).eq("id", id).eq("user_id", userId).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ contact: data });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const userId = req.nextUrl.searchParams.get("userId");
  if (!id || !userId) return NextResponse.json({ error: "id and userId required" }, { status: 400 });
  const { error } = await getSupabase().from("contacts").delete().eq("id", id).eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
