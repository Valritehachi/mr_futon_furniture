import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function GET() {
  try {
    const msg = {
      to: process.env.EMAIL_TO!,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: "Test Email from Contact Form",
      text: "If you receive this, SendGrid is working correctly!",
      html: "<strong>If you receive this, SendGrid is working correctly!</strong>",
    };

    await sgMail.send(msg);

    return NextResponse.json({ 
      success: true, 
      message: "Test email sent",
      sentTo: process.env.EMAIL_TO 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.response?.body 
    }, { status: 500 });
  }
}