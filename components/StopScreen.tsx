// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   HUDBar,
//   Panel,
//   GameButton,
//   StatusTag,
// } from "./GameComponents";
// import {
//   STOPS,
//   AVS,
//   STOP_IMAGE_MAP,
//   STOP_BRIGHTNESS,
//   TOTAL_STOPS,
// } from "@/constants";
// import type { PlayerProfile, StopCompletion, CelebrationState } from "@/lib/game-types";
// import { GameService } from "@/lib/game.service";

// export function StopScreen({
//   isActive,
//   stopIndex,
//   player,
//   stopsDone,
//   onBack,
//   onSubmit,
//   onNavigate,
//   onToast,
//   onCelebrate,
//   onOpenMap
// }: {
//   isActive: boolean;
//   stopIndex: number;
//   player: PlayerProfile;
//   stopsDone: Record<number, StopCompletion>;
//   onBack: () => void;
//   onSubmit: (index: number, data: StopCompletion) => void;
//   onNavigate: (index: number) => void;
//   onToast: (msg: string) => void;
//   onCelebrate: (state: CelebrationState) => void;
//   onOpenMap: () => void
// }) {
//   const s = STOPS[stopIndex];
//   const done = !!stopsDone[stopIndex];
//   const av = AVS[player.avatarIndex] ?? AVS[0];


//   // ── 1. Calculate total active time spent BEFORE this stop ──
//   const previousStopsTime = Object.entries(stopsDone).reduce((acc, [key, value]: [string, any]) => {
//     // Only add time from other stops, not the current one if it's somehow already logged
//     if (Number(key) !== stopIndex) {
//       return acc + (value.timeSpent || 0);
//     }
//     return acc;
//   }, 0);

//   // ── 2. Memory Bank: Check if they have paused time for this specific stop ──
//   // const getSavedPartial = () => {
//   //   if (typeof window === "undefined") return 0;
//   //   return parseInt(sessionStorage.getItem(`partial_time_${stopIndex}`) || "0", 10);
//   // };


//   const [photoUp, setPhotoUp] = useState(done);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [selQ, setSelQ] = useState<number | null>(
//     stopsDone[stopIndex]?.qs ?? null
//   );
//   const [bonusAnswer, setBonusAnswer] = useState("");
//   const [repName, setRepName] = useState(stopsDone[stopIndex]?.rn ?? "");
//   const [repAnswer, setRepAnswer] = useState("");

//   // ── LIVE TICKING SESSION TIMER STATE ──
//   const [elapsedSeconds, setElapsedSeconds] = useState(previousStopsTime);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Live Timer Effect Hook
//   // useEffect(() => {
//   //   if (done) {
//   //     // If this stop is already finished, show what the final total clock was at that moment
//   //     const currentStopTime = stopsDone[stopIndex]?.timeSpent || 0;
//   //     setElapsedSeconds(previousStopsTime + currentStopTime);
//   //     return;
//   //   }



//   //   // If it's a fresh stop, start counting up directly from where the last stop left off!
//   //   setElapsedSeconds(previousStopsTime + getSavedPartial());

//   //   const activeInterval = setInterval(() => {
//   //     setElapsedSeconds((prev) => {
//   //       const next = prev + 1;

//   //       // Every second, quietly save their progress to the browser's memory
//   //       if (typeof window !== "undefined") {
//   //         sessionStorage.setItem(`partial_time_${stopIndex}`, (next - previousStopsTime).toString());
//   //       }

//   //       return next;
//   //     });
//   //   }, 1000);

//   //   return () => clearInterval(activeInterval);
//   // }, [stopIndex, done, stopsDone, previousStopsTime]);


//   // Live Timer Effect Hook
//   useEffect(() => {
//     if (!isActive || done) {
//       // RULE 3: Stop the clock and show final frozen time.
//       const currentStopTime = stopsDone[stopIndex]?.timeSpent || 0;
//       setElapsedSeconds(previousStopsTime + currentStopTime);
//       return;
//     }

//     // RULE 2 & 4: Read memory bank, start from exact previous timestamp
//     const partial = parseInt(sessionStorage.getItem(`partial_time_${stopIndex}`) || "0", 10);
//     let currentSeconds = previousStopsTime + partial;

//     setElapsedSeconds(currentSeconds);

//     const activeInterval = setInterval(() => {
//       currentSeconds += 1; // Count up cleanly
//       setElapsedSeconds(currentSeconds); // Update UI

//       // Save quietly to browser memory in case they click Back
//       if (typeof window !== "undefined") {
//         sessionStorage.setItem(`partial_time_${stopIndex}`, (currentSeconds - previousStopsTime).toString());
//       }
//     }, 1000);
//     // RULE 2: If they click "Back", this instantly stops the interval from running outside the screen
//     return () => clearInterval(activeInterval);

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isActive, stopIndex, done, stopsDone, previousStopsTime]);
//   useEffect(() => {
//     setPhotoUp(!!stopsDone[stopIndex]);

//     setPreviewUrl((prev) => {
//       if (prev) URL.revokeObjectURL(prev);
//       return null;
//     });


//     setSelQ(stopsDone[stopIndex]?.qs ?? null);
//     setRepName(stopsDone[stopIndex]?.rn ?? "");
//     setBonusAnswer("");
//     setRepAnswer("");
//   }, [stopIndex, stopsDone]);

//   useEffect(() => {
//     return () => {
//       setPreviewUrl((prev) => {
//         if (prev) URL.revokeObjectURL(prev);
//         return null;
//       });
//     };
//   }, []);

//   const photoUrl = STOP_IMAGE_MAP[stopIndex + 1] ?? STOP_IMAGE_MAP[1];
//   const brightness = STOP_BRIGHTNESS[stopIndex] ?? 0.45;
//   const calcLabel =
//     s.bt === "calc" && "calc" in s && s.calc
//       ? `Open ${s.calc} in app →`
//       : "Tap to open the calculator in the app";
//   const shopLabel = (player.shopName || "MY SHOP").toUpperCase();


//   const openPicker = () => {
//     if (done || photoUp) return;
//     fileInputRef.current?.click();
//   };

//   // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   if (!file) return;

//   //   // Revoke any previous object URL before creating a new one
//   //   setPreviewUrl((prev) => {
//   //     if (prev) URL.revokeObjectURL(prev);
//   //     return URL.createObjectURL(file);
//   //   });

//   //   setPhotoUp(true);
//   //   onToast("📸 EVIDENCE LOGGED");

//   //   // Reset so the same file can be re-selected if needed
//   //   e.target.value = "";
//   // };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // 1. Show immediate local preview so the user feels instant progress
//     const localBlobUrl = URL.createObjectURL(file);
//     setPreviewUrl(localBlobUrl);
//     onToast("⚡ TRANSMITTING EVIDENCE...");

//     try {
//       // 2. Fire upload to your Next.js API Route proxy
//       const res = await GameService.uploadMedia(file, player.email);

//       if (res.success) {
//         setPhotoUp(true);
//         onToast("📸 EVIDENCE SECURED ON SERVER");

//         // Save the backend path into your preview url state 
//         // to replace the temporary blob string
//         const serverPath = res.cdnUrl

//         console.log(serverPath, "from file uploade")
//         setPreviewUrl(serverPath);
//       } else {
//         onToast("⚠️ UPLOAD FAILED. PLEASE RETAKE.");
//         setPreviewUrl(null);
//       }
//     } catch (err) {
//       onToast("❌ CONNECTION ERROR DURING UPLOAD");
//       setPreviewUrl(null);
//     } finally {
//       e.target.value = ""; // Clear input anchor
//     }
//   };

//   const handleRetake = () => {
//     setPreviewUrl((prev) => {
//       if (prev) URL.revokeObjectURL(prev);
//       return null;
//     });
//     setPhotoUp(false);
//   };

//   // const mockUpload = () => {
//   //   if (done) return;
//   //   setPhotoUp(true);
//   //   onToast("📸 EVIDENCE LOGGED");
//   // };

//   // const submitStop = () => {
//   //   if (!photoUp && !done) {
//   //     onToast("📷 UPLOAD PHOTO FIRST");
//   //     return;
//   //   }
//   //   if (done) {
//   //     // const next = stopIndex + 1;
//   //     // if (next < TOTAL_STOPS) onNavigate(next);
//   //     // else
//   //     onBack();
//   //     return;
//   //   }

//   //   let bonus = false;
//   //   let badge: string | null = s.b1;
//   //   let rn = "";

//   //   if (s.bt === "calc") {
//   //     bonus = !!bonusAnswer.trim();
//   //   } else {
//   //     rn = repName.trim();
//   //     bonus = !!rn;
//   //   }

//   //   const gained = 10 + (bonus ? 5 : 0);
//   //   onSubmit(stopIndex, {
//   //     bonus,
//   //     badge: bonus ? badge : null,
//   //     rn: rn || undefined,
//   //     qs: selQ ?? undefined,
//   //   });
//   //   onCelebrate({
//   //     icon: bonus ? "🎉" : "✅",
//   //     title: bonus ? `STOP ${stopIndex + 1} COMPLETE!` : "FIND-IT LOGGED!",
//   //     sub: bonus
//   //       ? `+${gained} PTS · YOUR SHOP IS BUILDING MOMENTUM`
//   //       : "+10 PTS · BONUS STILL AVAILABLE",
//   //     badge: bonus ? (badge ?? "BONUS") : "FIND-IT COMPLETE",
//   //   });
//   // };


//   // const submitStop = () => {
//   //   if (!photoUp && !done) {
//   //     onToast("📷 UPLOAD PHOTO FIRST");
//   //     return;
//   //   }
//   //   if (done) {
//   //     onBack();
//   //     return;
//   //   }

//   //   let bonus = false;
//   //   let badge: string | null = null;
//   //   let rn = "";

//   //   // ── NEW LOGIC: Handling the 3 different stop types ──
//   //   if (s.bt === "creative") {
//   //     // Creative stops just require the photo (which is already verified above)
//   //     bonus = true;
//   //     badge = s.b1 || null;

//   //   } else if (s.bt === "calc") {
//   //     bonus = !!bonusAnswer.trim();

//   //     if (bonus) {
//   //       // If it's a graded math question (targetAnswer exists and isn't 0)
//   //       if (s.targetAnswer !== undefined && s.targetAnswer !== 0) {
//   //         const parsedAns = parseFloat(bonusAnswer);
//   //         if (!isNaN(parsedAns)) {
//   //           const diff = Math.abs(parsedAns - s.targetAnswer) / s.targetAnswer;

//   //           if (diff <= 0.10) {
//   //             badge = s.b1 || null; // Gold ±10%
//   //           } else if (diff <= 0.20) {
//   //             badge = s.b2 || null; // Silver ±20%
//   //           } else {
//   //             badge = s.b3 || null; // Bronze (Participation)
//   //           }
//   //         } else {
//   //           badge = s.b3 || null; // Fallback if they type text instead of a number
//   //         }
//   //       } else {
//   //         // Fallback for non-math text questions (like Stop 1)
//   //         badge = s.b1 || null;
//   //       }
//   //     }

//   //   } else {
//   //     // Conversation / Soft-Skills stops
//   //     rn = repName.trim();
//   //     const ans = repAnswer.trim();

//   //     const hasPartialInput = selQ !== null || !!rn || !!ans;
//   //     const hasAllInput = selQ !== null && !!rn && !!ans;

//   //     // If they started filling it out but missed a piece, warn them and halt submission!
//   //     if (hasPartialInput && !hasAllInput) {
//   //       onToast("⚠️ COMPLETE ALL SHOP TALK FIELDS FOR BONUS!");
//   //       return;
//   //     }

//   //     bonus = hasAllInput;
//   //     if (bonus) badge = s.b1 || null;
//   //   }
//   //   // else {
//   //   //   // Conversation / Soft-Skills stops
//   //   //   rn = repName.trim();
//   //   //   bonus = !!rn;
//   //   //   if (bonus) badge = s.b1 || null;
//   //   // }

//   //   const gained = 10 + (bonus ? 5 : 0);
//   //   onSubmit(stopIndex, {
//   //     bonus,
//   //     badge: bonus ? badge : null,
//   //     rn: rn || undefined,
//   //     qs: selQ ?? undefined,
//   //   });

//   //   onCelebrate({
//   //     icon: bonus ? "🎉" : "✅",
//   //     title: bonus ? `STOP ${stopIndex + 1} COMPLETE!` : "FIND-IT LOGGED!",
//   //     sub: bonus
//   //       ? `+${gained} PTS · YOUR SHOP IS BUILDING MOMENTUM`
//   //       : "+10 PTS · BONUS STILL AVAILABLE",
//   //     badge: bonus ? (badge ?? "BONUS") : "FIND-IT COMPLETE",
//   //   });
//   // };


//   const submitStop = () => {
//     if (!photoUp && !done) {
//       onToast("📷 UPLOAD PHOTO FIRST");
//       return;
//     }
//     if (done) {
//       onBack();
//       return;
//     }

//     let isCorrect = false;
//     let rn = "";

//     // ── NEW REQUIRED VALIDATION & GRADING LOGIC ──
//     if (s.bt === "calc") {
//       const cleanAns = bonusAnswer.trim();

//       // Enforce that the question is attempted
//       if (!cleanAns) {
//         onToast("⚠️ ANSWER THE SKILL CHALLENGE TO SUBMIT");
//         return;
//       }

//       // Check the answer against the target
//       // if (s.targetAnswer !== undefined) {
//       //   if (typeof s.targetAnswer === "number") {
//       //     const parsedAns = parseFloat(cleanAns);
//       //     if (!isNaN(parsedAns) && parsedAns === s.targetAnswer) {
//       //       isCorrect = true;
//       //     }
//       //   } else if (typeof s?.targetAnswer === "string") {
//       //     if (cleanAns.toLowerCase() === s?.targetAnswer.toLowerCase()) {
//       //       isCorrect = true;
//       //     }
//       //   }
//       // } else {
//       //   // Fallback if no specific target answer is defined
//       //   isCorrect = true;
//       // }


//       if (s.targetAnswer !== undefined) {
//         if (cleanAns.toLowerCase() === String(s.targetAnswer).toLowerCase()) {
//           isCorrect = true;
//         }
//       } else {
//         // Fallback if no specific target answer is defined
//         isCorrect = true;
//       }

//     } else {
//       rn = repName.trim();
//       const ans = repAnswer.trim();

//       // Enforce that all interview questions are completed
//       if (selQ === null || !rn || !ans) {
//         onToast("⚠️ COMPLETE ALL SHOP TALK FIELDS TO SUBMIT");
//         return;
//       }

//       // If they completed the conversation details, they earn the points
//       isCorrect = true;
//     }

//     // ── NEW: Clear the temporary memory because they officially submitted! ──
//     if (typeof window !== "undefined") {
//       sessionStorage.removeItem(`partial_time_${stopIndex}`);
//     }
//     // Calculate just the portion of time spent on THIS specific question
//     const timeSpentOnThisStop = elapsedSeconds - previousStopsTime;

//     // Submit values to the state engine
//     onSubmit(stopIndex, {
//       bonus: isCorrect, // Translates internally to +10 additional points
//       badge: isCorrect ? (s.badge || "Stop Master") : null,
//       rn: rn || undefined,
//       qs: selQ ?? undefined,
//       timeSpent: timeSpentOnThisStop,
//     });

//     // Fire the celebration alert with hidden badges revealed dynamically
//     onCelebrate({
//       icon: isCorrect ? "🎉" : "✅",
//       title: isCorrect ? "STOP 100% COMPLETE!" : "STOP LOGGED",
//       sub: isCorrect
//         ? "+20 PTS LOGGED · PERFECT SCORE ON THIS STOP"
//         : "+10 PTS LOGGED · PHOTO PASSED, ANSWER INCORRECT",
//       badge: isCorrect ? (s.badge || "CHAMPION") : "PHOTO VERIFIED",
//     });
//   };
//   const prevStop = () => {
//     if (stopIndex > 0) onNavigate(stopIndex - 1);
//   };

//   const nextStop = () => {
//     const n = stopIndex + 1;
//     if (n >= TOTAL_STOPS) return;
//     const unlocked = !!stopsDone[n] || n === 0 || !!stopsDone[n - 1];
//     if (!unlocked) {
//       onToast(`🔒 COMPLETE STOP ${n} FIRST`);
//       return;
//     }
//     onNavigate(n);
//   };

//   const handleKey = useCallback(
//     (e: KeyboardEvent) => {
//       if (e.key === "ArrowRight") nextStop();
//       if (e.key === "ArrowLeft") prevStop();
//       if (e.key === "Escape") onBack();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [stopIndex, stopsDone]
//   );

//   useEffect(() => {
//     if (!isActive) return;
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [handleKey]);

//   const canNext =
//     stopIndex + 1 < TOTAL_STOPS &&
//     (!!stopsDone[stopIndex + 1] ||
//       !!stopsDone[stopIndex] ||
//       stopIndex + 1 === 0);

//   const formatLiveTime = (secs: number) => {
//     const minutes = Math.floor(secs / 60);
//     const seconds = secs % 60;
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   return (
//     <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden z-30">

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         // capture="environment"
//         className="sr-only"
//         tabIndex={-1}
//         aria-hidden="true"
//         onChange={handleFileChange}
//       />
//       <div
//         className="absolute inset-0 z-0"
//         style={{
//           backgroundImage: `url('${photoUrl.src}')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center 30%",
//           filter: `brightness(${brightness * 0.6}) saturate(0.65) blur(2px)`,
//         }}
//       />
//       <div
//         className="absolute inset-0 z-[1] pointer-events-none"
//         style={{
//           background:
//             "linear-gradient(to bottom, rgba(4,5,6,0.45) 0%, rgba(4,5,6,0.72) 45%, rgba(4,5,6,0.88) 100%)",
//         }}
//       />

//       <HUDBar
//         title={`STOP ${stopIndex + 1} · ${s.co}`}
//         onBack={onBack}
//         backLabel="◄ STOPS"
//         onOpenMap={onOpenMap}
//         isMapShow={true}
//       />

//       <div className="game-scroll flex-1 min-h-0 bg-transparent">
//         <div className="relative h-[185px] flex-shrink-0 overflow-hidden">
//           <div
//             className="absolute inset-0 bg-cover bg-[center_30%]"
//             style={{
//               backgroundImage: `url('${photoUrl.src}')`,
//               filter: `brightness(${brightness}) saturate(0.8)`,
//             }}
//           />
//           <div
//             className="absolute inset-0 pointer-events-none"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(241, 92, 48, 0.05) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(241, 92, 48, 0.05) 1px, transparent 1px)
//               `,
//               backgroundSize: "28px 28px",
//             }}
//           />
//           <div
//             className="absolute left-0 right-0 h-px"
//             style={{
//               background:
//                 "linear-gradient(90deg, transparent, rgba(241,92,48,0.8), transparent)",
//               animation: "sweep 3s linear infinite",
//             }}
//           />
//           <div
//             className="absolute inset-2 border border-[rgba(241,92,48,0.2)] pointer-events-none"
//             style={{
//               clipPath:
//                 "polygon(0 14px, 14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px))",
//             }}
//           />
//           <div
//             className="absolute top-1/2 left-1/2 w-9 h-9 pointer-events-none border border-[rgba(241,92,48,0.25)] opacity-50"
//             style={{
//               transform: "translate(-50%, -60%)",
//               clipPath:
//                 "polygon(0 50%, 35% 50%, 50% 0, 65% 50%, 100% 50%, 65% 50%, 50% 100%, 35% 50%)",
//               animation: "rSpin 8s linear infinite",
//             }}
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,5,6,0.88)] via-[rgba(4,5,6,0.5)] to-transparent" />
//           <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-[2]">
//             <div
//               className="game-bc mb-1"
//               style={{ color: "rgba(232,234,240,0.28)" }}
//             >
//               STOPS <span>›</span> STOP {stopIndex + 1}
//             </div>
//             <StatusTag variant="orange">
//               STOP {stopIndex + 1} OF {TOTAL_STOPS}
//             </StatusTag>
//             <div className="flex items-end justify-between gap-2 mt-2">
//               <div>
//                 <h1
//                   className="font-orbitron text-[22px] font-black leading-none tracking-[0.04em]"
//                   style={{ textShadow: "0 0 16px rgba(241,92,48,0.5)" }}
//                 >
//                   {s.co.toUpperCase()}
//                 </h1>
//                 <p className="font-share-mono text-[10px] text-[var(--c)] tracking-[0.1em] uppercase mt-1">
//                   {s.task}
//                 </p>

//                 {/* ── LIVE INTERACTIVE TIMER INJECTED EXACTLY HERE ── */}
//                 <div className="flex items-center gap-1.5 mt-2 font-share-mono text-[11px] font-bold tracking-[0.06em] text-[var(--o)] animate-pulse">
//                   <span>⏱️</span> GAME CLOCK: <span className="font-orbitron text-[12px] text-white font-black">{formatLiveTime(elapsedSeconds)}</span>
//                 </div>
//               </div>
//               <div
//                 className="flex-shrink-0 border border-[var(--bdr)] bg-[rgba(4,5,6,0.9)] px-[11px] py-[7px]"
//                 style={{
//                   clipPath:
//                     "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))",
//                 }}
//               >
//                 <div className="font-share-mono text-[8px] text-[var(--mut)] tracking-[0.14em] uppercase">
//                   SHOP
//                 </div>
//                 <div className="font-orbitron text-[9px] font-bold text-[var(--o)]">
//                   {shopLabel}
//                 </div>
//                 <div className="font-share-mono text-[9px] text-[var(--mut)]">
//                   500 PCS · 6 WKS
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="px-[14px] py-3 flex flex-col gap-2.5">
//           <Panel
//             header={
//               <span style={{ color: "var(--o)" }}>
//                 📖 <span>MISSION BRIEF</span>
//               </span>
//             }
//             headerColor="orange"
//             stopVariant
//             className="story-bg"
//           >
//             <p className="text-sm leading-[1.75] text-[rgba(232,234,240,0.85)]">
//               {s.story}
//             </p>
//             <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
//               <div
//                 className="w-9 h-9 flex items-center justify-center text-xl bg-[rgba(241,92,48,0.1)] border border-[var(--bdr)]"
//                 style={{
//                   clipPath:
//                     "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
//                 }}
//               >
//                 {av.em}
//               </div>
//               <div>
//                 <div className="font-orbitron text-[11px] font-bold tracking-[0.06em]">
//                   {player.name.toUpperCase()}
//                 </div>
//                 <div className="font-share-mono text-[10px] text-[var(--mut)]">
//                   {player.school} · {player.role}
//                 </div>
//               </div>
//             </div>
//           </Panel>

//           <Panel
//             header={
//               <>
//                 <span style={{ color: "var(--c)" }}>
//                   ① <span>FIND-IT TASK</span>
//                 </span>
//                 <StatusTag variant="cyan">10 PTS · REQUIRED</StatusTag>
//               </>
//             }
//             headerColor="cyan"
//             stopVariant
//           >
//             <p className="font-share-mono text-[11px] text-[var(--mut)] mb-2.5 tracking-[0.04em]">
//               {s.fi}
//             </p>


//             <button
//               type="button"
//               onClick={openPicker}
//               disabled={done || photoUp}
//               className={`game-photo-box w-full${photoUp || done ? " up" : ""}`}
//             >
//               {/* Show preview thumbnail after selection */}
//               {previewUrl ? (
//                 <div className="flex flex-col items-center gap-2 w-full">
//                   <img
//                     src={previewUrl}
//                     alt="Your uploaded evidence"
//                     className="w-full max-h-[120px] object-cover"
//                     style={{
//                       clipPath:
//                         "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
//                     }}
//                   />
//                   <span className="font-share-mono text-[11px] tracking-[0.06em] text-[var(--g)]">
//                     ✅ PHOTO UPLOADED — EVIDENCE LOGGED
//                   </span>
//                 </div>
//               ) : (
//                 <>
//                   <span
//                     className="text-[30px]"
//                     style={{
//                       filter:
//                         photoUp || done
//                           ? "drop-shadow(0 0 8px rgba(57,255,20,0.6))"
//                           : "drop-shadow(0 0 8px rgba(241,92,48,0.5))",
//                     }}
//                   >
//                     {photoUp || done ? "✅" : "📷"}
//                   </span>
//                   <span
//                     className={`font-share-mono text-[11px] tracking-[0.06em] text-center ${photoUp || done ? "text-[var(--g)]" : "text-[var(--mut)]"
//                       }`}
//                   >
//                     {photoUp || done
//                       ? "PHOTO UPLOADED — EVIDENCE LOGGED"
//                       : "TAP TO OPEN CAMERA · GALLERY"}
//                   </span>
//                   {!photoUp && !done && (
//                     <span className="font-share-mono text-[9px] text-[var(--dim)] tracking-[0.08em] mt-1">
//                       CAMERA OR PHOTO LIBRARY
//                     </span>
//                   )}
//                 </>
//               )}
//             </button>

//             {/* Retake — only shown after upload but before submit */}
//             {photoUp && !done && (
//               <button
//                 type="button"
//                 onClick={handleRetake}
//                 className="mt-2 w-full font-share-mono text-[10px] text-[var(--mut)] tracking-[0.08em] py-1.5 border border-[rgba(255,255,255,0.08)] bg-transparent hover:bg-[rgba(255,255,255,0.04)] transition-colors"
//               >
//                 ↺ RETAKE PHOTO
//               </button>
//             )}
//           </Panel>

//           {s.bt === "creative" ? null : s.bt === "calc" ? (
// <Panel
//   header={
//     <>
//       <span style={{ color: "#ffbb00" }}>
//         ② <span>SKILL CHALLENGE</span>
//       </span>
//       <span
//         className="game-tag"
//         style={{
//           color: "#ffbb00",
//           borderColor: "rgba(255,187,0,0.3)",
//           background: "rgba(255,187,0,0.07)",
//           clipPath:
//             "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
//         }}
//       >
//         10 PTS · REQUIRED
//       </span>
//       {/* 
//       <StatusTag variant="orange">10 PTS · REQUIRED</StatusTag> */}
//     </>
//   }
//   headerColor="yellow"
//   stopVariant
// >
//               <p className="font-[family:var(--font-rajdhani)] text-[13px] leading-[1.6] text-[rgba(232,234,240,0.82)] mb-2">
//                 {s.bp}
//               </p>
//               <div className="gif-box flex items-center gap-1.5 px-3 py-2 mb-2 border border-[rgba(255,187,0,0.22)] bg-[rgba(255,187,0,0.05)] text-[#ffbb00] font-share-mono text-[11px]">
//                 📱 GIF: where to find this tool in Phillips Machinist app
//               </div>
//               <input
//                 className="game-input mb-2"
//                 placeholder="ENTER YOUR ANSWER…"
//                 value={
//                   done && stopsDone[stopIndex]?.bonus
//                     ? "SUBMITTED ✓"
//                     : bonusAnswer
//                 }
//                 onChange={(e) => setBonusAnswer(e.target.value)}
//                 readOnly={done}
//                 disabled={done}
//               />
//               {/* <p className="font-share-mono text-[10px] text-[var(--dim)] tracking-[0.08em] mb-1">
//                 BADGE TIERS:
//               </p>
//               <div className="flex flex-wrap gap-1.5">
//                 {s.b1 && (
//                   <span className="px-2.5 py-1 text-[10px] border border-[rgba(255,187,0,0.3)] bg-[rgba(255,187,0,0.1)] text-[#ffbb00]">
//                     🥇 {s.b1} (±10%)
//                   </span>
//                 )}
//                 {s.b2 && (
//                   <span className="px-2.5 py-1 text-[10px] border border-[var(--bdc)] bg-[rgba(0,229,255,0.08)] text-[var(--c)]">
//                     🥈 {s.b2} (±20%)
//                   </span>
//                 )}
//                 {s.b3 && (
//                   <span className="px-2.5 py-1 text-[10px] border border-[var(--dim)] bg-[rgba(255,255,255,0.04)] text-[var(--mut)]">
//                     🥉 {s.b3}
//                   </span>
//                 )}
//               </div> */}
//             </Panel>
//           ) : (
//             <Panel
//               header={
//                 <>
//                   <span style={{ color: "var(--g)" }}>
//                     ③ <span>SHOP TALK</span>
//                   </span>
//                   <StatusTag variant="green">+5 PTS · BONUS</StatusTag>
//                 </>
//               }
//               headerColor="green"
//               stopVariant
//             >
//               <p className="font-share-mono text-[10px] text-[var(--mut)] tracking-[0.06em] mb-2">
//                 ASK A REP AT {(s.rc || "").toUpperCase()} ONE OF THESE:
//               </p>
//               {[s.q1, s.q2].map((q, i) => (
//                 <button
//                   key={i}
//                   type="button"
//                   disabled={done}
//                   onClick={() => setSelQ(i)}
//                   className={`game-q-opt${(done && stopsDone[stopIndex]?.qs === i) || selQ === i
//                     ? " sel"
//                     : ""
//                     }`}
//                 >
//                   {q}
//                 </button>
//               ))}
//               <input
//                 className="game-input mb-2 mt-1"
//                 placeholder="NAME OF REP YOU SPOKE WITH…"
//                 value={repName}
//                 onChange={(e) => setRepName(e.target.value)}
//                 readOnly={done}
//                 disabled={done}
//               />
//               <input
//                 className="game-input mb-2"
//                 placeholder="SHORT ANSWER FROM CONVERSATION…"
//                 value={repAnswer}
//                 onChange={(e) => setRepAnswer(e.target.value)}
//                 readOnly={done}
//                 disabled={done}
//               />
//               <p
//                 className={`font-share-mono text-[10px] tracking-[0.06em] ${done && stopsDone[stopIndex]?.bonus
//                   ? "text-[var(--g)]"
//                   : "text-[var(--dim)]"
//                   }`}
//               >
//                 {done && stopsDone[stopIndex]?.bonus
//                   ? "✓ ADDED TO YOUR TEAM ROSTER"
//                   : "THIS PERSON JOINS YOUR JOB TRAVELER ROSTER"}
//               </p>
//             </Panel>
//           )}
//         </div>

//         <div className="px-[14px] py-3">
//           <GameButton variant="primary" onClick={submitStop}>
//             {done
//               ? "✓ COMPLETED — VIEW NEXT STOP ►"
//               : `► SUBMIT STOP ${stopIndex + 1}`}
//           </GameButton>
//         </div>

//         {s.bt === "calc" && (
//           <div className="px-[14px] pb-2.5">
//             <button
//               type="button"
//               className="game-app-cta w-full"
//               onClick={() => onToast("📱 Opening Phillips Machinist…")}
//             >
//               <span className="game-app-cta-icon">📱</span>
//               <span className="game-app-cta-text">
//                 <div className="game-app-cta-title">OPEN IN PHILLIPS MACHINIST</div>
//                 <div className="game-app-cta-sub">{calcLabel}</div>
//               </span>
//               <span className="game-app-cta-arrow">►</span>
//             </button>
//           </div>
//         )}

//         <p className="font-share-mono text-[9px] text-[var(--dim)] text-center pb-3 tracking-[0.08em]">
//           ← SWIPE OR USE ARROWS BELOW →
//         </p>
//       </div>

//       <div className="game-stop-nav">
//         <button
//           type="button"
//           className="game-snav"
//           onClick={prevStop}
//           disabled={stopIndex === 0}
//         >
//           ◄ PREV
//         </button>
//         <div className="game-snav-ctr">
//           {stopIndex + 1}{" "}
//           <span className="text-[var(--mut)] text-[11px] font-normal">
//             / {TOTAL_STOPS}
//           </span>
//         </div>
//         <button
//           type="button"
//           className="game-snav text-right"
//           onClick={nextStop}
//           disabled={!canNext}
//         >
//           NEXT ►
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  HUDBar,
  Panel,
  GameButton,
  StatusTag,
} from "./GameComponents";
import {
  STOPS,
  AVS,
  STOP_IMAGE_MAP,
  STOP_BRIGHTNESS,
  TOTAL_STOPS,
} from "@/constants";
import type { PlayerProfile, StopCompletion, CelebrationState } from "@/lib/game-types";
import { GameService } from "@/lib/game.service";
import { IMAGE_UPLOAD_ACCEPT, isImageFile } from "@/lib/image-to-png";
import {
  createImagePreviewUrl,
  resolveMediaPreviewUrl,
  revokeObjectPreviewUrl,
} from "@/lib/media-preview";

export function StopScreen({
  isActive,
  stopIndex,
  player,
  stopsDone,
  onBack,
  onSubmit,
  onNavigate,
  onToast,
  onCelebrate,
  onOpenMap
}: {
  isActive: boolean;
  stopIndex: number;
  player: PlayerProfile;
  stopsDone: Record<number, StopCompletion>;
  onBack: () => void;
  onSubmit: (index: number, data: any) => void; // Made flexible for test payload objects
  onNavigate: (index: number) => void;
  onToast: (msg: string) => void;
  onCelebrate: (state: CelebrationState) => void;
  onOpenMap: () => void
}) {
  const s = STOPS[stopIndex];
  const done = !!stopsDone[stopIndex];
  const av = AVS[player.avatarIndex] ?? AVS[0];

  // Calculate total active time spent BEFORE this stop
  const previousStopsTime = Object.entries(stopsDone).reduce((acc, [key, value]: [string, any]) => {
    if (Number(key) !== stopIndex) {
      return acc + (value.timeSpent || 0);
    }
    return acc;
  }, 0);

  // Initialize your components directly from saved state tables if they exist
  const [photoUp, setPhotoUp] = useState(done);
  const [previewUrl, setPreviewUrl] = useState<string | null>(stopsDone[stopIndex]?.previewUrl ?? null);
  const [selQ, setSelQ] = useState<number | null>(stopsDone[stopIndex]?.qs ?? null);
  const [bonusAnswer, setBonusAnswer] = useState(s.bt === "calc" ? (stopsDone[stopIndex] as any)?.selectedAnswer ?? "" : "");
  const [repName, setRepName] = useState(stopsDone[stopIndex]?.rn ?? "");
  const [repAnswer, setRepAnswer] = useState(s.bt !== "calc" ? (stopsDone[stopIndex] as any)?.selectedAnswer ?? "" : "");

  // LIVE TICKING SESSION TIMER STATE
  const [elapsedSeconds, setElapsedSeconds] = useState(previousStopsTime);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobPreviewRef = useRef<string | null>(null);

  const displayPreviewUrl = resolveMediaPreviewUrl(previewUrl);

  useEffect(() => {
    return () => revokeObjectPreviewUrl(blobPreviewRef.current);
  }, []);

  // Live Timer Effect Hook
  useEffect(() => {
    if (!isActive || done) {
      const currentStopTime = stopsDone[stopIndex]?.timeSpent || 0;
      setElapsedSeconds(previousStopsTime + currentStopTime);
      return;
    }

    const partial = parseInt(sessionStorage.getItem(`partial_time_${stopIndex}`) || "0", 10);
    let currentSeconds = previousStopsTime + partial;
    setElapsedSeconds(currentSeconds);

    const activeInterval = setInterval(() => {
      currentSeconds += 1;
      setElapsedSeconds(currentSeconds);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(`partial_time_${stopIndex}`, (currentSeconds - previousStopsTime).toString());
      }
    }, 1000);

    return () => clearInterval(activeInterval);
  }, [isActive, stopIndex, done, stopsDone, previousStopsTime]);

  // ── FIX: Hydrate state elements cleanly when navigating between stops ──
  useEffect(() => {
    revokeObjectPreviewUrl(blobPreviewRef.current);
    blobPreviewRef.current = null;

    const record = stopsDone[stopIndex] as any;
    setPhotoUp(!!record);
    setPreviewUrl(record?.previewUrl ?? null);
    setSelQ(record?.qs ?? null);
    setRepName(record?.rn ?? "");

    if (s.bt === "calc") {
      setBonusAnswer(record?.selectedAnswer ?? "");
      setRepAnswer("");
    } else {
      setRepAnswer(record?.selectedAnswer ?? "");
      setBonusAnswer("");
    }
  }, [stopIndex, stopsDone, s.bt]);

  const photoUrl = STOP_IMAGE_MAP[stopIndex + 1] ?? STOP_IMAGE_MAP[1];
  const brightness = STOP_BRIGHTNESS[stopIndex] ?? 0.45;
  const calcLabel = s.bt === "calc" && "calc" in s && s.calc ? `Open ${s.calc} in app →` : "Tap to open the calculator in the app";
  const shopLabel = (player.shopName || "MY SHOP").toUpperCase();

  const openPicker = () => {
    if (done || photoUp) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isImageFile(file)) {
      onToast("⚠️ UNSUPPORTED FILE — USE A PHOTO (JPG, PNG, HEIC, ETC.)");
      e.target.value = "";
      return;
    }

    revokeObjectPreviewUrl(blobPreviewRef.current);
    blobPreviewRef.current = null;

    let localBlobUrl: string;
    try {
      localBlobUrl = await createImagePreviewUrl(file);
    } catch {
      onToast("⚠️ COULD NOT PREVIEW THIS IMAGE");
      e.target.value = "";
      return;
    }

    blobPreviewRef.current = localBlobUrl;
    setPreviewUrl(localBlobUrl);
    onToast("⚡ TRANSMITTING EVIDENCE...");

    try {
      const res = await GameService.uploadMedia(file, player.email);

      if (res.success) {
        setPhotoUp(true);
        onToast("📸 EVIDENCE SECURED ON SERVER");
        revokeObjectPreviewUrl(blobPreviewRef.current);
        blobPreviewRef.current = null;
        setPreviewUrl(res.cdnUrl);
      } else {
        onToast(`⚠️ ${res.error || "UPLOAD FAILED. PLEASE RETAKE."}`);
        revokeObjectPreviewUrl(blobPreviewRef.current);
        blobPreviewRef.current = null;
        setPreviewUrl(null);
      }
    } catch (err) {
      onToast("❌ CONNECTION ERROR DURING UPLOAD");
      revokeObjectPreviewUrl(blobPreviewRef.current);
      blobPreviewRef.current = null;
      setPreviewUrl(null);
    } finally {
      e.target.value = "";
    }
  };

  const handleRetake = () => {
    revokeObjectPreviewUrl(blobPreviewRef.current);
    blobPreviewRef.current = null;
    setPreviewUrl(null);
    setPhotoUp(false);
  };

  const submitStop = () => {
    if (!photoUp && !done) {
      onToast("📷 UPLOAD PHOTO FIRST");
      return;
    }
    if (done) {
      onBack();
      return;
    }

    let isCorrect = false;
    let rn = "";
    let finalAnswer = "";
    let questionText = "";

    if (s.bt === "calc") {
      finalAnswer = bonusAnswer.trim();
      questionText = s.bp || "";

      if (!finalAnswer) {
        onToast("⚠️ ANSWER THE SKILL CHALLENGE TO SUBMIT");
        return;
      }

      if (s.targetAnswer !== undefined) {
        if (finalAnswer.toLowerCase() === String(s.targetAnswer).toLowerCase()) {
          isCorrect = true;
        }
      } else {
        isCorrect = true;
      }
    } else {

      rn = repName.trim();
      finalAnswer = repAnswer.trim();


      if (selQ === null || !rn || !finalAnswer) {
        onToast("⚠️ COMPLETE ALL SHOP TALK FIELDS TO SUBMIT");
        return;
      }

      questionText = selQ === 0 ? s.q1 : s.q2;
      isCorrect = true;
    }


    if (typeof window !== "undefined") {
      sessionStorage.removeItem(`partial_time_${stopIndex}`);
    }

    const timeSpentOnThisStop = elapsedSeconds - previousStopsTime;

    // ── FIX: Inject explicit variables directly matching your API specifications ──
    onSubmit(stopIndex, {
      bonus: isCorrect,
      badge: isCorrect ? (s.badge || "Stop Master") : null,
      rn: rn || undefined,
      qs: selQ ?? undefined,               // The question index chosen (0 or 1)
      question: questionText,
      timeSpent: timeSpentOnThisStop,
      previewUrl: previewUrl || "",       // Saved backend file string
      mediaType: "image",                 // Media identifier flag
      selectedAnswer: finalAnswer,        // Holds the input text string value
      isCorrect: isCorrect                // Grading comparison state boolean
    });

    onCelebrate({
      icon: isCorrect ? "🎉" : "✅",
      title: isCorrect ? "STOP 100% COMPLETE!" : "STOP LOGGED",
      sub: isCorrect ? "+20 PTS LOGGED · PERFECT SCORE ON THIS STOP" : "+10 PTS LOGGED · PHOTO PASSED",
      badge: isCorrect ? (s.badge || "CHAMPION") : "PHOTO VERIFIED",
    });
  };

  const prevStop = () => {
    if (stopIndex > 0) onNavigate(stopIndex - 1);
  };

  const nextStop = () => {
    const n = stopIndex + 1;
    if (n >= TOTAL_STOPS) return;
    const unlocked = !!stopsDone[n] || n === 0 || !!stopsDone[n - 1];
    if (!unlocked) {
      onToast(`🔒 COMPLETE STOP ${n} FIRST`);
      return;
    }
    onNavigate(n);
  };

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextStop();
      if (e.key === "ArrowLeft") prevStop();
      if (e.key === "Escape") onBack();
    },
    [stopIndex, stopsDone]
  );

  useEffect(() => {
    if (!isActive) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey, isActive]);

  const canNext = stopIndex + 1 < TOTAL_STOPS && (!!stopsDone[stopIndex + 1] || !!stopsDone[stopIndex] || stopIndex + 1 === 0);

  const formatLiveTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="absolute inset-0 flex flex-col h-full w-full overflow-hidden z-30">
      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_UPLOAD_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleFileChange}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${photoUrl.src}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: `brightness(${brightness * 0.6}) saturate(0.65) blur(2px)`,
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(4,5,6,0.45) 0%, rgba(4,5,6,0.72) 45%, rgba(4,5,6,0.88) 100%)",
        }}
      />

      <HUDBar
        title={`STOP ${stopIndex + 1} · ${s.co}`}
        onBack={onBack}
        backLabel="◄ STOPS"
        onOpenMap={onOpenMap}
        isMapShow={true}
      />

      <div className="game-scroll flex-1 min-h-0 bg-transparent">
        <div className="relative h-[185px] flex-shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-[center_30%]"
            style={{
              backgroundImage: `url('${photoUrl.src}')`,
              filter: `brightness(${brightness}) saturate(0.8)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,5,6,0.88)] via-[rgba(4,5,6,0.5)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-[2]">
            <StatusTag variant="orange">STOP {stopIndex + 1} OF {TOTAL_STOPS}</StatusTag>
            <div className="flex items-end justify-between gap-2 mt-2">
              <div>
                <h1 className="font-orbitron text-[22px] font-black leading-none tracking-[0.04em] text-white">
                  {s.co.toUpperCase()}
                </h1>
                <p className="font-share-mono text-[10px] text-[var(--c)] tracking-[0.1em] uppercase mt-1">
                  {s.task}
                </p>
                <div className="flex items-center gap-1.5 mt-2 font-share-mono text-[11px] font-bold tracking-[0.06em] text-[var(--o)] animate-pulse">
                  <span>⏱️</span> GAME CLOCK: <span className="font-orbitron text-[12px] text-white font-black">{formatLiveTime(elapsedSeconds)}</span>
                </div>
              </div>
              <div className="flex-shrink-0 border border-[var(--bdr)] bg-[rgba(4,5,6,0.9)] px-[11px] py-[7px]">
                <div className="font-share-mono text-[8px] text-[var(--mut)] tracking-[0.14em] uppercase">SHOP</div>
                <div className="font-orbitron text-[9px] font-bold text-[var(--o)]">{shopLabel}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-[14px] py-3 flex flex-col gap-2.5">
          <Panel header={<span style={{ color: "var(--o)" }}>📖 MISSION BRIEF</span>} headerColor="orange" stopVariant className="story-bg">
            <p className="text-sm leading-[1.75] text-[rgba(232,234,240,0.85)]">{s.story}</p>
          </Panel>

          <Panel header={<><span style={{ color: "var(--c)" }}>① FIND-IT TASK</span><StatusTag variant="cyan">10 PTS · REQUIRED</StatusTag></>} headerColor="cyan" stopVariant>
            <p className="font-share-mono text-[11px] text-[var(--mut)] mb-2.5">{s.fi}</p>
            <button type="button" onClick={openPicker} disabled={done || photoUp} className={`game-photo-box w-full${photoUp || done ? " up" : ""}`}>
              {displayPreviewUrl ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <img src={displayPreviewUrl} alt="Evidence Logged" className="w-full max-h-[120px] object-cover" />
                  <span className="font-share-mono text-[11px] text-[var(--g)]">✅ PHOTO UPLOADED — EVIDENCE LOGGED</span>
                </div>
              ) : (
                <>
                  <span className="text-[30px]">📷</span>
                  <span className="font-share-mono text-[11px] text-[var(--mut)] text-center">TAP TO OPEN CAMERA · GALLERY</span>
                </>
              )}
            </button>
            {photoUp && !done && (
              <button type="button" onClick={handleRetake} className="mt-2 w-full font-share-mono text-[10px] text-[var(--mut)] py-1.5 border border-[rgba(255,255,255,0.08)] bg-transparent">
                ↺ RETAKE PHOTO
              </button>
            )}
          </Panel>

          {s.bt !== "creative" && (s.bt === "calc" ? (
            <Panel
              header={
                <>
                  <span style={{ color: "#ffbb00" }}>
                    ② <span>SKILL CHALLENGE</span>
                  </span>
                  <span
                    className="game-tag"
                    style={{
                      color: "#ffbb00",
                      borderColor: "rgba(255,187,0,0.3)",
                      background: "rgba(255,187,0,0.07)",
                      clipPath:
                        "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                    }}
                  >
                    10 PTS · REQUIRED
                  </span>
                  {/* 
                  <StatusTag variant="orange">10 PTS · REQUIRED</StatusTag> */}
                </>
              }
              headerColor="yellow"
              stopVariant
            >
              <p className="font-[family:var(--font-rajdhani)] text-[13px] text-[rgba(232,234,240,0.82)] mb-2">{s.bp}</p>
              <input
                className="game-input mb-2"
                placeholder="ENTER YOUR ANSWER…"
                value={done ? "SUBMITTED ✓" : bonusAnswer}
                onChange={(e) => setBonusAnswer(e.target.value)}
                readOnly={done}
                disabled={done}
              />
            </Panel>
          ) : (
            <Panel header={<><span style={{ color: "var(--g)" }}>③ SHOP TALK</span><StatusTag variant="green">+10 PTS · REQUIRED</StatusTag></>} headerColor="green" stopVariant>
              <p className="font-share-mono text-[10px] text-[var(--mut)] mb-2">ASK A REP AT {(s.rc || "").toUpperCase()} ONE OF THESE:</p>
              {[s.q1, s.q2].map((q, i) => (
                <button key={i} type="button" disabled={done} onClick={() => setSelQ(i)} className={`game-q-opt${(done && stopsDone[stopIndex]?.qs === i) || selQ === i ? " sel" : ""}`}>
                  {q}
                </button>
              ))}
              <input
                className="game-input mb-2 mt-1"
                placeholder="NAME OF REP YOU SPOKE WITH…"
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
                readOnly={done}
                disabled={done}
              />
              <input
                className="game-input mb-2"
                placeholder="SHORT ANSWER FROM CONVERSATION…"
                value={repAnswer}
                onChange={(e) => setRepAnswer(e.target.value)}
                readOnly={done}
                disabled={done}
              />
            </Panel>
          ))}
        </div>

        <div className="px-[14px] py-3">
          <GameButton variant="primary" onClick={submitStop}>
            {done ? "✓ COMPLETED — VIEW NEXT STOP ►" : `► SUBMIT STOP ${stopIndex + 1}`}
          </GameButton>
        </div>

        {s.bt === "calc" && (
          <div className="px-[14px] pb-2.5">
            <button type="button" className="game-app-cta w-full" onClick={() => onToast("📱 Opening Phillips Machinist…")}>
              <span className="game-app-cta-icon">📱</span>
              <span className="game-app-cta-text">
                <div className="game-app-cta-title">OPEN IN PHILLIPS MACHINIST</div>
                <div className="game-app-cta-sub">{calcLabel}</div>
              </span>
              <span className="game-app-cta-arrow">►</span>
            </button>
          </div>
        )}
      </div>

      <div className="game-stop-nav">
        <button type="button" className="game-snav" onClick={prevStop} disabled={stopIndex === 0}>◄ PREV</button>
        <div className="game-snav-ctr">{stopIndex + 1} <span className="text-[var(--mut)] text-[11px] font-normal">/ {TOTAL_STOPS}</span></div>
        <button type="button" className="game-snav text-right" onClick={nextStop} disabled={!canNext}>NEXT ►</button>
      </div>
    </div>
  );
}
