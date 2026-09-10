import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contactSchema";
import { getResendClient } from "@/lib/resend";
import { env } from "@/lib/env";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields and try again." },
      { status: 400 },
    );
  }

  // Honeypot tripped — pretend success so bots don't learn anything.
  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const resend = getResendClient();
  if (!resend) {
    console.error(
      "Contact form submitted but RESEND_API_KEY is not configured — see .env.example.",
    );
    return NextResponse.json(
      {
        ok: false,
        error: `Message could not be sent automatically right now. Please email ${env.contactEmail} directly.`,
      },
      { status: 503 },
    );
  }

  const { name, email, company, message } = parsed.data;

  try {
    const { error } = await resend.emails.send({
      from: "Audu Victor Site <onboarding@resend.dev>",
      to: env.contactEmail,
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        company ? `Company: ${company}` : undefined,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Something went wrong sending your message. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form send failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your message. Please try again." },
      { status: 500 },
    );
  }
}
