"use client";

import type { HuntTab } from "@/lib/game-types";

const TABS: { id: HuntTab; label: string; icon: string }[] = [
  { id: "stops", label: "STOPS", icon: "📍" },
  { id: "shorts", label: "BONUS", icon: "🎬" },
  { id: "board", label: "BOARD", icon: "🏆" },
  { id: "comp", label: "PROFILE", icon: "📋" },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: HuntTab;
  onChange: (tab: HuntTab) => void;
}) {
  return (
    <nav className="game-bnav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`game-bnav-item${active === tab.id ? " on" : ""}`}
        >
          <span className="game-bnav-ic">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
