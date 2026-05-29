"use client";

import { useEffect, useMemo, useState } from "react";
import { computeBaseScore, computeBonusScore } from "@/constants";
import { GameService } from "@/lib/game.service";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { rankForEmail, sortEntries } from "@/lib/leaderboard";
import type { PlayerProfile } from "@/lib/game-types";

export function useLeaderboard(
  player: PlayerProfile,
  score: number,
  stopsDone: Record<number, { timeSpent?: number }>,
  shortsDone: Record<string, unknown>,
) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseScore = computeBaseScore(stopsDone);
  const bonusScore = computeBonusScore(shortsDone);
  const badgeCount =
    Object.keys(stopsDone).length + Object.keys(shortsDone).length;
  const totalSeconds = Object.values(stopsDone).reduce(
    (acc, curr) => acc + (curr.timeSpent || 0),
    0,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      setLoading(true);
      setError(null);

      const data = await GameService.fetchLeaderboard(player.email || undefined);

      if (cancelled) return;

      if (data.success && Array.isArray(data.entries)) {
        setEntries(data.entries);
        setTotalParticipants(data.totalParticipants ?? data.entries.length);
      } else {
        setEntries([]);
        setTotalParticipants(0);
        setError(data.error || "Failed to load leaderboard");
      }

      setLoading(false);
    }

    loadLeaderboard();
    return () => {
      cancelled = true;
    };
  }, [player.email, score]);

  const all = useMemo(() => {
    const youEntry: LeaderboardEntry = {
      emailId: player.email,
      name: player.name || "You",
      school: player.school,
      base: baseScore,
      bonus: bonusScore,
      total: score,
      badges: badgeCount,
      avatarIndex: player.avatarIndex,
      timeSpent: totalSeconds,
      isYou: true,
    };

    const normalizedEmail = player.email?.toLowerCase();
    const remote = entries.filter(
      (entry) =>
        !normalizedEmail ||
        entry.emailId.toLowerCase() !== normalizedEmail,
    );

    return sortEntries([...remote, youEntry]);
  }, [
    player.avatarIndex,
    badgeCount,
    baseScore,
    bonusScore,
    entries,
    player.email,
    player.name,
    player.school,
    score,
    totalSeconds,
  ]);

  const rank = useMemo(
    () =>
      player.email
        ? rankForEmail(all, player.email, score)
        : all.findIndex((entry) => entry.isYou) + 1,
    [all, player.email, score],
  );

  return {
    all,
    rank,
    totalParticipants,
    loading,
    error,
    baseScore,
    bonusScore,
    badgeCount,
    totalSeconds,
  };
}
