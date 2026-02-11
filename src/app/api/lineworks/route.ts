import { NextRequest, NextResponse } from "next/server";

const LW_CLIENT_ID = process.env.LINEWORKS_CLIENT_ID || "";
const LW_CLIENT_SECRET = process.env.LINEWORKS_CLIENT_SECRET || "";
const LW_SERVICE_ACCOUNT = process.env.LINEWORKS_SERVICE_ACCOUNT || "";
const LW_PRIVATE_KEY = process.env.LINEWORKS_PRIVATE_KEY || "";
const LW_DOMAIN_ID = process.env.LINEWORKS_DOMAIN_ID || "";

// たくのLINE WORKS UID (TODO: move to profile)
const TAKU_LW_UID = "1c08c1b7-bc51-4876-1f87-05e4bd3e95f1";

let cachedToken: { token: string; expires: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.token;

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: LW_CLIENT_ID, sub: LW_SERVICE_ACCOUNT, iat: now, exp: now + 3600,
  })).toString("base64url");

  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(LW_PRIVATE_KEY.replace(/\\n/g, "\n"), "base64url");

  const res = await fetch("https://auth.worksmobile.com/oauth2/v2.0/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      assertion: `${header}.${payload}.${signature}`,
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      client_id: LW_CLIENT_ID,
      client_secret: LW_CLIENT_SECRET,
      scope: "directory.read,calendar",
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error(`LINE WORKS auth failed: ${JSON.stringify(data)}`);

  cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return data.access_token;
}

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");

  if (action === "status") {
    return NextResponse.json({
      configured: !!(LW_CLIENT_ID && LW_CLIENT_SECRET && LW_SERVICE_ACCOUNT),
      domainId: LW_DOMAIN_ID || null,
    });
  }

  if (action === "calendar") {
    try {
      const token = await getAccessToken();
      const userId = req.nextUrl.searchParams.get("lwUserId") || TAKU_LW_UID;
      const from = req.nextUrl.searchParams.get("from") || new Date().toISOString().split("T")[0] + "T00:00:00+09:00";
      const to = req.nextUrl.searchParams.get("to") || (() => {
        const d = new Date(); d.setDate(d.getDate() + 14);
        return d.toISOString().split("T")[0] + "T23:59:59+09:00";
      })();

      const allEvents: any[] = [];

      // 1. Default calendar
      try {
        const res = await fetch(
          `https://www.worksapis.com/v1.0/users/${encodeURIComponent(userId)}/calendar/events?fromDateTime=${encodeURIComponent(from)}&untilDateTime=${encodeURIComponent(to)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.events) allEvents.push(...data.events);
      } catch (e) { /* skip */ }

      // 2. Personal calendars (where the actual events are)
      try {
        const calRes = await fetch(
          `https://www.worksapis.com/v1.0/users/${encodeURIComponent(userId)}/calendar-personals`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const calData = await calRes.json();
        const calendars = calData.calendarPersonals || [];

        for (const cal of calendars) {
          try {
            const evRes = await fetch(
              `https://www.worksapis.com/v1.0/users/${encodeURIComponent(userId)}/calendars/${cal.calendarId}/events?fromDateTime=${encodeURIComponent(from)}&untilDateTime=${encodeURIComponent(to)}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const evData = await evRes.json();
            if (evData.events) {
              for (const ev of evData.events) {
                ev._calendarName = cal.calendarName;
              }
              allEvents.push(...evData.events);
            }
          } catch (e) { /* skip */ }
        }
      } catch (e) { /* skip */ }

      // Format events
      const events = allEvents.map((ev: any) => {
        const comp = ev.eventComponents?.[0] || {};
        return {
          id: comp.eventId || "",
          title: comp.summary || "(無題)",
          description: comp.description || "",
          start: comp.start?.dateTime || "",
          end: comp.end?.dateTime || "",
          location: comp.location || "",
          calendarName: ev._calendarName || "基本",
          isAllDay: false,
        };
      });

      events.sort((a: any, b: any) => a.start.localeCompare(b.start));

      return NextResponse.json({ events, count: events.length });
    } catch (error: any) {
      console.error("LW calendar error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (action === "members") {
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `https://www.worksapis.com/v1.0/users?domainId=${LW_DOMAIN_ID}&count=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const members = (data.users || []).map((u: any) => ({
        id: u.userId,
        name: (u.userName?.lastName || "") + " " + (u.userName?.firstName || ""),
        email: u.email,
        department: u.organizations?.[0]?.orgUnitName || "",
      }));
      return NextResponse.json({ members });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "action required (status | calendar | members)" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.type === "message") {
    console.log("LINE WORKS message:", body);
  }
  return NextResponse.json({ ok: true });
}
