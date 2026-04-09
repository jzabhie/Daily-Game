"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  RotateCcw,
  Lightbulb,
  Globe2,
  ChartColumn,
  Sigma,
  Film,
  Trophy,
  Landmark,
  BookOpen,
  FlaskConical,
  ImageIcon,
  Sparkles,
  MapPinned,
} from "lucide-react";

function copyResult(text) {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.resolve();
}

function formatLabel(value) {
  if (!value) return "";
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function cleanAnswerLength(answer) {
  return String(answer || "").replace(/[^a-z0-9]/gi, "").length;
}

function buildHintList(puzzle) {
  const hints = [];

  if (puzzle?.hint) hints.push(puzzle.hint);
  if (puzzle?.hint2) hints.push(puzzle.hint2);
  if (puzzle?.hint3) hints.push(puzzle.hint3);

  if (puzzle?.answerGeo?.region) {
    hints.push(`Region: ${puzzle.answerGeo.region}`);
  }

  if (Array.isArray(puzzle?.tags) && puzzle.tags.length > 0) {
    hints.push(`Tags: ${puzzle.tags.slice(0, 4).map(formatLabel).join(", ")}`);
  }

  if (Array.isArray(puzzle?.options) && puzzle.options.length > 0) {
    hints.push(`One of the visible options is correct. Use elimination across ${puzzle.options.length} choices.`);
  }

  if (puzzle?.answer) {
    hints.push(
      `Answer format: starts with "${String(puzzle.answer).charAt(0).toUpperCase()}" and has ${cleanAnswerLength(
        puzzle.answer
      )} letters if spaces and punctuation are ignored.`
    );
  }

  return [...new Set(hints)].filter(Boolean);
}

function getTheme(puzzle) {
  switch (puzzle?.category) {
    case "geography":
      return {
        icon: Globe2,
        title: "Geography Clue",
        subtitle: puzzle?.answerGeo?.region || "World map challenge",
      };
    case "data-clues":
    case "economics":
      return {
        icon: ChartColumn,
        title: "Data Clue",
        subtitle: "Read the pattern carefully",
      };
    case "math":
      return {
        icon: Sigma,
        title: "Math Clue",
        subtitle: formatLabel(puzzle?.subcategory) || "Concept recognition",
      };
    case "science-tech":
      return {
        icon: FlaskConical,
        title: "Science & Tech Clue",
        subtitle: formatLabel(puzzle?.subcategory) || "Discovery or invention",
      };
    case "arts":
      return {
        icon: ImageIcon,
        title: "Art Clue",
        subtitle: formatLabel(puzzle?.subcategory) || "Artwork recognition",
      };
    case "movies":
      return {
        icon: Film,
        title: "Movie Clue",
        subtitle: formatLabel(puzzle?.subcategory) || "Film recognition",
      };
    case "sports":
      return {
        icon: Trophy,
        title: "Sports Clue",
        subtitle: formatLabel(puzzle?.subcategory) || "Sports history",
      };
    case "history-current-affairs-style":
      return {
        icon: Landmark,
        title: "History Clue",
        subtitle: formatLabel(puzzle?.subcategory) || "Timeline puzzle",
      };
    case "literature":
      return {
        icon: BookOpen,
        title: "Literature Clue",
        subtitle: formatLabel(puzzle?.subcategory) || "Book or author puzzle",
      };
    default:
      return {
        icon: Sparkles,
        title: "Puzzle Clue",
        subtitle: "Daily challenge",
      };
  }
}

function MiniTrend({ trendStyle = "steady" }) {
  let points = "8,60 40,42 72,34 104,26 136,20";

  if (trendStyle === "u-shaped") points = "8,26 40,40 72,58 104,40 136,20";
  if (trendStyle === "inverted-u") points = "8,54 40,32 72,16 104,34 136,56";
  if (trendStyle === "upward") points = "8,58 40,50 72,40 104,28 136,14";
  if (trendStyle === "downward") points = "8,16 40,28 72,40 104,50 136,60";
  if (trendStyle === "volatile") points = "8,38 32,18 56,46 80,14 104,52 136,24";
  if (trendStyle === "flat") points = "8,36 40,37 72,35 104,36 136,35";

  return (
    <svg viewBox="0 0 144 72" className="h-24 w-full rounded-2xl border border-white/10 bg-black/20 p-2">
      <line x1="10" y1="62" x2="138" y2="62" stroke="currentColor" opacity="0.25" />
      <line x1="10" y1="10" x2="10" y2="62" stroke="currentColor" opacity="0.25" />
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle cx="136" cy="20" r="3" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function VisualClueCard({ puzzle }) {
  const theme = getTheme(puzzle);
  const Icon = theme.icon;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">
            <Icon className="h-4 w-4" />
            {theme.title}
          </div>
          <h3 className="mt-3 text-xl font-semibold">{theme.subtitle}</h3>
          <p className="mt-2 text-sm text-slate-300">
            {puzzle?.visualSpec?.assetPrompt || "Use the visual and metadata clues together."}
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
          {formatLabel(puzzle?.visualType) || "Visual clue"}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          {puzzle?.visualType === "interactive-chart" ||
          puzzle?.visualType === "chart-or-text-clue" ? (
            <>
              <MiniTrend trendStyle={puzzle?.chartMeta?.trendStyle} />
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-white/10 px-2 py-1">
                  X: {puzzle?.chartMeta?.xAxis || "X Axis"}
                </span>
                <span className="rounded-full border border-white/10 px-2 py-1">
                  Y: {puzzle?.chartMeta?.yAxis || "Y Axis"}
                </span>
                {puzzle?.chartMeta?.trendStyle ? (
                  <span className="rounded-full border border-white/10 px-2 py-1">
                    Trend: {formatLabel(puzzle.chartMeta.trendStyle)}
                  </span>
                ) : null}
              </div>
            </>
          ) : puzzle?.category === "math" ? (
            <div className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-center text-lg font-semibold text-slate-100">
              ∑ · π · f(x) · P(A|B)
            </div>
          ) : puzzle?.category === "geography" ? (
            <div className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-slate-100">
              <MapPinned className="h-10 w-10" />
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-slate-100">
              <Icon className="h-10 w-10" />
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">Category</div>
            <div className="mt-1 font-medium">{formatLabel(puzzle?.category)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">Difficulty</div>
            <div className="mt-1 font-medium">{formatLabel(puzzle?.difficulty)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">Type</div>
            <div className="mt-1 font-medium">{formatLabel(puzzle?.subcategory)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">Mode</div>
            <div className="mt-1 font-medium">{formatLabel(puzzle?.mode)}</div>
          </div>
        </div>
      </div>

      {Array.isArray(puzzle?.tags) && puzzle.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {puzzle.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
            >
              #{formatLabel(tag)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function GameClient({ puzzle }) {
  const MAX_GUESSES = 5;

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [status, setStatus] = useState("playing");
  const [streak, setStreak] = useState(0);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("signalSprintStreak");
    if (saved) {
      setStreak(Number(saved));
    }
  }, []);

  const normalizedAnswer = normalize(puzzle?.answer);
  const accepted = (puzzle?.acceptedAnswers || []).map((x) => normalize(x));
  const guessesLeft = MAX_GUESSES - guesses.length;
  const progress = (guesses.length / MAX_GUESSES) * 100;
  const hints = useMemo(() => buildHintList(puzzle), [puzzle]);

  const unlockedHints = useMemo(() => {
    if (guesses.length >= 4) return 3;
    if (guesses.length >= 2) return 2;
    if (guesses.length >= 1) return 1;
    return 0;
  }, [guesses.length]);

  function submitGuess(value) {
    if (status !== "playing") return;

    const entry = String(value ?? guess).trim();
    if (!entry) return;
    if (guesses.some((g) => normalize(g) === normalize(entry))) return;

    const next = [...guesses, entry];
    setGuesses(next);
    setGuess("");

    if (normalize(entry) === normalizedAnswer || accepted.includes(normalize(entry))) {
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
    setShowHints(false);
  }

  const shareText = `SignalSprint ${new Date().toISOString().slice(0, 10)}\n${
    status === "won" ? "Solved" : "Tried"
  } in ${guesses.length}/${MAX_GUESSES}`;

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-300">Today's puzzle</div>
          <h1 className="mt-1 text-2xl font-semibold">{puzzle.prompt}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Use the visual clue, hints, tags, and answer choices together. You still get only 5 guesses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-sm text-orange-200">
            🔥 Streak: {streak}
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            {formatLabel(puzzle.category)}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <VisualClueCard puzzle={puzzle} />

          <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-yellow-200">
                <Lightbulb className="h-4 w-4" />
                <span className="font-medium">Hint section</span>
              </div>
              <button
                onClick={() => setShowHints((prev) => !prev)}
                className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-sm text-yellow-50"
              >
                {showHints ? "Hide hints" : "Show hints"}
              </button>
            </div>

            <p className="mt-3 text-sm text-slate-200">
              Hints unlock after guess 1, guess 2, and guess 4.
            </p>

            {!showHints ? null : unlockedHints === 0 ? (
              <div className="mt-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-300">
                Make your first guess to unlock the first hint.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {hints.slice(0, unlockedHints).map((hint, index) => (
                  <div
                    key={`${hint}-${index}`}
                    className="rounded-2xl border border-yellow-300/15 bg-black/15 px-4 py-3 text-sm text-yellow-50"
                  >
                    <span className="font-semibold">Hint {index + 1}:</span> {hint}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 text-sm text-slate-400">Enter your guess below.</div>
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
          </div>

          {Array.isArray(puzzle?.options) && puzzle.options.length > 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-medium text-slate-200">Answer choices</div>
              <p className="mt-1 text-sm text-slate-400">Tap a choice to fill the input quickly.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {puzzle.options.map((option) => {
                  const used = guesses.some((g) => normalize(g) === normalize(option));
                  return (
                    <button
                      key={option}
                      onClick={() => setGuess(option)}
                      disabled={status !== "playing" || used}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="grid gap-2">
            <AnimatePresence>
              {guesses.map((g, i) => {
                const correct = normalize(g) === normalizedAnswer || accepted.includes(normalize(g));
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
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold">Round status</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">Guesses left</div>
                <div className="mt-1 text-2xl font-semibold text-amber-200">{guessesLeft}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">Used</div>
                <div className="mt-1 text-2xl font-semibold">{guesses.length}/{MAX_GUESSES}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                <span>Attempt progress</span>
                <span>{guesses.length}/{MAX_GUESSES}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold">Puzzle notes</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p><span className="text-slate-400">ID:</span> {puzzle.id}</p>
              <p><span className="text-slate-400">Feedback mode:</span> {formatLabel(puzzle.feedbackMode)}</p>
              <p><span className="text-slate-400">Accepted answers:</span> {(puzzle.acceptedAnswers || []).join(", ")}</p>
              {puzzle?.explanation ? <p>{puzzle.explanation}</p> : null}
            </div>
          </div>
        </div>
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
