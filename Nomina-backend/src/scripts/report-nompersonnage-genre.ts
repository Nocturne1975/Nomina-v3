import prisma from "../utils/prisma";

async function main() {
  const total = await prisma.nomPersonnage.count();
  const missing = await prisma.nomPersonnage.count({
    where: { OR: [{ genre: null }, { genre: "" }] },
  });

  const distinct = await prisma.nomPersonnage.findMany({
    distinct: ["genre"],
    select: { genre: true },
  });

  console.log(`Total NomPersonnage: ${total}`);
  console.log(`Missing genre (NULL or empty): ${missing}`);

  console.log("\nValeurs distinctes de genre:");
  for (const d of distinct) {
    console.log(`- ${d.genre ?? "<NULL>"}`);
  }

  // Petit regroupement par valeur (SQL simple)
  const grouped = await prisma.$queryRaw<
    Array<{ genre: string | null; count: bigint }>
  >`SELECT "genre", COUNT(*)::bigint AS count FROM "NomPersonnage" GROUP BY "genre" ORDER BY count DESC, "genre" ASC`;

  console.log("\nRépartition:");
  for (const g of grouped) {
    console.log(`- ${g.genre ?? "<NULL>"}: ${g.count.toString()}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
