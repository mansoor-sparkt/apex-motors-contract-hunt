import { NextResponse } from "next/server";
import { normalizeEmail, withSessionCookie } from "@/lib/game-session";

const baseUrl = process.env.BACKEND_API_URL;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Server config error" },
        { status: 500 },
      );
    }

    const emailId = normalizeEmail(email);
    const res = await fetch(
      `${baseUrl}/Login/LoginWithEmail?emailId=${encodeURIComponent(emailId)}`,
      {
        method: "GET",
        headers: { accept: "application/json" },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "External API is down" },
        { status: res.status },
      );
    }

    const data = await res.json();

    if (data.statusCode === 200 && data.result) {
      const sessionEmail =
        data.result.emailId ?? data.result.user?.emailId ?? emailId;
      const isProfileComplete =
        data.result.isProfileComplete ??
        data.result.user?.isProfileComplete ??
        false;

      return withSessionCookie(
        NextResponse.json({
          success: true,
          isProfileComplete,
          user: data.result.user,
          verifiedAt: data.result.verifiedAt,
          message: data.message?.[0] || "Login successful",
        }),
        sessionEmail,
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: data.errors?.[0] || "Login failed",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to login" },
      { status: 500 },
    );
  }
}
