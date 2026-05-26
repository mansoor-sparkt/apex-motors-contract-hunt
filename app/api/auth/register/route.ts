import { NextResponse } from "next/server";
import {
  emailsMatch,
  getSessionFromRequest,
  sessionForbidden,
  sessionUnauthorized,
  withSessionCookie,
} from "@/lib/game-session";

const baseUrl = process.env.BACKEND_API_URL;

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return sessionUnauthorized("Verify your email before saving a profile");
    }

    const payload = await request.json();

    if (
      typeof payload.emailId !== "string" ||
      !emailsMatch(payload.emailId, session.email)
    ) {
      return sessionForbidden();
    }

    // Forward to the external API
    const res = await fetch(`${baseUrl}/Profile/UpsertProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${process.env.EXTERNAL_API_SECRET_KEY}`
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(payload, data);

    // 3. Translate response for React
    if (data.statusCode === 200 && data.result) {
      return withSessionCookie(
        NextResponse.json({
          success: true,
          user: data.result,
          message: data.message?.[0] || "Profile saved successfully.",
        }),
        payload.emailId
      );
    } else {
      return NextResponse.json(
        { success: false, error: data.errors?.[0] || "Failed to save profile" },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
