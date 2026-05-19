"use client";

import { useState } from "react";
import { HUDBar, GameButton } from "./GameComponents";
import { IMAGE_URLS } from "@/constants";

export function AuthScreen({
  onNext,
  onBack,
  isLoading,
}: {
  onNext: (email: string) => void;
  onBack?: () => void;
  isLoading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const submit = () => {
    if (!email.trim()) {
      setError("⚠️ RESUME KEY / EMAIL REQUIRED");
      return;
    } else if (!validateEmail(email.trim())) {
      setError("⚠️ INVALID EMAIL FORMAT");
      return;
    }

    setError(null);
    onNext(email.trim().toLowerCase());
  };

  return (
    <div className="absolute inset-0 flex flex-col h-full overflow-hidden">
      <HUDBar title="SYSTEM LOGIN" onBack={onBack} />

      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div
          className="game-form-bg"
          style={{ backgroundImage: `url('${IMAGE_URLS.formBg}')` }}
        />
        <div className="game-form-scroll flex flex-col justify-center pb-20">
          <div className="game-bc text-center">
            SYSTEM <span>›</span> IDENTIFY
          </div>
          <h1 className="game-form-title text-center mb-6">
            ENTER YOUR
            <br />
            Email
          </h1>

          <div className="game-field max-w-[300px] mx-auto w-full">
            <label className="text-center">Email Address</label>

            {error && (
              <span className="text-red-500 text-xs font-bold tracking-wider animate-pulse text-center block mb-1">
                {error}
              </span>
            )}
            <input
              className={`game-input text-center ${error ? "border-red-500 focus:border-red-500" : ""
                }`}
              type="email"
              placeholder="operator@school.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              disabled={isLoading}
            />
          </div>

          <div className="h-[24px]" />
          <div className="max-w-[300px] mx-auto w-full">
            <GameButton onClick={submit} disabled={isLoading}>
              {isLoading ? "AUTHENTICATING..." : "► CONTINUE"}
            </GameButton>
          </div>
          <p className="game-form-sub text-center mt-6">
            NEW USERS WILL BE PROMPTED TO CREATE A PROFILE.
            <br />
            RETURNING USERS WILL RESUME THEIR CONTRACT.
          </p>
        </div>
      </div>
    </div>
  );
}