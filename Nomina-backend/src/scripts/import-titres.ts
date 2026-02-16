import prisma from "../utils/prisma";

type ImportTitre = {
  valeur: string;
  type: string | null;
  genre: string | null;
};

export type ImportTitresOptions = {
  apply?: boolean;
  source?: string;
  defaultCultureId?: number | null;
  defaultCategorieId?: number | null;
};

const DEFAULT_SOURCE = `✅ TITRES RÉELS (emplois & fonctions)
Administration & État
Ministre
Secrétaire d’État
Préfet
Sous-préfet
Gouverneur
Haut-commissaire
Conseiller
Conseillère
Directeur
Directrice
Inspecteur
Inspectrice
Procureur
Procureure
Magistrat
Magistrate
Juge
Juge d’instruction
Greffier
Greffière
Huissier
Huissière
Armée & sécurité
Général
Générale
Colonel
Colonelle
Commandant
Commandante
Capitaine
Capitaine de vaisseau
Sergent
Major
Lieutenant
Officier
Officier supérieur
Gendarme
Policier
Gardien de la paix
Officier de renseignement
Médecine & santé
Médecin
Chirurgien
Chirurgienne
Infirmier
Infirmière
Pharmacien
Pharmacienne
Sage-femme
Médecin-chef
Psychiatre
Radiologue
Éducation & recherche
Professeur
Professeure
Maître de conférences
Chercheur
Chercheuse
Docteur
Docteure
Recteur
Rectrice
Doyen
Doyenne
Bibliothécaire
Technique & industrie
Ingénieur
Ingénieure
Architecte
Urbaniste
Technicien
Technicienne
Chef de projet
Analyste
Développeur
Développeuse
Data scientist
Responsable cybersécurité
✅ TITRES MÉDIÉVAUX
Seigneur
Dame
Chevalier
Écuyer
Comte
Comtesse
Baron
Baronne
Marquise
Duc
Duchesse
Sénéchal
Bailli
Châtelain
Châtelaine
Connétable
Maréchal
✅ FANTASY NOIRE
Seigneur des Ombres
Dame des Cendres
Gardien du Néant
Maître des Serments Sombres
Émissaire du Voile
Oracle de la Nuit
Margrave du Sang
Porte-Épée Noire
Prélat des Abîmes
Scelleur des Âmes
✅ ANTIQUE
Consul
Proconsul
Sénateur
Tribun
Préteur
Censeur
Dictateur
Augure
Pontife
Vestale
Stratège
Archonte
Hiérophante
✅ ORIENTAL
Vizir
Grand Vizir
Émir
Émirah
Sultan
Sultane
Pacha
Bey
Caïd
Grand Mufti
Sherif
Hakim
Qadi
✅ STEAMPUNK
Archi-Mécaniste
Seigneur des Pistons
Capitaine du Dirigeable
Maître-Engreneur
Baron du Fumoir
Commissaire à la Vapeur
Gardien des Chaudières
Magister des Pressions
Ingénieur impérial
Contrôleur des Horloges
✅ FUTURISTE / SF
Commandant orbital
Gouverneur stellaire
Amiral des Flottes
Capitaine de station
Architecte quantique
Officier cybernétique
Analyste de singularité
Ministre de l’IA
Régent de la Colonie
Gardien des Portails
✅ DRACONIQUE
Seigneur des Écailles
Gardien des Nids
Maître du Souffle
Prélat du Dragon
Héraut des Flammèches
Prince Draconique
Maréchal des Cendres
Chancelier du Vol
Protecteur du Pacte Draconique
Oracle des Ailes
✅ RELIGIEUX
Abbé
Abbesse
Prieur
Prieure
Évêque
Archevêque
Cardinal
Chanoine
Grand Inquisiteur
Grand Aumônier
Patriarche
Matriarche
✅ MARITIME
Amiral
Capitaine de flotte
Maître de port
Pilote en chef
Vigie
Quartier-maître
Capitaine de corsaire
Seigneur des Mers
Gardien des Marées
Commandant du Phare
✅ POLICIER / ENQUÊTE
Inspecteur
Inspectrice
Commissaire
Commandant
Capitaine de police
Lieutenant
Sergent
Enquêteur
Enquêtrice
Chef d’unité
Analyste criminel
Criminologue
Procureur
Procureure
Agent spécial
Officier judiciaire
Profiler
✅ MAFIA / CRIME ORGANISÉ
Parrain
Marraine
Capo
Caporegime
Don
Consigliere
Sous‑chef
Boss
Bras droit
Exécuteur
Comptable du clan
Trésorier du clan
Lieutenant du cartel
Chef de famille
Chef de clan
Émissaire
Négociateur
✅ MYTHOLOGIE
Grand Oracle
Oracle des Dieux
Prêtresse du Temple
Prêtre du Temple
Héraut des Cieux
Messager divin
Gardien des Moires
Seigneur Olympien
Dame Olympienne
Titan
Titanide
Archonte sacré
Élu des Anciens
Gardienne des Runes
Gardien du Panthéon
✅ POST‑APOCALYPTIQUE
Chef de clan
Seigneur des Ruines
Dame des Ruines
Gardien de l’Eau
Gardienne de l’Eau
Maître des Forteresses
Maîtresse des Forteresses
Capitaine des Pillards
Commandant de l’Avant‑poste
Protecteur des Terres
Protectrice des Terres
Seigneur du Dôme
Dame du Dôme
Éclaireur
Éclaireuse
Archiviste du Vieux Monde
✅ AUTRES THÈMES (bonus)
Espionnage
Agent double
Directeur des Opérations
Contrôleur de terrain
Analyste du renseignement
Chef de cellule
Cyberpunk
Netrunner
Fixeur
Seigneur des Grid
Maître des Réseaux
Architecte de données
Western
Shérif
Maréchal
Ranger
Chef de poste
Pistolero
`;

function normalizeLine(input: string) {
  return input
    .replace(/\u00A0/g, " ") // nbsp
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDash(input: string) {
  return input.replace(/[‐‑‒–—]/g, "-");
}

function guessGenre(valeurRaw: string): string | null {
  const valeur = valeurRaw.trim().toLowerCase();

  // Très explicites
  const feminineExact = new Set([
    "madame",
    "mademoiselle",
    "princesse",
    "reine",
    "duchesse",
    "comtesse",
    "baronne",
    "marquise",
    "vicomtesse",
    "archiduchesse",
    "abbesse",
    "prieure",
    "prêtresse",
    "matriarche",
    "châtelaine",
    "chancelière",
    "inspectrice",
    "procureure",
    "directrice",
    "conseillère",
    "magistrate",
    "rectrice",
    "doyenne",
    "chercheuse",
    "docteure",
    "ingénieure",
    "technicienne",
    "développeuse",
    "enquêtrice",
    "marraine",
    "titanide",
    "éclaireuse",
    "gardienne",
    "protectrice",
    "maîtresse",
    "grande",
  ]);

  if (feminineExact.has(valeur)) return "feminin";

  // Mot-clé féminin/masculin dans la valeur (ex: "Gardienne ...")
  if (/(^|\s)(gardienne|protectrice|maîtresse|princesse|reine|duchesse|comtesse|baronne|marquise|titanide|prêtresse)(\s|$)/i.test(valeurRaw)) {
    return "feminin";
  }
  if (/(^|\s)(monsieur|seigneur|prince|roi|duc|comte|baron|prêtre|abbé|patriarche)(\s|$)/i.test(valeurRaw)) {
    return "masculin";
  }

  // Suffixes féminins fréquents (heuristique)
  if (/(esse|onne|tesse|trice|euse|ière|ienne|aine|esse|esse)$/i.test(valeur)) {
    return "feminin";
  }

  return null;
}

function parseTitres(source: string): ImportTitre[] {
  const lines = source
    .split(/\r?\n/g)
    .map((l) => normalizeLine(normalizeDash(l)))
    .filter(Boolean);

  let topType: string | null = null;
  let currentType: string | null = null;

  const out: ImportTitre[] = [];

  for (const raw of lines) {
    if (raw.startsWith("✅")) {
      topType = normalizeLine(raw.replace(/^✅+\s*/, ""));
      currentType = topType;
      continue;
    }

    // Heuristique sous-section: très utile pour "Administration & État", etc.
    const isSubSection =
      topType !== null &&
      /[&/]/.test(raw) &&
      raw.length <= 60 &&
      raw.split(" ").length <= 6 &&
      !/\b(de|des|du|d'|d’|la|le|les)\b/i.test(raw);

    if (isSubSection) {
      currentType = `${topType} — ${raw}`;
      continue;
    }

    const valeur = raw;
    out.push({
      valeur,
      type: currentType,
      genre: guessGenre(valeur),
    });
  }

  // Dédoublonnage interne (par type+valeur)
  const seen = new Set<string>();
  return out.filter((t) => {
    const k = `${t.type ?? ""}::${t.valeur.toLowerCase()}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function getArgValue(name: string): string | undefined {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function importTitres(options: ImportTitresOptions = {}) {
  const apply = options.apply ?? false;
  const defaultCultureId = options.defaultCultureId ?? null;
  const defaultCategorieId = options.defaultCategorieId ?? null;

  const source = options.source ?? DEFAULT_SOURCE;
  const parsed = parseTitres(source);

  const types = Array.from(new Set(parsed.map((t) => t.type).filter((t): t is string => Boolean(t))));

  // Charger les existants (par type+valeur) en chunks pour éviter des IN énormes.
  const existingKey = new Set<string>();
  const byType = new Map<string | null, ImportTitre[]>();

  for (const t of parsed) {
    const list = byType.get(t.type) ?? [];
    list.push(t);
    byType.set(t.type, list);
  }

  for (const [type, items] of byType.entries()) {
    const valeurs = items.map((t) => t.valeur);
    for (const batch of chunk(valeurs, 200)) {
      const rows = await prisma.titre.findMany({
        where: {
          type: type ?? null,
          valeur: { in: batch },
        },
        select: { id: true, type: true, valeur: true },
      });

      for (const r of rows) {
        existingKey.add(`${r.type ?? ""}::${r.valeur.toLowerCase()}`);
      }
    }
  }

  const toInsert = parsed.filter((t) => !existingKey.has(`${t.type ?? ""}::${t.valeur.toLowerCase()}`));

  console.log("--- Import titres ---");
  console.log(`Titres détectés: ${parsed.length}`);
  console.log(`Types détectés: ${types.length}`);
  console.log(`Nouveaux titres à insérer: ${toInsert.length}`);
  if (!apply) {
    console.log("Mode DRY-RUN (aucune insertion). Ajoute --apply pour insérer.");
  }

  if (toInsert.length === 0) return;

  if (!apply) {
    // Affiche un mini aperçu
    for (const t of toInsert.slice(0, 10)) {
      console.log(`+ [${t.type ?? "(sans type)"}] ${t.valeur}${t.genre ? ` (genre=${t.genre})` : ""}`);
    }
    if (toInsert.length > 10) console.log(`… +${toInsert.length - 10} autres`);
    return;
  }

  // Insertion séquentielle (pas de skipDuplicates possible sans unique)
  let inserted = 0;
  for (const t of toInsert) {
    await prisma.titre.create({
      data: {
        valeur: t.valeur,
        type: t.type,
        genre: t.genre,
        cultureId: defaultCultureId,
        categorieId: defaultCategorieId,
      },
    });
    inserted++;
  }

  console.log(`Insertion terminée: ${inserted} titres ajoutés.`);
}

async function main() {
  const apply = hasFlag("apply");
  const defaultCultureIdRaw = getArgValue("defaultCultureId");
  const defaultCategorieIdRaw = getArgValue("defaultCategorieId");

  const defaultCultureId = defaultCultureIdRaw ? Number(defaultCultureIdRaw) : null;
  const defaultCategorieId = defaultCategorieIdRaw ? Number(defaultCategorieIdRaw) : null;

  await importTitres({
    apply,
    defaultCultureId,
    defaultCategorieId,
  });
}

if (require.main === module) {
  main()
    .catch((err) => {
      console.error("Import titres: erreur", err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
