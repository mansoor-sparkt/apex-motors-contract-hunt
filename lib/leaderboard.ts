import { computeBaseScore, computeBonusScore } from "@/constants";

export interface LeaderboardEntry {
  emailId: string;
  name: string;
  school: string;
  base: number;
  bonus: number;
  total: number;
  badges: number;
  avatarIndex: number;
  timeSpent: number;
  isYou: boolean;
}

export interface BackendGameProgressRow {
  gameProgressId: string;
  emailId: string;
  gameProgress: string;
  isActive: boolean;
  modifiedDate: string;
}

export interface BackendProfile {
  emailId: string;
  firstName?: string | null;
  lastName?: string | null;
  operatorName?: string | null;
  schoolOrCompany?: string | null;
  machinistCharacter?: string | null;
}

const AVATAR_COUNT = 4;

export function avatarFromIndex(index: number): number {
  if (!Number.isFinite(index) || index < 0 || index >= AVATAR_COUNT) return 0;
  return index;
}

export function formatNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function profileDisplayName(
  profile: BackendProfile | null,
  emailId: string,
): string {
  if (!profile) return formatNameFromEmail(emailId);

  let first = profile?.firstName?.trim();
  let last = profile?.lastName?.trim();

  const lastInitial = last ? `${last.charAt(0).toUpperCase()}.` : "";

  const full = [first, lastInitial].filter(Boolean).join(" ").trim();
  return full || profile.operatorName || formatNameFromEmail(emailId);
}

export function parseGameProgress(raw: string): {
  stops: Record<number, { timeSpent?: number }>;
  shorts: Record<string, unknown>;
} {
  try {
    const parsed = JSON.parse(raw) as {
      stops?: Record<number, { timeSpent?: number }>;
      shorts?: Record<string, unknown>;
    };
    return {
      stops: parsed.stops ?? {},
      shorts: parsed.shorts ?? {},
    };
  } catch {
    return { stops: {}, shorts: {} };
  }
}

export function sumTimeSpent(
  stops: Record<number, { timeSpent?: number }>,
): number {
  return Object.values(stops).reduce(
    (acc, stop) => acc + (stop?.timeSpent || 0),
    0,
  );
}

export function buildLeaderboardEntry(
  emailId: string,
  gameProgress: string,
  profile: BackendProfile | null,
  currentEmail?: string,
): LeaderboardEntry {
  const { stops, shorts } = parseGameProgress(gameProgress);
  const base = computeBaseScore(stops);
  const bonus = computeBonusScore(shorts);
  const avatarIndex = profile?.machinistCharacter
    ? parseInt(profile.machinistCharacter, 10)
    : 0;

  return {
    emailId,
    name: profileDisplayName(profile, emailId),
    school: profile?.schoolOrCompany?.trim() || "—",
    base,
    bonus,
    total: base + bonus,
    badges: Object.keys(stops).length + Object.keys(shorts).length,
    avatarIndex: avatarFromIndex(Number.isNaN(avatarIndex) ? 0 : avatarIndex),
    timeSpent: sumTimeSpent(stops),
    isYou: Boolean(
      currentEmail && emailId.toLowerCase() === currentEmail.toLowerCase(),
    ),
  };
}

export function dedupeProgressRows(
  rows: BackendGameProgressRow[],
): BackendGameProgressRow[] {
  const byEmail = new Map<string, BackendGameProgressRow>();

  for (const row of rows) {
    if (!row.isActive) continue;
    const key = row.emailId.toLowerCase();
    const existing = byEmail.get(key);
    if (
      !existing ||
      new Date(row.modifiedDate).getTime() >
        new Date(existing.modifiedDate).getTime()
    ) {
      byEmail.set(key, row);
    }
  }

  return Array.from(byEmail.values());
}

export function sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => b.total - a.total);
}

export function rankForEmail(
  entries: LeaderboardEntry[],
  email: string,
  fallbackScore?: number,
): number {
  const normalized = email.toLowerCase();
  let all = sortEntries(entries);

  if (
    fallbackScore != null &&
    !all.some((e) => e.emailId.toLowerCase() === normalized)
  ) {
    all = sortEntries([
      ...all,
      {
        emailId: email,
        name: "",
        school: "",
        base: 0,
        bonus: 0,
        total: fallbackScore,
        badges: 0,
        avatarIndex: 0,
        timeSpent: 0,
        isYou: true,
      },
    ]);
  }

  const idx = all.findIndex((e) => e.emailId.toLowerCase() === normalized);
  return idx >= 0 ? idx + 1 : all.length + 1;
}
