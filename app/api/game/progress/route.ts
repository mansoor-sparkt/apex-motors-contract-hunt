import { NextResponse } from "next/server";

// Helper function to keep our logic DRY since POST and PUT are nearly identical
async function forwardProgress(request: Request, method: "POST" | "PUT") {
  try {
    const body = await request.json();

    const baseUrl = process.env.BACKEND_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Server config error" },
        { status: 500 },
      );
    }

    const backendRes = await fetch(`${baseUrl}/GameProgress`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json({ success: true, data });
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
  return forwardProgress(req, "POST");
}

export async function PUT(req: Request) {
  return forwardProgress(req, "PUT");
}
