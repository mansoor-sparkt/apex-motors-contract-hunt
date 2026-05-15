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
            <input
              className="game-input"
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="game-field">
            <label>Email — your resume key</label>
            <input
              className="game-input"
              type="email"
              placeholder="alex@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
