import { GameApp } from "@/components/GameApp";


export default function Home() {
  return (
    <main className="flex min-h-dvh w-full flex-1 flex-col items-center justify-start bg-[#0a0a0a] overflow-x-hidden overflow-y-auto pb-[env(safe-area-inset-bottom,0px)] sm:justify-center">
      <GameApp />
    </main>
  );
}
