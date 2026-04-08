import GameClient from "@/components/GameClient";
import { pickDailyPuzzle } from "@/lib/pickDailyPuzzle";
import puzzles from "@/data/puzzles.json";

export default function HomePage() {
  const puzzle = pickDailyPuzzle(puzzles, new Date());

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute left-10 top-10 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 md:px-10">
          <nav className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <div>
              <div className="text-lg font-semibold">SignalSprint</div>
              <div className="text-xs text-slate-400">
                Daily geography, events, flags, landmarks, and chart puzzle
              </div>
            </div>
          </nav>

          <div className="mt-16 max-w-4xl">
            <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              New puzzle every day
            </div>

            <h1 className="mt-6 text-5xl font-semibold leading-tight md:text-7xl">
              SignalSprint
            </h1>

            <p className="mt-4 text-xl text-slate-300">
              A daily geography, events, and visual puzzle game
            </p>

            <div className="mt-6 space-y-2 text-slate-300">
              <p>🎯 Guess the answer using clues</p>
              <p>🧠 5 guesses only</p>
              <p>🌍 Categories: geography, events, flags, landmarks, charts</p>
              <p>📅 New puzzle every day</p>
            </div>
          </div>

          <GameClient puzzle={puzzle} />

          <div className="mt-16 max-w-3xl">
            <h2 className="mb-4 text-2xl font-semibold">How to Play</h2>

            <div className="space-y-3 text-slate-300">
              <p>1. You get one puzzle per day.</p>
              <p>2. Use the question to guess the correct answer.</p>
              <p>3. You have 5 guesses.</p>
              <p>4. After solving, share your result.</p>
            </div>
          </div>

          <footer className="mt-20 border-t border-white/10 pt-6 text-center text-slate-400">
            <p>SignalSprint © 2026</p>
            <p className="mt-2 text-sm">Daily visual puzzle game</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
