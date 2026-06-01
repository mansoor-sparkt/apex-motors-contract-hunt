


"use client";

import { useEffect, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import {
  APP_BONUS_ANSWER_PTS,
  APP_BONUS_PHOTO_PTS,
  APP_BONUS_TOTAL_PTS,
  SHORTS,
} from "@/constants";
import type { CelebrationState, ShortCompletion } from "@/lib/game-types";
import MediaModal from "./MediaModal";
import { GameService } from "@/lib/game.service";
import { IMAGE_UPLOAD_ACCEPT, isImageFile } from "@/lib/image-to-png";
import {
  isVideoFile,
  MAX_VIDEO_UPLOAD_BYTES,
  VIDEO_UPLOAD_ACCEPT,
} from "@/lib/media-upload";
import {
  resolveMediaPreviewUrl,
  resolveVideoPreviewUrl,
} from "@/lib/media-preview";
import { MachinistAppCta } from "@/components/MachinistAppCta";
import { MediaUploadProgress } from "@/components/MediaUploadProgress";
import { Panel, StatusTag } from "./GameComponents";
import { BonusProgressBar } from "./ui/BonusProgressBar";

type ShortDef = (typeof SHORTS)[number];

function resolveShortPreviewUrl(
  url: string | null,
  type: "image" | "video",
): string | null {
  if (!url) return null;
  return type === "video"
    ? resolveVideoPreviewUrl(url) ?? url
    : resolveMediaPreviewUrl(url) ?? url;
}

/** Small inline video poster for 2-up bonus tiles */
function VideoPreviewThumb({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const paintFrame = () => {
      try {
        const t =
          el.duration && Number.isFinite(el.duration)
            ? Math.min(0.15, el.duration / 10)
            : 0.1;
        if (el.currentTime < t) el.currentTime = t;
      } catch {
        /* seek may fail before metadata */
      }
    };

    el.addEventListener("loadeddata", paintFrame);
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) paintFrame();

    return () => el.removeEventListener("loadeddata", paintFrame);
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="game-sc2-upload-preview"
      muted
      playsInline
      preload="auto"
      aria-hidden
    />
  );
}

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

function getAppHintGif(short: ShortDef): StaticImageData | null {
  if (short.type !== "app" || !("hintGif" in short) || !short.hintGif) {
    return null;
  }
  return short.hintGif;
}

function AppFindItHint({
  title,
  onOpen,
}: {
  title: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="game-app-hint-link"
      onClick={onOpen}
      aria-label={`Where to find in app: ${title}`}
    >
      <span className="game-app-hint-q" aria-hidden>
        ?
      </span>
      Where to find?
    </button>
  );
}

export function ShortCard({
  short,
  completion,
  emailId,
  onComplete,
  onCelebrate,
  onToast,
  onSkip,
  onViewChallenge,
  onGoToBonusListing,
  variant = "detail",
  isDemo,
}: {
  short: ShortDef;
  completion?: ShortCompletion;
  emailId: string;
  onComplete: (slug: string, data: ShortCompletion) => void;
  onCelebrate: (state: CelebrationState) => void;
  onToast: (msg: string) => void;
  onSkip?: () => void;
  /** Listing page — opens full challenge (find-it + knowledge check). */
  onViewChallenge?: () => void;
  /** Opens hunt hub Bonus tab (all challenges grid). */
  onGoToBonusListing?: () => void;
  variant?: "list" | "detail";
  isDemo: boolean;
}) {
  const isApp = short.type === "app";
  const isPhoto = short.type === "photo" || isApp;

  // ── NEW LOGIC: Differentiate between uploading a photo and answering the question ──
  const photoDone = !!completion;
  const fullyDone = isApp ? !!completion?.qAnswered : !!completion;

  const [modalOpen, setModalOpen] = useState(false);
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const appHintGif = isApp ? getAppHintGif(short) : null;
  const [appAnswer, setAppAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = completion?.previewUrl ?? null;
  const mediaType = completion?.mediaType ?? (isPhoto ? "image" : "video");
  const displayPreviewUrl = resolveShortPreviewUrl(previewUrl, mediaType);

  const openPicker = () => {
    if (photoDone || uploading) return;
    fileInputRef.current?.click();
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   e.target.value = "";
  //   if (!file || photoDone) return;

  //   const isImage = file.type.startsWith("image/");
  //   const isVideo = file.type.startsWith("video/");

  //   if (isPhoto && !isImage) return;
  //   if (!isPhoto && !isVideo) return;

  //   const url = URL.createObjectURL(file);
  //   const mType = isImage ? "image" : "video";

  //   const data: ShortCompletion = {
  //     mediaType: mType,
  //     previewUrl: url,
  //     badge: short.badge,
  //     qAnswered: false, // Explicitly false initially for App challenges
  //   };

  //   onComplete(short.slug, data);

  //   // ── DYNAMIC CELEBRATION ──
  //   onCelebrate({
  //     icon: "📸",
  //     title: isApp ? "SCREENSHOT LOGGED!" : "CHALLENGE COMPLETE!",
  //     sub: isApp ? "+10 PTS EARNED. NOW ANSWER THE QUESTION." : `+${short.pts} BONUS PTS LOGGED.`,
  //     badge: isApp ? "HALF WAY THERE" : (short.badge || "BONUS MASTER"),
  //   });
  // };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || photoDone) return;

    const isImage = isImageFile(file);
    const isVideo = isVideoFile(file);

    if (isPhoto && !isImage) {
      onToast("⚠️ UNSUPPORTED FILE — USE A PHOTO (JPG, PNG, HEIC, ETC.)");
      e.target.value = "";
      return;
    }
    if (!isPhoto && !isVideo) {
      onToast("⚠️ UNSUPPORTED FILE — USE A VIDEO (MOV, MP4, ETC.)");
      e.target.value = "";
      return;
    }

    if (isVideo && file.size > MAX_VIDEO_UPLOAD_BYTES) {
      onToast("⚠️ VIDEO TOO LARGE! PLEASE KEEP IT UNDER 4MB.");
      e.target.value = "";
      return;
    }

    if (!emailId) {
      onToast("⚠️ SIGN IN REQUIRED TO UPLOAD MEDIA");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadPercent(0);

    // ── NEW: OFFLINE DEMO MODE BYPASS ──
    if (isDemo) {
      setTimeout(() => {
        const mType = isImage ? "image" : "video";
        const fakeData: ShortCompletion = {
          mediaType: mType,
          previewUrl: URL.createObjectURL(file), // Use offline local blob
          badge: short.badge,
          qAnswered: false,
          points: isApp ? APP_BONUS_PHOTO_PTS : short.pts
        };

        onComplete(short.slug, fakeData);
        onCelebrate({
          icon: "📸",
          title: isApp ? "SCREENSHOT LOGGED!" : "CHALLENGE COMPLETE!",
          sub: isApp
            ? `+${APP_BONUS_PHOTO_PTS} PTS EARNED. NOW ANSWER THE QUESTION.`
            : `+${short.pts} BONUS PTS LOGGED.`,
          badge: isApp ? "HALF WAY THERE" : (short.badge || "BONUS MASTER"),
        });
        setUploading(false);
      }, 800);
      return;
    }

    try {
      const res = await GameService.uploadMedia(file, emailId, setUploadPercent);

      if (res.success) {
        // Extract server-backed file path
        const serverPath = res.cdnUrl || ''
        const mType = isImage ? "image" : "video";

        const data: ShortCompletion = {
          mediaType: mType,
          previewUrl: serverPath, // Persistent server string saved to global state
          badge: short.badge,
          qAnswered: false,
          points: isApp ? APP_BONUS_PHOTO_PTS : short.pts
        };

        // INSTANT PROGRESS: Update global state engine immediately
        onComplete(short.slug, data);

        if (isApp) {
          onToast(`📸 EVIDENCE LOGGED. NOW ANSWER THE QUESTION.`);
        } else {
          onCelebrate({
            icon: "📸",
            title: isApp ? "SCREENSHOT LOGGED!" : "CHALLENGE COMPLETE!",
            sub: isApp
              ? `+${APP_BONUS_PHOTO_PTS} PTS EARNED. NOW ANSWER THE QUESTION.`
              : `+${short.pts} BONUS PTS LOGGED.`,
            badge: isApp ? "HALF WAY THERE" : (short.badge || "BONUS MASTER"),
          });
        }
      } else {
        onToast(`❌ ${res.error || "UPLOAD FAILED"}`);
      }
    } catch {
      onToast("❌ SERVER CONNECTION ERROR");
    } finally {
      setUploading(false);
      setUploadPercent(0);
      e.target.value = "";
    }
  };

  const knowledgeQuestion =
    ("bp" in short && short.bp) ? short.bp : short.prompt ?? "";

  // ── Handle Step 2 knowledge check submit ──
  const handleAppSubmit = () => {
    if (!photoDone) {
      onToast("📷 UPLOAD SCREENSHOT EVIDENCE FIRST");
      return;
    }
    if (!appAnswer.trim()) {
      setErrorMsg("⚠️ PLEASE ENTER AN ANSWER.");
      return;
    }

    const isCorrect =
      appAnswer.trim().toLowerCase() ===
      String(short.targetAnswer).toLowerCase();

    if (isCorrect) {
      setErrorMsg("");
      // Update completion data to flip qAnswered to true
      onComplete(short.slug, {
        ...completion!,
        qAnswered: true,
        points: APP_BONUS_TOTAL_PTS,
      });

      onCelebrate({
        icon: "🎉",
        title: "APP CHALLENGE 100% COMPLETE!",
        sub: `+${APP_BONUS_ANSWER_PTS} PTS LOGGED · ${APP_BONUS_TOTAL_PTS} PTS TOTAL.`,
        badge: short.badge || "APP MASTER",
      });
    } else {
      setErrorMsg("❌ INCORRECT. CHECK THE APP AGAIN.");
    }
  };

  if (variant === "list" && isApp) {
    const stepsDone = fullyDone ? 2 : photoDone ? 1 : 0;
    const statusLine = fullyDone
      ? "✓ Both steps complete"
      : photoDone
        ? "Step 1 done · finish the knowledge check"
        : "2 steps · screenshot + knowledge check";

    return (
      <>
        {modalOpen && previewUrl && (
          <MediaModal
            previewUrl={previewUrl}
            mediaType="image"
            title={short.title}
            onClose={() => setModalOpen(false)}
          />
        )}
        {hintModalOpen && appHintGif && (
          <MediaModal
            previewUrl={appHintGif.src}
            mediaType="image"
            title={short.title}
            purpose="hint"
            onClose={() => setHintModalOpen(false)}
          />
        )}

        <div
          className={`game-sc2 game-sc2--app-list w-full max-w-full min-w-0 box-border${fullyDone ? " done" : ""} `}
        >
          <div className="text-2xl leading-none">{short.em}</div>
          <div className="game-sc2-title">{short.title}</div>
          {"task" in short && short.task && (
            <p className="font-share-mono text-[10px] text-[var(--c)] tracking-[0.08em] uppercase -mt-0.5">
              {short.task}
            </p>
          )}
          <p className="game-sc2-desc">{short.desc}</p>

          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span
              className={`font-share-mono text-[8px] sm:text-[9px] tracking-[0.06em] px-1.5 py-1 border shrink-0 ${stepsDone >= 1
                ? "text-[var(--g)] border-[rgba(57,255,20,0.35)] bg-[rgba(57,255,20,0.06)]"
                : "text-[var(--mut)] border-[rgba(255,255,255,0.12)]"
                }`}
            >
              ① Screenshot{stepsDone >= 1 ? " ✓" : ""}
            </span>
            <span
              className={`font-share-mono text-[8px] sm:text-[9px] tracking-[0.06em] px-1.5 py-1 border shrink-0 ${stepsDone >= 2
                ? "text-[var(--g)] border-[rgba(57,255,20,0.35)] bg-[rgba(57,255,20,0.06)]"
                : "text-[var(--mut)] border-[rgba(255,255,255,0.12)]"
                }`}
            >
              ② Question{stepsDone >= 2 ? " ✓" : ""}
            </span>
          </div>

          <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.06em] mt-1.5 leading-snug">
            {statusLine}
          </p>

          {appHintGif && (
            <AppFindItHint
              title={short.title}
              onOpen={() => setHintModalOpen(true)}
            />
          )}

          {photoDone && previewUrl && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full mt-2 py-2 font-share-mono text-[10px] text-[var(--g)] border border-[rgba(57,255,20,0.35)] bg-[rgba(57,255,20,0.08)] tracking-[0.1em]"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              🔍 VIEW SCREENSHOT
            </button>
          )}

          <button
            type="button"
            onClick={onViewChallenge}
            className="w-full mt-2.5 py-3 bg-[rgba(0,229,255,0.08)] hover:bg-[rgba(0,229,255,0.12)] text-[var(--c)] border border-[rgba(0,229,255,0.35)] font-share-mono text-[11px] tracking-[0.1em] transition-colors"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            }}
          >
            {fullyDone
              ? "REVIEW CHALLENGE ►"
              : photoDone
                ? "CONTINUE CHALLENGE ►"
                : "VIEW CHALLENGE ►"}
          </button>

          <div className="game-sc2-foot mt-2.5 flex-wrap gap-1.5">
            <ShortTag variant="cyan">📱 MACHINIST</ShortTag>
            {fullyDone ? (
              <ShortTag variant="green">✓ +{short.pts} PTS</ShortTag>
            ) : (
              <span className="font-orbitron text-[10px] font-bold text-[var(--g)] whitespace-nowrap">
                +{photoDone ? APP_BONUS_PHOTO_PTS : short.pts}
                {photoDone && !fullyDone
                  ? ` (+${APP_BONUS_ANSWER_PTS} on question)`
                  : ""}
              </span>
            )}
          </div>
        </div>
      </>
    );
  }

  const skipBlock = (onSkip || onGoToBonusListing) && (
    <div className="mt-3">
      {!fullyDone && <button
        type="button"
        onClick={onSkip}
        className="w-full min-h-[48px] py-3.5 px-3 border border-[rgba(255,255,255,0.15)] text-[var(--mut)] font-share-mono text-sm leading-snug tracking-[0.06em] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
        }}
      >
        Skip & move to next stop ►
      </button>}
      {/* <p className="mt-2.5 text-center font-[family:var(--font-rajdhani)] text-[13px] leading-[1.5] text-[rgba(232,234,240,0.7)] px-1">
        Collect{" "}
        <span className="text-[#ffbb00] font-semibold">100 bonus points</span>{" "}
        across challenges to unlock an additional gift at the booth.
      </p> */}
      {onGoToBonusListing && (
        <button
          type="button"
          onClick={onGoToBonusListing}
          className="w-full mt-3 py-2.5 bg-[rgba(255,187,0,0.1)] hover:bg-[rgba(255,187,0,0.15)] text-[#ffbb00] border border-[rgba(255,187,0,0.35)] font-share-mono text-[11px] tracking-[0.1em] transition-colors"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}
        >
          VIEW ALL BONUS CHALLENGES ►
        </button>
      )}
    </div>
  );

  // const actionBlock = (onSkip || onGoToBonusListing) && (
  //   <div className="mt-3 flex flex-col gap-2.5">
  //     {/* ── FIX: Top mention of the Extra Prize ── */}
  //     <p className="text-center font-[family:var(--font-rajdhani)] text-[13px] leading-[1.5] text-[rgba(232,234,240,0.85)] px-2 bg-[rgba(255,187,0,0.08)] border border-[rgba(255,187,0,0.2)] p-2.5 mb-1">
  //       Collect <span className="text-[#ffbb00] font-semibold">100 bonus points</span> across challenges to unlock an additional gift at the booth.
  //     </p>

  //     {onSkip && !fullyDone && (
  //       <button
  //         type="button"
  //         onClick={onSkip}
  //         className="w-full py-3.5 border border-[rgba(255,255,255,0.15)] text-[var(--mut)] font-share-mono text-[12px] tracking-[0.06em] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
  //         style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
  //       >
  //         Skip & move to next stop ►
  //       </button>
  //     )}
  //     {onGoToBonusListing && (
  //       <button
  //         type="button"
  //         onClick={onGoToBonusListing}
  //         className="w-full py-3 bg-[rgba(255,187,0,0.1)] hover:bg-[rgba(255,187,0,0.15)] text-[#ffbb00] border border-[rgba(255,187,0,0.35)] font-share-mono text-[12px] tracking-[0.1em] transition-colors"
  //         style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
  //       >
  //         VIEW ALL BONUS CHALLENGES ►
  //       </button>
  //     )}
  //   </div>
  // );

  if (isApp) {
    const storyText =
      "story" in short && short.story ? short.story : short.desc;
    const findItText = "fi" in short && short.fi ? short.fi : short.desc;

    return (
      <>
        {modalOpen && previewUrl && (
          <MediaModal
            previewUrl={previewUrl}
            mediaType="image"
            title={short.title}
            onClose={() => setModalOpen(false)}
          />
        )}
        {hintModalOpen && appHintGif && (
          <MediaModal
            previewUrl={appHintGif.src}
            mediaType="image"
            title={short.title}
            purpose="hint"
            onClose={() => setHintModalOpen(false)}
          />
        )}

        <div className={`${fullyDone ? "opacity-95" : ""}`}>
          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_UPLOAD_ACCEPT}
            className="sr-only"
            tabIndex={-1}
            aria-label="Upload screenshot from camera or gallery"
            onChange={handleFileChange}
          />

          <div className="flex flex-col gap-2.5">
            <Panel
              header={<span style={{ color: "var(--o)" }}>📖 MISSION BRIEF</span>}
              headerColor="orange"
              stopVariant
              className="story-bg"
            >
              <p className="text-sm leading-[1.75] text-[rgba(232,234,240,0.85)]">
                {storyText}
              </p>
            </Panel>

            <Panel
              header={
                <>
                  <span style={{ color: "var(--c)" }}>① FIND-IT TASK</span>
                  <StatusTag variant="cyan">
                    {APP_BONUS_PHOTO_PTS} PTS · REQUIRED
                  </StatusTag>
                </>
              }
              headerColor="cyan"
              stopVariant
            >
              <p className="font-[family:var(--font-rajdhani)] text-base font-medium leading-[1.55] text-[rgba(232,234,240,0.92)] mb-2.5">
                {findItText}
              </p>

              {appHintGif && (
                <AppFindItHint
                  title={short.title}
                  onOpen={() => setHintModalOpen(true)}
                />
              )}

              {!photoDone && (
                <MachinistAppCta
                  className="w-full mb-2.5"
                  appLink={"appLink" in short ? short.appLink : undefined}
                  onOpened={() => onToast("📱 Opening Phillips Machinist…")}
                />
              )}

              <button
                type="button"
                onClick={openPicker}
                disabled={photoDone || uploading}
                aria-label="Tap to open camera or gallery and upload screenshot"
                className={`game-photo-box w-full${photoDone ? " up" : ""}`}
              >
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <img
                      src={previewUrl}
                      alt="Screenshot evidence"
                      className="w-full max-h-[120px] object-cover opacity-90"
                    />
                    {!uploading && photoDone && (
                      <span className="font-share-mono text-[11px] text-[var(--g)]">
                        ✅ SCREENSHOT UPLOADED — EVIDENCE LOGGED
                      </span>
                    )}
                    {!uploading && !photoDone && (
                      <span className="font-share-mono text-[11px] text-[var(--c)]">
                        PREVIEW — UPLOADING…
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <span className="text-[30px]">📱</span>
                    <span className="font-share-mono text-[11px] text-[var(--mut)] text-center">
                      TAP TO ADD SCREENSHOT
                    </span>
                  </>
                )}
                {uploading && (
                  <div className="game-upload-progress game-upload-progress--overlay">
                    <MediaUploadProgress
                      percent={uploadPercent}
                      label="TRANSMITTING EVIDENCE"
                    />
                  </div>
                )}
              </button>
            </Panel>

            <Panel
              header={
                <>
                  <span style={{ color: "#ffbb00" }}>② KNOWLEDGE CHECK</span>
                  <StatusTag variant="orange">
                    {APP_BONUS_ANSWER_PTS} PTS · REQUIRED
                  </StatusTag>
                </>
              }
              headerColor="yellow"
              stopVariant
            >
              <p
                className={`font-[family:var(--font-rajdhani)] text-lg font-bold leading-[1.55] text-[rgba(232,234,240,0.95)] mb-3 ${!photoDone ? "opacity-45" : ""
                  }`}
              >
                {knowledgeQuestion}
              </p>

              {!photoDone && (
                <p className="font-share-mono text-[10px] text-[var(--mut)] mb-3 tracking-[0.06em]">
                  Complete Step 1 to unlock this question.
                </p>
              )}

              {errorMsg && (
                <div className="font-share-mono text-[9px] text-[var(--o)] mb-2">
                  {errorMsg}
                </div>
              )}

              {short.options ? (
                <div
                  className={`flex flex-col gap-2 mb-2 ${!photoDone ? "pointer-events-none opacity-40" : ""}`}
                  role="radiogroup"
                  aria-label="Knowledge check answer"
                >
                  {short.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={!photoDone || fullyDone}
                      onClick={() => {
                        setAppAnswer(opt);
                        setErrorMsg("");
                      }}
                      className={`game-q-opt ${appAnswer === opt ? "sel" : ""}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  className="game-input mb-2"
                  placeholder="ENTER YOUR ANSWER…"
                  value={appAnswer}
                  disabled={!photoDone || fullyDone}
                  onChange={(e) => {
                    setAppAnswer(e.target.value);
                    setErrorMsg("");
                  }}
                />
              )}

              <button
                type="button"
                className="w-full py-2.5 bg-[rgba(255,187,0,0.1)] hover:bg-[rgba(255,187,0,0.15)] text-[#ffbb00] border border-[rgba(255,187,0,0.3)] font-share-mono text-[11px] tracking-[0.1em] transition-colors disabled:opacity-40 disabled:pointer-events-none"
                disabled={!photoDone || fullyDone}
                onClick={handleAppSubmit}
              >
                ► SUBMIT ANSWER
              </button>
            </Panel>

            {photoDone && previewUrl && (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full py-2 font-share-mono text-[10px] text-[var(--g)] border border-[rgba(57,255,20,0.35)] bg-[rgba(57,255,20,0.08)] tracking-[0.1em]"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                }}
              >
                🔍 VIEW SUBMITTED SCREENSHOT
              </button>
            )}

            {fullyDone && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <ShortTag variant="cyan">📱 APP CHALLENGE</ShortTag>
                <ShortTag variant="green">✓ DONE · +{short.pts} PTS</ShortTag>
              </div>
            )}

            {skipBlock}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {modalOpen && displayPreviewUrl && (
        <MediaModal
          previewUrl={displayPreviewUrl}
          mediaType={mediaType as "image" | "video"}
          title={short.title}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div
        className={`game-sc2 w-full max-w-full min-w-0 box-border${variant === "list" ? " game-sc2--tile" : ""}${fullyDone ? " done" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={isPhoto ? IMAGE_UPLOAD_ACCEPT : VIDEO_UPLOAD_ACCEPT}
          className="sr-only"
          tabIndex={-1}
          aria-label={
            isPhoto
              ? "Upload photo from camera or gallery"
              : "Upload video from camera or gallery"
          }
          onChange={handleFileChange}
        />

        <div className="game-sc2-head shrink-0">
          <div className="text-2xl leading-none">{short.em}</div>
          <div className="game-sc2-title">{short.title}</div>
          <div className="game-sc2-desc">{short.desc}</div>
        </div>

        <div className={variant === "list" ? "game-sc2-actions" : undefined}>
          <button
            type="button"
            className={
              variant === "list"
                ? `game-sc2-upload-btn${photoDone && displayPreviewUrl && !uploading ? " game-sc2-upload-btn--preview" : ""}`
                : undefined
            }
            onClick={
              variant === "list" && photoDone && displayPreviewUrl
                ? () => setModalOpen(true)
                : !photoDone && !uploading
                  ? openPicker
                  : undefined
            }
            disabled={uploading}
            aria-label={
              variant === "list" && photoDone && displayPreviewUrl
                ? `View submitted ${isPhoto ? "photo" : "video"}`
                : isPhoto
                  ? "Tap to add photo"
                  : "Tap to add video"
            }
            style={
              variant === "list"
                ? undefined
                : {
                  width: "100%",
                  border: `1px dashed ${photoDone ? "rgba(57,255,20,0.45)" : uploading ? "rgba(0,229,255,0.45)" : "rgba(241,92,48,0.40)"}`,
                  padding: "14px 10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  cursor: photoDone || uploading ? "default" : "pointer",
                  background: photoDone
                    ? "rgba(57,255,20,0.04)"
                    : uploading
                      ? "rgba(0,229,255,0.04)"
                      : "rgba(241,92,48,0.03)",
                  position: "relative",
                  overflow: "hidden",
                  clipPath:
                    "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
                  transition: "all .2s",
                }
            }
          >
            {variant === "list" && photoDone && displayPreviewUrl && !uploading ? (
              mediaType === "video" ? (
                <VideoPreviewThumb src={displayPreviewUrl} />
              ) : (
                <img
                  src={displayPreviewUrl}
                  alt=""
                  className="game-sc2-upload-preview max-h-[70px]"
                />
              )
            ) : variant === "list" ? (
              <>
                <span className="text-lg leading-none">
                  {uploading ? "⚡" : isPhoto ? "📷" : "🎬"}
                </span>
                <span className="font-share-mono text-[8px] text-[var(--mut)] tracking-[0.08em] uppercase leading-tight text-center">
                  {uploading
                    ? "UPLOADING…"
                    : isPhoto
                      ? "TAP TO ADD PHOTO"
                      : "TAP TO ADD VIDEO"}
                </span>
                {uploading && (
                  <div className="game-upload-progress w-full px-1 mt-0.5">
                    <MediaUploadProgress
                      percent={uploadPercent}
                      label="UPLOADING"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <span style={{ fontSize: 24, lineHeight: 1 }}>
                  {uploading ? "⚡" : photoDone ? "✅" : isPhoto ? "📷" : "🎬"}
                </span>
                <span
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: 10,
                    color: uploading
                      ? "var(--c)"
                      : photoDone
                        ? "var(--g)"
                        : "var(--mut)",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                  }}
                >
                  {uploading
                    ? `UPLOADING ${!isPhoto ? "VIDEO" : "MEDIA"}…`
                    : fullyDone
                      ? "✓ SUBMITTED"
                      : photoDone
                        ? "✓ SCREENSHOT LOGGED"
                        : isPhoto
                          ? "TAP TO ADD PHOTO"
                          : "TAP TO ADD VIDEO"}
                </span>
                <span
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: 9,
                    color: "var(--mut)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                  }}
                >
                  {uploading
                    ? "KEEP THIS SCREEN OPEN"
                    : photoDone
                      ? "EVIDENCE SECURED"
                      : isPhoto
                        ? "PHOTO REQUIRED"
                        : "VIDEO REQUIRED"}
                </span>
                {uploading && (
                  <div
                    className="game-upload-progress"
                    style={{ width: "100%", marginTop: 8, padding: "0 4px" }}
                  >
                    <MediaUploadProgress
                      percent={uploadPercent}
                      label={!isPhoto ? "UPLOADING VIDEO" : "UPLOADING MEDIA"}
                    />
                  </div>
                )}
              </>
            )}
          </button>

          {/* Detail view only — list uses tap on preview */}
          {variant !== "list" && photoDone && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-3"
              style={{
                width: "100%",
                padding: "7px 10px",
                background: "rgba(57,255,20,0.08)",
                border: "1px solid rgba(57,255,20,0.35)",
                color: "var(--g)",
                fontFamily: "var(--fm)",
                fontSize: 10,
                letterSpacing: ".1em",
                cursor: "pointer",
                clipPath:
                  "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <span>{isPhoto ? "🔍" : "▶"}</span>
              {`VIEW SUBMITTED ${isPhoto ? "PHOTO" : "VIDEO"}`}
            </button>
          )}
        </div>

        <div className={`game-sc2-foot${variant === "list" ? "" : " mt-3"}`}>
          <ShortTag variant={isPhoto ? "cyan" : "purple"}>
            {isPhoto ? "📷 PHOTO" : "🎬 VIDEO"}
          </ShortTag>
          {fullyDone ? (
            <ShortTag variant="green">✓ DONE</ShortTag>
          ) : (
            <span className="font-orbitron text-[11px] font-bold text-[var(--g)]">
              +{short.pts} PTS
            </span>
          )}
        </div>

        {skipBlock}
      </div>
    </>
  );
}

export function ShortsScreen({
  shortsDone,
  bonusScore,
  emailId,
  onComplete,
  onCelebrate,
  bonusPercent,
  onToast,
  onOpenShort,
  isDemo,
}: {
  shortsDone: Record<string, ShortCompletion>;
  bonusScore: number;
  emailId: string;
  onComplete: (slug: string, data: ShortCompletion) => void;
  onCelebrate: (state: CelebrationState) => void;
  bonusPercent: number;
  onToast: (msg: string) => void;
  onOpenShort: (slug: string) => void;
  isDemo: boolean;
}) {

  // ── NEW: Tab State Controller ──
  const [activeCategory, setActiveCategory] = useState<"app" | "photo" | "video">("app");

  // ── NEW: Filter challenges dynamically based on the active tab ──
  const displayedChallenges = SHORTS.filter((s) => s.type === activeCategory);


  // Helper function to handle tab button styling
  const getTabClass = (category: string) => {
    const isActive = activeCategory === category;
    return `flex-1 text-center font-share-mono text-[10px] font-black py-1.5 cursor-pointer transition-colors ${isActive
      ? "text-white bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.35)]"
      : "text-[var(--mut)] bg-[rgba(5,6,8,0.8)] border border-[rgba(0,229,255,0.15)] hover:bg-[rgba(0,229,255,0.05)] py-1 "
      }`;
  };

  return (
    <div className="game-hub-panel w-full min-w-0 max-w-full">
      <div className="game-sub-hdr">
        <div className="game-bc">
          HUNT <span>›</span> BONUS CHALLENGES
        </div>
        <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] mt-0">
          ALL UNLOCKED · ANY ORDER · +10 OR +15 PTS EACH
        </p>
      </div>




      <BonusProgressBar bonusScore={bonusScore} />


      <div className="px-3.5  pb-1 relative z-[1]">
        <div className="bg-[rgba(5,6,8,0.85)] border border-[rgba(0,229,255,0.2)] p-2.5"
          style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}>
          <div className="font-share-mono text-[8px] text-[var(--c)] tracking-[0.12em] uppercase mb-1.5">
            // AVAILABLE MISSION CATEGORIES (SCROLL DOWN)
          </div>
          {/* <div className="flex justify-between items-center gap-1.5">
            <span className="flex-1 text-center font-share-mono text-[10px] font-bold text-white bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.3)] py-1">
              📱 APP (2)
            </span>
            <span className="flex-1 text-center font-share-mono text-[10px] font-bold text-[var(--mut)] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] py-1 animate-pulse">
              📷 PHOTO (4) ↓
            </span>
            <span className="flex-1 text-center font-share-mono text-[10px] font-bold text-[var(--mut)] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] py-1 animate-pulse">
              🎬 VIDEO (4) ↓
            </span>
          </div> */}

          <div className="flex justify-between items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveCategory("app")}
              className={getTabClass("app")}
            >
              📱 APPS
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("photo")}
              className={getTabClass("photo")}
            >
              📷 PHOTOS
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("video")}
              className={getTabClass("video")}
            >
              🎬 VIDEOS
            </button>
          </div>
        </div>
      </div>

      {/* <div className={`h-full ${bonusPercent < 100 ? "bg-[#ffbb00]" : 'bg-[#39ff14]'} transition-all duration-500 ease-out`} style={{ width: `${bonusPercent}%` }} /> */}
      <div className="game-scroll flex-1 min-h-0 w-full min-w-0">

        {/* ── FIX: Callout at the top of the Bonus Page ── */}
        <div className="px-3.5  pb-1 relative z-[1]">
          <div className="bg-[rgba(0,229,255,0.06)] border border-[rgba(0,229,255,0.25)] p-2.5">
            <span className="font-orbitron text-[11px] text-[var(--c)] font-bold block mb-1">🎯 BONUS OBJECTIVE</span>
            <span className="font-rajdhani text-[13px] text-[rgba(232,234,240,0.9)] leading-tight block">
              App, Photo, and Video (max 4MB) challenges are all available below! Complete them in any order to unlock the Extra Prize.
            </span>
          </div>
        </div>


        <div className="game-shorts-g grid w-full min-w-0 max-w-full grid-cols-2 gap-2 box-border px-3.5 pt-1">
          {/* {SHORTS.map((s) => (
            <div
              key={s.slug}
              className={
                s.type === "app"
                  ? "game-shorts-item game-shorts-item--full col-span-2 min-w-0 w-full max-w-full"
                  : "game-shorts-item min-w-0 w-full max-w-full"
              }
            >
              <ShortCard
                short={s}
                variant="list"
                completion={shortsDone[s.slug]}
                emailId={emailId}
                onComplete={onComplete}
                onCelebrate={onCelebrate}
                onToast={onToast}
                onViewChallenge={() => onOpenShort(s.slug)}
                isDemo={isDemo}
              />
            </div>
          ))} */}

          {displayedChallenges.map((s) => (
            <div
              key={s.slug}
              className={
                s.type === "app"
                  ? "game-shorts-item game-shorts-item--full col-span-2 min-w-0 w-full max-w-full"
                  : "game-shorts-item min-w-0 w-full max-w-full"
              }
            >
              {/* <div className={s.type === "app" ? "max-h-[165px] overflow-hidden" : ""}> */}
              <ShortCard
                short={s}
                variant="list"
                completion={shortsDone[s.slug]}
                emailId={emailId}
                onComplete={onComplete}
                onCelebrate={onCelebrate}
                onToast={onToast}
                onViewChallenge={() => onOpenShort(s.slug)}
                isDemo={isDemo}
              />
              {/* </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
