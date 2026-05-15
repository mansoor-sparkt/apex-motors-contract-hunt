"use client";

import { useState } from "react";
import { Panel, GameButton } from "./GameComponents";
import { ROLES, IMAGE_URLS } from "@/constants";
import type { RegisterDraft } from "@/lib/game-types";

const inputClass =
  "w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(241,92,48,0.3)] p-3 text-sm text-white font-[family:var(--font-share-mono)] outline-none focus:border-[#F15C30]";

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

  const submit = () => {
    if (!name.trim() || !email.trim()) return;
    onNext({
      name: name.trim(),
      email: email.trim(),
      school: school.trim() || "My School",
      role,
    });
  };

  return (
    <div
      className="absolute inset-0 flex flex-col h-full overflow-y-auto scrollbar-hide"
      style={{
        backgroundImage: `linear-gradient(rgba(4,5,6,0.88), rgba(4,5,6,0.95)), url('${IMAGE_URLS.formBg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="p-5 flex-1 flex flex-col gap-4">
        <Panel header="OPERATOR REGISTRATION" headerColor="orange">
          <div className="space-y-3">
            <input
              className={inputClass}
              placeholder="Operator Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="School / Company"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
            <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.45)] tracking-wider uppercase mb-1">
              Role
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-2.5 border text-left font-[family:var(--font-share-mono)] text-[11px] transition-colors ${
                    role === r.id
                      ? "border-[#F15C30] bg-[rgba(241,92,48,0.12)] text-[#F15C30]"
                      : "border-[rgba(255,255,255,0.1)] text-[rgba(232,234,240,0.6)]"
                  }`}
                >
                  <span className="mr-1">{r.icon}</span>
                  {r.id}
                </button>
              ))}
            </div>
            <GameButton onClick={submit}>NEXT: CHOOSE AVATAR ►</GameButton>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full py-2 font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.45)]"
              >
                ← BACK TO SPLASH
              </button>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
