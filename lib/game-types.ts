export interface PlayerProfile {
  name: string;
  email: string;
  school: string;
  role: string;
  avatarIndex: number;
}

/** Registration form data before avatar selection (Splash → Register → Avatar). */
export interface RegisterDraft {
  name: string;
  email: string;
  school: string;
  role: string;
}

export interface StopCompletion {
  bonus: boolean;
  badge: string | null;
  rn?: string;
  qs?: number;
}

export interface RosterEntry {
  n: string;
  c: string;
}

/** Hunt hub tabs: Stops | Shorts | Leaderboard | Job Traveler */
export type HuntTab = "stops" | "shorts" | "board" | "comp";

/**
 * Top-level app screens (matches product flowchart).
 * Splash → Register → Avatar → Hunt Hub ⇄ Stop Detail
 */
export type AppScreen =
  | "splash"
  | "auth"
  | "otp"
  | "register"
  | "avatar"
  | "hunt"
  | "stop";

export type CelebrationSource = "stop" | "shorts";

export interface CelebrationState {
  icon: string;
  title: string;
  sub: string;
  badge: string;
}
