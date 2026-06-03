import { NextResponse } from "next/server";
import { google } from "googleapis";

export interface RSVPPayload {
  name: string;
  phone: string;
  side: "bride" | "groom";
  dietary: string;
  adults: string;
  babies: string;
  message: string;
}

const SHEET_NAME = "RSVPs";

function getJwtClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) {
    throw new Error("Missing Google service account credentials.");
  }
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(req: Request) {
  try {
    const body: RSVPPayload = await req.json();

    if (!body.name || !body.phone || !body.side) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      console.error("[RSVP] GOOGLE_SHEETS_ID is not set");
      return NextResponse.json(
        { error: "Server is not configured." },
        { status: 500 }
      );
    }

    const auth = getJwtClient();
    const sheets = google.sheets({ version: "v4", auth });
    const ip = getClientIp(req);

    // Duplicate check — look up existing IPs in column I. Skip unknown IPs so
    // local dev / proxy-stripped requests don't collide.
    if (ip !== "unknown") {
      const existing = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${SHEET_NAME}!I2:I`,
      });
      const ips = (existing.data.values ?? []).map((row) => (row[0] ?? "").trim());
      if (ips.includes(ip)) {
        return NextResponse.json({ error: "duplicate" }, { status: 409 });
      }
    }

    const timestamp = new Date().toISOString();
    const side = body.side === "bride" ? "Bride's Side" : "Groom's Side";

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:I`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            timestamp,
            body.name,
            body.phone,
            side,
            body.adults || "1",
            body.babies || "0",
            body.dietary || "",
            body.message || "",
            ip,
          ],
        ],
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[RSVP] error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
