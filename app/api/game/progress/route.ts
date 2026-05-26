import { NextResponse } from "next/server";
import {
  emailsMatch,
  getSessionFromRequest,
  sessionForbidden,
  sessionUnauthorized,
} from "@/lib/game-session";
import { decryptProgressPayload } from "@/lib/progress-payload-crypto";

interface ProgressType {
  request: Request;
  method: "POST" | "PUT";
  successText: string;
  failedText: string;
}

// Helper function to keep our logic DRY since POST and PUT are nearly identical
async function forwardProgress(
  request: Request,
  method: "POST" | "PUT",
  successText: string,
  failedText: string,
) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return sessionUnauthorized();
    }

    const raw = await request.json();
    let body: { emailId: string; gameProgress: string };

    try {
      body = await decryptProgressPayload(raw);
    } catch (decryptError) {
      console.error("Progress payload decrypt error:", decryptError);
      return NextResponse.json(
        { success: false, error: "Invalid or corrupted progress payload" },
        { status: 400 },
      );
    }

    if (!emailsMatch(body.emailId, session.email)) {
      return sessionForbidden();
    }

    const baseUrl = process.env.BACKEND_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Server config error" },
        { status: 500 },
      );
    }

    const forwardToBackend = (httpMethod: "POST" | "PUT") =>
      fetch(`${baseUrl}/GameProgress`, {
        method: httpMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    let res = await forwardToBackend(method);

    // Phillips returns 409 when POST is used but progress already exists — update instead
    if (!res.ok && method === "POST" && res.status === 409) {
      res = await forwardToBackend("PUT");
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            data?.errors?.[0] ||
            `External API error (${res.status})`,
        },
        { status: res.status === 409 ? 400 : res.status },
      );
    }

    if (data?.statusCode === 200) {
      return NextResponse.json({
        success: true,
        message: data.message?.[0] || successText,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: data?.errors?.[0] || failedText,
      },
      { status: 400 },
    );
    // return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(`Progress ${method} Error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to sync progress" },
      { status: 500 },
    );
  }
}

// Next.js automatically maps these functions to the incoming HTTP method
export async function POST(req: Request) {
  return forwardProgress(
    req,
    "POST",
    "Progress saved",
    "Failed to log progress",
  );
}

export async function PUT(req: Request) {
  return forwardProgress(
    req,
    "PUT",
    "Progress updated",
    "Failed to update progress",
  );
}

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return sessionUnauthorized();
    }

    const emailId = session.email;

    const baseUrl = process.env.BACKEND_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Server config error" },
        { status: 500 },
      );
    }

    // Forward the payload via request parameter matching your backend structure
    const res = await fetch(
      `${baseUrl}/GameProgress/ByEmail?emailId=${emailId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );


    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "External API is down" },
        { status: res.status },
      );
    }

    const data = await res.json();

    // Match your custom business structure verification layer
    if (data.statusCode === 200 && data.result) {
      return NextResponse.json({
        success: true,
        gameProgress: data.result.gameProgress,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: data.errors?.[0] || "No existing cloud sync found",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Progress GET Routing Exception:", error);
    return NextResponse.json(
      { success: false, error: "Internal Sync Failure" },
      { status: 500 },
    );
  }
}
