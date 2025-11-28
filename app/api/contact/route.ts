import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { name, email, message, token } = await request.json();

    const msg = {
      to: process.env.EMAIL_TO,           // where to receive emails
      from: "your_verified_email@gmail.com", // must be verified in SendGrid
      replyTo: email,                     // user’s email
      cc: process.env.EMAIL_CC || undefined,
      subject: `New contact form submission from ${name}`,
      text: message,
      html: `<p>${message}</p>`,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email failed to send:", error);
    return NextResponse.json({ success: false, error: "Email failed to send" }, { status: 500 });
  }
}




