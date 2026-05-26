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
    const backendRes = await fetch(`${baseUrl}/Profile/UploadHuntImage`, {
      method: "POST",
      body: formData,
    });

    const data = await backendRes.json();

    // Return the response (which should contain your string path!)
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
