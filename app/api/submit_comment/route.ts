// import { NextRequest, NextResponse } from "next/server";
// import { supabase } from "@/utils/supabaseClient";

// export async function POST(req: NextRequest) {
//   try {
//     const { articleId, name, comment, token } = await req.json();

//     if (!articleId || !name || !comment || !token) {
//       return NextResponse.json(
//         { error: "Missing required fields or reCAPTCHA token" },
//         { status: 400 }
//       );
//     }

//     // Verify reCAPTCHA server-side
//     const secretKey = process.env.RECAPTCHA_SECRET_KEY; // store in .env
//     const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

//     const verifyRes = await fetch(verifyUrl, { method: "POST" });
//     const verifyData = await verifyRes.json();

//     if (!verifyData.success) {
//       return NextResponse.json(
//         { error: "reCAPTCHA verification failed" },
//         { status: 400 }
//       );
//     }

//     // Insert comment into Supabase
//     const { error } = await supabase.from("comments").insert({
//       article_id: articleId,
//       name,
//       comment,
//     });

//     if (error) {
//       return NextResponse.json(
//         { error: "Failed to submit comment" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ message: "Comment submitted successfully!" });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Received comment submission:", body);

    // Support both old and new field names for backwards compatibility
    const articleId = body.articleId || body.article_id;
    const name = body.name || body.author_name;
    const email = body.email || body.author_email;
    const comment = body.comment || body.content;
    const token = body.token || body.recaptchaToken;

    // Validate required fields
    if (!articleId || !name || !comment || !token) {
      console.error("❌ Missing required fields:", { articleId, name, comment, token: !!token });
      return NextResponse.json(
        { 
          error: "Missing required fields or reCAPTCHA token",
          received: { articleId: !!articleId, name: !!name, comment: !!comment, token: !!token }
        },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA server-side
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.error("❌ RECAPTCHA_SECRET_KEY not found in environment variables");
      return NextResponse.json(
        { error: "Server configuration error - reCAPTCHA not configured" },
        { status: 500 }
      );
    }

    console.log("🔐 Verifying reCAPTCHA...");
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const verifyRes = await fetch(verifyUrl, { method: "POST" });
    const verifyData = await verifyRes.json();

    console.log("🔐 reCAPTCHA response:", verifyData);

    if (!verifyData.success) {
      console.error("❌ reCAPTCHA verification failed:", verifyData);
      return NextResponse.json(
        { 
          error: "reCAPTCHA verification failed",
          details: verifyData["error-codes"]
        },
        { status: 400 }
      );
    }

    // Insert comment into Supabase
    console.log("💾 Inserting comment into database...");
    const { data, error } = await supabase.from("comments").insert({
      article_id: Number(articleId),
      author_name: name,
      comment: comment,
      created_at: new Date().toISOString(),
    }).select();

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json(
        { 
          error: "Failed to submit comment",
          details: error.message,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    console.log("✅ Comment submitted successfully:", data);
    return NextResponse.json({ 
      message: "Comment submitted successfully and pending approval!",
      success: true,
      comment: data?.[0]
    });

  } catch (err) {
    console.error("❌ Unexpected error in submit_comment:", err);
    return NextResponse.json(
      { 
        error: "Something went wrong",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
