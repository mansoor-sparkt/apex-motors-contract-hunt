"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SHORTS } from "@/constants";
import type { CelebrationState, ShortCompletion } from "@/lib/game-types";
import MediaModal from "./MediaModal";

type ShortDef = (typeof SHORTS)[number];

type PendingMedia = {
  previewUrl: string;
  mediaType: "image" | "video";
};

function ShortTag({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "cyan" | "purple" | "green";
}) {
  const v =
    variant === "cyan"
      ? "game-tag-c"
      : variant === "purple"
        ? "game-tag-pu"
        : "game-tag-g";
  return <span className={`game-tag game-tag-sm ${v}`}>{children}</span>;
}

function ShortCard({
  short,
  completion,
  onComplete,
  onCelebrate,
}: {
  short: ShortDef;
  completion?: ShortCompletion;
  onComplete: (slug: string, data: ShortCompletion) => void;
  onCelebrate: (state: CelebrationState) => void;
}) {
  const done = !!completion;
  const isPhoto = short.type === "photo";

  const [pending, setPending] = useState<PendingMedia | null>(null);
  // const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = completion?.previewUrl ?? pending?.previewUrl ?? null;
  const mediaType =
    completion?.mediaType ??
    pending?.mediaType ??
    (isPhoto ? "image" : "video");

  const revokePending = useCallback((url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pending?.previewUrl) revokePending(pending.previewUrl);
    };
  }, [pending?.previewUrl, revokePending]);

  const openPicker = () => {
    if (done) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || done) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (isPhoto && !isImage) return;
    if (!isPhoto && !isVideo) return;

    setPending((prev) => {
      if (prev?.previewUrl) revokePending(prev.previewUrl);
      return {
        previewUrl: URL.createObjectURL(file),
        mediaType: isImage ? "image" : "video",
      };
    });
  };

  const handleRetake = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (done) return;
    setPending((prev) => {
      if (prev?.previewUrl) revokePending(prev.previewUrl);
      return null;
    });
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (done || !pending) return;

    const data: ShortCompletion = {
      mediaType: pending.mediaType,
      previewUrl: pending.previewUrl,
      badge: short.badge,
    };

    onComplete(short.slug, data);
    setPending(null);
    onCelebrate({
      icon: short.type === "video" ? "🎬" : "📸",
      title: "SHORT SUBMITTED!",
      sub: "+5 BONUS PTS EARNED.",
      badge: short.badge,
    });
  };
  const hasPending = !!pending;
  const hasSubmitted = done && !!completion?.previewUrl;

  return (
    <>
      {modalOpen && previewUrl && (
        <MediaModal
          previewUrl={previewUrl}
          mediaType={mediaType as "image" | "video"}
          title={short.title}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className={`game-sc2${done ? " done" : ""}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept={isPhoto ? "image/*" : "video/*"}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={handleFileChange}
        />

        <div className="text-2xl leading-none">{short.em}</div>
        <div className="game-sc2-title">{short.title}</div>
        <div className="game-sc2-desc">{short.desc}</div>

        {/* Upload zone */}
        <button
          type="button"
          onClick={!done ? openPicker : undefined}
          style={{
            width: "100%",
            border: `1px dashed ${done ? "rgba(57,255,20,0.45)" : hasPending ? "rgba(241,92,48,0.70)" : "rgba(241,92,48,0.40)"}`,
            padding: "14px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            cursor: done ? "default" : "pointer",
            background: done ? "rgba(57,255,20,0.04)" : hasPending ? "rgba(241,92,48,0.07)" : "rgba(241,92,48,0.03)",
            position: "relative",
            overflow: "hidden",
            clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
            transition: "all .2s",
          }}
        >
          <span style={{ fontSize: 24, lineHeight: 1 }}>
            {done ? "✅" : hasPending ? (isPhoto ? "📷" : "🎬") : isPhoto ? "📷" : "🎬"}
          </span>
          <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: done ? "var(--g)" : hasPending ? "var(--o)" : "var(--mut)", letterSpacing: ".08em", textTransform: "uppercase" }}>
            {done ? "✓ SUBMITTED" : hasPending ? (isPhoto ? "PHOTO READY" : "VIDEO READY") : isPhoto ? "TAP TO ADD PHOTO" : "TAP TO ADD VIDEO"}
          </span>
          <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--mut)", letterSpacing: ".06em", textTransform: "uppercase" }}>
            {done ? "EVIDENCE LOGGED" : hasPending ? "SUBMIT BELOW" : isPhoto ? "PHOTO REQUIRED" : "VIDEO REQUIRED"}
          </span>
        </button>

        {/* View button — only when media exists */}
        {(hasSubmitted || hasPending) && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={{
              width: "100%",
              padding: "7px 10px",
              background: done ? "rgba(57,255,20,0.08)" : "rgba(0,229,255,0.08)",
              border: `1px solid ${done ? "rgba(57,255,20,0.35)" : "rgba(0,229,255,0.30)"}`,
              color: done ? "var(--g)" : "var(--c)",
              fontFamily: "var(--fm)",
              fontSize: 10,
              letterSpacing: ".1em",
              cursor: "pointer",
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <span>{isPhoto ? "🔍" : "▶"}</span>
            {done ? "VIEW SUBMITTED" : "PREVIEW"} {isPhoto ? "PHOTO" : "VIDEO"}
          </button>
        )}

        <div className="game-sc2-foot">
          <ShortTag variant={isPhoto ? "cyan" : "purple"}>
            {isPhoto ? "📷 PHOTO" : "🎬 VIDEO"}
          </ShortTag>
          {done ? (
            <ShortTag variant="green">✓ DONE</ShortTag>
          ) : (
            <span className="font-orbitron text-[11px] font-bold text-[var(--g)]">
              +5 PTS
            </span>
          )}
        </div>

        {!done && hasPending && (
          <>
            <button type="button" className="game-sc2-retake" onClick={handleRetake}>
              ↺ CHANGE {isPhoto ? "PHOTO" : "VIDEO"}
            </button>
            <button type="button" className="game-sc2-upload" onClick={handleSubmit}>
              ► SUBMIT FOR +5 PTS
            </button>
          </>
        )}
      </div>
    </>
  );
}

export function ShortsScreen({
  shortsDone,
  onComplete,
  onCelebrate,
}: {
  shortsDone: Record<string, ShortCompletion>;
  onComplete: (slug: string, data: ShortCompletion) => void;
  onCelebrate: (state: CelebrationState) => void;
}) {
  return (
    <div className="game-hub-panel">
      <div className="game-sub-hdr">
        <div className="game-bc">
          HUNT <span>›</span> SHORTS
        </div>
        <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] mt-0">
          ALL UNLOCKED · ANY ORDER · +5 PTS + BADGE EACH
        </p>
      </div>

      <div className="game-scroll flex-1 min-h-0">
        <div className="game-shorts-g">
          {SHORTS.map((s) => (
            <ShortCard
              key={s.slug}
              short={s}
              completion={shortsDone[s.slug]}
              onComplete={onComplete}
              onCelebrate={onCelebrate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
