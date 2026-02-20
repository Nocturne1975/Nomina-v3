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
      "Cette personne change d'identité à chaque saison pour échapper à une ancienne confrérie.",
    appliesTo: "npc",
    genre: null,
  },
  {
    texte:
      "Quelqu'un lui a confié un message à remettre \"au bon moment\"; iel ne sait pas encore quand ce moment viendra.",
    appliesTo: "npc",
    genre: null,
  },
  {
    texte:
      "On l'engage quand tout semble perdu: iel trouve toujours une sortie, mais jamais sans contrepartie.",
    appliesTo: "npc",
    genre: null,
  },
  {
    texte:
      "Il prétend n'avoir peur de rien, mais évite systématiquement les clochers et les horloges.",
    appliesTo: "npc",
    genre: "M",
  },
  {
    texte:
      "Elle tient un carnet codé que personne n'a réussi à lire; chaque page semble prédire un choix crucial.",
    appliesTo: "npc",
    genre: "F",
  },
  {
    texte:
      "Iel agit comme médiateur entre deux factions rivales; un seul faux pas pourrait rallumer la guerre.",
    appliesTo: "npc",
    genre: "NB",
  },

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

  // Bloc additionnel fourni (templates narratifs)
  {
    texte:
      "{name} a juré de ne plus jamais prononcer un certain nom. Depuis, ce nom apparaît partout.",
    appliesTo: "personnage",
    genre: null,
    minNameLength: 3,
    maxNameLength: 24,
  },
  {
    texte:
      "{name} garde une lettre scellée qui ne doit être ouverte qu'en cas de trahison. Elle est déjà entrouverte.",
    appliesTo: "personnage",
    genre: null,
    minNameLength: 3,
    maxNameLength: 24,
  },
  {
    texte:
      "On dit que {name} peut reconnaître un mensonge à l'odeur. Personne n'ose le/la contredire.",
    appliesTo: "personnage",
    genre: null,
    minNameLength: 3,
    maxNameLength: 24,
  },
  {
    texte:
      "{name} a été payé(e) pour oublier. Le paiement a disparu, mais pas les trous dans sa mémoire.",
    appliesTo: "personnage",
    genre: null,
    minNameLength: 3,
    maxNameLength: 24,
  },
  {
    texte:
      "{name} a survécu à un rituel interdit. Depuis, les ombres s'alignent toujours derrière lui/elle.",
    appliesTo: "personnage",
    genre: null,
    minNameLength: 3,
    maxNameLength: 24,
  },
  {
    texte:
      "{name} est certain(e) d'avoir déjà vécu cette journée. La preuve : il/elle connaît la prochaine phrase de chacun.",
    appliesTo: "personnage",
    genre: null,
    minNameLength: 3,
    maxNameLength: 24,
  },
  {
    texte:
      "Une ruelle n'apparaît que lorsqu'il pleut. Au bout, une porte sans poignée attend un nom précis.",
    appliesTo: "lieu",
  },
  {
    texte:
      "Cette auberge affiche des portraits de voyageurs. Les cadres se remplissent la veille d'une disparition.",
    appliesTo: "lieu",
  },
  {
    texte:
      "Le pont ne se traverse qu'en disant la vérité. Les mensonges font surgir une seconde rive, qui n'existe pas.",
    appliesTo: "lieu",
  },
  {
    texte:
      "Sous la ville, une salle scellée contient des statues à l'effigie de personnes pas encore nées.",
    appliesTo: "lieu",
  },
  {
    texte:
      "Un phare éclaire parfois l'intérieur des maisons. Ceux qu'il touche rêvent d'un endroit qu'ils n'ont jamais vu.",
    appliesTo: "lieu",
  },
  {
    texte:
      "Un masque rit quand on le porte. Plus il rit, plus la foule vous croit digne de confiance.",
    appliesTo: "objet",
  },
  {
    texte:
      "Une bague ternit à chaque mensonge entendu. Certains l'utilisent comme une arme sociale.",
    appliesTo: "objet",
  },
  {
    texte:
      "Un flacon vendu au marché noir contient du 'silence' : après l'avoir ouvert, vous ne pouvez plus révéler un secret précis.",
    appliesTo: "objet",
  },
  {
    texte:
      "Un livre sans titre réécrit son contenu à chaque aube. Il semble raconter la vie de son prochain lecteur.",
    appliesTo: "objet",
  },
  {
    texte:
      "Le traité de paix tient grâce à une clause secrète. Quelqu'un vient de la vendre au plus offrant.",
    appliesTo: "intrigue",
  },
  {
    texte:
      "Une prophétie a été réécrite. Les anciens jurent que le texte original parlait de vous, mot pour mot.",
    appliesTo: "intrigue",
  },
  {
    texte:
      "On a volé la cloche du temple. Depuis, les morts murmurent des noms, comme s'ils cherchaient quelqu'un.",
    appliesTo: "intrigue",
  },
  {
    texte:
      "Le contrat est simple : protéger l'héritier. Le problème, c'est que personne ne sait qui il est.",
    appliesTo: "quete",
  },
  {
    texte:
      "Un sanctuaire interdit accorde un seul vœu, mais exige un souvenir précis en échange. Personne ne choisit le souvenir perdu.",
    appliesTo: "quete",
  },
  {
    texte:
      "Ici, les serments ont un poids réel : ils collent à la peau, s'entendent dans la voix, et se paient toujours.",
    appliesTo: "univers",
  },
  {
    texte:
      "Dans ces terres, les noms sont des clefs. Mal employés, ils ouvrent des portes qu'on ne devrait pas voir.",
    appliesTo: "univers",
  },
];
