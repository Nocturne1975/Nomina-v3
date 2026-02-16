import prisma from "../utils/prisma";
import { fragmentsHistoire } from "./data/fragments-histoire";

export type ImportFragmentsHistoireOptions = {
  apply?: boolean;
};

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

export async function importFragmentsHistoire(options: ImportFragmentsHistoireOptions = {}) {
  const apply = options.apply ?? false;

  console.log("--- Import fragments d'histoire ---");

  const textes = fragmentsHistoire.map((f) => f.texte);

  // Dédupe simple par texte (pas de contrainte unique en DB)
  const existing = new Set<string>();
  const rows = await prisma.fragmentsHistoire.findMany({
    where: { texte: { in: textes } },
    select: { texte: true },
  });
  for (const r of rows) existing.add(r.texte);

  const toInsert = fragmentsHistoire.filter((f) => !existing.has(f.texte));

  console.log(`Fragments détectés: ${fragmentsHistoire.length}`);
  console.log(`Nouveaux fragments à insérer: ${toInsert.length}`);

  if (!apply) {
    console.log("Mode DRY-RUN (aucune insertion). Ajoute --apply pour insérer.");
    for (const f of toInsert.slice(0, 10)) {
      console.log(`+ ${f.texte.slice(0, 80)}${f.texte.length > 80 ? "…" : ""}`);
    }
    if (toInsert.length > 10) console.log(`… +${toInsert.length - 10} autres`);
    return;
  }

  // On ajoute quelques fragments "ciblés" sur une culture/catégorie si elles existent,
  // pour que les filtres cultureId/categorieId puissent aussi retourner des résultats.
  const firstCulture = await prisma.culture.findFirst({ orderBy: { id: "asc" } });
  const firstCategorie = await prisma.categorie.findFirst({ orderBy: { id: "asc" } });

  let inserted = 0;

  for (const f of toInsert) {
    await prisma.fragmentsHistoire.create({
      data: {
        texte: f.texte,
        appliesTo: f.appliesTo ?? null,
        genre: f.genre ?? null,
        minNameLength: f.minNameLength ?? null,
        maxNameLength: f.maxNameLength ?? null,
        cultureId: null,
        categorieId: null,
      },
    });
    inserted++;
  }

  // Fragments supplémentaires ciblés (idempotents via texte distinct)
  const targeted: Array<{ texte: string; cultureId?: number | null; categorieId?: number | null }> = [];

  if (firstCulture) {
    targeted.push(
      {
        texte: "Dans cette culture, les anciens disent qu'un nom mal prononcé peut attirer des années de malchance.",
        cultureId: firstCulture.id,
      },
      {
        texte: "Le rite de passage laisse une marque discrète; ceux qui la portent sont reconnus sans un mot.",
        cultureId: firstCulture.id,
      }
    );
  }

  if (firstCategorie) {
    targeted.push(
      {
        texte: "Dans cette catégorie d'univers, un secret se transmet en silence: par gestes et par regards.",
        categorieId: firstCategorie.id,
      },
      {
        texte: "On raconte que le symbole de cette catégorie n'a pas été créé… il a été découvert.",
        categorieId: firstCategorie.id,
      }
    );
  }

  if (firstCulture && firstCategorie) {
    targeted.push({
      texte: "Ici, les traditions et l'univers se heurtent: un compromis fragile maintient la paix depuis des générations.",
      cultureId: firstCulture.id,
      categorieId: firstCategorie.id,
    });
  }

  for (const t of targeted) {
    const exists = await prisma.fragmentsHistoire.findFirst({ where: { texte: t.texte }, select: { id: true } });
    if (exists) continue;
    await prisma.fragmentsHistoire.create({
      data: {
        texte: t.texte,
        appliesTo: "univers",
        genre: null,
        cultureId: t.cultureId ?? null,
        categorieId: t.categorieId ?? null,
      },
    });
    inserted++;
  }

  console.log(`Insertion terminée: ${inserted} fragments ajoutés.`);
}

async function main() {
  const apply = hasFlag("apply");
  await importFragmentsHistoire({ apply });
}

if (require.main === module) {
  main()
    .catch((err) => {
      console.error("Import fragments d'histoire: erreur", err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
