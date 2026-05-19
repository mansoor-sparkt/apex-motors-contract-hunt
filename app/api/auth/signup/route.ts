import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const profileData = await request.json(); // Gets name, email, school, role, avatarId

    await new Promise((resolve) => setTimeout(resolve, 800));

    // FAKE LOGIC: Just return success and the created user
    return NextResponse.json({
      success: true,
      user: profileData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}
