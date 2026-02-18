import prisma from "../utils/prisma";

type SeedOptions = {
  count: number;
};

function parseCountArg(argv: string[]): number {
  const arg = argv.find((a) => a.startsWith("--count="));
  if (!arg) return 20;
  const raw = Number(arg.split("=")[1]);
  if (!Number.isFinite(raw) || raw < 1) return 20;
  return Math.min(Math.floor(raw), 500);
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildBiography(input: {
  prenom: string;
  nomFamille?: string | null;
  titre?: string | null;
  lieuHint?: string | null;
}): string {
  const fullName = [input.titre, input.prenom, input.nomFamille].filter(Boolean).join(" ");
  const place = input.lieuHint ?? "des terres frontalières";

  const hooks = [
    `${fullName} est connu(e) pour son sang-froid face au danger.`,
    `${fullName} protège les siens avec une discipline remarquable.`,
    `${fullName} s'est forgé une réputation solide auprès des guildes locales.`,
  ];

  const goals = [
    `Son objectif est de restaurer l'ordre autour de ${place}.`,
    `Son objectif est de former une nouvelle génération d'alliés fiables.`,
    `Son objectif est d'empêcher qu'une ancienne menace ne ressurgisse.`,
  ];

  const tones = [
    `On dit que son nom inspire autant la confiance que le respect.`,
    `Ses décisions difficiles font de lui/elle une figure controversée mais essentielle.`,
    `Sa loyauté n'est jamais remise en question par ses proches.`,
  ];

  return `${pickRandom(hooks)} ${pickRandom(goals)} ${pickRandom(tones)}`;
}

export async function seedPersonnages(options: SeedOptions): Promise<{ created: number }> {
  const prenoms = await prisma.prenom.findMany({
    where: { valeur: { not: null } },
    select: {
      id: true,
      valeur: true,
      genre: true,
      cultureId: true,
      categorieId: true,
      nomFamilleId: true,
      nomFamille: { select: { valeur: true } },
    },
    take: 2000,
  });

  if (prenoms.length === 0) {
    console.log("⚠️ Aucun prénom disponible. Ajoute d'abord des données dans la table Prenom.");
    return { created: 0 };
  }

  const titres = await prisma.titre.findMany({
    select: { id: true, valeur: true, genre: true, cultureId: true, categorieId: true },
    take: 2000,
  });

  const nomFamilles = await prisma.nomFamille.findMany({
    where: { valeur: { not: null } },
    select: { id: true, valeur: true, cultureId: true, categorieId: true },
    take: 2000,
  });

  const lieux = await prisma.lieux.findMany({
    select: { value: true },
    take: 500,
  });

  const payload: Array<{
    prenomId: number;
    nomFamilleId: number | null;
    titreId: number | null;
    genre: string | null;
    biographie: string;
    cultureId: number | null;
    categorieId: number | null;
  }> = [];

  for (let i = 0; i < options.count; i += 1) {
    const prenom = pickRandom(prenoms);

    const hasTitre = titres.length > 0 && Math.random() < 0.6;
    const titre = hasTitre ? pickRandom(titres) : null;

    const shouldUseExistingNomFamille = prenom.nomFamilleId != null && Math.random() < 0.8;
    const randomNomFamille = nomFamilles.length > 0 && Math.random() < 0.65 ? pickRandom(nomFamilles) : null;

    const nomFamilleId = shouldUseExistingNomFamille
      ? prenom.nomFamilleId
      : (randomNomFamille?.id ?? null);

    const nomFamilleLabel = shouldUseExistingNomFamille
      ? (prenom.nomFamille?.valeur ?? null)
      : (randomNomFamille?.valeur ?? null);

    const cultureId = prenom.cultureId ?? titre?.cultureId ?? randomNomFamille?.cultureId ?? null;
    const categorieId = prenom.categorieId ?? titre?.categorieId ?? randomNomFamille?.categorieId ?? null;
    const genre = prenom.genre ?? titre?.genre ?? null;

    payload.push({
      prenomId: prenom.id,
      nomFamilleId,
      titreId: titre?.id ?? null,
      genre,
      biographie: buildBiography({
        prenom: prenom.valeur ?? "Inconnu",
        nomFamille: nomFamilleLabel,
        titre: titre?.valeur ?? null,
        lieuHint: lieux.length > 0 ? pickRandom(lieux).value : null,
      }),
      cultureId,
      categorieId,
    });
  }

  const created = await prisma.personnage.createMany({
    data: payload,
  });

  console.log(`✅ ${created.count} personnages créés.`);
  return { created: created.count };
}

async function main() {
  const count = parseCountArg(process.argv.slice(2));
  console.log(`=== Seed Personnages (count=${count}) ===`);
  await seedPersonnages({ count });
  console.log("=== Terminé ===");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
