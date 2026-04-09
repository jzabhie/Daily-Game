import GameClient from "@/components/GameClient";
import { pickDailyPuzzle } from "@/lib/pickDailyPuzzle";
import puzzles from "@/data/puzzles.json";

export default function HomePage() {
  const puzzle = pickDailyPuzzle(puzzles, new Date());

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            SignalSprint · Daily Visual Puzzle
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Guess smarter with clues, hints, options, and visual context.</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Every day brings one puzzle. You still get only 5 guesses, but now the round includes smarter hints,
            better clue panels, answer choices, puzzle metadata, and richer feedback.
          </p>
        </div>

        <GameClient puzzle={puzzle} />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-semibold">How to Play</h2>
            <div className="space-y-3 text-slate-300">
              <p>1. You get one puzzle per day.</p>
              <p>2. Study the main clue card before guessing.</p>
              <p>3. You have 5 guesses only.</p>
              <p>4. Hints unlock as you use more guesses.</p>
              <p>5. Use the answer choices to eliminate bad options fast.</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-semibold">What’s New</h2>
            <div className="space-y-3 text-slate-300">
              <p>• Smarter hint system from puzzle metadata</p>
              <p>• Better visual clue cards for maps, charts, and concept puzzles</p>
              <p>• Clickable answer choices</p>
              <p>• Progress tracking and puzzle notes</p>
              <p>• Cleaner end-of-round explanation</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-semibold">Puzzle Mix</h2>
            <div className="space-y-3 text-slate-300">
              <p>Geography</p>
              <p>Math</p>
              <p>Economics</p>
              <p>Science &amp; Tech</p>
              <p>Arts, Movies, Sports, History, and Literature</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
