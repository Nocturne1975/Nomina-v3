import seedrandom from "seedrandom";

export function createRng(seed?: string) {
  const s = seed ?? String(Date.now());
  const rand = seedrandom(s);

  return {
    seed: s,
    next: () => rand(),
  };
}