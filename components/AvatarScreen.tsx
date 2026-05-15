"use client";

import { useState } from "react";
import { HUDBar, GameButton } from "./GameComponents";
import { AVS, IMAGE_URLS } from "@/constants";
import type { PlayerProfile, RegisterDraft } from "@/lib/game-types";

const AVATAR_FACE_STYLES = [
  { background: "rgba(241,92,48,0.1)", borderColor: "rgba(241,92,48,0.3)" },
  { background: "rgba(0,229,255,0.08)", borderColor: "rgba(0,229,255,0.25)" },
  { background: "rgba(57,255,20,0.08)", borderColor: "rgba(57,255,20,0.25)" },
  { background: "rgba(177,77,255,0.1)", borderColor: "rgba(177,77,255,0.3)" },
];

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
    <div className="absolute inset-0 flex flex-col h-full overflow-hidden">
      <HUDBar title="SELECT OPERATOR" onBack={onBack} />

      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div
          className="game-form-bg"
          style={{ backgroundImage: `url('${IMAGE_URLS.formBg}')` }}
        />
        <div className="game-form-scroll">
          <div className="game-bc">
            REGISTER <span>›</span> OPERATOR
          </div>
          <h1 className="game-form-title">
            CHOOSE YOUR
            <br />
            MACHINIST
          </h1>
          <p className="game-form-sub">
            THIS CHARACTER APPEARS ON YOUR JOB TRAVELER
          </p>

          <div className="game-av-g">
            {AVS.map((av, i) => (
              <button
                key={i}
                type="button"
                className={`game-av-c${selAv === i ? " sel" : ""}`}
                onClick={() => setSelAv(i)}
              >
                <div
                  className="game-av-face"
                  style={AVATAR_FACE_STYLES[i]}
                >
                  {av.em}
                </div>
                <div className="game-av-name">{av.n}</div>
                <div className="game-av-role">{av.role}</div>
              </button>
            ))}
          </div>

          <GameButton
            variant="primary"
            disabled={selAv < 0}
            onClick={() =>
              onComplete({
                ...draft,
                avatarIndex: selAv,
              })
            }
          >
            ► START THE HUNT
          </GameButton>
        </div>
      </div>
    </div>
  );
}
