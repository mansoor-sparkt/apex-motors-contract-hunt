"use client";

import { useState } from "react";
import { HUDBar, GameButton } from "./GameComponents";
import { IMAGE_URLS } from "@/constants";

export function OtpScreen({
  email,
  onVerify,
  onBack,
  isLoading,
}: {
  email: string;
  onVerify: (code: string) => void;
  onBack?: () => void;
  isLoading: boolean;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const digits = code.trim();
    if (!digits) {
      setError("ENTER THE 6-DIGIT CODE");
      return;
    }
    if (digits.length < 6) {
      setError(`ENTER ALL 6 DIGITS (${digits.length}/6)`);
      return;
    }
    setError(null);
    onVerify(digits);
  };

  return (
    <div className="absolute inset-0 flex flex-col h-full overflow-hidden">
      <HUDBar title="IDENTITY VERIFICATION" onBack={onBack} />

      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div
          className="game-form-bg"
          style={{ backgroundImage: `url('${IMAGE_URLS.formBg}')` }}
        />
        <div className="game-form-scroll flex flex-col justify-center pb-20">
          <div className="game-bc text-center">
            SYSTEM <span>›</span> VERIFY
          </div>
          <h1 className="game-form-title text-center mb-2">
            ENTER
            <br />
            SECURITY CODE
          </h1>
          <p className="game-form-sub text-center mb-8">
            TRANSMITTED TO: <span className="text-[var(--o)]">{email.toUpperCase()}</span>
          </p>

          <div className="game-field max-w-[300px] mx-auto w-full">
            <label className="text-center">6-Digit Code</label>

            {error && (
              <span
                id="otp-error"
                role="alert"
                className="text-red-500 text-xs font-bold tracking-wider animate-pulse text-center block mb-1"
              >
                {error}
              </span>
            )}
            <input
              className={`game-input text-center text-2xl tracking-[0.5em] ${error ? "border-red-500 focus:border-red-500" : ""
                }`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-invalid={!!error}
              aria-describedby={error ? "otp-error" : undefined}
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => {
                // Only allow numbers
                const val = e.target.value.replace(/[^0-9]/g, "");
                setCode(val);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              disabled={isLoading}
            />
          </div>

          <div className="h-[24px]" />
          <div className="max-w-[300px] mx-auto w-full">
            <GameButton onClick={submit} disabled={isLoading}>
              {isLoading ? "VERIFYING..." : "► ACCESS SYSTEM"}
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  );
}