import { NextResponse } from "next/server";

export async function GET() {
  const diagnostics = {
    environment: process.env.NODE_ENV,
    envVars: {
      RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY ? "✅ Set" : "❌ Missing",
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? "✅ Set" : "❌ Missing",
      SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || "❌ Missing",
      EMAIL_TO: process.env.EMAIL_TO || "❌ Missing",
      EMAIL_CC: process.env.EMAIL_CC || "(optional)",
    }
  };

  return NextResponse.json(diagnostics);
}