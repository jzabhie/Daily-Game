import puzzles from "@/data/puzzles.json";

export default function Archive() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white p-10">
      <h1 className="text-3xl font-semibold mb-6">Puzzle Archive</h1>

      <div className="grid gap-3">
        {puzzles.slice(0, 50).map((p) => (
          <div key={p.id} className="border border-white/10 p-4 rounded-xl">
            <div className="text-sm text-slate-400">{p.category}</div>
            <div className="text-lg">{p.prompt}</div>
            <div className="text-sm text-slate-300 mt-2">
              Answer: {p.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
