"use client";

import { useEffect, useState } from "react";
import { HUDBar, GameButton } from "./GameComponents";
import { ROLES, IMAGE_URLS, DEFAULT_SHOP_NAME } from "@/constants";
import type { RegisterDraft } from "@/lib/game-types";

export function RegisterScreen({
  initialEmail,
  draft,
  onNext,
  onBack,
}: {
  initialEmail?: string;
  draft?: RegisterDraft | null;
  onNext: (draft: RegisterDraft) => void;
  onBack?: () => void;
}) {
  const [name, setName] = useState(draft?.name || "");
  const [email, setEmail] = useState(draft?.email || initialEmail || "");
  const [school, setSchool] = useState(draft?.school || "");
  const [role, setRole] = useState(draft?.role || "Student");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  useEffect(() => {
    if (initialEmail && !draft?.email) {
      setEmail(initialEmail);
    }
  }, [initialEmail, draft]);

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const submit = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = "⚠️ OPERATOR NAME REQUIRED";
    }
    if (!email.trim()) {
      newErrors.email = "⚠️ RESUME KEY / EMAIL REQUIRED";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "⚠️ INVALID EMAIL FORMAT";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext({
      shopName: DEFAULT_SHOP_NAME,
      name: name.trim(),
      email: email.trim(),
      school: school.trim() || "My School",
      role,
    });
  };

  return (
    <div className="absolute inset-0 flex flex-col h-full overflow-hidden">
      <HUDBar title="OPERATOR PROFILE" onBack={onBack} />

      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div
          className="game-form-bg"
          style={{ backgroundImage: `url('${IMAGE_URLS.formBg}')` }}
        />
        <div className="game-form-scroll">
          <div className="game-bc">
            INTRO <span>›</span> SETUP
          </div>
          <h1 className="game-form-title">
            WHO&apos;S RUNNING
            <br />
            THE SHOP?
          </h1>
          <p className="game-form-sub">
            YOUR NAME APPEARS ON EVERY MISSION CARD — SHOP: {DEFAULT_SHOP_NAME.toUpperCase()}
          </p>

          <div className="game-field">
            <label>Your Name</label>
            {errors.name && (
              <span className="text-red-500 text-xs font-bold tracking-wider animate-pulse">
                {errors.name}
              </span>
            )}
            <input
              className={`game-input ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
          </div>

          <div className="game-field">
            <label>School / Company</label>
            <input
              className="game-input"
              type="text"
              placeholder="Lincoln Tech"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>
          <div className="game-field">
            <label>You are a…</label>
            <div className="game-role-g">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`game-role-b${role === r.id ? " sel" : ""}`}
                  onClick={() => setRole(r.id)}
                >
                  <span className="text-lg">{r.icon}</span>
                  {r.id}
                </button>
              ))}
            </div>
          </div>

          {errors.email && (
            <p className="mb-3 text-center text-xs font-bold tracking-wider text-red-500 animate-pulse">
              {errors.email}
            </p>
          )}

          <div className="h-[14px]" />
          <GameButton onClick={submit}>► CHOOSE YOUR MACHINIST</GameButton>
        </div>
      </div>
    </div>
  );
}
