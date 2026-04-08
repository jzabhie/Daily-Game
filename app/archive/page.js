import puzzles from "@/data/puzzles.json";

export default function ArchivePage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold">Puzzle Archive</h1>
            <p className="mt-2 text-slate-300">
              Browse previous SignalSprint puzzle prompts.
            </p>
          </div>

          <a
            href="/"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            Back to Home
          </a>
        </div>

        <div className="grid gap-4">
          {puzzles.slice(0, 50).map((puzzle) => (
            <div
              key={puzzle.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="text-sm text-slate-400">
                {puzzle.category} • {puzzle.visualType}
              </div>
              <div className="mt-2 text-lg font-medium">{puzzle.prompt}</div>
              <div className="mt-2 text-sm text-slate-300">
                Answer: {puzzle.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
