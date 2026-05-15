// // 'use client';

// // import React from 'react';

// // /* Button Components */
// // export function GameButton({
// //   children,
// //   variant = 'primary',
// //   onClick,
// //   className = '',
// //   ...props
// // }: {
// //   children: React.ReactNode;
// //   variant?: 'primary' | 'secondary';
// //   onClick?: () => void;
// //   className?: string;
// //   [key: string]: any;
// // }) {
// //   const baseClasses = 'w-full px-5 py-[15px] border-none cursor-pointer font-[family:var(--font-orbitron)] font-bold text-xs letter-spacing tracking-[0.14em] uppercase transition-all duration-150 relative overflow-hidden active:scale-[0.97]';

// //   const variantClasses = {
// //     primary: `bg-[#F15C30] text-white shadow-[0_0_24px_rgba(241,92,48,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#ff6b3d] hover:shadow-[0_0_36px_rgba(241,92,48,0.65)]`,
// //     secondary: `bg-[rgba(8,10,14,0.7)] text-[#F15C30] border border-[rgba(241,92,48,0.3)] hover:bg-[rgba(241,92,48,0.08)]`,
// //   };

// //   return (
// //     <button
// //       className={`${baseClasses} ${variantClasses[variant]} ${className}`}
// //       style={{
// //         clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
// //       }}
// //       onClick={onClick}
// //       {...props}
// //     >
// //       <span className="relative z-10">{children}</span>
// //       {/* Shimmer sweep on hover */}
// //       <div
// //         className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-all duration-400 hover:animate-none"
// //         style={{
// //           background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.07), transparent)',
// //         }}
// //       />
// //     </button>
// //   );
// // }

// // /* Status Tags */
// // export function StatusTag({
// //   children,
// //   variant = 'orange',
// // }: {
// //   children: React.ReactNode;
// //   variant?: 'orange' | 'cyan' | 'green' | 'purple' | 'dim';
// // }) {
// //   const variantClasses = {
// //     orange: 'text-[#F15C30] border-[rgba(241,92,48,0.3)] bg-[rgba(241,92,48,0.09)]',
// //     cyan: 'text-[#00e5ff] border-[rgba(0,229,255,0.2)] bg-[rgba(0,229,255,0.07)]',
// //     green: 'text-[#39ff14] border-[rgba(57,255,20,0.3)] bg-[rgba(57,255,20,0.07)]',
// //     purple: 'text-[#b14dff] border-[rgba(177,77,255,0.3)] bg-[rgba(177,77,255,0.07)]',
// //     dim: 'text-[rgba(232,234,240,0.5)] border-[rgba(232,234,240,0.22)] bg-transparent',
// //   };

// //   return (
// //     <div
// //       className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] font-[family:var(--font-mono)] text-[10px] letter-spacing tracking-[0.1em] uppercase border ${variantClasses[variant]}`}
// //       style={{
// //         clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
// //       }}
// //     >
// //       {children}
// //     </div>
// //   );
// // }

// // /* Panel Component */
// // export function Panel({
// //   children,
// //   header,
// //   headerColor = 'orange',
// //   className = '',
// // }: {
// //   children: React.ReactNode;
// //   header?: React.ReactNode;
// //   headerColor?: 'orange' | 'cyan' | 'green' | 'yellow';
// //   className?: string;
// // }) {
// //   const colorGradients = {
// //     orange: 'linear-gradient(90deg, #F15C30, transparent 60%)',
// //     cyan: 'linear-gradient(90deg, #00e5ff, transparent 60%)',
// //     green: 'linear-gradient(90deg, #39ff14, transparent 60%)',
// //     yellow: 'linear-gradient(90deg, #ffbb00, transparent 60%)',
// //   };

// //   return (
// //     <div
// //       className={`bg-[rgba(5,6,8,0.62)] border border-[rgba(241,92,48,0.3)] relative overflow-hidden backdrop-blur-md ${className}`}
// //       style={{ backdropFilter: 'blur(6px)' }}
// //     >
// //       {/* Top accent line */}
// //       <div
// //         className="absolute top-0 left-0 right-0 h-[2px]"
// //         style={{ background: colorGradients[headerColor] }}
// //       />

// //       {header && (
// //         <div className="px-[14px] py-[11px] flex items-center justify-between border-b border-[rgba(255,255,255,0.04)]">
// //           <div className="font-[family:var(--font-mono)] text-[10px] letter-spacing tracking-[0.12em] uppercase flex items-center gap-[6px]">
// //             {header}
// //           </div>
// //         </div>
// //       )}

// //       <div className="p-[12px_14px_14px]">{children}</div>
// //     </div>
// //   );
// // }

// // /* Progress Pips */
// // export function ProgressPips({
// //   total,
// //   completed,
// //   active,
// // }: {
// //   total: number;
// //   completed: number;
// //   active?: number;
// // }) {
// //   return (
// //     <div className="flex gap-[3px] px-[14px] pb-[10px]">
// //       {Array.from({ length: total }).map((_, i) => {
// //         const isDone = i < completed;
// //         const isActive = i === active;

// //         return (
// //           <div
// //             key={i}
// //             className={`flex-1 h-1 relative transition-colors duration-500 ${
// //               isDone ? 'bg-[rgba(57,255,20,0.12)]' : 'bg-[rgba(255,255,255,0.07)]'
// //             }`}
// //           >
// //             <div
// //               className="absolute inset-0"
// //               style={{
// //                 background: isDone ? '#39ff14' : '#F15C30',
// //                 transform: `scaleX(${isDone || isActive ? 1 : 0})`,
// //                 transformOrigin: 'left',
// //                 transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
// //                 animation: isActive ? 'pp 1.6s ease infinite' : 'none',
// //               }}
// //             />
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // }

// // /* Stop Row Component */
// // export function StopRow({
// //   stopNumber,
// //   title,
// //   description,
// //   points,
// //   status = 'locked',
// //   onClick,
// // }: {
// //   stopNumber: number;
// //   title: string;
// //   description: string;
// //   points: number;
// //   status?: 'locked' | 'active' | 'done';
// //   onClick?: () => void;
// // }) {
// //   const statusColors = {
// //     locked: { num: 'bg-[rgba(255,255,255,0.04)] text-[rgba(232,234,240,0.22)]', accent: 'transparent' },
// //     active: { num: 'bg-[#F15C30] text-white shadow-[0_0_14px_rgba(241,92,48,0.6)]', accent: '#F15C30' },
// //     done: { num: 'bg-[rgba(57,255,20,0.12)] text-[#39ff14]', accent: '#39ff14' },
// //   };

// //   const isLocked = status === 'locked';

// //   return (
// //     <div
// //       className={`flex items-center gap-[10px] px-[14px] py-[11px] border-b border-[rgba(255,255,255,0.06)] cursor-pointer transition-colors duration-150 relative overflow-hidden ${
// //         isLocked ? 'opacity-32 cursor-default' : 'hover:bg-[rgba(241,92,48,0.05)]'
// //       }`}
// //       style={{ backgroundColor: isLocked ? undefined : 'rgba(4, 5, 7, 0.5)' }}
// //       onClick={onClick}
// //     >
// //       {/* Left accent strip */}
// //       <div
// //         className="absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-200"
// //         style={{
// //           background:
// //             status === 'active'
// //               ? '#F15C30'
// //               : status === 'done'
// //                 ? '#39ff14'
// //                 : 'transparent',
// //           boxShadow:
// //             status === 'active'
// //               ? '0 0 8px rgba(241, 92, 48, 0.55)'
// //               : status === 'done'
// //                 ? '0 0 8px rgba(57, 255, 20, 0.45)'
// //                 : 'none',
// //         }}
// //       />

// //       {/* Stop number box */}
// //       <div
// //         className={`w-[34px] h-[34px] flex items-center justify-center font-[family:var(--font-orbitron)] text-xs font-bold flex-shrink-0 ${statusColors[status].num}`}
// //         style={{
// //           clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
// //         }}
// //       >
// //         {stopNumber}
// //       </div>

// //       {/* Stop info */}
// //       <div className="flex-1 min-w-0">
// //         <div className="font-[family:var(--font-orbitron)] text-xs font-bold letter-spacing tracking-[0.04em]">
// //           {title}
// //         </div>
// //         <div className="font-[family:var(--font-mono)] text-[10px] text-[rgba(232,234,240,0.5)] mt-[1px] whitespace-nowrap overflow-hidden text-ellipsis">
// //           {description}
// //         </div>
// //       </div>

// //       {/* Points display */}
// //       <div className="text-right flex-shrink-0">
// //         <div className="font-[family:var(--font-orbitron)] text-[11px] font-bold text-[#39ff14]">
// //           +{points}
// //         </div>
// //         <div className="text-sm text-[#F15C30] mt-[2px]">→</div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* Score Row Component */
// // export function ScoreRow({
// //   label,
// //   value,
// // }: {
// //   label: string;
// //   value: string | number;
// // }) {
// //   return (
// //     <div
// //       className="flex-1 bg-[rgba(5,6,8,0.55)] border border-[rgba(241,92,48,0.3)] px-[10px] py-[7px] text-center relative backdrop-blur-sm"
// //       style={{ backdropFilter: 'blur(4px)' }}
// //     >
// //       {/* Bottom accent line */}
// //       <div
// //         className="absolute bottom-0 left-0 right-0 h-px"
// //         style={{
// //           background: 'linear-gradient(90deg, transparent, #F15C30, transparent)',
// //         }}
// //       />
// //       <div className="font-[family:var(--font-orbitron)] text-base font-black">
// //         {value}
// //       </div>
// //       <div className="font-[family:var(--font-mono)] text-[8px] text-[rgba(232,234,240,0.5)] letter-spacing tracking-[0.1em] uppercase mt-[2px]">
// //         {label}
// //       </div>
// //     </div>
// //   );
// // }

// // /* HUD Top Bar */
// // export function HUDBar({
// //   title,
// //   onBack,
// // }: {
// //   title: string;
// //   onBack?: () => void;
// // }) {
// //   return (
// //     <div
// //       className="h-12 px-[14px] flex items-center gap-[10px] flex-shrink-0 relative z-20"
// //       style={{
// //         background: 'linear-gradient(to bottom, rgba(4, 5, 6, 0.85), rgba(4, 5, 6, 0.8))',
// //         borderBottom: '1px solid rgba(241, 92, 48, 0.3)',
// //       }}
// //     >
// //       {/* Logo section */}
// //       <div className="flex items-center gap-[5px] flex-shrink-0">
// //         <div className="font-[family:var(--font-orbitron)] text-[11px] font-black text-[#F15C30] letter-spacing tracking-[0.06em]">
// //           HUNT
// //         </div>
// //         <div className="font-[family:var(--font-mono)] text-[9px] text-[rgba(232,234,240,0.5)] letter-spacing tracking-[0.14em]">
// //           v1.0
// //         </div>
// //       </div>

// //       {/* Separator */}
// //       <div
// //         className="w-px h-[22px] bg-[rgba(241,92,48,0.25)] mx-1"
// //         style={{}}
// //       />

// //       {/* Title */}
// //       <div className="flex-1 font-[family:var(--font-mono)] text-[11px] text-[#00e5ff] letter-spacing tracking-[0.1em] uppercase overflow-hidden text-ellipsis whitespace-nowrap">
// //         {title}
// //       </div>

// //       {/* Back button */}
// //       {onBack && (
// //         <button
// //           onClick={onBack}
// //           className="flex items-center gap-1 font-[family:var(--font-mono)] text-[10px] text-[#F15C30] cursor-pointer px-[9px] py-[5px] border border-[rgba(241,92,48,0.3)] bg-[rgba(241,92,48,0.06)] letter-spacing tracking-[0.06em] hover:bg-[rgba(241,92,48,0.14)] active:scale-[0.96] transition-all"
// //           style={{
// //             clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
// //           }}
// //         >
// //           ← BACK
// //         </button>
// //       )}

// //       {/* Animated blip */}
// //       <div
// //         className="w-[6px] h-[6px] rounded-full bg-[#F15C30] flex-shrink-0"
// //         style={{
// //           boxShadow: '0 0 8px rgba(241, 92, 48, 0.55)',
// //           animation: 'blip 2s ease infinite',
// //         }}
// //       />
// //     </div>
// //   );
// // }

// 'use client';

// import React from 'react';

// /* ─── GameButton ──────────────────────────────────────────────────────────── */
// export function GameButton({
//   children,
//   variant = 'primary',
//   onClick,
//   className = '',
//   ...props
// }: {
//   children: React.ReactNode;
//   variant?: 'primary' | 'secondary';
//   onClick?: () => void;
//   className?: string;
//   [key: string]: unknown;
// }) {
//   const base =
//     'w-full px-5 py-[15px] border-none cursor-pointer font-[family:var(--font-orbitron)] font-bold text-xs tracking-[0.14em] uppercase transition-all duration-150 relative overflow-hidden active:scale-[0.97]';

//   const variants = {
//     primary:
//       'bg-[#F15C30] text-white shadow-[0_0_24px_rgba(241,92,48,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#ff6b3d] hover:shadow-[0_0_36px_rgba(241,92,48,0.65)]',
//     secondary:
//       'bg-[rgba(8,10,14,0.7)] text-[#F15C30] border border-[rgba(241,92,48,0.3)] hover:bg-[rgba(241,92,48,0.08)]',
//   };

//   return (
//     <button
//       className={`${base} ${variants[variant]} ${className}`}
//       style={{
//         clipPath:
//           'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
//       }}
//       onClick={onClick}
//       {...props}
//     >
//       <span className="relative z-10">{children}</span>
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           background:
//             'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
//         }}
//       />
//     </button>
//   );
// }

// /* ─── StatusTag ───────────────────────────────────────────────────────────── */
// export function StatusTag({
//   children,
//   variant = 'orange',
// }: {
//   children: React.ReactNode;
//   variant?: 'orange' | 'cyan' | 'green' | 'purple' | 'dim';
// }) {
//   const variants = {
//     orange: 'text-[#F15C30] border-[rgba(241,92,48,0.3)]   bg-[rgba(241,92,48,0.09)]',
//     cyan: 'text-[#00e5ff] border-[rgba(0,229,255,0.2)]    bg-[rgba(0,229,255,0.07)]',
//     green: 'text-[#39ff14] border-[rgba(57,255,20,0.3)]    bg-[rgba(57,255,20,0.07)]',
//     purple: 'text-[#b14dff] border-[rgba(177,77,255,0.3)]   bg-[rgba(177,77,255,0.07)]',
//     dim: 'text-[rgba(232,234,240,0.5)] border-[rgba(232,234,240,0.22)] bg-transparent',
//   };

//   return (
//     <div
//       className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] font-[family:var(--font-share-mono)] text-[10px] tracking-[0.1em] uppercase border ${variants[variant]}`}
//       style={{
//         clipPath:
//           'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// /* ─── Panel ───────────────────────────────────────────────────────────────── */
// export function Panel({
//   children,
//   header,
//   headerColor = 'orange',
//   className = '',
// }: {
//   children: React.ReactNode;
//   header?: React.ReactNode;
//   headerColor?: 'orange' | 'cyan' | 'green' | 'yellow';
//   className?: string;
// }) {
//   const gradients = {
//     orange: 'linear-gradient(90deg, #F15C30, transparent 60%)',
//     cyan: 'linear-gradient(90deg, #00e5ff, transparent 60%)',
//     green: 'linear-gradient(90deg, #39ff14, transparent 60%)',
//     yellow: 'linear-gradient(90deg, #ffbb00, transparent 60%)',
//   };

//   return (
//     <div
//       className={`bg-[rgba(5,6,8,0.62)] border border-[rgba(241,92,48,0.3)] relative overflow-hidden ${className}`}
//       style={{ backdropFilter: 'blur(6px)' }}
//     >
//       {/* Top accent line */}
//       <div
//         className="absolute top-0 left-0 right-0 h-[2px]"
//         style={{ background: gradients[headerColor] }}
//       />

//       {header && (
//         <div className="px-[14px] py-[11px] flex items-center justify-between border-b border-[rgba(255,255,255,0.04)]">
//           {/* ↓ font-share-mono, not font-mono */}
//           <div className="font-[family:var(--font-share-mono)] text-[10px] tracking-[0.12em] uppercase flex items-center gap-[6px]">
//             {header}
//           </div>
//         </div>
//       )}

//       <div className="p-[12px_14px_14px]">{children}</div>
//     </div>
//   );
// }

// /* ─── ProgressPips ────────────────────────────────────────────────────────── */
// export function ProgressPips({
//   total,
//   completed,
//   active,
// }: {
//   total: number;
//   completed: number;
//   active?: number;
// }) {
//   return (
//     <div className="flex gap-[3px] px-[14px] pb-[10px]">
//       {Array.from({ length: total }).map((_, i) => {
//         const isDone = i < completed;
//         const isActive = i === active;

//         return (
//           <div
//             key={i}
//             className={`flex-1 h-1 relative transition-colors duration-500 ${isDone ? 'bg-[rgba(57,255,20,0.12)]' : 'bg-[rgba(255,255,255,0.07)]'
//               }`}
//           >
//             <div
//               className="absolute inset-0"
//               style={{
//                 background: isDone ? '#39ff14' : '#F15C30',
//                 transform: `scaleX(${isDone || isActive ? 1 : 0})`,
//                 transformOrigin: 'left',
//                 transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
//                 animation: isActive ? 'pp 1.6s ease infinite' : 'none',
//               }}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// /* ─── StopRow ─────────────────────────────────────────────────────────────── */
// export function StopRow({
//   stopNumber,
//   title,
//   description,
//   points,
//   status = 'locked',
//   onClick,
// }: {
//   stopNumber: number;
//   title: string;
//   description: string;
//   points: number;
//   status?: 'locked' | 'active' | 'done';
//   onClick?: () => void;
// }) {
//   const numStyles = {
//     locked: 'bg-[rgba(255,255,255,0.04)] text-[rgba(232,234,240,0.22)]',
//     active: 'bg-[#F15C30] text-white shadow-[0_0_14px_rgba(241,92,48,0.6)]',
//     done: 'bg-[rgba(57,255,20,0.12)] text-[#39ff14]',
//   };

//   const isLocked = status === 'locked';

//   return (
//     <div
//       className={`flex items-center gap-[10px] px-[14px] py-[11px] border-b border-[rgba(255,255,255,0.06)] relative overflow-hidden transition-colors duration-150 ${isLocked
//         ? 'opacity-30 cursor-default'
//         : 'cursor-pointer hover:bg-[rgba(241,92,48,0.05)]'
//         }`}
//       onClick={isLocked ? undefined : onClick}
//     >
//       {/* Left accent strip */}
//       <div
//         className="absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-200"
//         style={{
//           background:
//             status === 'active' ? '#F15C30'
//               : status === 'done' ? '#39ff14'
//                 : 'transparent',
//           boxShadow:
//             status === 'active' ? '0 0 8px rgba(241,92,48,0.55)'
//               : status === 'done' ? '0 0 8px rgba(57,255,20,0.45)'
//                 : 'none',
//         }}
//       />

//       {/* Stop number badge */}
//       <div
//         className={`w-[34px] h-[34px] flex items-center justify-center font-[family:var(--font-orbitron)] text-xs font-bold flex-shrink-0 ${numStyles[status]}`}
//         style={{
//           clipPath:
//             'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
//         }}
//       >
//         {stopNumber}
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <div className="font-[family:var(--font-orbitron)] text-xs font-bold tracking-[0.04em]">
//           {title}
//         </div>
//         {/* ↓ font-share-mono */}
//         <div className="font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.5)] mt-[1px] truncate">
//           {description}
//         </div>
//       </div>

//       {/* Points */}
//       <div className="text-right flex-shrink-0">
//         <div className="font-[family:var(--font-orbitron)] text-[11px] font-bold text-[#39ff14]">
//           +{points}
//         </div>
//         <div className="text-sm text-[#F15C30] mt-[2px]">→</div>
//       </div>
//     </div>
//   );
// }

// /* ─── ScoreRow ────────────────────────────────────────────────────────────── */
// export function ScoreRow({
//   label,
//   value,
// }: {
//   label: string;
//   value: string | number;
// }) {
//   return (
//     <div
//       className="flex-1 bg-[rgba(5,6,8,0.55)] border border-[rgba(241,92,48,0.3)] px-[10px] py-[7px] text-center relative"
//       style={{ backdropFilter: 'blur(4px)' }}
//     >
//       <div
//         className="absolute bottom-0 left-0 right-0 h-px"
//         style={{
//           background: 'linear-gradient(90deg, transparent, #F15C30, transparent)',
//         }}
//       />
//       <div className="font-[family:var(--font-orbitron)] text-base font-black">
//         {value}
//       </div>
//       {/* ↓ font-share-mono */}
//       <div className="font-[family:var(--font-share-mono)] text-[8px] text-[rgba(232,234,240,0.5)] tracking-[0.1em] uppercase mt-[2px]">
//         {label}
//       </div>
//     </div>
//   );
// }

// /* ─── HUDBar ──────────────────────────────────────────────────────────────── */
// export function HUDBar({
//   title,
//   onBack,
// }: {
//   title: string;
//   onBack?: () => void;
// }) {
//   return (
//     <div
//       className="h-12 px-[14px] flex items-center gap-[10px] flex-shrink-0 relative z-20"
//       style={{
//         background: 'linear-gradient(to bottom, rgba(4,5,6,0.85), rgba(4,5,6,0.8))',
//         borderBottom: '1px solid rgba(241,92,48,0.3)',
//       }}
//     >
//       {/* Logo */}
//       <div className="flex items-center gap-[5px] flex-shrink-0">
//         <div className="font-[family:var(--font-orbitron)] text-[11px] font-black text-[#F15C30] tracking-[0.06em]">
//           HUNT
//         </div>
//         {/* ↓ font-share-mono */}
//         <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.5)] tracking-[0.14em]">
//           v1.0
//         </div>
//       </div>

//       <div className="w-px h-[22px] bg-[rgba(241,92,48,0.25)] mx-1" />

//       {/* Title */}
//       {/* ↓ font-share-mono */}
//       <div className="flex-1 font-[family:var(--font-share-mono)] text-[11px] text-[#00e5ff] tracking-[0.1em] uppercase overflow-hidden text-ellipsis whitespace-nowrap">
//         {title}
//       </div>

//       {/* Back button */}
//       {onBack && (
//         <button
//           onClick={onBack}
//           className="flex items-center gap-1 font-[family:var(--font-share-mono)] text-[10px] text-[#F15C30] cursor-pointer px-[9px] py-[5px] border border-[rgba(241,92,48,0.3)] bg-[rgba(241,92,48,0.06)] tracking-[0.06em] hover:bg-[rgba(241,92,48,0.14)] active:scale-[0.96] transition-all"
//           style={{
//             clipPath:
//               'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
//           }}
//         >
//           ← BACK
//         </button>
//       )}

//       {/* Animated blip */}
//       <div
//         className="w-[6px] h-[6px] rounded-full bg-[#F15C30] flex-shrink-0"
//         style={{
//           boxShadow: '0 0 8px rgba(241,92,48,0.55)',
//           animation: 'blip 2s ease infinite',
//         }}
//       />
//     </div>
//   );
// }


'use client';

import React from 'react';

/* ─── GameButton ──────────────────────────────────────────────────────────── */
export function GameButton({
  children,
  variant = 'primary',
  onClick,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  [key: string]: unknown;
}) {
  const base =
    'w-full px-5 py-[15px] border-none cursor-pointer font-[family:var(--font-orbitron)] font-bold text-xs tracking-[0.14em] uppercase transition-all duration-150 relative overflow-hidden active:scale-[0.97]';

  const variants = {
    primary:
      'bg-[#F15C30] text-white shadow-[0_0_24px_rgba(241,92,48,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#ff6b3d] hover:shadow-[0_0_36px_rgba(241,92,48,0.65)]',
    secondary:
      'bg-[rgba(8,10,14,0.7)] text-[#F15C30] border border-[rgba(241,92,48,0.3)] hover:bg-[rgba(241,92,48,0.08)]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      style={{
        clipPath:
          'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
      }}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
        }}
      />
    </button>
  );
}

/* ─── StatusTag ───────────────────────────────────────────────────────────── */
export function StatusTag({
  children,
  variant = 'orange',
}: {
  children: React.ReactNode;
  variant?: 'orange' | 'cyan' | 'green' | 'purple' | 'dim';
}) {
  const variants = {
    orange: 'text-[#F15C30] border-[rgba(241,92,48,0.3)]   bg-[rgba(241,92,48,0.09)]',
    cyan: 'text-[#00e5ff] border-[rgba(0,229,255,0.2)]    bg-[rgba(0,229,255,0.07)]',
    green: 'text-[#39ff14] border-[rgba(57,255,20,0.3)]    bg-[rgba(57,255,20,0.07)]',
    purple: 'text-[#b14dff] border-[rgba(177,77,255,0.3)]   bg-[rgba(177,77,255,0.07)]',
    dim: 'text-[rgba(232,234,240,0.5)] border-[rgba(232,234,240,0.22)] bg-transparent',
  };

  return (
    <div
      className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] font-[family:var(--font-share-mono)] text-[10px] tracking-[0.1em] uppercase border ${variants[variant]}`}
      style={{
        clipPath:
          'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
      }}
    >
      {children}
    </div>
  );
}

/* ─── Panel ───────────────────────────────────────────────────────────────── */
export function Panel({
  children,
  header,
  headerColor = 'orange',
  className = '',
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  headerColor?: 'orange' | 'cyan' | 'green' | 'yellow';
  className?: string;
}) {
  const gradients = {
    orange: 'linear-gradient(90deg, #F15C30, transparent 60%)',
    cyan: 'linear-gradient(90deg, #00e5ff, transparent 60%)',
    green: 'linear-gradient(90deg, #39ff14, transparent 60%)',
    yellow: 'linear-gradient(90deg, #ffbb00, transparent 60%)',
  };

  return (
    <div
      className={`bg-[rgba(5,6,8,0.62)] border border-[rgba(241,92,48,0.3)] relative overflow-hidden ${className}`}
      style={{ backdropFilter: 'blur(6px)' }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: gradients[headerColor] }}
      />

      {header && (
        <div className="px-[14px] py-[11px] flex items-center justify-between border-b border-[rgba(255,255,255,0.04)]">
          {/* ↓ font-share-mono, not font-mono */}
          <div className="font-[family:var(--font-share-mono)] text-[10px] tracking-[0.12em] uppercase flex items-center gap-[6px]">
            {header}
          </div>
        </div>
      )}

      <div className="p-[12px_14px_14px]">{children}</div>
    </div>
  );
}

/* ─── ProgressPips ────────────────────────────────────────────────────────── */
export function ProgressPips({
  total,
  completed,
  active,
}: {
  total: number;
  completed: number;
  active?: number;
}) {
  return (
    <div className="flex gap-[3px] px-[14px] pb-[10px]">
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < completed;
        const isActive = i === active;

        return (
          <div
            key={i}
            className={`flex-1 h-1 relative transition-colors duration-500 ${isDone ? 'bg-[rgba(57,255,20,0.12)]' : 'bg-[rgba(255,255,255,0.07)]'
              }`}
          >
            <div
              className="absolute inset-0"
              style={{
                background: isDone ? '#39ff14' : '#F15C30',
                transform: `scaleX(${isDone || isActive ? 1 : 0})`,
                transformOrigin: 'left',
                transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: isActive ? 'pp 1.6s ease infinite' : 'none',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ─── StopRow ─────────────────────────────────────────────────────────────── */
export function StopRow({
  stopNumber,
  title,
  description,
  points,
  status = 'locked',
  onClick,
}: {
  stopNumber: number;
  title: string;
  description: string;
  points: number;
  status?: 'locked' | 'active' | 'done';
  onClick?: () => void;
}) {
  const numStyles = {
    locked: 'bg-[rgba(255,255,255,0.04)] text-[rgba(232,234,240,0.22)]',
    active: 'bg-[#F15C30] text-white shadow-[0_0_14px_rgba(241,92,48,0.6)]',
    done: 'bg-[rgba(57,255,20,0.12)] text-[#39ff14]',
  };

  const isLocked = status === 'locked';

  return (
    <div
      className={`flex items-center gap-[10px] px-[14px] py-[11px] border-b border-[rgba(255,255,255,0.06)] relative overflow-hidden transition-colors duration-150 ${isLocked
        ? 'opacity-30 cursor-default'
        : 'cursor-pointer hover:bg-[rgba(241,92,48,0.05)]'
        }`}
      onClick={isLocked ? undefined : onClick}
    >
      {/* Left accent strip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-200"
        style={{
          background:
            status === 'active' ? '#F15C30'
              : status === 'done' ? '#39ff14'
                : 'transparent',
          boxShadow:
            status === 'active' ? '0 0 8px rgba(241,92,48,0.55)'
              : status === 'done' ? '0 0 8px rgba(57,255,20,0.45)'
                : 'none',
        }}
      />

      {/* Stop number badge */}
      <div
        className={`w-[34px] h-[34px] flex items-center justify-center font-[family:var(--font-orbitron)] text-xs font-bold flex-shrink-0 ${numStyles[status]}`}
        style={{
          clipPath:
            'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        }}
      >
        {stopNumber}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-[family:var(--font-orbitron)] text-xs font-bold tracking-[0.04em]">
          {title}
        </div>
        {/* ↓ font-share-mono */}
        <div className="font-[family:var(--font-share-mono)] text-[10px] text-[rgba(232,234,240,0.5)] mt-[1px] truncate">
          {description}
        </div>
      </div>

      {/* Points */}
      <div className="text-right flex-shrink-0">
        <div className="font-[family:var(--font-orbitron)] text-[11px] font-bold text-[#39ff14]">
          +{points}
        </div>
        <div className="text-sm text-[#F15C30] mt-[2px]">→</div>
      </div>
    </div>
  );
}

/* ─── ScoreRow ────────────────────────────────────────────────────────────── */
export function ScoreRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="flex-1 bg-[rgba(5,6,8,0.55)] border border-[rgba(241,92,48,0.3)] px-[10px] py-[7px] text-center relative"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, #F15C30, transparent)',
        }}
      />
      <div className="font-[family:var(--font-orbitron)] text-base font-black">
        {value}
      </div>
      {/* ↓ font-share-mono */}
      <div className="font-[family:var(--font-share-mono)] text-[8px] text-[rgba(232,234,240,0.5)] tracking-[0.1em] uppercase mt-[2px]">
        {label}
      </div>
    </div>
  );
}

/* ─── HUDBar ──────────────────────────────────────────────────────────────── */
export function HUDBar({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <div
      className="h-12 px-[14px] flex items-center gap-[10px] flex-shrink-0 relative z-20"
      style={{
        background: 'linear-gradient(to bottom, rgba(4,5,6,0.85), rgba(4,5,6,0.8))',
        borderBottom: '1px solid rgba(241,92,48,0.3)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-[5px] flex-shrink-0">
        <div className="font-[family:var(--font-orbitron)] text-[11px] font-black text-[#F15C30] tracking-[0.06em]">
          HUNT
        </div>
        {/* ↓ font-share-mono */}
        <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.5)] tracking-[0.14em]">
          v1.0
        </div>
      </div>

      <div className="w-px h-[22px] bg-[rgba(241,92,48,0.25)] mx-1" />

      {/* Title */}
      {/* ↓ font-share-mono */}
      <div className="flex-1 font-[family:var(--font-share-mono)] text-[11px] text-[#00e5ff] tracking-[0.1em] uppercase overflow-hidden text-ellipsis whitespace-nowrap">
        {title}
      </div>

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 font-[family:var(--font-share-mono)] text-[10px] text-[#F15C30] cursor-pointer px-[9px] py-[5px] border border-[rgba(241,92,48,0.3)] bg-[rgba(241,92,48,0.06)] tracking-[0.06em] hover:bg-[rgba(241,92,48,0.14)] active:scale-[0.96] transition-all"
          style={{
            clipPath:
              'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
          }}
        >
          ← BACK
        </button>
      )}

      {/* Animated blip */}
      <div
        className="w-[6px] h-[6px] rounded-full bg-[#F15C30] flex-shrink-0"
        style={{
          boxShadow: '0 0 8px rgba(241,92,48,0.55)',
          animation: 'blip 2s ease infinite',
        }}
      />
    </div>
  );
}

export function PhillipsHUDBar({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <div
      className="h-11 px-3 flex items-center gap-2 flex-shrink-0 relative z-20"
      style={{
        background: 'linear-gradient(to bottom, rgba(4,5,6,0.92), rgba(4,5,6,0.88))',
        borderBottom: '1px solid rgba(241,92,48,0.35)',
      }}
    >
      <div className="font-[family:var(--font-orbitron)] text-[10px] font-black text-[#F15C30] tracking-wider">
        PHILLIPS
      </div>
      <div className="w-px h-4 bg-[rgba(241,92,48,0.25)]" />
      <div className="flex-1 font-[family:var(--font-share-mono)] text-[10px] text-[#00e5ff] tracking-wider uppercase truncate">
        {title}
      </div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="font-[family:var(--font-share-mono)] text-[9px] text-[#F15C30] px-2 py-1 border border-[rgba(241,92,48,0.3)]"
        >
          ← EXIT
        </button>
      )}
    </div>
  );
}

export function HuntStopRow({
  index,
  company,
  task,
  done,
  active,
  locked,
  bonus,
  onClick,
}: {
  index: number;
  company: string;
  task: string;
  done: boolean;
  active: boolean;
  locked: boolean;
  bonus?: boolean;
  onClick?: () => void;
}) {
  const numClass = done
    ? 'bg-[rgba(57,255,20,0.12)] text-[#39ff14]'
    : active
      ? 'bg-[#F15C30] text-white shadow-[0_0_14px_rgba(241,92,48,0.6)]'
      : 'bg-[rgba(255,255,255,0.04)] text-[rgba(232,234,240,0.22)]';

  const pts = done ? `${bonus ? 15 : 10} PTS` : active ? '10–15 PTS' : '';

  return (
    <div
      role={locked ? undefined : 'button'}
      onClick={locked ? undefined : onClick}
      className={`flex items-center gap-2.5 px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.06)] relative bg-[rgba(4,5,7,0.5)] ${
        locked ? 'opacity-[0.55]' : 'cursor-pointer hover:bg-[rgba(241,92,48,0.05)]'
      } ${done ? 'bg-[rgba(57,255,20,0.08)]' : active ? 'bg-[rgba(241,92,48,0.06)]' : ''}`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 ${active ? 'bg-[#F15C30]' : done ? 'bg-[#39ff14]' : ''}`}
      />
      <div
        className={`w-8 h-8 flex items-center justify-center font-[family:var(--font-orbitron)] text-xs font-bold flex-shrink-0 ${numClass}`}
        style={{
          clipPath:
            'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
        }}
      >
        {done ? '✓' : locked ? '🔒' : index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-[family:var(--font-orbitron)] text-[11px] font-bold">{company}</div>
        <div className="font-[family:var(--font-share-mono)] text-[9px] text-[rgba(232,234,240,0.45)] truncate">
          {task}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-[family:var(--font-orbitron)] text-[10px] font-bold text-[#39ff14]">
          {pts}
        </div>
        {!locked && <div className="text-[#F15C30] text-xs">►</div>}
      </div>
    </div>
  );
}
