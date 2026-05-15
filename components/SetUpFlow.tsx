"use client";

/**
 * @deprecated Use RegisterScreen + AvatarScreen via GameApp flow instead.
 * Kept for backwards compatibility.
 */
export { RegisterScreen as SetupFlowRegister } from "./RegisterScreen";
export { AvatarScreen as SetupFlowAvatar } from "./AvatarScreen";

import type { PlayerProfile, RegisterDraft } from "@/lib/game-types";
import { RegisterScreen } from "./RegisterScreen";
import { AvatarScreen } from "./AvatarScreen";
import { useState } from "react";

export function SetupFlow({
  onComplete,
}: {
  onComplete: (player: PlayerProfile) => void;
}) {
  const [draft, setDraft] = useState<RegisterDraft | null>(null);

  if (!draft) {
    return (
      <RegisterScreen
        onNext={(d) => setDraft(d)}
      />
    );
  }

  return (
    <AvatarScreen
      draft={draft}
      onComplete={onComplete}
      onBack={() => setDraft(null)}
    />
  );
}
