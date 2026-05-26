import { NextResponse } from "next/server";
import { withSessionCookie } from "@/lib/game-session";

const baseUrl = process.env.BACKEND_API_URL;

export async function POST(request: Request) {
  try {
    const { emailId, otp } = await request.json();

    if (!emailId || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    // 2. Map to the exact keys the external API expects

    const res = await fetch(`${baseUrl}/Login/VerifyOTP`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.EXTERNAL_API_SECRET_KEY}`,
      },
      body: JSON.stringify({
        emailId,
        otp,
      }),
    });

    const data = await res.json();

    if (data.statusCode === 200 && data.result) {
      return withSessionCookie(
        NextResponse.json({
          success: true,
          isProfileComplete: data.result.isProfileComplete,
          user: data.result.user,
          message: data.message?.[0] || "OTP Verified",
        }),
        emailId
      );
    } else {
      // Handle the 404 "Invalid OTP" error
      return NextResponse.json(
        { success: false, error: data.errors?.[0] || "Invalid OTP" },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("OTP API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
