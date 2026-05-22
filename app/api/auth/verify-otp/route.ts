import { NextResponse } from "next/server";

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

    const res = await fetch(
      "https://phillipsx-content-dev.azurewebsites.net/api/Login/VerifyOTP",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${process.env.EXTERNAL_API_SECRET_KEY}`,
        },
        body: JSON.stringify({
          emailId,
          otp,
        }),
      },
    );

    const data = await res.json();

    if (data.statusCode === 200 && data.result) {
      return NextResponse.json({
        success: true,
        isProfileComplete: data.result.isProfileComplete, // Extract the flag!
        user: data.result.user, // Send the user data down
        message: data.message?.[0] || "OTP Verified",
      });
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
