import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });
  try {
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: `Web search query: "${query}". Provide a helpful, concise answer in Japanese. Include key facts, dates, and sources if relevant. Format clearly.` }],
    });
    const text = res.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map(b => b.text).join("");
    return NextResponse.json({ result: text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
