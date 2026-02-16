import prisma from "../utils/prisma";
import { concepts } from "./data/concepts";

export type ImportConceptsOptions = {
  apply?: boolean;
};

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function importConcepts(options: ImportConceptsOptions = {}) {
  const apply = options.apply ?? false;

  const parsed = concepts;
  const values = parsed.map((c) => c.valeur);

  // Charger les existants (par valeur) en chunks pour éviter un IN énorme.
  const existing = new Set<string>();
  for (const batch of chunk(values, 200)) {
    const rows = await prisma.concept.findMany({
      where: { valeur: { in: batch } },
      select: { valeur: true },
    });

    for (const r of rows) existing.add(r.valeur.toLowerCase());
  }

  const toInsert = parsed.filter((c) => !existing.has(c.valeur.toLowerCase()));

  console.log("--- Import concepts ---");
  console.log(`Concepts détectés: ${parsed.length}`);
  console.log(`Nouveaux concepts à insérer: ${toInsert.length}`);

  if (!apply) {
    console.log("Mode DRY-RUN (aucune insertion). Ajoute --apply pour insérer.");
    for (const c of toInsert.slice(0, 10)) {
      console.log(`+ ${c.valeur}${c.type ? ` (type=${c.type})` : ""}`);
    }
    if (toInsert.length > 10) console.log(`… +${toInsert.length - 10} autres`);
    return;
  }

  let inserted = 0;
  for (const c of toInsert) {
    await prisma.concept.create({
      data: {
        valeur: c.valeur,
        type: c.type ?? null,
        mood: c.mood ?? null,
        keywords: c.keywords ?? null,
      },
    });
    inserted++;
  }

  console.log(`Insertion terminée: ${inserted} concepts ajoutés.`);
}

async function main() {
  const apply = hasFlag("apply");
  await importConcepts({ apply });
}

if (require.main === module) {
  main()
    .catch((err) => {
      console.error("Import concepts: erreur", err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
