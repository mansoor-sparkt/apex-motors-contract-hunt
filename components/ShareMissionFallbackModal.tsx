"use client";

import { useEffect, useState } from "react";
import { GameButton } from "./GameComponents";

export function ShareMissionFallbackModal({
  imageUrl,
  summaryText,
  file,
  needsHttps,
  onClose,
  onToast,
}: {
  imageUrl: string;
  summaryText: string;
  file: File;
  needsHttps: boolean;
  onClose: () => void;
  onToast?: (msg: string) => void;
}) {
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      onToast?.("✓ Summary copied — paste in your post");
    } catch {
      onToast?.("⚠ Couldn't copy — select and copy the text below");
    }
  };

  const tryNativeShare = async () => {
    if (typeof navigator.share !== "function") {
      onToast?.(
        needsHttps
          ? "Share menu needs HTTPS — use hold-to-share on the image below"
          : "Use hold-to-share on the image below"
      );
      return;
    }

    setSharing(true);
    try {
      const payload: ShareData = { files: [file], text: summaryText };
      if (navigator.canShare && !navigator.canShare(payload)) {
        await navigator.share({ files: [file] });
      } else {
        await navigator.share(payload);
      }
      onClose();
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        onToast?.("Couldn't open share menu — press and hold the image instead");
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <div
      className="game-share-fallback"
      role="dialog"
      aria-modal="true"
      aria-label="Share mission report"
    >
      <div className="game-share-fallback-panel">
        <div className="game-share-fallback-head">
          <span className="game-share-fallback-title">SHARE MISSION REPORT</span>
          <button
            type="button"
            className="game-share-fallback-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {needsHttps && (
          <p className="game-share-fallback-note">
            Safari&apos;s share menu requires a secure (HTTPS) connection. Use the
            image below — press and hold, then tap <strong>Share</strong>.
          </p>
        )}

        <img
          src={imageUrl}
          alt="Your mission report"
          className="game-share-fallback-img"
        />

        <p className="game-share-fallback-hint">
          📱 <strong>iPhone/iPad:</strong> Press and hold the image → Share
        </p>

        <div className="game-share-fallback-actions">
          {typeof navigator.share === "function" && (
            <GameButton variant="primary" disabled={sharing} onClick={() => void tryNativeShare()}>
              {sharing ? "OPENING…" : "► SHARE…"}
            </GameButton>
          )}
          <GameButton variant="secondary" onClick={() => void copySummary()}>
            COPY SUMMARY TEXT
          </GameButton>
          <GameButton variant="secondary" onClick={onClose}>
            DONE
          </GameButton>
        </div>
      </div>
    </div>
  );
}
