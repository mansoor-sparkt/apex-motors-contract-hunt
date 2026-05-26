import { NextResponse } from "next/server";
import { resolveMediaPreviewUrl } from "@/lib/media-url";
import { ensurePngForUpload } from "@/lib/server/ensure-png-upload";

export async function POST(request: Request) {
  try {
    const incoming = await request.formData();
    const rawFile = incoming.get("UploadPicture");
    const emailId = incoming.get("EmailId");

    if (!(rawFile instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
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

    let pngFile: File;
    try {
      pngFile = await ensurePngForUpload(rawFile);
    } catch (convertError) {
      console.error("HEIC/PNG conversion error:", convertError);
      return NextResponse.json(
        {
          success: false,
          error: "Could not convert image to PNG. Try another photo.",
        },
        { status: 400 },
      );
    }

    const formData = new FormData();
    formData.append("UploadPicture", pngFile);
    if (typeof emailId === "string") {
      formData.append("EmailId", emailId);
    }

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
      const rawUrl = data.result.cdnUrl as string;
      return NextResponse.json({
        success: true,
        cdnUrl: resolveMediaPreviewUrl(rawUrl) ?? rawUrl,
        message: data.message?.[0] || "Success",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: data.errors?.[0] || "Upload validation failed",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
