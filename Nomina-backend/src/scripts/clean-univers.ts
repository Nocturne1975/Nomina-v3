import prisma from "../utils/prisma";

type UniversRow = {
  id: number;
  name: string;
};

const shouldApply = process.argv.includes("--apply");

const cleanName = (value: string): string =>
  value
    .replace(/\\[tnr]/g, " ")
    .replace(/\\+/g, " ")
    .replace(/[\t\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const keyOf = (value: string): string => cleanName(value).toLocaleLowerCase("fr-CA");

async function main() {
  const univers = await prisma.universThematique.findMany({
    select: { id: true, name: true },
    orderBy: { id: "asc" },
  });

  const groups = new Map<string, UniversRow[]>();
  for (const item of univers) {
    const key = keyOf(item.name);
    const arr = groups.get(key);
    if (arr) arr.push(item);
    else groups.set(key, [item]);
  }

  const renameOnly: Array<{ id: number; from: string; to: string }> = [];
  const mergeGroups: Array<{
    key: string;
    canonical: UniversRow;
    canonicalCleanName: string;
    duplicates: UniversRow[];
  }> = [];

  for (const [key, items] of groups.entries()) {
    const sorted = [...items].sort((a, b) => a.id - b.id);
    const canonical = sorted[0];
    const canonicalCleanName = cleanName(canonical.name);

    if (sorted.length > 1) {
      mergeGroups.push({
        key,
        canonical,
        canonicalCleanName,
        duplicates: sorted.slice(1),
      });
      continue;
    }

    if (canonical.name !== canonicalCleanName) {
      renameOnly.push({
        id: canonical.id,
        from: canonical.name,
        to: canonicalCleanName,
      });
    }
  }

  console.log(`Univers total: ${univers.length}`);
  console.log(`Renommages simples: ${renameOnly.length}`);
  console.log(`Groupes de doublons à fusionner: ${mergeGroups.length}`);

  if (renameOnly.length > 0) {
    console.log("\n--- Renommages ---");
    for (const r of renameOnly) {
      console.log(`#${r.id}: ${JSON.stringify(r.from)} -> ${JSON.stringify(r.to)}`);
    }
  }

  if (mergeGroups.length > 0) {
    console.log("\n--- Fusions ---");
    for (const g of mergeGroups) {
      const dupList = g.duplicates.map((d) => `#${d.id} ${JSON.stringify(d.name)}`).join(" ; ");
      console.log(
        `[${g.key}] canonique #${g.canonical.id} ${JSON.stringify(g.canonical.name)} -> ${JSON.stringify(g.canonicalCleanName)} | doublons: ${dupList}`
      );
    }
  }

  if (!shouldApply) {
    console.log("\nMode aperçu. Relance avec --apply pour appliquer les changements.");
    return;
  }

  for (const r of renameOnly) {
    await prisma.universThematique.update({
      where: { id: r.id },
      data: { name: r.to },
    });
  }

  for (const g of mergeGroups) {
    await prisma.$transaction(async (tx) => {
      for (const dup of g.duplicates) {
        await tx.categorie.updateMany({
          where: { universId: dup.id },
          data: { universId: g.canonical.id },
        });
      }

      for (const dup of g.duplicates) {
        await tx.universThematique.delete({ where: { id: dup.id } });
      }

      const refreshedCanonical = await tx.universThematique.findUnique({
        where: { id: g.canonical.id },
        select: { name: true },
      });

      if (refreshedCanonical && refreshedCanonical.name !== g.canonicalCleanName) {
        await tx.universThematique.update({
          where: { id: g.canonical.id },
          data: { name: g.canonicalCleanName },
        });
      }
    });
  }

  const after = await prisma.universThematique.findMany({
    select: { id: true, name: true },
    orderBy: { id: "asc" },
  });

  const afterKeys = new Set<string>();
  let afterDupCount = 0;
  let afterWeirdCount = 0;

  for (const u of after) {
    const clean = cleanName(u.name);
    if (u.name !== clean) afterWeirdCount++;
    const key = clean.toLocaleLowerCase("fr-CA");
    if (afterKeys.has(key)) afterDupCount++;
    else afterKeys.add(key);
  }

  console.log("\n✅ Nettoyage appliqué.");
  console.log(`Univers restants: ${after.length}`);
  console.log(`Valeurs encore 'weird': ${afterWeirdCount}`);
  console.log(`Doublons normalisés restants: ${afterDupCount}`);
}

main()
  .catch((error) => {
    console.error("❌ Erreur nettoyage univers:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
