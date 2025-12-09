

import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { name, email, message, token } = await request.json();

    // 1. Verify reCAPTCHA
    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      console.error("reCAPTCHA verification failed:", recaptchaData);
      return NextResponse.json(
        { success: false, error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // 2. Send email
    const msg = {
      to: process.env.EMAIL_TO,
      from: process.env.SENDGRID_FROM_EMAIL!, 
      replyTo: email,
      cc: process.env.EMAIL_CC || undefined,
      subject: `New contact form submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}

        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email failed to send:", error);
    
    // Log more details for debugging
    if (error.response) {
      console.error("SendGrid error:", error.response.body);
    }
    
    return NextResponse.json(
      { success: false, error: "Email failed to send" },
      { status: 500 }
    );
  }
}




