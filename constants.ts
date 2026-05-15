import type { PlayerProfile } from "@/lib/game-types";

export const MAX_SCORE = 160;
export const TOTAL_STOPS = 8;

export const IMAGE_URLS = {
  photoBg:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
  splashHero:
    "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1200",
  formBg:
    "https://images.unsplash.com/photo-1504917595217-d4dc5efd1ad7?auto=format&fit=crop&q=80&w=1200",
};

export const STOP_IMAGE_MAP: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
  2: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800",
  3: "https://images.unsplash.com/photo-1504917595217-d4dc5efd1ad7?auto=format&fit=crop&q=80&w=800",
  4: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=800",
  5: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800",
  6: "https://images.unsplash.com/photo-1581092160607-ee23622dd13b?auto=format&fit=crop&q=80&w=800",
  7: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=800",
  8: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
};

export const STOP_BRIGHTNESS: number[] = [0.4, 0.52, 0.48, 0.45, 0.48, 0.5, 0.42, 0.55];

export const ROLES = [
  { id: "Student", icon: "🎓" },
  { id: "Educator", icon: "📐" },
  { id: "Industry", icon: "🏭" },
  { id: "Other", icon: "✨" },
];

export const AVS = [
  { em: "🧑‍🔧", n: "RICKY REYES", role: "Speed demon. Tight tolerances." },
  { em: "👩‍🔬", n: "MAYA TORRES", role: "Quality first. CMM is her weapon." },
  { em: "🧑‍💻", n: "DEV PATEL", role: "CAM wizard. Toolpaths are art." },
  { em: "👩‍🏭", n: "SAM OKAFOR", role: "Shop floor veteran. Seen it all." },
];

export const STOPS = [
  {
    n: 1,
    co: "Markforged",
    task: "The contract starts here",
    story:
      "Apex Motors just called. They need 500 brake caliper brackets in 6 weeks. You take the job. Time to figure out what you're working with.",
    fi: "Photo of any part on display or booth banner",
    bt: "calc" as const,
    bp: "What material is this part most likely made of? Use your knowledge of manufacturing processes.",
    b1: "Material Whisperer",
    b2: "Alloy Guesser",
    b3: "Chump Change",
  },
  {
    n: 2,
    co: "Autodesk",
    task: "Read the print, plan the build",
    story:
      "The CAD file just arrived. Before you can program a single toolpath, you need to understand what you're actually cutting.",
    fi: "Photo of Fusion 360 demo running on screen",
    bt: "conv" as const,
    q1: "How does Fusion 360 handle CAM for multi-axis jobs?",
    q2: "What's the learning curve for a first-year student?",
    rc: "Autodesk",
    b1: "CAD Whisperer",
  },
  {
    n: 3,
    co: "Mastercam",
    task: "Program the toolpaths, hit the deadline",
    story:
      "CAD is locked in. 500 parts in 6 weeks means cycle time is everything. Every second on the machine is money made or lost.",
    fi: "Photo of any Mastercam toolpath screen",
    bt: "calc" as const,
    bp: "MRR challenge: Roughing 6061 aluminum. Open Phillips Machinist app and calculate your material removal rate.",
    b1: "Chip Slinger",
    b2: "Roughing It",
    b3: "Butter Cutter",
  },
  {
    n: 4,
    co: "Haas",
    task: "Pick the machine, dial in the cut",
    story:
      "You've got the toolpaths dialed. Now you need iron to run them on. 500-part runs don't care about excuses.",
    fi: "Photo of a Haas machine on display",
    bt: "conv" as const,
    q1: "What's the best Haas model for 500-piece aluminum runs?",
    q2: "How does Haas support first-time machine buyers?",
    rc: "Haas",
    b1: "Iron Talker",
  },
  {
    n: 5,
    co: "Mitutoyo",
    task: "First article inspection",
    story:
      "First part comes off the machine. Before you run another 499, you need to prove this one is right.",
    fi: "Photo of any Mitutoyo measuring tool",
    bt: "calc" as const,
    bp: "Unit conversion sprint! Open Phillips Machinist and convert 3 values from the bracket drawing.",
    b1: "Decimal Demon",
    b2: "Close Enough",
    b3: "Lost in Translation",
  },
  {
    n: 6,
    co: "Zeiss",
    task: "CMM verification on critical features",
    story:
      "Two features got flagged as critical. Calipers won't cut it — you need a full CMM report before this lot ships.",
    fi: "Photo of Zeiss CMM on display",
    bt: "conv" as const,
    q1: "What CMM features matter most for aerospace-grade tolerances?",
    q2: "How long does it take to program a CMM for a new part?",
    rc: "Zeiss",
    b1: "Measurement Mouth",
  },
  {
    n: 7,
    co: "Deere",
    task: "A second contract on the table",
    story:
      "Word's getting around that you can deliver. Deere's procurement team asks if you can quote a hydraulic fitting job.",
    fi: "Photo of any Deere part on display",
    bt: "calc" as const,
    bp: "Multi-select: Which manufacturing processes were likely involved in the Deere part you found?",
    b1: "Process Boss",
    b2: "Shop Tourist",
    b3: "Window Shopper",
  },
  {
    n: 8,
    co: "Caterpillar",
    task: "What's next for your shop",
    story:
      "Contract delivered. 500 brackets shipped on time. Now Cat's asking what kind of machinist you want to become.",
    fi: "Photo of Cat component or career signage",
    bt: "conv" as const,
    q1: "What career paths lead to programming CNC machines at Cat?",
    q2: "How did you personally get started in manufacturing?",
    rc: "Caterpillar",
    b1: "Future Builder",
  },
];

export const SHORTS = [
  {
    slug: "big-machine",
    em: "💪",
    title: "BIG MACHINE ENERGY",
    desc: "Strike a pose with the biggest machine on the floor.",
    type: "photo" as const,
    badge: "Main Character",
  },
  {
    slug: "album-cover",
    em: "🎵",
    title: "ALBUM COVER",
    desc: "Album cover with your crew — machining concept required.",
    type: "photo" as const,
    badge: "Platinum Record",
  },
  {
    slug: "spirit-tool",
    em: "🔧",
    title: "SPIRIT TOOL",
    desc: "Find the tool that speaks to your soul. Caption why.",
    type: "photo" as const,
    badge: "Tool Soulmate",
  },
  {
    slug: "human-gdt",
    em: "📐",
    title: "HUMAN GD&T",
    desc: "Recreate a GD&T symbol with your body.",
    type: "photo" as const,
    badge: "Living Blueprint",
  },
  {
    slug: "action-hero",
    em: "🎬",
    title: "ACTION HERO",
    desc: "Slow-mo walk away from a CNC. Full action energy.",
    type: "video" as const,
    badge: "Blockbuster",
  },
  {
    slug: "the-pitch",
    em: "📢",
    title: "THE PITCH",
    desc: "30-sec infomercial for Phillips Machinist. Sell it.",
    type: "video" as const,
    badge: "Closer",
  },
  {
    slug: "elevator",
    em: "🛗",
    title: "THE ELEVATOR",
    desc: "Explain what a machinist does in 15 seconds. Go.",
    type: "video" as const,
    badge: "Smooth Operator",
  },
  {
    slug: "in-tolerance",
    em: "🎉",
    title: "IN TOLERANCE",
    desc: "Your best 'in tolerance' celebration on camera.",
    type: "video" as const,
    badge: "Victory Lap",
  },
];

export const FLB = [
  { n: "Taylor R.", s: "Lincoln Tech", sc: 155, b: 12, av: "👩‍🔬" },
  { n: "Jordan K.", s: "West Side CTC", sc: 140, b: 10, av: "🧑‍🔧" },
  { n: "Priya S.", s: "Metro Tech", sc: 135, b: 9, av: "👩‍🏭" },
  { n: "Marcus D.", s: "Southern Poly", sc: 120, b: 8, av: "🧑‍💻" },
  { n: "Casey W.", s: "Northeast CTE", sc: 110, b: 7, av: "🧑‍🔧" },
  { n: "Sam L.", s: "Gateway Votech", sc: 95, b: 6, av: "👩‍🔬" },
  { n: "Eli T.", s: "Central HS", sc: 85, b: 5, av: "🧑‍💻" },
];

export const DEFAULT_PLAYER: PlayerProfile = {
  name: "Operator",
  email: "",
  school: "—",
  role: "Student",
  avatarIndex: 0,
};

export function getActiveStopIndex(
  stopsDone: Record<number, { bonus: boolean }>
): number {
  for (let i = 0; i < TOTAL_STOPS; i++) {
    if (!stopsDone[i]) return i;
  }
  return TOTAL_STOPS;
}

export function computeScore(
  stopsDone: Record<number, { bonus: boolean }>,
  shortsDone: Record<string, boolean>
): number {
  let score = 0;
  Object.keys(stopsDone).forEach((k) => {
    const i = Number(k);
    const d = stopsDone[i];
    if (d) score += 10 + (d.bonus ? 5 : 0);
  });
  score += Object.keys(shortsDone).length * 5;
  return score;
}

export function getRank(score: number, playerName: string): number {
  const all = [
    ...FLB.map((p) => ({ sc: p.sc, isYou: false })),
    { sc: score, isYou: true },
  ].sort((a, b) => b.sc - a.sc);
  return all.findIndex((p) => p.isYou) + 1;
}
