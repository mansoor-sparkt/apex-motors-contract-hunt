import { NextResponse } from "next/server";

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
    const body = await request.json();

    const baseUrl = process.env.BACKEND_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Server config error" },
        { status: 500 },
      );
    }

    const res = await fetch(`${baseUrl}/GameProgress`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "External API is down" },
        { status: res.status },
      );
    }

    const data = await res.json();

    if (data.statusCode === 200) {
      return NextResponse.json({
        success: true,
        message: data.message?.[0] || successText,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: data.errors?.[0] || failedText,
        },
        { status: 400 },
      );
    }
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
    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get("emailId");

    if (!emailId) {
      return NextResponse.json(
        { success: false, error: "Email parameter is required" },
        { status: 400 },
      );
    }

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
