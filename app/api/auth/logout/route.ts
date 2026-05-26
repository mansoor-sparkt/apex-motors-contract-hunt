import { NextResponse } from "next/server";
import { withClearSessionCookie } from "@/lib/game-session";

export async function POST() {
  return withClearSessionCookie(
    NextResponse.json({ success: true, message: "Logged out" })
  );
}
