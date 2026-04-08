export function pickDailyPuzzle(puzzles, date = new Date()) {
  const dayString = date.toISOString().slice(0, 10);
  const sorted = [...puzzles].filter(p => p.publishReady !== false).sort((a, b) => a.id.localeCompare(b.id));
  if (!sorted.length) throw new Error("No puzzles available");
  const categories = ["geography", "geography", "world-events", "geography", "data-clues", "mixed", "hard"];
  const weekday = date.getUTCDay(); // 0 = Sunday
  const target = categories[weekday];
  let pool = sorted;
  if (target === "hard") {
    pool = sorted.filter(p => p.difficulty === "hard");
  } else if (target !== "mixed") {
    pool = sorted.filter(p => p.category === target);
  }
  if (!pool.length) pool = sorted;

  let hash = 0;
  for (const ch of dayString) hash = ((hash << 5) - hash) + ch.charCodeAt(0);
  const index = Math.abs(hash) % pool.length;
  return pool[index];
}
