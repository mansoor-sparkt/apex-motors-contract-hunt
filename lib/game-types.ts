export interface PlayerProfile {
  name: string;
  email: string;
  school: string;
  role: string;
  shopName: string;
  avatarIndex: number;
  avatarName?: string;
}

export interface PlayeRegisterProfile {
  emailId: string;
  // operatorName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; // Default since it's not in UI
  profilePicture: string;
  schoolOrCompany: string;
  shopName?: string;
  role: string;
  machinistCharacter: string;
  isProfileComplete: boolean;
}

/** Registration form data before avatar selection (Splash → Intro → Register → Avatar). */
export interface RegisterDraft {
  shopName: string;
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
  timeSpent?: number;
  previewUrl?: string;
  selectedAnswer: string;
  /** Stop label in cloud progress JSON (booth company name). */
  challengeName?: string;
}

/** Shop floor short submission with local media preview. */
export interface ShortCompletion {
  mediaType: "image" | "video";
  previewUrl: string;
  badge: string;
  qAnswered?: boolean;
  points: number;
  /** Bonus challenge display title — included in cloud progress JSON. */
  challengeName?: string;
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
  | "intro"
  | "auth"
  | "register"
  | "avatar"
  | "hunt"
  | "stop"
  | "short";

export type CelebrationSource = "stop" | "shorts";

/** Cloud save hydration lifecycle for hunt progress state. */
export type ProgressLoadStatus = "idle" | "loading" | "loaded" | "error";

export interface CelebrationState {
  icon: string;
  title: string;
  sub: string;
  badge: string;
}
