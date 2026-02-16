# NOMINA — Générateur d'idées (noms, personnages, mondes, concepts)

Nomina est une API qui aide à **inventer** :
- des **noms** (personnages, lieux, familles, titres),
- des **concepts** (idées de jeux, thèmes, mots-clés),
- des **fragments d'histoire** (mini‑backstories, hooks narratifs),
- des **PNJ** (combinaison nom + éléments narratifs).

L'idée : accélérer l'inspiration pour des univers fantasy/sci‑fi, des scénarios, des personnages, ou des mécaniques de jeu.

Dossier de présentation : `docs/Dossier_Presentation_Nomina.md`

---

## Démarrage local

### Prérequis

- Node.js 20+
- Une base PostgreSQL accessible via `DATABASE_URL` (local ou cloud)

### Installation

```bash
npm install
```

### Variables d'environnement (Nomina-backend/.env)

- `DATABASE_URL` : chaîne de connexion PostgreSQL (utilisée par Prisma)
- `CORS_ORIGIN` (ou `CORS_ORIGINS`) : origins autorisées (séparées par virgules)
- `PORT` : port de l'API (défaut : 3000)

Authentification (optionnel selon ton usage) :
- `CLERK_SECRET_KEY` : requis pour les endpoints `/auth/*`
- `ADMIN_CLERK_USER_ID` : requis pour `/auth/admin/ping`

### Lancer le serveur

```bash
npm run dev
```

### Migrations / seed

```bash
npm run migrate
npm run seed
```

---

## Endpoints

### Santé

- `GET /healthz` : état du serveur

### Génération (public)

Ces routes sont accessibles sans token (elles tirent et combinent des données de la base) :

- `GET /generate/npcs`
- `GET /generate/nom-personnages`
- `GET /generate/lieux`
- `GET /generate/fragments-histoire`
- `GET /generate/titres`
- `GET /generate/concepts`

Paramètres (query) typiques : `count`, `cultureId`, `categorieId`, `genre`, `seed`.

### Données (CRUD)

- `GET /cultures`, `POST /cultures`, `PUT /cultures/:id`, `DELETE /cultures/:id` (+ `GET /cultures/total`)
- Routes similaires existent pour `categories`, `concepts`, `titres`, `lieux`, `fragmentsHistoire`, `univers`, etc.

### Auth (protégé)

- `GET /auth/me` : nécessite un token Clerk (Bearer)
- `GET /auth/admin/ping` : nécessite un token Clerk + rôle admin (via `ADMIN_CLERK_USER_ID`)

---

## Exemples

### curl

```bash
curl "http://localhost:3000/generate/npcs?count=5&seed=demo"
```

### JavaScript (minimal)

```js
const res = await fetch("http://localhost:3000/generate/concepts?count=10&seed=demo");
console.log(await res.json());
```

---

## Notes techniques

- Base : PostgreSQL + Prisma (schéma dans `prisma/schema.prisma`)
- Déploiement : Docker + Fly.io (migrations via `npm run migrate:deploy`)

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
