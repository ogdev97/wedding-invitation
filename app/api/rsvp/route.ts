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

function normalizePhone(raw: string): string {
  // Strip everything except digits, then drop a leading 0 (Malaysian local form
  // 012-... is equivalent to +6012-...). Keeps comparison forgiving.
  const digits = (raw ?? "").replace(/\D+/g, "");
  return digits.replace(/^0+/, "");
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
    const normalizedPhone = normalizePhone(body.phone);

    // Duplicate check — phone first (most meaningful per-guest), then IP fallback.
    // Pull both columns in one round-trip: C (phone) and I (IP).
    const existing = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: [`${SHEET_NAME}!C2:C`, `${SHEET_NAME}!I2:I`],
    });
    const phones = (existing.data.valueRanges?.[0]?.values ?? []).map((row) =>
      normalizePhone(row[0] ?? "")
    );
    const ips = (existing.data.valueRanges?.[1]?.values ?? []).map((row) =>
      (row[0] ?? "").trim()
    );

    if (normalizedPhone && phones.includes(normalizedPhone)) {
      return NextResponse.json(
        { error: "duplicate", reason: "phone" },
        { status: 409 }
      );
    }
    if (ip !== "unknown" && ips.includes(ip)) {
      return NextResponse.json(
        { error: "duplicate", reason: "ip" },
        { status: 409 }
      );
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
