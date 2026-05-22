export interface PlayerProfile {
  name: string;
  email: string;
  school: string;
  role: string;
  shopName: string;
  avatarIndex: number;
}

export interface PlayeRegisterProfile {
  emailId: string;
  operatorName: string;
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
}

/** Shop floor short submission with local media preview. */
export interface ShortCompletion {
  mediaType: "image" | "video";
  previewUrl: string;
  badge: string;
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
