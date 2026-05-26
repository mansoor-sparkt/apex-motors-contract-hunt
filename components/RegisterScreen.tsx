"use client";

import { useEffect, useState } from "react";
import { HUDBar, GameButton } from "./GameComponents";
import { ROLES, IMAGE_URLS } from "@/constants";
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
  const [shopName, setShopName] = useState(draft?.shopName || "");
  const [name, setName] = useState(draft?.name || "");
  const [email, setEmail] = useState(draft?.email || initialEmail || "");
  const [school, setSchool] = useState(draft?.school || "");
  const [role, setRole] = useState(draft?.role || "Student");

  const [errors, setErrors] = useState<{
    shopName?: string;
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
    const newErrors: { shopName?: string; name?: string; email?: string } = {};

    if (!shopName.trim()) {
      newErrors.shopName = "⚠️ SHOP NAME REQUIRED";
    }
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
      shopName: shopName.trim(),
      name: name.trim(),
      email: email.trim(),
      school: school.trim() || "My School",
      role,
    });
  };

  return (
    <div className="absolute inset-0 flex flex-col h-full overflow-hidden">
      <HUDBar title="NAME YOUR SHOP" onBack={onBack} />

      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div
          className="game-form-bg"
          style={{ backgroundImage: `url('${IMAGE_URLS.formBg}')` }}
        />
        <div className="game-form-scroll">
          <div className="game-bc">
            INTRO <span>›</span> SHOP SETUP
          </div>
          <h1 className="game-form-title">
            WHAT&apos;S YOUR
            <br />
            SHOP CALLED?
          </h1>
          <p className="game-form-sub">
            YOUR SHOP NAME APPEARS ON EVERY MISSION CARD
          </p>

          <div className="game-field">
            <label>Shop Name</label>
            {errors.shopName && (
              <span className="text-red-500 text-xs font-bold tracking-wider animate-pulse">
                {errors.shopName}
              </span>
            )}
            <input
              className={`game-input ${errors.shopName ? "border-red-500 focus:border-red-500" : ""}`}
              type="text"
              placeholder="Apex Precision Works"
              value={shopName}
              onChange={(e) => {
                setShopName(e.target.value);
                if (errors.shopName)
                  setErrors((prev) => ({ ...prev, shopName: undefined }));
              }}
            />
          </div>
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
            <label>Email — your resume key</label>
            {errors.email && (
              <span className="text-red-500 text-xs font-bold tracking-wider animate-pulse">
                {errors.email}
              </span>
            )}
            <input
              className={`game-input ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
              type="email"
              placeholder="alex@school.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              readOnly={!!initialEmail}
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

          <div className="h-[14px]" />
          <GameButton onClick={submit}>► CHOOSE YOUR MACHINIST</GameButton>
        </div>
      </div>
    </div>
  );
}
