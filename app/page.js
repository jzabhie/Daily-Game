import GameClient from "@/components/GameClient";
import { pickDailyPuzzle } from "@/lib/pickDailyPuzzle";
import puzzles from "@/data/puzzles.json";

export default function HomePage() {
  const puzzle = pickDailyPuzzle(puzzles, new Date());

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <GameClient puzzle={puzzle} />

        <div className="mt-16 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-semibold">How to Play</h2>
          <div className="space-y-3 text-slate-300">
            <p>1. You get one puzzle per day.</p>
            <p>2. Read the question and make your best guess.</p>
            <p>3. You have 5 guesses.</p>
            <p>4. If you solve it, share your result.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
