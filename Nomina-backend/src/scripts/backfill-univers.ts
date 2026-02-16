import prisma from "../utils/prisma";

const UNIVERS = [
  "Tous",
  "Mythologies & Religions anciennes",
  "Civilisations & Cultures historiques",
  "Merveilles & Mystères",
  "Fantasy & Surnaturel",
  "Science-fiction & Futur",
  "Mystère, Occulte & Étrange",
  "Nature & Mondes organiques",
  "Technologie & Mondes industriels",
  "Exploration & Aventure",
  "Concepts abstraits & symboliques",
];

const MAPPINGS: Record<string, string[]> = {
  "Mythologies & Religions anciennes": [
    "Mythologie nordique",
    "Mythologie grecque",
    "Mythologie égyptienne",
    "Mythologie mésopotamienne",
    "Mythologie maya",
    "Mythologie aztèque",
    "Mythologie hindoue",
    "Mythologie celte",
    "Mythologie japonaise (shinto)",
    "Mythologie inuit",
    "Mythologie slave",
    "Mythologie phénicienne",
    "Mythologie perse",
    "Mythologie polynésienne",
  ],
  "Civilisations & Cultures historiques": [
    "Civilisation maya",
    "Civilisation inca",
    "Civilisation aztèque",
    "Empire romain",
    "Empire byzantin",
    "Dynasties chinoises",
    "Royaumes africains anciens",
    "Civilisations mésopotamiennes",
    "Tribus nomades des steppes",
    "Europe médiévale",
    "Empire ottoman",
    "Civilisation minoenne",
    "Carthage antique",
    "Japon féodal",
    "Inde médiévale",
  ],
  "Merveilles & Mystères": [
    "Merveilles du monde oubliées",
    "Cités perdues",
    "Ruines cyclopéennes",
    "Artefacts impossibles",
    "Lieux maudits ou sacrés",
    "Monuments mégalithiques",
    "Bibliothèques disparues",
    "Portails interdits",
    "Territoires effacés",
  ],
  "Fantasy & Surnaturel": [
    "Royaumes elfiques",
    "Terres naines",
    "Contrées démoniaques",
    "Forêts enchantées",
    "Ordres de mages",
    "Bestiaires fantastiques",
    "Panthéons inventés",
    "Magie du sang",
    "Royaumes aquatiques",
    "Villes flottantes",
    "Chevaliers maudits",
    "Chasseurs d’artefacts",
  ],
  "Science-fiction & Futur": [
    "Colonies spatiales",
    "Civilisations extraterrestres",
    "IA anciennes ou divines",
    "Stations orbitales",
    "Mondes post-apocalyptiques",
    "Sociétés cyberpunk",
    "Univers transhumanistes",
    "Mondes terraformés",
    "Guerres stellaires antiques",
    "Réseaux quantiques",
    "Exils spatiaux",
    "Religions techno‑cosmiques",
  ],
  "Mystère, Occulte & Étrange": [
    "Sociétés secrètes",
    "Grimoires interdits",
    "Cultes oubliés",
    "Dimensions parallèles",
    "Phénomènes inexpliqués",
    "Expériences interdites",
    "Villes fantômes",
    "Objets possédés",
    "Ordres ésotériques",
  ],
  "Nature & Mondes organiques": [
    "Forêts primordiales",
    "Archipels tropicaux",
    "Déserts vivants",
    "Montagnes sacrées",
    "Écosystèmes imaginaires",
    "Biomes conscients",
    "Rivières sacrées",
    "Archipels brumeux",
  ],
  "Technologie & Mondes industriels": [
    "Révolutions steampunk",
    "Cités industrielles",
    "Mécanismes anciens",
    "Automates et golems",
    "Laboratoires oubliés",
    "Républiques d’inventeurs",
    "Complexes miniers",
    "Réseaux d’automates",
  ],
  "Exploration & Aventure": [
    "Routes commerciales anciennes",
    "Expéditions maritimes",
    "Cartographies imaginaires",
    "Royaumes frontaliers",
    "Ports et comptoirs exotiques",
    "Routes interdites",
    "Expéditions polaires",
    "Marches sauvages",
  ],
  "Concepts abstraits & symboliques": [
    "Archétypes universels",
    "Forces cosmiques",
    "Énergies élémentaires",
    "Philosophies anciennes",
    "Cycles du monde",
  ],
};

async function main() {
  // 1) Créer / upsert les univers
  for (const name of UNIVERS) {
    await prisma.universThematique.upsert({
      where: { name },
      create: { name },
      update: {},
    });
  }

  // 2) Récupérer les IDs d’univers
  const univers = await prisma.universThematique.findMany();
  const byName = Object.fromEntries(univers.map((u) => [u.name, u.id]));

  // 3) Associer catégories -> univers
  for (const [universName, categories] of Object.entries(MAPPINGS)) {
    const universId = byName[universName];
    if (!universId) continue;

    await prisma.categorie.updateMany({
      where: { name: { in: categories } },
      data: { universId },
    });
  }

  // 4) Vérification : catégories non mappées
  const allCats = await prisma.categorie.findMany({
    select: { name: true, universId: true },
  });

  const unmapped = allCats.filter((c) => !c.universId).map((c) => c.name);

  if (unmapped.length > 0) {
    console.error("Catégories sans universId :", unmapped);
    throw new Error("Backfill incomplet : des catégories n’ont pas été mappées.");
  }

  console.log("✅ Backfill terminé : toutes les catégories ont un universId.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });