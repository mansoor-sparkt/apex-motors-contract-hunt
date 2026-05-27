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
//           ALL UNLOCKED · ANY ORDER · +10 OR +20 PTS EACH
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

import { useRef, useState } from "react";
import { SHORTS } from "@/constants";
import type { CelebrationState, ShortCompletion } from "@/lib/game-types";
import MediaModal from "./MediaModal";
import { GameService } from "@/lib/game.service";
import { IMAGE_UPLOAD_ACCEPT, isImageFile } from "@/lib/image-to-png";
import { openMachinistApp } from "@/lib/machinist-app";
import { MediaUploadProgress } from "@/components/MediaUploadProgress";

type ShortDef = (typeof SHORTS)[number];

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
}: {
  short: ShortDef;
  completion?: ShortCompletion;
  emailId: string;
  onComplete: (slug: string, data: ShortCompletion) => void;
  onCelebrate: (state: CelebrationState) => void;
  onToast: (msg: string) => void;
  onSkip?: () => void;
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
    const isVideo = file.type.startsWith("video/");

    if (isPhoto && !isImage) {
      onToast("⚠️ UNSUPPORTED FILE — USE A PHOTO (JPG, PNG, HEIC, ETC.)");
      return;
    }
    if (!isPhoto && !isVideo) return;

    if (!emailId) {
      onToast("⚠️ SIGN IN REQUIRED TO UPLOAD MEDIA");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadPercent(0);

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
        };

        // INSTANT PROGRESS: Update global state engine immediately
        onComplete(short.slug, data);

        onCelebrate({
          icon: "📸",
          title: isApp ? "SCREENSHOT LOGGED!" : "CHALLENGE COMPLETE!",
          sub: isApp ? "+10 PTS EARNED. NOW ANSWER THE QUESTION." : `+${short.pts} BONUS PTS LOGGED.`,
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

  // ── NEW: Handle the 2nd Phase Question Submit ──
  const handleAppSubmit = () => {
    if (!appAnswer.trim()) {
      setErrorMsg("⚠️ PLEASE ENTER AN ANSWER.");
      return;
    }

    const isCorrect = appAnswer.trim().toLowerCase() === String(short.targetAnswer).toLowerCase();

    if (isCorrect) {
      setErrorMsg("");
      // Update completion data to flip qAnswered to true
      onComplete(short.slug, { ...completion!, qAnswered: true });

      onCelebrate({
        icon: "🎉",
        title: "APP CHALLENGE 100% COMPLETE!",
        sub: "+10 FINAL BONUS PTS LOGGED.",
        badge: short.badge || "APP MASTER",
      });
    } else {
      setErrorMsg("❌ INCORRECT. CHECK THE APP AGAIN.");
    }
  };

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

      <div className={`game-sc2${fullyDone ? " done" : ""}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept={isPhoto ? IMAGE_UPLOAD_ACCEPT : "video/*"}
          className="sr-only"
          tabIndex={-1}
          aria-label={
            isPhoto
              ? "Upload photo from camera or gallery"
              : "Upload video from camera or gallery"
          }
          onChange={handleFileChange}
        />

        <div className="text-2xl leading-none">{short.em}</div>
        <div className="game-sc2-title">{short.title}</div>
        <div className="game-sc2-desc">{short.desc}</div>

        <button
          type="button"
          onClick={!photoDone && !uploading ? openPicker : undefined}
          disabled={uploading}
          style={{
            width: "100%",
            border: `1px dashed ${photoDone ? "rgba(57,255,20,0.45)" : uploading ? "rgba(0,229,255,0.45)" : "rgba(241,92,48,0.40)"}`,
            padding: "14px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            cursor: photoDone || uploading ? "default" : "pointer",
            background: photoDone ? "rgba(57,255,20,0.04)" : uploading ? "rgba(0,229,255,0.04)" : "rgba(241,92,48,0.03)",
            position: "relative",
            overflow: "hidden",
            clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
            transition: "all .2s",
          }}
        >
          <span style={{ fontSize: 24, lineHeight: 1 }}>
            {uploading ? "⚡" : photoDone ? "✅" : isPhoto ? "📷" : "🎬"}
          </span>
          <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: uploading ? "var(--c)" : photoDone ? "var(--g)" : "var(--mut)", letterSpacing: ".08em", textTransform: "uppercase" }}>
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
          <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--mut)", letterSpacing: ".06em", textTransform: "uppercase" }}>
            {uploading ? "KEEP THIS SCREEN OPEN" : photoDone ? "EVIDENCE SECURED" : isPhoto ? "PHOTO REQUIRED" : "VIDEO REQUIRED"}
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
        </button>

        {isApp && !photoDone && (
          <button
            type="button"
            className="game-app-cta w-full mt-2"
            onClick={() => {
              openMachinistApp();
              onToast("📱 Opening Phillips Machinist…");
            }}
          >
            <span className="game-app-cta-icon">📱</span>
            <span className="game-app-cta-text">
              <div className="game-app-cta-title">OPEN PHILLIPS MACHINIST</div>
              <div className="game-app-cta-sub">Then capture your screenshot below</div>
            </span>
            <span className="game-app-cta-arrow">►</span>
          </button>
        )}

        {/* ── NEW: In-App Question UI (Only shows for App challenges after photo upload) ── */}
        {isApp && photoDone && !fullyDone && (
          <div className="mt-3 p-3 bg-[rgba(255,187,0,0.05)] border border-[rgba(255,187,0,0.3)]" style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
            <div className="font-share-mono text-[10px] text-[#ffbb00] mb-2 tracking-[0.06em]">
              ⚠️ REQUIRED FOR FINAL 10 PTS
            </div>
            <div className="font-[family:var(--font-rajdhani)] text-[13px] text-[rgba(232,234,240,0.85)] mb-2 leading-[1.5]">
              {short.prompt}
            </div>
            {errorMsg && (
              <div className="font-share-mono text-[9px] text-[var(--o)] mb-2">
                {errorMsg}
              </div>
            )}
            <input
              type="text"
              className="game-input mb-2"
              placeholder="ENTER YOUR ANSWER..."
              value={appAnswer}
              onChange={(e) => {
                setAppAnswer(e.target.value);
                setErrorMsg("");
              }}
            />
            <button
              type="button"
              className="w-full py-2 bg-[rgba(255,187,0,0.1)] hover:bg-[rgba(255,187,0,0.15)] text-[#ffbb00] border border-[rgba(255,187,0,0.3)] font-share-mono text-[10px] tracking-[0.1em] transition-colors"
              onClick={handleAppSubmit}
            >
              ► SUBMIT ANSWER
            </button>
          </div>
        )}

        {/* View button — shows immediately after the instant upload */}
        {photoDone && (
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
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <span>{isPhoto ? "🔍" : "▶"}</span>
            VIEW SUBMITTED {isPhoto ? "PHOTO" : "VIDEO"}
          </button>
        )}

        <div className="game-sc2-foot mt-3">
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

        {/* ── NEW: Conditionally render the SKIP button only if onSkip is provided and the challenge isn't done ── */}
        {onSkip && !fullyDone && (
          <button
            type="button"
            onClick={onSkip}
            className="w-full mt-3 py-2 border border-[rgba(255,255,255,0.15)] text-[var(--mut)] font-share-mono text-[10px] tracking-[0.1em] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            style={{
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
            }}
          >
            SKIP FOR NOW ►
          </button>
        )}
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
}: {
  shortsDone: Record<string, ShortCompletion>;
  bonusScore: number;
  emailId: string;
  onComplete: (slug: string, data: ShortCompletion) => void;
  onCelebrate: (state: CelebrationState) => void;
  bonusPercent: number;
  onToast: (msg: string) => void;
}) {
  return (
    <div className="game-hub-panel">
      <div className="game-sub-hdr">
        <div className="game-bc">
          HUNT <span>›</span> BONUS CHALLENGES
        </div>
        <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] mt-0">
          ALL UNLOCKED · ANY ORDER · +10 OR +20 PTS EACH
        </p>
      </div>

      {/* <div className="px-4 py-2 space-y-3 relative z-[1]">
        <div className="border border-[rgba(255,187,0,0.3)] bg-[rgba(0,0,0,0.65)] p-3"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
          <div className="flex justify-between items-end mb-2">
            <div className="font-share-mono text-[9px] text-[#ffbb00] tracking-[0.1em]">EXTRA PRIZE: BONUS TRACK</div>
            <div className="font-orbitron text-[12px] font-bold text-[#ffbb00]">{bonusScore} / 160 PTS</div>
          </div>
          <div className="h-2 w-full bg-[rgba(255,255,255,0.1)] overflow-hidden rounded-sm">
            <div className="h-full bg-[#ffbb00] transition-all duration-500 ease-out" style={{ width: `${bonusPercent}%` }} />
          </div>
        </div>
      </div> */}

      {(() => {
        // ── MILESTONE CONFIGURATION ──
        const GIFT_MILESTONE = 100;
        const TOTAL_BONUS_POOL = 160;

        // 1. Calculate percentage based on the true 160-point pool maximum
        const fillPercent = Math.min(100, (bonusScore / TOTAL_BONUS_POOL) * 100);

        // 2. Locate exactly where the 100-point marker sits (100 / 160 = 62.5%)
        const milestonePercent = (GIFT_MILESTONE / TOTAL_BONUS_POOL) * 100;

        const isGoalReached = bonusScore >= GIFT_MILESTONE;
        const activeColor = isGoalReached ? "var(--g)" : "#ffbb00";
        const activeBorder = isGoalReached ? "rgba(57,255,20,0.3)" : "rgba(241,187,0,0.3)";

        return (
          <div className="px-4 py-2 space-y-3 relative z-[1]">
            <div
              className="bg-[rgba(0,0,0,0.65)] p-3 transition-colors duration-300"
              style={{
                border: `1px solid ${activeBorder}`,
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
              }}
            >
              {/* Tracker Headers */}
              <div className="flex justify-between items-end mb-2">
                <div
                  className="font-share-mono text-[9px] tracking-[0.1em] transition-colors duration-300"
                  style={{ color: activeColor }}
                >
                  {isGoalReached ? "🎉 EXTRA PRIZE UNLOCKED!" : "REACH 100 PTS TO UNLOCK EXTRA PRIZE"}
                </div>
                <div className="font-orbitron text-[12px] font-bold text-white">
                  {bonusScore} / {TOTAL_BONUS_POOL} PTS
                </div>
              </div>

              {/* Master Progress Container with space for the marker overflow */}
              <div className="relative w-full pt-2 pb-4">

                {/* Main 160-Point Progress Track */}
                <div className="h-2 w-full bg-[rgba(255,255,255,0.1)] overflow-hidden rounded-sm">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${fillPercent}%`,
                      backgroundColor: isGoalReached ? "var(--g)" : "#ffbb00",
                      boxShadow: isGoalReached ? "0 0 4px var(--g)" : "none"
                    }}
                  />
                </div>

                {/* ── 100-POINT MILESTONE TARGET TAG ── */}
                <div
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
                  style={{ left: `${milestonePercent}%`, marginTop: '-2px' }}
                >
                  {/* Vertical Marker Line crossing the bar */}
                  <div
                    className="w-[2px] h-5 transition-colors duration-300 shadow-sm"
                    style={{ backgroundColor: activeColor }}
                  />
                  {/* Tag Label underneath the line */}
                  <span
                    className="font-share-mono text-[10px] font-bold mt-1 whitespace-nowrap tracking-widest transition-colors duration-300"
                    style={{
                      color: activeColor,
                      textShadow: isGoalReached ? "0 0 8px rgba(57,255,20,0.4)" : "none"
                    }}
                  >
                    🎁 100 PTS
                  </span>
                </div>

              </div>
            </div>
          </div>
        );
      })()}


      {/* <div className={`h-full ${bonusPercent < 100 ? "bg-[#ffbb00]" : 'bg-[#39ff14]'} transition-all duration-500 ease-out`} style={{ width: `${bonusPercent}%` }} /> */}
      <div className="game-scroll flex-1 min-h-0 pb-20">
        <div className="game-shorts-g">
          {SHORTS.map((s) => (
            <ShortCard
              key={s.slug}
              short={s}
              completion={shortsDone[s.slug]}
              emailId={emailId}
              onComplete={onComplete}
              onCelebrate={onCelebrate}
              onToast={onToast}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
