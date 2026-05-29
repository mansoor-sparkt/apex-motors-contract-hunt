// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { SHORTS } from "@/constants";
// import type { CelebrationState, ShortCompletion } from "@/lib/game-types";
// import MediaModal from "./MediaModal";

// type ShortDef = (typeof SHORTS)[number];

// type PendingMedia = {
//   previewUrl: string;
//   mediaType: "image" | "video";
// };

// function ShortTag({
//   children,
//   variant,
// }: {
//   children: React.ReactNode;
//   variant: "cyan" | "purple" | "green";
// }) {
//   const v =
//     variant === "cyan"
//       ? "game-tag-c"
//       : variant === "purple"
//         ? "game-tag-pu"
//         : "game-tag-g";
//   return <span className={`game-tag game-tag-sm ${v}`}>{children}</span>;
// }

// function ShortCard({
//   short,
//   completion,
//   onComplete,
//   onCelebrate,
// }: {
//   short: ShortDef;
//   completion?: ShortCompletion;
//   onComplete: (slug: string, data: ShortCompletion) => void;
//   onCelebrate: (state: CelebrationState) => void;
// }) {
//   const done = !!completion;
//   const isPhoto = short.type === "photo";

//   const [pending, setPending] = useState<PendingMedia | null>(null);
//   // const [expanded, setExpanded] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const previewUrl = completion?.previewUrl ?? pending?.previewUrl ?? null;
//   const mediaType =
//     completion?.mediaType ??
//     pending?.mediaType ??
//     (isPhoto ? "image" : "video");

//   const revokePending = useCallback((url: string | null) => {
//     if (url && url.startsWith("blob:")) {
//       URL.revokeObjectURL(url);
//     }
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (pending?.previewUrl) revokePending(pending.previewUrl);
//     };
//   }, [pending?.previewUrl, revokePending]);

//   const openPicker = () => {
//     if (done) return;
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     e.target.value = "";
//     if (!file || done) return;

//     const isImage = file.type.startsWith("image/");
//     const isVideo = file.type.startsWith("video/");

//     if (isPhoto && !isImage) return;
//     if (!isPhoto && !isVideo) return;

//     setPending((prev) => {
//       if (prev?.previewUrl) revokePending(prev.previewUrl);
//       return {
//         previewUrl: URL.createObjectURL(file),
//         mediaType: isImage ? "image" : "video",
//       };
//     });
//   };

//   const handleRetake = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (done) return;
//     setPending((prev) => {
//       if (prev?.previewUrl) revokePending(prev.previewUrl);
//       return null;
//     });
//     fileInputRef.current?.click();
//   };

//   const handleSubmit = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (done || !pending) return;

//     const data: ShortCompletion = {
//       mediaType: pending.mediaType,
//       previewUrl: pending.previewUrl,
//       badge: short.badge,
//     };

//     onComplete(short.slug, data);
//     setPending(null);
//     onCelebrate({
//       icon: short.type === "video" ? "🎬" : "📸",
//       title: "SHORT SUBMITTED!",
//       sub: "+5 BONUS PTS EARNED.",
//       badge: short.badge,
//     });
//   };
//   const hasPending = !!pending;
//   const hasSubmitted = done && !!completion?.previewUrl;

//   return (
//     <>
//       {modalOpen && previewUrl && (
//         <MediaModal
//           previewUrl={previewUrl}
//           mediaType={mediaType as "image" | "video"}
//           title={short.title}
//           onClose={() => setModalOpen(false)}
//         />
//       )}

//       <div className={`game-sc2${done ? " done" : ""}`}>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept={isPhoto ? "image/*" : "video/*"}
//           className="sr-only"
//           tabIndex={-1}
//           aria-hidden
//           onChange={handleFileChange}
//         />

//         <div className="text-2xl leading-none">{short.em}</div>
//         <div className="game-sc2-title">{short.title}</div>
//         <div className="game-sc2-desc">{short.desc}</div>

//         {/* Upload zone */}
//         <button
//           type="button"
//           onClick={!done ? openPicker : undefined}
//           style={{
//             width: "100%",
//             border: `1px dashed ${done ? "rgba(57,255,20,0.45)" : hasPending ? "rgba(241,92,48,0.70)" : "rgba(241,92,48,0.40)"}`,
//             padding: "14px 10px",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 5,
//             cursor: done ? "default" : "pointer",
//             background: done ? "rgba(57,255,20,0.04)" : hasPending ? "rgba(241,92,48,0.07)" : "rgba(241,92,48,0.03)",
//             position: "relative",
//             overflow: "hidden",
//             clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
//             transition: "all .2s",
//           }}
//         >
//           <span style={{ fontSize: 24, lineHeight: 1 }}>
//             {done ? "✅" : hasPending ? (isPhoto ? "📷" : "🎬") : isPhoto ? "📷" : "🎬"}
//           </span>
//           <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: done ? "var(--g)" : hasPending ? "var(--o)" : "var(--mut)", letterSpacing: ".08em", textTransform: "uppercase" }}>
//             {done ? "✓ SUBMITTED" : hasPending ? (isPhoto ? "PHOTO READY" : "VIDEO READY") : isPhoto ? "TAP TO ADD PHOTO" : "TAP TO ADD VIDEO"}
//           </span>
//           <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--mut)", letterSpacing: ".06em", textTransform: "uppercase" }}>
//             {done ? "EVIDENCE LOGGED" : hasPending ? "SUBMIT BELOW" : isPhoto ? "PHOTO REQUIRED" : "VIDEO REQUIRED"}
//           </span>
//         </button>

//         {/* View button — only when media exists */}
//         {(hasSubmitted || hasPending) && (
//           <button
//             type="button"
//             onClick={() => setModalOpen(true)}
//             style={{
//               width: "100%",
//               padding: "7px 10px",
//               background: done ? "rgba(57,255,20,0.08)" : "rgba(0,229,255,0.08)",
//               border: `1px solid ${done ? "rgba(57,255,20,0.35)" : "rgba(0,229,255,0.30)"}`,
//               color: done ? "var(--g)" : "var(--c)",
//               fontFamily: "var(--fm)",
//               fontSize: 10,
//               letterSpacing: ".1em",
//               cursor: "pointer",
//               clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 5,
//             }}
//           >
//             <span>{isPhoto ? "🔍" : "▶"}</span>
//             {done ? "VIEW SUBMITTED" : "PREVIEW"} {isPhoto ? "PHOTO" : "VIDEO"}
//           </button>
//         )}

//         <div className="game-sc2-foot">
//           <ShortTag variant={isPhoto ? "cyan" : "purple"}>
//             {isPhoto ? "📷 PHOTO" : "🎬 VIDEO"}
//           </ShortTag>
//           {done ? (
//             <ShortTag variant="green">✓ DONE</ShortTag>
//           ) : (
//             <span className="font-orbitron text-[11px] font-bold text-[var(--g)]">
//               +{short.pts} PTS
//             </span>
//           )}
//         </div>

//         {!done && hasPending && (
//           <>
//             <button type="button" className="game-sc2-retake" onClick={handleRetake}>
//               ↺ CHANGE {isPhoto ? "PHOTO" : "VIDEO"}
//             </button>
//             <button type="button" className="game-sc2-upload" onClick={handleSubmit}>
//               ► SUBMIT FOR +{short.pts} PTS
//             </button>
//           </>
//         )}
//       </div>
//     </>
//   );
// }

// export function ShortsScreen({
//   shortsDone,
//   onComplete,
//   onCelebrate,
// }: {
//   shortsDone: Record<string, ShortCompletion>;
//   onComplete: (slug: string, data: ShortCompletion) => void;
//   onCelebrate: (state: CelebrationState) => void;
// }) {
//   return (
//     <div className="game-hub-panel">
//       <div className="game-sub-hdr">
//         <div className="game-bc">
//           HUNT <span>›</span> SHORTS
//         </div>
//         <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] mt-0">
//           ALL UNLOCKED · ANY ORDER · +5 PTS + BADGE EACH
//         </p>
//       </div>

//       <div className="game-scroll flex-1 min-h-0">
//         <div className="game-shorts-g">
//           {SHORTS.map((s) => (
//             <ShortCard
//               key={s.slug}
//               short={s}
//               completion={shortsDone[s.slug]}
//               onComplete={onComplete}
//               onCelebrate={onCelebrate}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useRef, useState } from "react";
// import { SHORTS } from "@/constants";
// import type { CelebrationState, ShortCompletion } from "@/lib/game-types";
// import MediaModal from "./MediaModal";

// type ShortDef = (typeof SHORTS)[number];

// function ShortTag({
//   children,
//   variant,
// }: {
//   children: React.ReactNode;
//   variant: "cyan" | "purple" | "green";
// }) {
//   const v =
//     variant === "cyan"
//       ? "game-tag-c"
//       : variant === "purple"
//         ? "game-tag-pu"
//         : "game-tag-g";
//   return <span className={`game-tag game-tag-sm ${v}`}>{children}</span>;
// }

// function ShortCard({
//   short,
//   completion,
//   onComplete,
//   onCelebrate,
// }: {
//   short: ShortDef;
//   completion?: ShortCompletion;
//   onComplete: (slug: string, data: ShortCompletion) => void;
//   onCelebrate: (state: CelebrationState) => void;
// }) {
//   const done = !!completion;
//   const isPhoto = short.type === "photo" || short.type === "app";

//   const [modalOpen, setModalOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const previewUrl = completion?.previewUrl ?? null;
//   const mediaType = completion?.mediaType ?? (isPhoto ? "image" : "video");

//   const openPicker = () => {
//     if (done) return;
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     e.target.value = ""; // Reset input so same file can be clicked again if needed
//     if (!file || done) return;

//     const isImage = file.type.startsWith("image/");
//     const isVideo = file.type.startsWith("video/");

//     if (isPhoto && !isImage) return;
//     if (!isPhoto && !isVideo) return;

//     // 1. Generate local URL for preview
//     const url = URL.createObjectURL(file);
//     const mType = isImage ? "image" : "video";

//     // 2. Build the exact submission data
//     const data: ShortCompletion = {
//       mediaType: mType,
//       previewUrl: url,
//       badge: short.badge,
//     };

//     // 3. INSTANT FIRE: Update global state immediately
//     onComplete(short.slug, data);

//     // 4. INSTANT FIRE: Pop the celebration modal with dynamic points
//     onCelebrate({
//       icon: short.type === "video" ? "🎬" : "📸",
//       title: "CHALLENGE COMPLETE!",
//       sub: `+${short.pts} BONUS PTS LOGGED.`,
//       badge: short.badge || "BONUS MASTER",
//     });
//   };

//   const hasSubmitted = done && !!completion?.previewUrl;

//   return (
//     <>
//       {modalOpen && previewUrl && (
//         <MediaModal
//           previewUrl={previewUrl}
//           mediaType={mediaType as "image" | "video"}
//           title={short.title}
//           onClose={() => setModalOpen(false)}
//         />
//       )}

//       <div className={`game-sc2${done ? " done" : ""}`}>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept={isPhoto ? "image/*" : "video/*"}
//           className="sr-only"
//           tabIndex={-1}
//           aria-hidden
//           onChange={handleFileChange}
//         />

//         <div className="text-2xl leading-none">{short.em}</div>
//         <div className="game-sc2-title">{short.title}</div>
//         <div className="game-sc2-desc">{short.desc}</div>

//         {/* Upload zone - simplified to directly show success state */}
//         <button
//           type="button"
//           onClick={!done ? openPicker : undefined}
//           style={{
//             width: "100%",
//             border: `1px dashed ${done ? "rgba(57,255,20,0.45)" : "rgba(241,92,48,0.40)"}`,
//             padding: "14px 10px",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 5,
//             cursor: done ? "default" : "pointer",
//             background: done ? "rgba(57,255,20,0.04)" : "rgba(241,92,48,0.03)",
//             position: "relative",
//             overflow: "hidden",
//             clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
//             transition: "all .2s",
//           }}
//         >
//           <span style={{ fontSize: 24, lineHeight: 1 }}>
//             {done ? "✅" : isPhoto ? "📷" : "🎬"}
//           </span>
//           <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: done ? "var(--g)" : "var(--mut)", letterSpacing: ".08em", textTransform: "uppercase" }}>
//             {done ? "✓ SUBMITTED" : isPhoto ? "TAP TO ADD PHOTO" : "TAP TO ADD VIDEO"}
//           </span>
//           <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--mut)", letterSpacing: ".06em", textTransform: "uppercase" }}>
//             {done ? "EVIDENCE LOGGED" : isPhoto ? "PHOTO REQUIRED" : "VIDEO REQUIRED"}
//           </span>
//         </button>

//         {/* View button — shows immediately after the instant upload */}
//         {hasSubmitted && (
//           <button
//             type="button"
//             onClick={() => setModalOpen(true)}
//             style={{
//               width: "100%",
//               padding: "7px 10px",
//               background: "rgba(57,255,20,0.08)",
//               border: "1px solid rgba(57,255,20,0.35)",
//               color: "var(--g)",
//               fontFamily: "var(--fm)",
//               fontSize: 10,
//               letterSpacing: ".1em",
//               cursor: "pointer",
//               clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 5,
//             }}
//           >
//             <span>{isPhoto ? "🔍" : "▶"}</span>
//             VIEW SUBMITTED {isPhoto ? "PHOTO" : "VIDEO"}
//           </button>
//         )}

//         <div className="game-sc2-foot">
//           <ShortTag variant={isPhoto ? "cyan" : "purple"}>
//             {isPhoto ? "📷 PHOTO" : "🎬 VIDEO"}
//           </ShortTag>
//           {done ? (
//             <ShortTag variant="green">✓ DONE</ShortTag>
//           ) : (
//             <span className="font-orbitron text-[11px] font-bold text-[var(--g)]">
//               +{short.pts} PTS
//             </span>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export function ShortsScreen({
//   shortsDone,
//   bonusScore,
//   onComplete,
//   onCelebrate,
//   bonusPercent
// }: {
//   shortsDone: Record<string, ShortCompletion>;
//   bonusScore: number,
//   onComplete: (slug: string, data: ShortCompletion) => void;
//   onCelebrate: (state: CelebrationState) => void;
//   bonusPercent: number
// }) {
//   return (
//     <div className="game-hub-panel">
//       <div className="game-sub-hdr">
//         <div className="game-bc">
//           HUNT <span>›</span> BONUS CHALLENGES
//         </div>
//         <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] mt-0">
//           ALL UNLOCKED · ANY ORDER · +10 OR +15 PTS EACH
//         </p>
//       </div>

//       <div className="px-4 py-2 space-y-3 relative z-[1]">
//         <div className="border border-[rgba(255,187,0,0.3)] bg-[rgba(0,0,0,0.65)] p-3"
//           style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
//           <div className="flex justify-between items-end mb-2">
//             <div className="font-share-mono text-[9px] text-[#ffbb00] tracking-[0.1em]">EXTRA PRIZE: BONUS TRACK</div>
//             <div className="font-orbitron text-[12px] font-bold text-[#ffbb00]">{bonusScore} / 100 PTS</div>
//           </div>
//           {/* Dedicated 100-Point Fill Bar */}
//           <div className="h-2 w-full bg-[rgba(255,255,255,0.1)] overflow-hidden rounded-sm">
//             <div className="h-full bg-[#ffbb00] transition-all duration-500 ease-out" style={{ width: `${bonusPercent}%` }} />
//           </div>
//         </div>
//       </div>

//       <div className="game-scroll flex-1 min-h-0 pb-20">
//         <div className="game-shorts-g">
//           {SHORTS.map((s) => (
//             <ShortCard
//               key={s.slug}
//               short={s}
//               completion={shortsDone[s.slug]}
//               onComplete={onComplete}
//               onCelebrate={onCelebrate}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
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

        onCelebrate({
          icon: "📸",
          title: isApp ? "SCREENSHOT LOGGED!" : "CHALLENGE COMPLETE!",
          sub: isApp
            ? `+${APP_BONUS_PHOTO_PTS} PTS EARNED. NOW ANSWER THE QUESTION.`
            : `+${short.pts} BONUS PTS LOGGED.`,
          badge: isApp ? "HALF WAY THERE" : (short.badge || "BONUS MASTER"),
        });
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

        <div
          className={`game-sc2 game-sc2--app-list w-full max-w-full min-w-0 box-border${fullyDone ? " done" : ""}`}
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
              className={`font-share-mono text-[8px] sm:text-[9px] tracking-[0.06em] px-1.5 py-1 border shrink-0 ${
                stepsDone >= 1
                  ? "text-[var(--g)] border-[rgba(57,255,20,0.35)] bg-[rgba(57,255,20,0.06)]"
                  : "text-[var(--mut)] border-[rgba(255,255,255,0.12)]"
              }`}
            >
              ① Screenshot{stepsDone >= 1 ? " ✓" : ""}
            </span>
            <span
              className={`font-share-mono text-[8px] sm:text-[9px] tracking-[0.06em] px-1.5 py-1 border shrink-0 ${
                stepsDone >= 2
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

  const skipBlock = onSkip && !fullyDone && (
    <div className="mt-3">
      <button
        type="button"
        onClick={onSkip}
        className="w-full min-h-[48px] py-3.5 px-3 border border-[rgba(255,255,255,0.15)] text-[var(--mut)] font-share-mono text-sm leading-snug tracking-[0.06em] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
        }}
      >
        Skip & move to next stop ►
      </button>
      <p className="mt-2.5 text-center font-[family:var(--font-rajdhani)] text-[13px] leading-[1.5] text-[rgba(232,234,240,0.7)] px-1">
        Collect{" "}
        <span className="text-[#ffbb00] font-semibold">100 bonus points</span>{" "}
        across challenges to unlock an additional gift at the booth.
      </p>
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
                className={`font-[family:var(--font-rajdhani)] text-lg font-bold leading-[1.55] text-[rgba(232,234,240,0.95)] mb-3 ${
                  !photoDone ? "opacity-45" : ""
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
                  className="game-sc2-upload-preview"
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


      {/* <div className={`h-full ${bonusPercent < 100 ? "bg-[#ffbb00]" : 'bg-[#39ff14]'} transition-all duration-500 ease-out`} style={{ width: `${bonusPercent}%` }} /> */}
      <div className="game-scroll flex-1 min-h-0 pb-20 w-full min-w-0">
        <div className="game-shorts-g grid w-full min-w-0 max-w-full grid-cols-2 gap-2 box-border px-3.5 pb-24 pt-1">
          {SHORTS.map((s) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
