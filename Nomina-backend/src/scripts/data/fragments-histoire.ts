export type FragmentSeed = {
  texte: string;
  appliesTo?: string | null;
  genre?: string | null;
  minNameLength?: number | null;
  maxNameLength?: number | null;
};

// Jeu minimal de fragments pour que /generate/fragments-histoire retourne toujours quelque chose.
// On reste volontairement générique (sans dépendre d'une "bibliothèque" externe).
export const fragmentsHistoire: FragmentSeed[] = [
  {
    texte:
      "Depuis l'enfance, une personne entend un chant lointain qui se tait dès qu'on tente de l'écouter.",
    appliesTo: "nomPersonnage",
    genre: null,
  },
  {
    texte:
      "Quelqu'un a promis de ne jamais retourner dans un lieu précis, mais une lettre scellée l'y rappelle aujourd'hui.",
    appliesTo: "nomPersonnage",
    genre: null,
  },
  {
    texte:
      "On dit qu'une personne porte une dette ancienne, contractée avant même sa naissance.",
    appliesTo: "nomPersonnage",
    genre: null,
  },
  {
    texte:
      "Une personne a été témoin d'un événement que personne d'autre ne se souvient avoir vécu.",
    appliesTo: "nomPersonnage",
    genre: null,
  },

  // Variantes genrées pour que le filtre "genre" ait des résultats.
  {
    texte:
      "Il a appris très tôt à sourire quand on l'accuse: c'était la seule façon de survivre.",
    appliesTo: "fragmentsHistoire",
    genre: "M",
  },
  {
    texte:
      "Il garde une cicatrice qu'il ne se rappelle pas avoir reçue; elle brûle quand on ment près de lui.",
    appliesTo: "fragmentsHistoire",
    genre: "M",
  },
  {
    texte:
      "Il a juré de protéger un secret, mais il ne sait plus exactement ce qu'il protège.",
    appliesTo: "fragmentsHistoire",
    genre: "M",
  },
  {
    texte:
      "Elle garde dans sa poche une pièce fendue, souvenir d'un pacte qu'elle regrette.",
    appliesTo: "fragmentsHistoire",
    genre: "F",
  },
  {
    texte:
      "Elle a appris la vérité trop tôt; depuis, elle choisit ses mots comme on choisit une arme.",
    appliesTo: "fragmentsHistoire",
    genre: "F",
  },
  {
    texte:
      "Elle a perdu un objet insignifiant, et pourtant tout le monde semble le chercher.",
    appliesTo: "fragmentsHistoire",
    genre: "F",
  },
  {
    texte:
      "Iel ne sait plus si ses souvenirs lui appartiennent ou s'ils ont été semés en iel.",
    appliesTo: "fragmentsHistoire",
    genre: "NB",
  },
  {
    texte:
      "Iel a grandi entre deux mondes; aucun ne les reconnaît complètement, et pourtant iel avance.",
    appliesTo: "fragmentsHistoire",
    genre: "NB",
  },
  {
    texte:
      "Iel refuse de choisir un camp; ce refus est devenu leur réputation.",
    appliesTo: "fragmentsHistoire",
    genre: "NB",
  },

  // Fragments plus "univers" / intrigue
  {
    texte:
      "Une rumeur circule: un objet impossible aurait réapparu après des siècles de silence.",
    appliesTo: "univers",
    genre: null,
  },
  {
    texte:
      "La ville a changé de plan en une nuit; les rues ne mènent plus aux mêmes endroits.",
    appliesTo: "lieux",
    genre: null,
  },
  {
    texte:
      "Un serment a été brisé, et le monde semble s'en souvenir mieux que les hommes.",
    appliesTo: "univers",
    genre: null,
  },
  {
    texte:
      "Dans les archives, une page a été arrachée. Le trou dans l'histoire est récent.",
    appliesTo: "univers",
    genre: null,
  },
  {
    texte:
      "Chaque pleine lune, un nom disparaît des registres. Personne n'ose en parler.",
    appliesTo: "univers",
    genre: null,
  },

  // Contraintes "nom" (optionnel)
  {
    texte:
      "Le nom a été choisi selon un rituel strict: trop court, il porte malheur; trop long, il attire l'envie.",
    appliesTo: "nomPersonnage",
    genre: null,
    minNameLength: 4,
    maxNameLength: 16,
  },

  // Divers
  {
    texte:
      "Un mentor a disparu sans laisser de trace, sinon une phrase répétée en boucle: \"Ne regarde pas en arrière\".",
    appliesTo: "nomPersonnage",
    genre: null,
  },
  {
    texte:
      "Le premier souvenir d'une personne n'est pas le sien: c'est celui de quelqu'un d'autre.",
    appliesTo: "nomPersonnage",
    genre: null,
  },
  {
    texte:
      "Une carte ancienne montre un passage secret… à l'endroit exact où se trouve maintenant une place publique.",
    appliesTo: "lieux",
    genre: null,
  },
  {
    texte:
      "Un symbole apparaît partout depuis quelques jours, gravé sur les portes et dessiné à la craie.",
    appliesTo: "univers",
    genre: null,
  },
  {
    texte:
      "La victoire a été célébrée, mais personne ne se souvient de la bataille.",
    appliesTo: "univers",
    genre: null,
  },
  {
    texte:
      "Un nom interdit circule à voix basse; le prononcer ferait venir la pluie noire.",
    appliesTo: "univers",
    genre: null,
  },
  {
    texte:
      "Une personne a retrouvé une boucle d'oreille identique à la sienne… dans une tombe scellée.",
    appliesTo: "nomPersonnage",
    genre: null,
  },
  {
    texte:
      "Le contrat était simple: un service rendu, un service rendu. Mais la balance n'a pas été respectée.",
    appliesTo: "univers",
    genre: null,
  },
  {
    texte:
      "Une chanson populaire cache un message. Seuls ceux qui connaissent l'histoire la comprennent.",
    appliesTo: "univers",
    genre: null,
  },
  {
    texte:
      "À l'aube, les ombres semblent avoir une seconde d'avance sur ceux qu'elles suivent.",
    appliesTo: "lieux",
    genre: null,
  },
];
