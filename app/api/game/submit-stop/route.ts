import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, stopId, answerData } = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 800));

    // FAKE LOGIC: Stop is always 10 points. Bonus adds 5.
    const basePoints = 10;
    const bonusPoints = answerData?.bonus ? 5 : 0;
    const pointsEarned = basePoints + bonusPoints;

    return NextResponse.json({
      success: true,
      pointsAdded: pointsEarned,
      message: "Stop completed successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit stop" },
      { status: 500 },
    );
  }
}
