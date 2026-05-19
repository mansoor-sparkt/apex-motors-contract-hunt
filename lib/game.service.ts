import type { PlayerProfile, StopCompletion } from "@/lib/game-types";

export const GameService = {
  /**
   * 1. Check if an email exists
   */
  async loginOrCheckEmail(email: string) {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return response.json();
    // Returns: { isNewUser: boolean, user?: PlayerProfile, ... }
  },

  /**
   * 2. Save a new user's profile and avatar
   */
  async registerUser(profile: PlayerProfile) {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    return response.json();
  },

  /**
   * 3. Submit a completed stop to calculate score
   */
  async submitStop(stopIndex: number, data: StopCompletion) {
    const response = await fetch("/api/submit-stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stopIndex, data }),
    });
    return response.json();
  },

  /**
   * Verify OTP for returning users
   */
  async verifyOtp(email: string, code: string) {
    // FAKE DELAY
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // MOCK LOGIC: Let's pretend "123456" is the correct code
    if (code === "123456") {
      return {
        success: true,
        user: {
          name: "Alex Johnson",
          email: email,
          school: "Lincoln Tech",
          role: "Student",
          avatarIndex: 0,
        },
      };
    }

    return { success: false };
  },
};
