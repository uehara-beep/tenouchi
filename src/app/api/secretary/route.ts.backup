import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function fetchGmailForUser(userId: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
    const res = await fetch(`${baseUrl}/api/gmail?action=fetch&userId=${userId}&max=5`);
    if (!res.ok) return "";
    const data = await res.json();
    if (!data.messages?.length) return "新着メールなし";
    return data.messages.map((m: any) =>
      `[${m.isUnread ? "未読" : "既読"}] ${m.from}: ${m.subject} - ${m.snippet?.slice(0, 80)}`
    ).join("\n");
  } catch {
    return "";
  }
}

async function fetchCalendar(): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
    const res = await fetch(`${baseUrl}/api/lineworks?action=calendar`);
    if (!res.ok) return "";
    const data = await res.json();
    if (!data.events?.length) return "今後の予定なし";

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    return data.events.map((ev: any) => {
      const startDate = ev.start?.split("T")[0] || "";
      const startTime = ev.start?.split("T")[1]?.slice(0, 5) || "";
      const endTime = ev.end?.split("T")[1]?.slice(0, 5) || "";
      let dayLabel = startDate;
      if (startDate === todayStr) dayLabel = "今日";
      else if (startDate === tomorrowStr) dayLabel = "明日";
      else {
        const d = new Date(startDate + "T00:00:00+09:00");
        const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
        dayLabel = `${d.getMonth() + 1}/${d.getDate()}(${weekdays[d.getDay()]})`;
      }
      const cal = ev.calendarName !== "基本" ? ` [${ev.calendarName}]` : "";
      const desc = ev.description ? ` / ${ev.description.slice(0, 50)}` : "";
      return `${dayLabel} ${startTime}-${endTime} ${ev.title}${desc}${cal}`;
    }).join("\n");
  } catch {
    return "";
  }
}

function buildSystemPrompt(profile: any, gmailContext: string, calendarContext: string): string {
  const name = profile?.name || "ユーザー";
  const company = profile?.company || "";
  const role = profile?.role || "";

  let companyCtx = "";
  if (company) {
    companyCtx = `User works at ${company}.`;
    if (role) companyCtx += ` Role: ${role}.`;
  }

  const now = new Date();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日(${weekdays[now.getDay()]})`;

  let dataSection = "";
  if (gmailContext) dataSection += `\n\n【最新のGmail】\n${gmailContext}`;
  if (calendarContext) dataSection += `\n\n【スケジュール（LINE WORKS）】\n${calendarContext}`;

  return `You are TENOUCHI AI Secretary. The user is "${name}". ${companyCtx}
Today is ${dateStr}.

CRITICAL: Always reply in the SAME LANGUAGE the user writes in.

You have access to REAL data from Gmail and LINE WORKS Calendar (below).
Use this data to give accurate, specific answers.

Role:
- Concise responses (max 8 lines)
- Schedule: report today's and upcoming events with times
- Email: summarize unread/important emails
- Money tracking: confirm amounts and categories
- Prioritize: flag urgent items, conflicts, or important meetings

Tone: Professional executive secretary. Warm but efficient.${dataSection}`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, translate, originalText, userId } = await req.json();

    // Translation mode
    if (translate && originalText) {
      const transRes = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: `Translate. Japanese→English, English→Japanese. Output ONLY the translation:\n\n${originalText}` }],
      });
      const translated = transRes.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map(b => b.text).join("");
      return NextResponse.json({ reply: translated });
    }

    if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

    // Get user profile
    let profile = null;
    if (userId) {
      const { data } = await getSupabase().from("profiles").select("*").eq("user_id", userId).single();
      profile = data;
    }

    // Detect what context to fetch
    const msg = message.toLowerCase();
    const emailKeywords = ["メール", "mail", "email", "受信", "inbox", "未読", "unread", "gmail"];
    const scheduleKeywords = ["予定", "スケジュール", "schedule", "今日", "明日", "今週", "来週", "カレンダー", "calendar", "会議", "打ち合わせ", "出張", "meeting"];
    const isEmailQuery = emailKeywords.some(k => msg.includes(k));
    const isScheduleQuery = scheduleKeywords.some(k => msg.includes(k));

    // Fetch context in parallel
    const [gmailData, calendarData] = await Promise.all([
      (isEmailQuery && userId) ? fetchGmailForUser(userId) : Promise.resolve(""),
      isScheduleQuery ? fetchCalendar() : Promise.resolve(""),
    ]);

    const systemPrompt = buildSystemPrompt(profile, gmailData, calendarData);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    });

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map(b => b.text).join("");

    return NextResponse.json({ reply, hasGmail: !!profile?.gmail_token });
  } catch (error: any) {
    console.error("Secretary error:", error);
    return NextResponse.json({ reply: "エラーが発生しました。もう一度お試しください。" }, { status: 200 });
  }
}
