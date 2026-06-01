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

    <div className={`game-toast${message ? " on" : ""}`}>
      {message}
    </div>
  );
}
