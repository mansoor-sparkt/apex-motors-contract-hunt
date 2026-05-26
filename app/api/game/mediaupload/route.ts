import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Grab the raw FormData containing the file and email
    const formData = await request.formData();

    const baseUrl = process.env.BACKEND_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Server config error" },
        { status: 500 },
      );
    }

    // 2. Forward the exact FormData directly to the backend
    const res = await fetch(`${baseUrl}/Profile/UploadHuntImage`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "External API is down" },
        { status: res.status },
      );
    }

    const data = await res.json();

    if (data.statusCode === 200 && data.result) {
      return NextResponse.json({
        success: true,
        cdnUrl: data.result.cdnUrl, // Flatten out the direct path string
        message: data.message?.[0] || "Success",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: data.errors?.[0] || "Upload validation failed",
        },
        { status: 400 },
      );
    }

    // Return the response (which should contain your string path!)
    // return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
