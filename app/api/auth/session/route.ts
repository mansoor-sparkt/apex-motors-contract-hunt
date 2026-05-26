import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/game-session";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    email: session.email,
  });
}
