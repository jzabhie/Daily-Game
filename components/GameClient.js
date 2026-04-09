"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, RotateCcw, Lightbulb } from "lucide-react";

function copyResult(text) {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.resolve();
}

function formatLabel(value) {
  if (!value) return "";
  return String(value)
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildHints(puzzle) {
  const hints = [];

  if (puzzle?.hint) hints.push(puzzle.hint);
  if (puzzle?.hint2) hints.push(puzzle.hint2);
  if (puzzle?.hint3) hints.push(puzzle.hint3);

  if (!hints.length && puzzle?.subcategory) {
    hints.push(`This puzzle is a ${formatLabel(puzzle.subcategory)} clue.`);
  }
  if (hints.length < 2 && puzzle?.answerGeo?.region) {
    hints.push(`The answer is connected to ${puzzle.answerGeo.region}.`);
  }
  if (hints.length < 3 && Array.isArray(puzzle?.tags) && puzzle.tags.length) {
    hints.push(`Related tags: ${puzzle.tags.slice(0, 2).map(formatLabel).join(", ")}.`);
  }

  return [...new Set(hints)].slice(0, 3);
}

function getChartPoints(trendStyle = "steady") {
  switch (String(trendStyle).toLowerCase()) {
    case "rising":
      return "10,72 28,66 46,58 64,49 82,39 100,28 118,18";
    case "falling":
      return "10,18 28,28 46,37 64,47 82,56 100,65 118,73";
    case "volatile":
      return "10,48 28,24 46,61 64,34 82,69 100,26 118,50";
    case "u-shaped":
      return "10,24 28,37 46,54 64,67 82,55 100,39 118,23";
    case "flat-then-jumping":
      return "10,60 28,59 46,58 64,58 82,56 100,34 118,16";
    case "flat":
      return "10,48 28,48 46,47 64,48 82,47 100,48 118,47";
    case "steady":
    default:
      return "10,55 28,53 46,51 64,49 82,47 100,45 118,43";
  }
}

function MiniChart({ chartMeta }) {
  const points = getChartPoints(chartMeta?.trendStyle);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <svg viewBox="0 0 130 90" className="h-56 w-full">
        <line x1="10" y1="80" x2="122" y2="80" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
        <line x1="10" y1="80" x2="10" y2="10" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />

        <line x1="10" y1="20" x2="122" y2="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="10" y1="40" x2="122" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="10" y1="60" x2="122" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        <polyline
          fill="none"
          stroke="rgb(34 211 238)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {points.split(" ").map((pt, idx) => {
          const [cx, cy] = pt.split(",");
          return <circle key={idx} cx={cx} cy={cy} r="2.7" fill="rgb(103 232 249)" />;
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <div>
          <span className="text-slate-400">X-axis:</span> {chartMeta?.xAxis || "Year"}
        </div>
        <div>
          <span className="text-slate-400">Y-axis:</span> {chartMeta?.yAxis || "Indicator"}
        </div>
      </div>
    </div>
  );
}

function MapCard({ puzzle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)] px-6 text-center">
        <div>
          <div className="text-lg font-semibold text-white">Map / outline clue</div>
          <div className="mt-3 text-sm leading-6 text-slate-300">
            {puzzle?.visualSpec?.assetPrompt || "A map or outline clue appears here."}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageCard({ puzzle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] px-6 text-center">
        <div>
          <div className="text-lg font-semibold text-white">Image / lab clue</div>
          <div className="mt-3 text-sm leading-6 text-slate-300">
            {puzzle?.visualSpec?.assetPrompt || "An image clue appears here."}
          </div>
        </div>
      </div>
    </div>
  );
}

function TextClueCard({ puzzle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-slate-300">
        {puzzle?.visualSpec?.assetPrompt || "A clue card appears here for this puzzle."}
      </div>
    </div>
  );
}

function VisualClue({ puzzle }) {
  const visualType = String(puzzle?.visualType || "").toLowerCase();
  const subcategory = String(puzzle?.subcategory || "").toLowerCase();
  const assetPrompt = puzzle?.visualSpec?.assetPrompt || "";
  const tags = Array.isArray(puzzle?.tags) ? puzzle.tags.map((t) => String(t).toLowerCase()) : [];

  const isChart =
    visualType.includes("chart") ||
    subcategory.includes("chart") ||
    tags.includes("chart") ||
    Boolean(puzzle?.chartMeta);

  const isMap =
    visualType.includes("map") ||
    visualType.includes("outline") ||
    subcategory.includes("country-outline") ||
    assetPrompt.toLowerCase().includes("outline map");

  const isImage =
    visualType.includes("image") ||
    visualType.includes("lab") ||
    visualType.includes("object") ||
    assetPrompt.toLowerCase().includes("diagram") ||
    assetPrompt.toLowerCase().includes("lab");

  return (
    <div className="mb-6 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Visual clue
          </div>
          <div className="mt-1 text-lg font-semibold text-white">
            {isChart
              ? "Chart clue"
              : isMap
              ? "Map / outline clue"
              : isImage
              ? "Image clue"
              : "Clue card"}
          </div>
        </div>

        {isChart && (
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
            {formatLabel(puzzle?.chartMeta?.trendStyle || "trend")}
          </div>
        )}
      </div>

      {isChart ? (
        <MiniChart chartMeta={puzzle?.chartMeta} />
      ) : isMap ? (
        <MapCard puzzle={puzzle} />
      ) : isImage ? (
        <ImageCard puzzle={puzzle} />
      ) : (
        <TextClueCard puzzle={puzzle} />
      )}
    </div>
  );
}

export default function GameClient({ puzzle }) {
  const MAX_GUESSES = 5;

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [status, setStatus] = useState("playing");
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("signalSprintStreak");
    if (saved) {
      setStreak(Number(saved));
    }
  }, []);

  const normalizedAnswer = puzzle.answer.toLowerCase();
  const accepted = puzzle.acceptedAnswers?.map((x) => x.toLowerCase()) || [];
  const guessesLeft = MAX_GUESSES - guesses.length;
  const hints = useMemo(() => buildHints(puzzle), [puzzle]);

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
    setShowHint(false);
  }

  const hintUnlockText =
    guesses.length === 0
      ? "Hints unlock after guess 1, guess 2, and guess 4."
      : guesses.length === 1
      ? "Hint 1 is now available."
      : guesses.length === 2 || guesses.length === 3
      ? "Hints 1 and 2 are now available."
      : "All hints are now available.";

  const visibleHints =
    guesses.length >= 4
      ? hints.slice(0, 3)
      : guesses.length >= 2
      ? hints.slice(0, 2)
      : guesses.length >= 1
      ? hints.slice(0, 1)
      : [];

  const shareText = `SignalSprint ${new Date().toISOString().slice(0, 10)}
${status === "won" ? "Solved" : "Tried"} in ${guesses.length}/${MAX_GUESSES}`;

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-300">Today's puzzle</div>
          <h1 className="mt-1 text-2xl font-semibold">{puzzle.prompt}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-sm text-orange-200">
            🔥 Streak: {streak}
          </div>
        </div>
      </div>

      <VisualClue puzzle={puzzle} />

      <div className="mb-2 text-sm text-slate-400">
        Enter your guess below.
      </div>

      <div className="flex flex-col gap-3">
        <input
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder:text-slate-500"
          placeholder="Type your guess..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitGuess()}
          disabled={status !== "playing"}
        />

        <button
          onClick={() => submitGuess()}
          disabled={status !== "playing"}
          className="h-14 w-full rounded-[28px] bg-white px-5 text-xl font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Guess
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-yellow-200">
            <Lightbulb className="h-5 w-5" />
            <span className="text-lg font-semibold">Hint section</span>
          </div>

          <button
            onClick={() => setShowHint((prev) => !prev)}
            className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-100"
          >
            {showHint ? "Hide hints" : "Show hints"}
          </button>
        </div>

        {!showHint ? (
          <p className="mt-4 text-sm leading-7 text-slate-200">
            {hintUnlockText}
          </p>
        ) : visibleHints.length > 0 ? (
          <div className="mt-4 space-y-2">
            {visibleHints.map((hint, index) => (
              <div
                key={`${hint}-${index}`}
                className="rounded-xl border border-yellow-400/10 bg-black/10 px-3 py-3 text-sm text-yellow-50"
              >
                Hint {index + 1}: {hint}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-7 text-slate-200">
            {hintUnlockText}
          </p>
        )}
      </div>

      {Array.isArray(puzzle.options) && puzzle.options.length > 0 ? (
        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Answer choices</h2>
          <p className="mt-2 text-slate-300">
            Tap a choice to fill the input quickly.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {puzzle.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGuess(option)}
                disabled={status !== "playing"}
                className="rounded-full border border-white/10 bg-black/10 px-5 py-3 text-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">Round status</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
            <div className="text-sm uppercase tracking-wide text-slate-400">
              Guesses left
            </div>
            <div className="mt-2 text-5xl font-bold text-amber-300">
              {guessesLeft}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
            <div className="text-sm uppercase tracking-wide text-slate-400">
              Used
            </div>
            <div className="mt-2 text-5xl font-bold text-white">
              {guesses.length}/{MAX_GUESSES}
            </div>
          </div>
        </div>
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
          <p className="mt-2 text-slate-300">
            {puzzle.explanation || puzzle.funFact || "Come back tomorrow for a new puzzle."}
          </p>
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
