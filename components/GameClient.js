"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, RotateCcw } from "lucide-react";

function copyResult(text) {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.resolve();
}

export default function GameClient({ puzzle }) {
  const MAX_GUESSES = 10;

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
  const accepted = puzzle.acceptedAnswers?.map((x) => x.toLowerCase()) || [];
  const guessesLeft = MAX_GUESSES - guesses.length;

  function submitGuess(value) {
    if (status !== "playing") return;

    const entry = (value ?? guess).trim();
    if (!entry) return;
    if (guesses.some((g) => g.toLowerCase() === entry.toLowerCase())) return;

    const next = [...guesses, entry];
    setGuesses(next);
    setGuess("");

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

    if (next.length >= MAX_GUESSES) {
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
${status === "won" ? "Solved" : "Tried"} in ${guesses.length}/${MAX_GUESSES}`;

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-300">Today's puzzle</div>
          <h1 className="mt-1 text-2xl font-semibold">{puzzle.prompt}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
              Total guesses: {MAX_GUESSES}
            </div>
            <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm text-amber-200">
              Guesses left: {guessesLeft}
            </div>
          </div>
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

      <div className="mb-2 text-sm text-slate-400">
        Enter your guess below.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder:text-slate-500"
          placeholder="Type your guess..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitGuess()}
          disabled={status !== "playing"}
        />
        <button
          onClick={() => submitGuess()}
          disabled={status !== "playing"}
          className="h-12 rounded-2xl bg-white px-5 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Guess
        </button>
      </div>

      <div className="mt-6 grid gap-2">
        <AnimatePresence>
          {guesses.map((g, i) => {
            const correct =
              g.toLowerCase() === normalizedAnswer ||
              accepted.includes(g.toLowerCase());

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
  );
}
