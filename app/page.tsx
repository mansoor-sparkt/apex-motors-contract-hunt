import { GameApp } from "@/components/GameApp";


export default function Home() {
  return (
    <main className="flex h-dvh w-full flex-1 flex-col items-stretch justify-stretch overflow-hidden bg-[#0a0a0a] sm:min-h-dvh sm:h-auto sm:items-center sm:justify-center sm:overflow-x-hidden sm:overflow-y-auto">
      <GameApp />
    </main>
  );
}
