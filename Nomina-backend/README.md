Présenté par : Sonia Corbin Date : 05/11/2025

# NOMINA — API Génératrice & Narratrice de Noms

Nomina s’inscrit dans l’industrie du logiciel et de la création numérique, en proposant une API innovante dédiée à la narration et à la génération de noms.

Slogan court (suggestion pour logo) : **Créez, Nommez, Racontez**

Dossier de présentation (version “document”) : `docs/Dossier_Presentation_Nomina.md`

* * *
## Installation & Lancement

1. Clonez le dépôt et installez les dépendances : git clone https://github.com/Nocturne1975/Nomina-backend
   cd Nomina-backend
   npm install

2. Configurez le fichier `.env` à la racine :
   DATABASE_URL=postgresql://...
  CLERK_SECRET_KEY=sk_live_...
  ADMIN_CLERK_USER_ID=user_...
  CORS_ORIGIN=http://localhost:5173

3. Lancez le serveur :  npm run dev
  
4. Testez l’API avec le fichier `test.rest` (VS Code) ou Postman.

## src + Desktop + Offline

- Le backend peut être déployé (API en ligne) et consommé par un **site src** et une **app Electron**.
- CORS est configurable via `CORS_ORIGIN` (liste séparée par virgules). L'app Electron peut ne pas envoyer d'en-tête `Origin`.
- Le mode offline se fait côté client (cache GET + outbox) et ne nécessite pas de changement côté API.

## Endpoints principaux

| Méthode | Endpoint                  | Description                  |
|---------|---------------------------|------------------------------|
| GET     | /users                    | Liste tous les utilisateurs  |
| POST    | /users                    | Crée un utilisateur          |
| ...     | ...                       | ...                          |

## Schéma ER

Le schéma ER est disponible à la racine du dépôt sous forme d’image/PDF.


## Table des matières

- [NOMINA — API Génératrice \& Narratrice de Noms]
  - [Installation \& Lancement]
  - [Endpoints principaux]
  - [Schéma ER]
  - [Table des matières]
  - [Présentation]
  - [Utilisateurs cibles]
  - [Objectifs]
  - [Fonctionnalités principales]
  - [Spécification API (exemples)]
    - [GET /healthz]
    - [GET /generate/npcs]
    - [GET /generate/nom-personnages]
    - [GET /generate/lieux]
    - [GET /generate/fragments-histoire]
    - [GET /generate/titres]
  - [Exemples d'utilisation]
    - [curl]
    - [Client JavaScript (exemple minimal)]
  - [Architecture technique (version locale / gratuite)]
  - [Design \& Branding]
    - [Palette \& typographie]
    - [Iconographie recommandée (pour logo)]
    - [Slogans courts possibles (pour le logo)]
  - [Déploiement (options simples)]
  - [Contribution \& contact]
  - [Licence]
  - [Annexes (à inclure dans le dossier)]

* * *

## Présentation

Nomina est une API destinée à générer des noms (personnages, lieux, objets, créatures) accompagnés, si souhaité, d'une mini-description ou d'une mini-biographie narrative. L’idée est d’aider développeurs, auteurs et créateurs à trouver rapidement des noms évocateurs et porteurs d’histoire.

* * *

## Utilisateurs cibles

Nomina vise principalement les utilisateurs suivants :

1.  Développeurs
    -   Intègrent la génération de noms et de mini-histoires dans leurs applications (jeux, sites src, outils, chatbots...).
    -   Développeurs de jeux vidéo, jeux de rôle, applis d’écriture, etc.
2.  Auteurs et écrivains
    -   Romans, nouvelles, BD, scénarios, en quête d’inspiration pour personnages, lieux ou objets.
3.  Maîtres de jeu (MJ) et joueurs de jeux de rôle
    -   Création rapide de PNJ, villes, objets magiques, etc., avec une touche narrative.
4.  Créateurs de contenu
    -   YouTubers, podcasteurs, blogueurs, streamers cherchant noms et idées pour leurs univers.
5.  Entrepreneurs et marketeurs
    -   Brainstorming de noms de marque, produits ou projets, avec un angle narratif différenciant.
6.  Chercheurs et enseignants
    -   Ateliers d’écriture, projets pédagogiques sur créativité, linguistique ou histoire.

* * *

## Objectifs

-   Fournir une API simple et rapide pour générer des noms thématiques et personnalisables.
-   Offrir des suggestions narratives (mini-histoires) associées aux noms.
-   Être facilement intégrable (RESTful, JSON) et utilisable en local ou hébergé sur des plateformes simples.
-   Rester extensible (ajout futur de modèles, langues, export, interface src, etc.).

* * *

## Fonctionnalités principales

-   Génération de contenu : noms de personnages, lieux, titres et fragments narratifs.
-   Génération de PNJ : combinaison de noms + fragments d’histoire pour produire une mini‑backstory.
-   Paramètres via querystring : filtres (culture, catégorie, genre), quantité, et `seed` pour un résultat reproductible.
-   Endpoints REST simples, réponses JSON.
-   Persistance via base de données PostgreSQL (accès via Prisma).

* * *

## Spécification API (exemples)

Les routes ci-dessous reflètent l’implémentation actuelle (Express).

### GET /healthz

-   Statut de santé du backend.

### GET /generate/npcs

-   Génère des idées de PNJ (noms + mini‑backstories).
-   Paramètres (query) possibles : `count`, `cultureId`, `categorieId`, `genre`, `seed`.

### GET /generate/nom-personnages

-   Génère des personnages « format court » (nom + mini‑biographie).
-   Paramètres (query) possibles : `count`, `cultureId`, `categorieId`, `genre`, `seed`.

### GET /generate/lieux

-   Tire des lieux depuis la base selon filtres.
-   Paramètres (query) possibles : `count`, `categorieId`, `seed`.

### GET /generate/fragments-histoire

-   Tire des fragments d’histoire selon filtres.
-   Paramètres (query) possibles : `count`, `cultureId`, `categorieId`, `genre`, `appliesTo`, `seed`.

### GET /generate/titres

-   Tire des titres selon filtres.
-   Paramètres (query) possibles : `count`, `cultureId`, `categorieId`, `genre`, `seed`.

* * *

## Exemples d'utilisation

### curl

```bash
curl "http://localhost:3000/generate/npcs?count=5&seed=demo"
```

### Client JavaScript (exemple minimal)

```js
const res = await fetch("http://localhost:3000/generate/nom-personnages?count=10&seed=demo");
const data = await res.json();
console.log(data);
```

* * *

## Architecture technique (version locale / gratuite)

-   Backend : Node.js + TypeScript + Express
-   Accès aux données : Prisma
-   Base de données : PostgreSQL
-   Authentification : Clerk (token Bearer) + rôles (Admin via variable d’environnement)
-   Déploiement : Docker + Fly.io (release command de migration Prisma)

Schéma simplifié : Utilisateur → UI (web/desktop) → API Nomina (Express) → PostgreSQL (Prisma) → Résultat

* * *

## Design & Branding

### Palette & typographie

-   Fond : bleu nuit / gris foncé (#0f1724 ou #1b2430)
-   Couleur principale : bleu-turquoise / vert d’eau (#36c6c6 ou #5fd7d7)
-   Accent : blanc cassé (#f7f7f7) ou doré léger pour détails
-   Police recommandée : fonte moderne et lisible (ex. Montserrat, Poppins, Lora pour le serif)

### Iconographie recommandée (pour logo)

-   Plume stylisée (écriture) + encrier (narration)
-   Petit engrenage discret (tech/API) intégré à la base de l’encrier
-   Petite étoile ou pixel proche de la plume (inspiration numérique)
-   Variante monochrome pour favicon / icône d’app

### Slogans courts possibles (pour le logo)

-   Créez, Nommez, Racontez
-   L’art du nom, la magie du récit
-   Des noms, des histoires

* * *

## Déploiement (options simples)

-   Local : `npm install` puis `npm run dev`
-   Fly.io : déploiement Docker (voir `fly.toml`) avec exécution des migrations Prisma au déploiement.

* * *

## Contribution & contact

-   Pour contributions : crée une issue / PR sur le dépôt GitHub (lien à ajouter).
-   Pour retours : [contact@nomina.example](mailto:contact@nomina.example) (remplace par ton email réel).

Modèle de phrase (dans le README du repo) :

> Nomina est un projet en cours. Contributions, idées et retours sont les bienvenus — ouvre une issue ou contacte-moi directement.

* * *

## Licence

Indique la licence choisie (ex. MIT, Apache-2.0). Exemple :

-   MIT License — voir fichier LICENSE.

* * *

## Annexes (à inclure dans le dossier)

-   `docs/` : documentation détaillée des endpoints, exemples supplémentaires
-   `assets/` : logos, icônes, palette couleur (PNG / SVG)
-   `examples/` : scripts d'exemple (client Node.js), mock data
-   `LICENSE` : fichier de licence
-   `CONTRIBUTING.md` : guide de contribution
