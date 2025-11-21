import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, message, token } = await request.json();

  // 1. Validate token with Google
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const googleRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    }
  );

  const data = await googleRes.json();

  if (!data.success) {
    return NextResponse.json(
      { error: "Failed CAPTCHA verification" },
      { status: 400 }
    );
  }

  // 2. Continue with form submission logic
  // For example: send email, save to DB, etc.
  // (You can add your logic here)

  return NextResponse.json({ success: true });
}
