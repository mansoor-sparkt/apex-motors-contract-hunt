// "use client";

// import { HUDBar, GameButton, Panel } from "./GameComponents";
// import { IMAGE_URLS } from "@/constants";

// export function IntroScreen({
//   onNext,
//   onBack,
//   onOpenMap,
// }: {
//   onNext: () => void;
//   onBack: () => void;
//   onOpenMap: () => void;
// }) {
//   return (
//     <div className="absolute inset-0 flex h-full flex-col overflow-hidden">
//       <HUDBar title="INCOMING TRANSMISSION" onBack={onBack} />

//       <div className="game-scroll flex-1 min-h-0">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `url('${IMAGE_URLS.splashHero.src}')`,

//             backgroundSize: "cover",
//             backgroundPosition: "center 40%",
//             filter: "brightness(0.45) saturate(0.85)",
//           }}
//         />
//         <div className="px-4 py-5 relative z-2">
//           <div className="game-bc">
//             HOME <span>›</span> MISSION BRIEF
//           </div>
//           <p className="font-share-mono text-[9px] text-[var(--o)] tracking-[0.16em] uppercase mt-2 mb-2.5">
//             // APEX MOTORS · PRIORITY CONTRACT
//           </p>
//           <h1 className="font-orbitron text-xl font-black leading-[1.1] mb-3.5">
//             YOUR SHOP JUST
//             <br />
//             GOT THE CALL.
//           </h1>
//           <p className="font-rajdhani text-sm leading-[1.8] text-[rgba(232,234,240,0.88)] mb-4">
//             Apex Motors needs{" "}
//             <strong className="text-[var(--o)]">500 brake caliper brackets</strong>{" "}
//             in <strong className="text-[var(--o)]">6 weeks</strong>. They came to
//             you because word on the floor is that your shop delivers.
//             <br />
//             <br />
//             To win this contract, you&apos;ll walk the show floor and prove you
//             know your craft — from raw material to final CMM report. Every stop
//             is a step in your production plan.
//             <br />
//             <br />
//             <strong className="text-[var(--txt)]">
//               Complete all 8 stops. Earn points. Build your team. Ship the job.
//             </strong>
//           </p>

//           <Panel
//             header={
//               <span className="text-[var(--o)]">📋 CONTRACT DETAILS</span>
//             }
//           >
//             <div className="flex flex-col gap-1.5 font-share-mono text-[11px]">
//               {(
//                 [
//                   { label: "CUSTOMER", value: "Apex Motors" },
//                   { label: "PART", value: "Brake Caliper Bracket" },
//                   { label: "QTY", value: "500 PCS", highlight: true },
//                   { label: "DEADLINE", value: "6 WEEKS", highlight: true },
//                   { label: "MATERIAL", value: "6061 Aluminum" },
//                 ] as const
//               ).map((row) => (
//                 <div key={row.label} className="flex justify-between gap-3">
//                   <span className="text-[var(--mut)]">{row.label}</span>
//                   <span
//                     className={
//                       "highlight" in row && row.highlight
//                         ? "text-[var(--o)]"
//                         : "text-[var(--txt)]"
//                     }
//                   >
//                     {row.value}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </Panel>

//           <div className="h-3.5 " />

//           {/* <GameButton variant="secondary" onClick={onOpenMap}>
//             🗺️ VIEW STARTING LOCATION MAP
//           </GameButton> */}
//           <GameButton variant="primary" onClick={onNext}>
//             ► SET UP YOUR SHOP
//           </GameButton>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { HUDBar, GameButton } from "./GameComponents";
import { IMAGE_URLS } from "@/constants";

export function IntroScreen({
  onNext,
  onBack,
  onOpenMap,
}: {
  onNext: () => void;
  onBack: () => void;
  onOpenMap: () => void;
}) {
  return (
    <div className="absolute inset-0 flex h-full flex-col overflow-hidden">
      <HUDBar title="MISSION BRIEFING" onBack={onBack} />

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url('${IMAGE_URLS.splashHero.src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: "brightness(0.45) saturate(0.85)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(4,5,6,0.35) 0%, rgba(4,5,6,0.92) 88%, rgba(4,5,6,0.98) 100%)",
          }}
        />

        <div className="game-scroll relative z-[2] flex-1 min-h-0">
          <div className="px-4 py-5 pb-4">
            <div className="game-bc">
              HOME <span>›</span> MISSION BRIEF
            </div>
            <p className="font-share-mono text-[9px] text-[var(--o)] tracking-[0.16em] uppercase mt-2 mb-2.5">
              // PHILLIPS SHOP WORKS · CONTRACT HUNT
            </p>
            <h1 className="font-orbitron text-xl font-black leading-[1.1] mb-3.5">
              PROVE YOUR CRAFT
              <br />
              ON THE SHOW FLOOR.
            </h1>
            <div className="font-rajdhani text-[15px] font-medium leading-[1.65] text-[rgba(232,234,240,0.96)] mb-3 space-y-3">
              <p>
                You&apos;re part of{" "}
                <strong className="text-white font-semibold">Phillips Shop Works</strong>
                , and you just landed a contract from{" "}
                <strong className="text-[var(--o)] font-semibold">Redline Robotics</strong>
                .
              </p>
              <p>
                Your objective: visit{" "}
                <strong className="text-white font-semibold">six stops</strong> in the
                manufacturing section at SkillsUSA, gather what you need at each booth,
                and deliver the order on time.
              </p>
            </div>

            <ul className="font-rajdhani text-[14px] font-medium leading-[1.55] text-[rgba(232,234,240,0.95)] list-none border-l-2 border-[var(--o)] pl-3 bg-[rgba(241,92,48,0.06)] py-2.5 space-y-2">
              <li>✓ Visit all 6 core booth stops to claim the base prize.</li>
              <li>✓ Earn 100 bonus points to unlock the extra prize.</li>
              <li>🎁 Collect rewards at the Phillips Machinist booth.</li>
            </ul>
          </div>
        </div>

        <div
          className="relative z-[3] flex shrink-0 flex-col gap-2 border-t border-[var(--bdr)] px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom))]"
          style={{ background: "rgba(4, 5, 6, 0.94)" }}
        >
          <GameButton variant="secondary" onClick={onOpenMap}>
            🗺️ VIEW SHOW FLOOR MAP
          </GameButton>
          <p className="font-share-mono text-center text-[9px] text-[var(--mut)] tracking-[0.05em] uppercase">
            📍 Start Line: Haas Booth #837 (Manufacturing Section)
          </p>
          <GameButton variant="primary" onClick={onNext}>
            ► SET UP YOUR PROFILE
          </GameButton>
        </div>
      </div>
    </div>
  );
}
