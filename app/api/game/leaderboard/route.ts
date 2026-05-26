import { NextResponse } from "next/server";
import {
  type BackendGameProgressRow,
  type BackendProfile,
  buildLeaderboardEntry,
  dedupeProgressRows,
  rankForEmail,
  sortEntries,
} from "@/lib/leaderboard";

async function fetchProfile(
  baseUrl: string,
  emailId: string,
): Promise<BackendProfile | null> {
  try {
    const res = await fetch(
      `${baseUrl}/Profile/GetProfile?emailId=${encodeURIComponent(emailId)}`,
      { headers: { accept: "application/json" }, cache: "no-store" },
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (data.statusCode === 200 && data.result) {
      return data.result as BackendProfile;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currentEmail = searchParams.get("emailId")?.trim() || undefined;

    const baseUrl = process.env.BACKEND_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Server config error" },
        { status: 500 },
      );
    }

    const res = await fetch(`${baseUrl}/GameProgress`, {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "External API is down" },
        { status: res.status },
      );
    }

    const data = await res.json();
    if (data.statusCode !== 200 || !Array.isArray(data.result)) {
      return NextResponse.json(
        {
          success: false,
          error: data.errors?.[0] || "Failed to load leaderboard",
        },
        { status: 400 },
      );
    }

    const rows = dedupeProgressRows(data.result as BackendGameProgressRow[]);
    const profiles = await Promise.all(
      rows.map((row) => fetchProfile(baseUrl, row.emailId)),
    );

    const entries = sortEntries(
      rows.map((row, index) =>
        buildLeaderboardEntry(
          row.emailId,
          row.gameProgress,
          profiles[index],
          currentEmail,
        ),
      ),
    );

    const yourRank = currentEmail
      ? rankForEmail(entries, currentEmail)
      : undefined;

    return NextResponse.json({
      success: true,
      entries,
      totalParticipants: entries.length,
      yourRank,
    });
  } catch (error) {
    console.error("Leaderboard GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load leaderboard" },
      { status: 500 },
    );
  }
}
