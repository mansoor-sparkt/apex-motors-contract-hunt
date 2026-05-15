"use client";

import { useEffect } from "react";

export function GameToast({
  message,
  onDone,
}: {
  message: string | null;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [message, onDone]);

  return (
    <div
      className={`absolute bottom-[72px] left-1/2 -translate-x-1/2 z-[600] px-4 py-2 font-[family:var(--font-share-mono)] text-[11px] tracking-wider whitespace-nowrap border border-[rgba(241,92,48,0.4)] bg-[rgba(8,10,14,0.95)] text-[#F15C30] transition-all duration-300 pointer-events-none ${
        message ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {message}
    </div>
  );
}

