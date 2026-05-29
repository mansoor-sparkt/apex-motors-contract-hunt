"use client";

import { openMachinistApp } from "@/lib/machinist-app";

export const MACHINIST_CTA_HEADLINE = "Get the Phillips Machinist.";
export const MACHINIST_CTA_SUBTEXT =
  "Free tools of the trade for manufacturing students.";

export function MachinistAppCta({
  className = "w-full",
  appLink,
  onOpened,
}: {
  className?: string;
  /** Per-challenge OneLink; falls back to generic Machinist app URL. */
  appLink?: string;
  onOpened?: () => void;
}) {
  return (
    <button
      type="button"
      className={`game-app-cta ${className}`.trim()}
      onClick={() => {
        openMachinistApp(appLink);
        onOpened?.();
      }}
    >
      <span className="game-app-cta-icon" aria-hidden>
        📱
      </span>
      <span className="game-app-cta-text">
        <div className="game-app-cta-title">{MACHINIST_CTA_HEADLINE}</div>
        <div className="game-app-cta-sub">{MACHINIST_CTA_SUBTEXT}</div>
      </span>
      <span className="game-app-cta-arrow" aria-hidden>
        ►
      </span>
    </button>
  );
}
