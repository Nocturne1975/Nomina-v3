import prisma from "../utils/prisma";

type UnknownMode = "keep" | "nb" | "null";

function parseArgs(argv: string[]) {
  const out: Record<string, string> = {};
  for (const raw of argv) {
    if (!raw.startsWith("--")) continue;
    const eq = raw.indexOf("=");
    if (eq === -1) out[raw.slice(2)] = "true";
    else out[raw.slice(2, eq)] = raw.slice(eq + 1);
  }
  return out;
}

function canonicalizeGenre(input: string): "M" | "F" | "NB" | undefined {
  const raw = input.trim();
  if (!raw) return undefined;
  const lc = raw.toLowerCase();

  if (["m", "masculin", "male", "homme"].includes(lc)) return "M";
  if (["f", "féminin", "feminin", "female", "femme"].includes(lc)) return "F";
  if (["nb", "non-binaire", "non binaire", "nonbinaire", "neutre", "neutral"].includes(lc)) return "NB";

  // Déjà canonical
  if (raw === "M" || raw === "F" || raw === "NB") return raw;

  return undefined;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const dryRun = args["dry-run"] === "true" || args.dryRun === "true";
  const unknown = (args.unknown ?? "keep") as UnknownMode;

  if (!(["keep", "nb", "null"] as const).includes(unknown)) {
    throw new Error(`Invalid --unknown. Use keep|nb|null (got: ${unknown})`);
  }

  const rows = await prisma.prenom.findMany({
    select: { id: true, valeur: true, genre: true },
    orderBy: { id: "asc" },
  });

  const updates: Array<{ id: number; from: string | null; to: string | null; valeur: string | null }> = [];
  const unknownValues = new Map<string, number>();

  for (const r of rows) {
    const from = r.genre;

    if (from === null) continue;
    if (from.trim() === "") continue;

    const canonical = canonicalizeGenre(from);
    if (canonical) {
      if (canonical !== from) {
        updates.push({ id: r.id, from, to: canonical, valeur: r.valeur ?? null });
      }
      continue;
    }

    // Valeur inconnue
    unknownValues.set(from, (unknownValues.get(from) ?? 0) + 1);
    if (unknown === "keep") continue;
    if (unknown === "nb") updates.push({ id: r.id, from, to: "NB", valeur: r.valeur ?? null });
    if (unknown === "null") updates.push({ id: r.id, from, to: null, valeur: r.valeur ?? null });
  }

  console.log(`Total rows: ${rows.length}`);
  console.log(`Planned updates: ${updates.length}`);
  console.log(`Unknown mode: ${unknown}`);
  console.log(`Dry-run: ${dryRun}`);

  if (unknownValues.size > 0) {
    console.log("\nUnknown genre values (top 20):");
    const top = Array.from(unknownValues.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    for (const [val, count] of top) {
      console.log(`- '${val}': ${count}`);
    }
  }

  console.log("\nPreview updates (first 15):");
  for (const u of updates.slice(0, 15)) {
    console.log(`- #${u.id} '${u.valeur ?? ""}'  ${u.from} => ${u.to}`);
  }

  if (dryRun || updates.length === 0) return;

  const batchSize = 250;
  let done = 0;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    await prisma.$transaction(
      batch.map((u) =>
        prisma.prenom.update({
          where: { id: u.id },
          data: { genre: u.to },
        })
      )
    );
    done += batch.length;
    console.log(`Updated ${done}/${updates.length}...`);
  }

  console.log(`✅ Done. Updated ${done} rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
