import type {
  PlayeRegisterProfile,
  PlayerProfile,
  StopCompletion,
} from "@/lib/game-types";

export const GameService = {
  /**
   * 1. Check if an email exists
   */
  // async registerEmail(email: string) {
  //   const response = await fetch("/api/auth/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email }),
  //   });
  //   return response.json();
  // },

  async registerEmail(email: string) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      // Catch total network failures (e.g. WiFi turned off)
      return { success: false, error: "Network connection failed" };
    }
  },

  //otp error
  //   {
  //   "statusCode": 404,
  //   "message": null,
  //   "result": null,
  //   "errors": [
  //     "Invalid OTP."
  //   ]
  // }

  //otp response
  //   {
  //   "statusCode": 200,
  //   "message": [
  //     "Login successful."
  //   ],
  //   "result": {
  //     "emailId": "mansoor@sparkt.in",
  //     "verifiedAt": "2026-05-21T08:51:39.4509405Z",
  //     "isProfileComplete": false,
  //     "user": {
  //       "loginUserId": "d0d5c416-2993-4c95-bae4-81ea0ff6f070",
  //       "emailId": "mansoor@sparkt.in",
  //       "operatorName": null,
  //       "firstName": null,
  //       "lastName": null,
  //       "phoneNumber": null,
  //       "profilePicture": null,
  //       "schoolOrCompany": null,
  //       "role": null,
  //       "machinistCharacter": null,
  //       "isProfileComplete": false,
  //       "isActive": true
  //     }
  //   },
  //   "errors": null
  // }

  /**
   * Verify OTP for returning users
   */
  async verifyOtp(email: string, code: string) {
    try {
      const payloade = {
        emailId: email,
        otp: code,
      };
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloade),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Network connection failed" };
    }
  },

  /**
   * 2. Save a new user's profile and avatar
   */
  async registerUser(profile: PlayeRegisterProfile) {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      return response.json();
    } catch (error) {
      return { success: false, error: "Network connection failed" };
    }
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
};
