"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Share2, RotateCcw } from "lucide-react";

function copyResult(text) {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.resolve();
}

export default function GameClient({ puzzle }) {
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [status, setStatus] = useState("playing");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("signalSprintStreak");
    if (saved) {
      setStreak(Number(saved));
    }
  }, []);

  const normalizedAnswer = puzzle.answer.toLowerCase();

  const filteredOptions = useMemo(() => {
    if (!guess.trim()) return puzzle.options || [];
    return (puzzle.options || []).filter((option) =>
      option.toLowerCase().includes(guess.toLowerCase())
    );
  }, [guess, puzzle.options]);

  function submitGuess(value) {
    if (status !== "playing") return;

    const entry = (value ?? guess).trim();
    if (!entry) return;
    if (guesses.includes(entry)) return;

    const next = [...guesses, entry];
    setGuesses(next);
    setGuess("");

    const accepted =
      puzzle.acceptedAnswers?.map((x) => x.toLowerCase()) || [];

    if (
      entry.toLowerCase() === normalizedAnswer ||
      accepted.includes(entry.toLowerCase())
    ) {
      setStatus("won");
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("signalSprintStreak", String(newStreak));
      return;
    }

    if (next.length >= 5) {
      setStatus("lost");
      localStorage.setItem("signalSprintStreak", "0");
      setStreak(0);
    }
  }

  function resetRound() {
    setGuess("");
    setGuesses([]);
    setStatus("playing");
  }

  const shareText = `SignalSprint ${new Date().toISOString().slice(0, 10)}
${status === "won" ? "Solved" : "Tried"} in ${guesses.length}/5
🌍 Daily puzzle game`;

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm text-slate-300">Today's puzzle</div>
            <h2 className="mt-1 text-2xl font-semibold">{puzzle.prompt}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-sm text-orange-200">
              🔥 Streak: {streak}
            </div>
            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
              {puzzle.category}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#081626] p-5">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Puzzle
          </div>
          <div className="mt-2 text-lg text-slate-200">
            Think carefully and make your best guess.
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-sm text-slate-400">
            Enter a guess or tap an option.
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder:text-slate-500"
              placeholder="Type your guess..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitGuess()}
            />
            <button
              onClick={() => submitGuess()}
              className="h-12 rounded-2xl bg-white px-5 font-semibold text-slate-900"
            >
              Guess
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(filteredOptions || []).map((option) => (
            <button
              key={option}
              onClick={() => submitGuess(option)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-2">
          <AnimatePresence>
            {guesses.map((g, i) => {
              const correct = g.toLowerCase() === normalizedAnswer;
              return (
                <motion.div
                  key={g + i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-2xl border px-4 py-3 ${
                    correct
                      ? "border-emerald-400/30 bg-emerald-400/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>{g}</div>
                    <div className={correct ? "text-emerald-300" : "text-slate-400"}>
                      {correct ? "Correct" : "Not this one"}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {status !== "playing" ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-400/15 to-fuchsia-500/15 p-5">
            <div className="text-xl font-semibold">
              {status === "won" ? "You solved it!" : "Round complete"}
            </div>
            <p className="mt-2 text-slate-200">
              Answer: <span className="font-semibold text-white">{puzzle.answer}</span>
            </p>
            <p className="mt-2 text-slate-300">{puzzle.funFact}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => copyResult(shareText)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2"
              >
                <Share2 className="h-4 w-4" />
                Copy result
              </button>
              <button
                onClick={resetRound}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2"
              >
                <RotateCcw className="h-4 w-4" />
                Play again
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            <Trophy className="h-3.5 w-3.5" />
            How it works
          </div>
          <div className="mt-4 space-y-3 text-slate-300">
            <p>1. Open the site each day.</p>
            <p>2. Solve one automatically selected puzzle.</p>
            <p>3. You get up to 5 guesses.</p>
            <p>4. Share your result with friends.</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Starter notes
          </div>
          <div className="mt-3 space-y-2 text-slate-300">
            <p>Use the built-in puzzle bank first.</p>
            <p>Add archive and streaks later.</p>
            <p>Keep version 1 simple so you can launch fast.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
