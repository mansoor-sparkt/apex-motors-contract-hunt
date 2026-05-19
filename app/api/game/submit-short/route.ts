import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, shortId } = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 500));

    // FAKE LOGIC: Shorts are always worth 5 points
    return NextResponse.json({
      success: true,
      pointsAdded: 5,
      message: "Short submitted successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit short" },
      { status: 500 },
    );
  }
}
