import prisma from "../utils/prisma";

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

async function main() {
  const apply = hasFlag("--apply");

  const rows = await prisma.prenom.findMany({
    where: { OR: [{ genre: null }, { genre: "" }] },
    select: { id: true, valeur: true, genre: true, cultureId: true, categorieId: true },
    orderBy: { id: "asc" },
  });

  console.log(`NomPersonnage avec genre NULL/'' : ${rows.length}`);
  for (const r of rows) {
    console.log(
      `- id=${r.id} valeur=${JSON.stringify(r.valeur)} genre=${r.genre ?? "<NULL>"} cultureId=${r.cultureId ?? "<NULL>"} categorieId=${r.categorieId ?? "<NULL>"}`,
    );
  }

  if (!apply) {
    console.log("\nAucune suppression effectuée (ajoute --apply pour supprimer).");
    return;
  }

  if (rows.length === 0) {
    console.log("\nRien à supprimer.");
    return;
  }

  const result = await prisma.prenom.deleteMany({
    where: { OR: [{ genre: null }, { genre: "" }] },
  });

  console.log(`\nSuppression effectuée: ${result.count} ligne(s) supprimée(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
