import { NextResponse } from "next/server";

export interface RSVPPayload {
  name: string;
  email: string;
  attendance: "yes" | "no" | "maybe";
  guests: string;
  dietary: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const body: RSVPPayload = await req.json();

    if (!body.name || !body.email || !body.attendance) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Log RSVP (visible in Vercel function logs)
    console.log("[RSVP]", JSON.stringify(body, null, 2));

    /*
     * To send RSVP notifications via email, add Resend:
     *   npm install resend
     *   Set RESEND_API_KEY in Vercel env vars
     *
     * import { Resend } from "resend";
     * const resend = new Resend(process.env.RESEND_API_KEY);
     * await resend.emails.send({
     *   from: "wedding@yourdomain.com",
     *   to: "norman1997.an@gmail.com",
     *   subject: `RSVP from ${body.name}`,
     *   text: JSON.stringify(body, null, 2),
     * });
     */

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
