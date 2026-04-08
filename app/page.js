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
          <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <div>
              <div className="text-lg font-semibold">SignalSprint</div>
              <div className="text-xs text-slate-400">Daily geography, event, landmark, flag, and chart puzzle</div>
            </div>
            <a
              href="https://github.com/"
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"
            >
              Launch on GitHub
            </a>
          </nav>

          <div className="mt-16 max-w-4xl">
            <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              Fully automatic daily game
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-tight md:text-7xl">
              A daily visual puzzle game you can launch for free.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              This starter version uses a 1000-puzzle bank and automatically picks one puzzle per day.
              Geography, world events, landmarks, flags, and chart clues are all supported.
            </p>
          </div>

          <GameClient puzzle={puzzle} />
        </div>
      </section>
    </main>
  );
}
