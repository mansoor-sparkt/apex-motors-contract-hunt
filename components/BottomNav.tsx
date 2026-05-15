"use client";

import type { HuntTab } from "@/lib/game-types";

const TABS: { id: HuntTab; label: string; icon: string }[] = [
  { id: "stops", label: "STOPS", icon: "📍" },
  { id: "shorts", label: "SHORTS", icon: "🎬" },
  { id: "board", label: "BOARD", icon: "🏆" },
  { id: "comp", label: "TRAVELER", icon: "📋" },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: HuntTab;
  onChange: (tab: HuntTab) => void;
}) {
  return (
    <nav
      className="flex-shrink-0 grid grid-cols-4 border-t border-[rgba(241,92,48,0.25)]"
      style={{
        background: "linear-gradient(to top, rgba(4,5,6,0.98), rgba(4,5,6,0.92))",
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
              isActive ? "text-[#F15C30]" : "text-[rgba(232,234,240,0.4)]"
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span className="font-[family:var(--font-share-mono)] text-[8px] tracking-[0.12em]">
              {tab.label}
            </span>
            {isActive && (
              <div
                className="absolute bottom-0 h-0.5 w-8 bg-[#F15C30]"
                style={{ boxShadow: "0 0 8px rgba(241,92,48,0.6)" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
