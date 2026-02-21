import prisma from "../utils/prisma";

type CreatureSeedInput = {
  valeur: string;
  type: string | null;
  description: string | null;
  personnageId: number | null;
  cultureId: number | null;
  categorieId: number | null;
};

const CREATURES: CreatureSeedInput[] = [
  // 1-25
  { valeur: "Aegirion", type: "Aquatique", description: "Esprit des courants, attire les navires vers les hauts-fonds.", personnageId: null, cultureId: 1, categorieId: 1 },
  { valeur: "Brûle-Saule", type: "Sylvestre", description: "Entité de bois noirci, protège les clairières sacrées.", personnageId: null, cultureId: 2, categorieId: 2 },
  { valeur: "Cendrelin", type: "Infernal", description: "Petit démon des foyers, se nourrit de rancunes.", personnageId: null, cultureId: 3, categorieId: 3 },
  { valeur: "Dorselune", type: "Nocturne", description: "Félin pâle, chasse uniquement sous lune nouvelle.", personnageId: 1, cultureId: 4, categorieId: 4 },
  { valeur: "Echine-de-Givre", type: "Glaciaire", description: "Reptile aux plaques gelées, souffle un brouillard coupant.", personnageId: null, cultureId: 1, categorieId: 5 },
  { valeur: "Fauche-Orage", type: "Tempête", description: "Oiseau-massue, bat des ailes et fend l’air d’éclairs.", personnageId: null, cultureId: 2, categorieId: 1 },
  { valeur: "Gourel", type: "Souterrain", description: "Mâche-pierre aveugle, suit les vibrations des pas.", personnageId: null, cultureId: 5, categorieId: 2 },
  { valeur: "Harpie d’Écume", type: "Aquatique", description: "Chante au large, provoque l’oubli des routes maritimes.", personnageId: null, cultureId: 1, categorieId: 4 },
  { valeur: "Ivoire-Rouge", type: "Sanguin", description: "Bête cornue, charge à l’odeur du fer et de la peur.", personnageId: 2, cultureId: 3, categorieId: 5 },
  { valeur: "Jaseuse", type: "Féerique", description: "Petite silhouette, répète les secrets entendus la nuit.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Korr des Ruches", type: "Insectoïde", description: "Gardien des essaims, enduit ses proies de résine.", personnageId: null, cultureId: 2, categorieId: 2 },
  { valeur: "Lézard-Étincelle", type: "Électrique", description: "Surcharge l’air, fait grésiller les armes métalliques.", personnageId: null, cultureId: 3, categorieId: 1 },
  { valeur: "Morne-Broute", type: "Marécage", description: "Buffle fangeux, avale les lanternes et laisse place au noir.", personnageId: null, cultureId: 5, categorieId: 5 },
  { valeur: "Nacre-Voile", type: "Aquatique", description: "Raie fantôme, traverse les filets comme s’ils étaient fumée.", personnageId: null, cultureId: 1, categorieId: 4 },
  { valeur: "Ombre-Bourdon", type: "Nocturne", description: "Insecte géant, vrombissement hypnotique.", personnageId: null, cultureId: 4, categorieId: 2 },
  { valeur: "Pilleur de Songes", type: "Onirique", description: "S’accroche aux dormeurs, vole un souvenir par nuit.", personnageId: 3, cultureId: 4, categorieId: 3 },
  { valeur: "Quartz-Fendu", type: "Minéral", description: "Golem de cristaux, se régénère au contact de la roche.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Rictus des Caves", type: "Souterrain", description: "Humanoïde troglodyte, attire avec des rires étouffés.", personnageId: null, cultureId: 5, categorieId: 3 },
  { valeur: "Sangsue-Charme", type: "Parasite", description: "Se fixe au cou, apaise la victime pour mieux boire.", personnageId: null, cultureId: 3, categorieId: 4 },
  { valeur: "Tisseur d’Aube", type: "Céleste", description: "Araignée lumineuse, tisse des fils qui dissipent les malédictions.", personnageId: null, cultureId: 4, categorieId: 2 },
  { valeur: "Umbrelame", type: "Nocturne", description: "Prédateur plat, se glisse dans les ombres des murs.", personnageId: null, cultureId: 4, categorieId: 5 },
  { valeur: "Vigie-Brume", type: "Maritime", description: "Silhouette sur les falaises, annonce les naufrages.", personnageId: null, cultureId: 1, categorieId: 3 },
  { valeur: "Wyrm de Tourbe", type: "Marécage", description: "Serpent massif, dort sous les mares, réveille la peste.", personnageId: null, cultureId: 5, categorieId: 5 },
  { valeur: "Xylophage", type: "Sylvestre", description: "Coléoptère géant, ronge les charpentes en une nuit.", personnageId: null, cultureId: 2, categorieId: 2 },
  { valeur: "Yeux-Deux-Fois", type: "Oracle", description: "Chouette bicéphale, voit le futur proche dans les reflets.", personnageId: 4, cultureId: 4, categorieId: 3 },

  // 26-50
  { valeur: "Zéphyrin", type: "Vent", description: "Esprit aérien, dévie les flèches et chuchote des directions.", personnageId: null, cultureId: 2, categorieId: 1 },
  { valeur: "Aurore-Mangeuse", type: "Céleste", description: "Créature qui absorbe la lumière du matin, laisse un froid net.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Bec-de-Fer", type: "Mécanique", description: "Corvidé d’acier, collectionne les clés et les anneaux.", personnageId: null, cultureId: 3, categorieId: 1 },
  { valeur: "Cavalier Sans-Peu", type: "Maudit", description: "Homme-cheval écorché, hante les routes des anciens champs de bataille.", personnageId: null, cultureId: 3, categorieId: 5 },
  { valeur: "Dent-de-Sel", type: "Aquatique", description: "Requin pâle, suit les prières jetées à la mer.", personnageId: null, cultureId: 1, categorieId: 5 },
  { valeur: "Échine-Fougère", type: "Sylvestre", description: "Sanglier couvert de frondes, charge quand on coupe du bois.", personnageId: null, cultureId: 2, categorieId: 5 },
  { valeur: "Fiole-Fauve", type: "Alchimique", description: "Petit homoncule, transpire un antidote rare quand il a peur.", personnageId: null, cultureId: 3, categorieId: 3 },
  { valeur: "Givrelaine", type: "Glaciaire", description: "Bélier blanc, ses sabots laissent des runes de gel.", personnageId: null, cultureId: 1, categorieId: 5 },
  { valeur: "Hurle-Cendre", type: "Infernal", description: "Chien noir, aboie et éteint les torches d’un souffle sec.", personnageId: null, cultureId: 3, categorieId: 4 },
  { valeur: "Iconophage", type: "Maudit", description: "Dévore les idoles, affaiblit les serments et les cultes.", personnageId: null, cultureId: 5, categorieId: 3 },
  { valeur: "Jument d’Obsidienne", type: "Volcanique", description: "Monture sombre, sa crinière fume et brûle les mains.", personnageId: 5, cultureId: 3, categorieId: 5 },
  { valeur: "Képi-Gris", type: "Souterrain", description: "Lutin mineur, vole les casques et égare les mineurs.", personnageId: null, cultureId: 5, categorieId: 3 },
  { valeur: "Lanterne-Vivante", type: "Spectral", description: "Flamme consciente, attire les voyageurs pour se nourrir d’espoir.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Mante-Prière", type: "Insectoïde", description: "Mante géante, immobilise par des gestes mimétiques.", personnageId: null, cultureId: 2, categorieId: 2 },
  { valeur: "Nid-aux-Os", type: "Charognard", description: "Oiseau énorme, bâtit son nid avec des côtes humaines.", personnageId: null, cultureId: 5, categorieId: 5 },
  { valeur: "Orgueil-Ronce", type: "Sylvestre", description: "Dryade vindicative, fait pousser des épines dans la peau des intrus.", personnageId: null, cultureId: 2, categorieId: 3 },
  { valeur: "Porte-Écho", type: "Oracle", description: "Masque vivant, répète les derniers mots des morts.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Queue-de-Braise", type: "Volcanique", description: "Renard ardent, trace des cercles de feu protecteurs.", personnageId: null, cultureId: 3, categorieId: 4 },
  { valeur: "Ronge-Serment", type: "Maudit", description: "Rat noir, détruit les contrats en rongeant l’encre.", personnageId: null, cultureId: 3, categorieId: 3 },
  { valeur: "Sablier", type: "Désert", description: "Scorpion doré, venin qui accélère le vieillissement.", personnageId: null, cultureId: 5, categorieId: 2 },
  { valeur: "Tambour-Foudre", type: "Tempête", description: "Crapaud massif, gorge qui tonne et fait tomber la grêle.", personnageId: null, cultureId: 2, categorieId: 1 },
  { valeur: "Urne-Rampante", type: "Nécrotique", description: "Vase animé, contient des cendres qui murmurent des noms.", personnageId: null, cultureId: 5, categorieId: 4 },
  { valeur: "Vermine-Satin", type: "Parasite", description: "Ver luisant, se glisse sous la peau et imite un bijou.", personnageId: null, cultureId: 3, categorieId: 2 },
  { valeur: "Wisp d’Encre", type: "Onirique", description: "Brume noire, écrit des messages dans les flaques.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Xénial", type: "Féerique", description: "Petit esprit rieur, inverse la gauche et la droite des voyageurs.", personnageId: null, cultureId: 4, categorieId: 3 },

  // 51-75
  { valeur: "Yokelame", type: "Maritime", description: "Poisson-sabre, tranche les amarres la nuit.", personnageId: null, cultureId: 1, categorieId: 5 },
  { valeur: "Zar-Moiré", type: "Spectral", description: "Fantôme tissé, traverse les tissus et vole les couleurs.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Ardent-Mycèle", type: "Fongique", description: "Champignon brûlant, ses spores enflamment les greniers.", personnageId: null, cultureId: 5, categorieId: 2 },
  { valeur: "Basilic des Miroirs", type: "Oracle", description: "Regard qui reflète la vérité, pétrifie les menteurs.", personnageId: null, cultureId: 4, categorieId: 5 },
  { valeur: "Croc-Équinoxe", type: "Céleste", description: "Loup pâle, n’apparaît qu’aux changements de saison.", personnageId: null, cultureId: 4, categorieId: 5 },
  { valeur: "Drille-Charbon", type: "Souterrain", description: "Foreur vivant, creuse des tunnels qui s’effondrent après passage.", personnageId: null, cultureId: 5, categorieId: 2 },
  { valeur: "Écaille-Rumeur", type: "Maritime", description: "Serpent de mer, colporte des voix à travers les ports.", personnageId: null, cultureId: 1, categorieId: 3 },
  { valeur: "Faucon-Voilé", type: "Nocturne", description: "Rapace masqué, capture les rêves au vol.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Galet-Roi", type: "Minéral", description: "Petit titan de pierre, roule et écrase les campements.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Houle-Feutrée", type: "Aquatique", description: "Vague consciente, étouffe les cris et emporte les armes.", personnageId: null, cultureId: 1, categorieId: 4 },
  { valeur: "Inciseur", type: "Sanguin", description: "Guêpe rouge, son dard laisse des marques qui saignent longtemps.", personnageId: null, cultureId: 3, categorieId: 2 },
  { valeur: "Jade-Épine", type: "Minéral", description: "Hérisson de gemmes, ses piquants valent une fortune… si on survit.", personnageId: null, cultureId: 5, categorieId: 5 },
  { valeur: "Kraket", type: "Aquatique", description: "Céphalopode vorace, encre qui provoque la cécité temporaire.", personnageId: null, cultureId: 1, categorieId: 5 },
  { valeur: "Liseur-de-Peau", type: "Maudit", description: "Vieillard difforme, lit les destins dans les cicatrices.", personnageId: null, cultureId: 3, categorieId: 3 },
  { valeur: "Murmure-Roc", type: "Minéral", description: "Paroi vivante, répond aux questions par des vibrations.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Négatif", type: "Spectral", description: "Ombre qui inverse les couleurs, glace les doigts au toucher.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Ogre des Vignes", type: "Sylvestre", description: "Colosse couvert de lianes, vole les tonneaux et écrase les pressoirs.", personnageId: null, cultureId: 2, categorieId: 5 },
  { valeur: "Pique-Feuille", type: "Sylvestre", description: "Petit lézard, crache des aiguilles végétales.", personnageId: null, cultureId: 2, categorieId: 2 },
  { valeur: "Quenouille", type: "Féerique", description: "Esprit du fil, emmêle les cordes et libère les prisonniers.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Râle-de-Vase", type: "Marécage", description: "Oiseau des marais, son cri attire les fièvres.", personnageId: null, cultureId: 5, categorieId: 4 },
  { valeur: "Siffle-Quai", type: "Maritime", description: "Gamin spectral, siffle pour attirer les marins hors des tavernes.", personnageId: null, cultureId: 1, categorieId: 3 },
  { valeur: "Tonne-Corne", type: "Tempête", description: "Bouc orageux, charge en faisant éclater le tonnerre.", personnageId: null, cultureId: 2, categorieId: 5 },
  { valeur: "Usure", type: "Parasite", description: "Mite grise, dévore le cuir et les souvenirs liés aux objets.", personnageId: null, cultureId: 3, categorieId: 2 },
  { valeur: "Vitrail", type: "Céleste", description: "Serpent de lumière, se fragmente en prismes tranchants.", personnageId: null, cultureId: 4, categorieId: 1 },
  { valeur: "Warg-Clos", type: "Maudit", description: "Loup des ruines, garde les portes qui n’existent plus.", personnageId: null, cultureId: 3, categorieId: 5 },

  // 76-100
  { valeur: "Xarque", type: "Désert", description: "Poisson des dunes, nage sous le sable et guette les pas.", personnageId: null, cultureId: 5, categorieId: 5 },
  { valeur: "Ysil", type: "Onirique", description: "Brume verte, rend les mensonges agréables à entendre.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Zinzolin", type: "Féerique", description: "Lutin pourpre, échange une heure de chance contre un bouton.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Aile-Scorie", type: "Volcanique", description: "Chauve-souris de lave, ses cris font tomber des cendres.", personnageId: null, cultureId: 3, categorieId: 4 },
  { valeur: "Boue-Drôle", type: "Marécage", description: "Blob rieur, se nourrit de chaleur corporelle.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Corne-Grêle", type: "Tempête", description: "Rhinocéros de nuages, laisse une traînée de grêlons.", personnageId: null, cultureId: 2, categorieId: 5 },
  { valeur: "Dague-Épine", type: "Sylvestre", description: "Petit esprit, transforme les ronces en lames courtes.", personnageId: null, cultureId: 2, categorieId: 3 },
  { valeur: "Éther-Glouton", type: "Onirique", description: "Absorbe les hallucinations et les recrache en cauchemars.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Fossile-Errant", type: "Minéral", description: "Squelette de pierre, se recompose autour des voyageurs perdus.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Garde-Écarlate", type: "Sanguin", description: "Chevalier sans armure, ne laisse que des traces de sang ancien.", personnageId: null, cultureId: 3, categorieId: 4 },
  { valeur: "Haleine-Bleue", type: "Glaciaire", description: "Phoque géant, souffle une brume qui endort.", personnageId: null, cultureId: 1, categorieId: 4 },
  { valeur: "Inflexion", type: "Oracle", description: "Créature-voix, altère la signification des promesses prononcées.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Jarre-aux-Mouches", type: "Fongique", description: "Colonie vivante, attire les insectes et les dissout.", personnageId: null, cultureId: 5, categorieId: 2 },
  { valeur: "Kite-Sombre", type: "Nocturne", description: "Manta volant, plane au-dessus des toits et vole les bijoux.", personnageId: null, cultureId: 4, categorieId: 5 },
  { valeur: "Lame-de-Récif", type: "Aquatique", description: "Poisson plat, peau coupante comme du verre marin.", personnageId: null, cultureId: 1, categorieId: 5 },
  { valeur: "Mange-Suif", type: "Charognard", description: "Rongeur, attire les bêtes en suivant l’odeur des bougies.", personnageId: null, cultureId: 3, categorieId: 2 },
  { valeur: "Nœud-de-Foudre", type: "Électrique", description: "Anguille aérienne, se noue et libère une décharge en arc.", personnageId: null, cultureId: 2, categorieId: 1 },
  { valeur: "Oiseau-Charte", type: "Oracle", description: "Grue blanche, signe des pactes en traçant des runes au sol.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Poussière-Guide", type: "Désert", description: "Nuée consciente, montre un chemin… jamais le bon au premier essai.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Quêteuse", type: "Féerique", description: "Petite chasseuse, propose des marchés absurdes mais efficaces.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Roule-Épave", type: "Maritime", description: "Crabe géant, porte une proue en guise de carapace.", personnageId: null, cultureId: 1, categorieId: 5 },
  { valeur: "Suaire", type: "Nécrotique", description: "Tissu vivant, enveloppe et ralentit le cœur.", personnageId: null, cultureId: 5, categorieId: 4 },
  { valeur: "Trancheronce", type: "Sylvestre", description: "Plante carnivore, ses feuilles sont des scies.", personnageId: null, cultureId: 2, categorieId: 2 },
  { valeur: "Usurpateur d’Air", type: "Vent", description: "Vole le souffle, laisse les victimes haletantes.", personnageId: null, cultureId: 2, categorieId: 4 },

  // 101-125
  { valeur: "Vase-Couronne", type: "Marécage", description: "Reine des boues, commande des sangsues par vibrations.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Wolfram", type: "Mécanique", description: "Golem de métal, marche au rythme d’un métronome intérieur.", personnageId: null, cultureId: 3, categorieId: 1 },
  { valeur: "Xylo-Oracle", type: "Sylvestre", description: "Arbre parlant, prédit la pluie par la forme de ses feuilles.", personnageId: null, cultureId: 2, categorieId: 3 },
  { valeur: "Yokeur", type: "Souterrain", description: "Homme-taupe, vole les lanternes pour agrandir son royaume noir.", personnageId: null, cultureId: 5, categorieId: 5 },
  { valeur: "Zèle-Glace", type: "Glaciaire", description: "Esprit froid, punit les profanateurs par des engelures rapides.", personnageId: null, cultureId: 1, categorieId: 4 },
  { valeur: "Amas-Sucre", type: "Fongique", description: "Moisissure douce, attire et englue les enfants curieux.", personnageId: null, cultureId: 5, categorieId: 2 },
  { valeur: "Braise-Moine", type: "Volcanique", description: "Ascète de cendre, médite dans les braseros et détourne la chaleur.", personnageId: null, cultureId: 3, categorieId: 3 },
  { valeur: "Cierge-Errant", type: "Spectral", description: "Bougie vivante, éclaire seulement ce qu’on regrette.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Doreur de Peaux", type: "Alchimique", description: "Enduit les bêtes d’un vernis qui durcit comme pierre.", personnageId: null, cultureId: 3, categorieId: 3 },
  { valeur: "Épine-Couronne", type: "Sylvestre", description: "Reine ronce, fait ployer les branches comme des bras.", personnageId: null, cultureId: 2, categorieId: 3 },
  { valeur: "Fauve-Sel", type: "Maritime", description: "Lion marin, rugit et fait tourner les boussoles.", personnageId: null, cultureId: 1, categorieId: 5 },
  { valeur: "Garde-Feu", type: "Infernal", description: "Sentinelle de braise, protège les pactes conclus au sang.", personnageId: null, cultureId: 3, categorieId: 4 },
  { valeur: "Hématite", type: "Minéral", description: "Sang coagulé en pierre, attire le fer et les blessures.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Iris-Double", type: "Oracle", description: "Biche aux deux iris, voit les chemins cachés entre les mondes.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Jonc-Siffleur", type: "Marécage", description: "Roseau vivant, siffle pour appeler les moustiques géants.", personnageId: null, cultureId: 5, categorieId: 2 },
  { valeur: "Kermès", type: "Sanguin", description: "Petit esprit, colore les tissus avec du sang frais.", personnageId: null, cultureId: 3, categorieId: 3 },
  { valeur: "Lige-Tempête", type: "Tempête", description: "Géant de vent, marche dans les champs et couche les blés.", personnageId: null, cultureId: 2, categorieId: 1 },
  { valeur: "Miroitante", type: "Céleste", description: "Carpe de lumière, nage dans l’air et laisse des éclats.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Nerf-Noir", type: "Maudit", description: "Serpent fin, son venin rompt la volonté et l’initiative.", personnageId: null, cultureId: 3, categorieId: 4 },
  { valeur: "Ossuaire", type: "Nécrotique", description: "Tas d’os animé, s’assemble en formes selon la menace.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Pique-Quai", type: "Maritime", description: "Anguille des ports, mord et vole les bagues des marins.", personnageId: null, cultureId: 1, categorieId: 2 },
  { valeur: "Quasi-Nuit", type: "Nocturne", description: "Brume dense, avale les couleurs et étouffe les sons.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Racine-Longue", type: "Sylvestre", description: "Racine serpentine, tire les intrus sous terre lentement.", personnageId: null, cultureId: 2, categorieId: 2 },
  { valeur: "Scellement", type: "Oracle", description: "Esprit de verrou, ferme les portes même sans gonds.", personnageId: null, cultureId: 4, categorieId: 3 },

  // 126-150
  { valeur: "Trébuchet", type: "Mécanique", description: "Automate de siège miniature, projette des pierres avec précision.", personnageId: null, cultureId: 3, categorieId: 1 },
  { valeur: "Ulcère", type: "Parasite", description: "Larve blanche, s’installe dans une blessure et refuse de partir.", personnageId: null, cultureId: 3, categorieId: 2 },
  { valeur: "Verrier", type: "Minéral", description: "Esprit du verre, coupe en silence et laisse des plaies nettes.", personnageId: null, cultureId: 5, categorieId: 4 },
  { valeur: "Wadi", type: "Désert", description: "Chacal des oueds, apparaît après les rares pluies et suit les traces.", personnageId: null, cultureId: 5, categorieId: 5 },
  { valeur: "Xénogriffe", type: "Maudit", description: "Chat étranger, griffe les ombres pour en faire sortir des secrets.", personnageId: null, cultureId: 3, categorieId: 4 },
  { valeur: "Yolande la Pâle", type: "Spectral", description: "Dame fantôme, danse et refroidit le sang des imprudents.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Zarath-Boue", type: "Marécage", description: "Colosse d’argile, se reconstruit à chaque pas dans la vase.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Astra-Pique", type: "Céleste", description: "Étoile vivante tombée, piquante et brûlante au toucher.", personnageId: null, cultureId: 4, categorieId: 1 },
  { valeur: "Bec-aux-Runes", type: "Oracle", description: "Corbeau savant, grave des présages sur la pierre.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Claque-Braise", type: "Infernal", description: "Crabe de feu, pince qui cautérise et marque au fer.", personnageId: null, cultureId: 3, categorieId: 2 },
  { valeur: "Dune-Rouge", type: "Désert", description: "Esprit du sable, forme des mirages qui séparent les groupes.", personnageId: null, cultureId: 5, categorieId: 4 },
  { valeur: "Écoute-Terre", type: "Minéral", description: "Taupe de pierre, détecte les pas à des kilomètres.", personnageId: null, cultureId: 5, categorieId: 1 },
  { valeur: "Fiel-de-Lys", type: "Alchimique", description: "Serpent élégant, venin distillable en remède… à faible dose.", personnageId: null, cultureId: 3, categorieId: 3 },
  { valeur: "Griffe-Lagon", type: "Aquatique", description: "Tortue carnassière, brise les os en refermant sa mâchoire.", personnageId: null, cultureId: 1, categorieId: 5 },
  { valeur: "Horizon-Cassé", type: "Onirique", description: "Fait voir des routes impossibles, pousse à marcher jusqu’à l’épuisement.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Insolent", type: "Féerique", description: "Petit esprit moqueur, vole les derniers mots d’une dispute.", personnageId: null, cultureId: 4, categorieId: 3 },
  { valeur: "Jarre-aux-Serments", type: "Maudit", description: "Contenant vivant, conserve les promesses brisées et les relâche.", personnageId: null, cultureId: 3, categorieId: 4 },
  { valeur: "Krohn", type: "Souterrain", description: "Chasseur des tunnels, utilise des os comme sifflets d’alerte.", personnageId: null, cultureId: 5, categorieId: 5 },
  { valeur: "Lueur-Fiel", type: "Nécrotique", description: "Flamme verte, corrompt la chair au lieu de la brûler.", personnageId: null, cultureId: 5, categorieId: 4 },
  { valeur: "Mèche-Longue", type: "Spectral", description: "Chevelure vivante, étrangle et laisse une odeur de savon froid.", personnageId: null, cultureId: 4, categorieId: 4 },
  { valeur: "Nacréon", type: "Maritime", description: "Esprit de coquille, renvoie les sons comme un écho tranchant.", personnageId: null, cultureId: 1, categorieId: 1 },
  { valeur: "Ocre-Soleil", type: "Désert", description: "Sorte de lévrier sableux, court sans laisser de trace.", personnageId: null, cultureId: 5, categorieId: 5 },
  { valeur: "Panse-Givre", type: "Glaciaire", description: "Ours blanc, son souffle rend le métal cassant.", personnageId: null, cultureId: 1, categorieId: 5 },
  { valeur: "Quenotte", type: "Charognard", description: "Hyène des ruines, rit quand un piège se déclenche.", personnageId: null, cultureId: 5, categorieId: 5 },
];

export async function seedCreatures(): Promise<{ created: number; total: number }> {
  const existingCultures = new Set((await prisma.culture.findMany({ select: { id: true } })).map((x) => x.id));
  const existingCategories = new Set((await prisma.categorie.findMany({ select: { id: true } })).map((x) => x.id));
  const existingPersonnages = new Set((await prisma.personnage.findMany({ select: { id: true } })).map((x) => x.id));

  const payload = CREATURES.map((item) => ({
    valeur: item.valeur,
    type: item.type,
    description: item.description,
    personnageId: item.personnageId && existingPersonnages.has(item.personnageId) ? item.personnageId : null,
    cultureId: item.cultureId && existingCultures.has(item.cultureId) ? item.cultureId : null,
    categorieId: item.categorieId && existingCategories.has(item.categorieId) ? item.categorieId : null,
  }));

  const inserted = await prisma.creature.createMany({
    data: payload,
    skipDuplicates: true,
  });

  const total = await prisma.creature.count();
  console.log(`✅ Seed Creature terminé. Ajoutés: ${inserted.count}. Total en BD: ${total}.`);
  return { created: inserted.count, total };
}

async function main() {
  await seedCreatures();
}

if (require.main === module) {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
