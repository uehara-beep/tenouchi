import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_APP_URL + "/api/gmail/callback"
);

// GET: Start OAuth flow or fetch emails
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");

  // Start OAuth flow
  if (action === "auth") {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.labels",
      ],
    });
    return NextResponse.redirect(url);
  }

  // Fetch recent emails
  if (action === "fetch") {
    try {
      const tokenStr = req.cookies.get("gmail_token")?.value;
      if (!tokenStr) {
        return NextResponse.json({ error: "Not authenticated", authUrl: "/api/gmail?action=auth" }, { status: 401 });
      }

      const tokens = JSON.parse(tokenStr);
      oauth2Client.setCredentials(tokens);

      // Refresh token if expired
      if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
      }

      const gmail = google.gmail({ version: "v1", auth: oauth2Client });
      const maxResults = parseInt(req.nextUrl.searchParams.get("max") || "10");

      const list = await gmail.users.messages.list({
        userId: "me",
        maxResults,
        q: "is:inbox",
      });

      const messages = [];
      for (const msg of list.data.messages || []) {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = detail.data.payload?.headers || [];
        const from = headers.find(h => h.name === "From")?.value || "不明";
        const subject = headers.find(h => h.name === "Subject")?.value || "(件名なし)";
        const date = headers.find(h => h.name === "Date")?.value || "";
        const snippet = detail.data.snippet || "";

        messages.push({
          id: msg.id,
          threadId: msg.threadId,
          from: from.replace(/<.*>/, "").trim(),
          fromEmail: from.match(/<(.+)>/)?.[1] || from,
          subject,
          snippet,
          date,
          labelIds: detail.data.labelIds || [],
          isUnread: detail.data.labelIds?.includes("UNREAD") || false,
        });
      }

      return NextResponse.json({ messages, total: list.data.resultSizeEstimate });
    } catch (error: any) {
      console.error("Gmail fetch error:", error);
      return NextResponse.json({ error: "Gmail取得失敗", detail: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "action required (auth | fetch)" }, { status: 400 });
}
