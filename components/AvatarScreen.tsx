"use client";

import { useState } from "react";
import { Panel, GameButton } from "./GameComponents";
import { AVS, IMAGE_URLS } from "@/constants";
import type { PlayerProfile, RegisterDraft } from "@/lib/game-types";

export function AvatarScreen({
  draft,
  onComplete,
  onBack,
}: {
  draft: RegisterDraft;
  onComplete: (player: PlayerProfile) => void;
  onBack: () => void;
}) {
  const [selAv, setSelAv] = useState(-1);

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
        <Panel header="CHOOSE YOUR AVATAR" headerColor="cyan">
          <div className="font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.5)] mb-1">
            Pick the operator who represents you on the shop floor.
          </div>
          <div className="font-[family:var(--font-orbitron)] text-[10px] text-[#F15C30]">
            {draft.name.toUpperCase()} · {draft.school}
          </div>
        </Panel>
        <div className="grid grid-cols-2 gap-3">
          {AVS.map((av, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelAv(i)}
              className={`p-4 border text-center transition-colors ${
                selAv === i
                  ? "border-[#F15C30] bg-[rgba(241,92,48,0.1)]"
                  : "border-[rgba(255,255,255,0.1)] bg-[rgba(5,6,8,0.6)] hover:border-[rgba(241,92,48,0.4)]"
              }`}
            >
              <div className="text-4xl mb-2">{av.em}</div>
              <div className="text-[10px] font-bold font-[family:var(--font-orbitron)] text-white">
                {av.n}
              </div>
              <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.45)] mt-1 leading-snug">
                {av.role}
              </div>
            </button>
          ))}
        </div>
        <GameButton
          variant="primary"
          disabled={selAv < 0}
          className="disabled:opacity-40"
          onClick={() =>
            onComplete({
              ...draft,
              avatarIndex: selAv,
            })
          }
        >
          ENTER HUNT HUB ►
        </GameButton>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.45)]"
        >
          ← BACK TO REGISTRATION
        </button>
      </div>
    </div>
  );
}
