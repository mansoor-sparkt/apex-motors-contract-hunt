"use client";

import { useState } from "react";
import { HUDBar, GameButton } from "./GameComponents";
import { ROLES, IMAGE_URLS } from "@/constants";
import type { RegisterDraft } from "@/lib/game-types";

export function RegisterScreen({
  onNext,
  onBack,
}: {
  onNext: (draft: RegisterDraft) => void;
  onBack?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [role, setRole] = useState("Student");

  // 1. Add error state tracking
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // 2. Simple email regex validation
  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const submit = () => {
    const newErrors: { name?: string; email?: string } = {};

    // Validate Name
    if (!name.trim()) {
      newErrors.name = "⚠️ OPERATOR NAME REQUIRED";
    }

    // Validate Email
    if (!email.trim()) {
      newErrors.email = "⚠️ RESUME KEY / EMAIL REQUIRED";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "⚠️ INVALID EMAIL FORMAT";
    }

    // If there are errors, block submission and update state
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors on success
    setErrors({});

    onNext({
      name: name.trim(),
      email: email.trim(),
      school: school.trim() || "My School",
      role,
    });
  };

  return (
    <div className="absolute inset-0 flex flex-col h-full overflow-hidden">
      <HUDBar title="OPERATOR REGISTRATION" onBack={onBack} />

      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div
          className="game-form-bg"
          style={{ backgroundImage: `url('${IMAGE_URLS.formBg}')` }}
        />
        <div className="game-form-scroll">
          <div className="game-bc">
            HOME <span>›</span> REGISTER
          </div>
          <h1 className="game-form-title">
            WHO&apos;S TAKING
            <br />
            THIS JOB?
          </h1>
          <p className="game-form-sub">NO ACCOUNT · NO PASSWORD · JUST START</p>

          <div className="game-field">
            <label>Operator Name</label>

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
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
          </div>
          <div className="game-field">
            <label>Email — your resume key</label>

            {errors.email && (
              <span className="text-red-500 text-xs font-bold tracking-wider animate-pulse">
                {errors.email}
              </span>
            )}
            <input
              className={`game-input ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
              type="email"
              placeholder="alex@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="game-field">
            <label>School / Company</label>
            <input
              className={`game-input ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
              type="text"
              placeholder="Lincoln Tech"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>
          <div className="game-field">
            <label>Role</label>
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

          <div className="h-[14px]" />
          <GameButton onClick={submit}>► NEXT: CHOOSE MACHINIST</GameButton>
        </div>
      </div>
    </div>
  );
}
