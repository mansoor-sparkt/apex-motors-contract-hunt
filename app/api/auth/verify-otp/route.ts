import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    // 1. FAKE DELAY
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. FAKE LOGIC: Assume "123456" is the correct OTP
    if (code === "123456") {
      return NextResponse.json({
        success: true,
        user: {
          name: "Alex Johnson",
          email: email,
          school: "Lincoln Tech",
          role: "Student",
          avatarIndex: 0,
        },
      });
    }
    return NextResponse.json(
      { success: false, error: "Invalid code" },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 },
    );
  }
}
