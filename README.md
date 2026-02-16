# Nomina — Projet de session (Lab 3)

Ce dépôt est un **monorepo** contenant le backend et le desktop.

Application **full‑stack** :
- **Backend** : API REST Node.js/Express + Prisma
- **Frontend** : React (Vite) — version desktop (Electron)
- **Auth** : Clerk (inscription / connexion / déconnexion)

## Fonctionnalités (Lab 3)

- Auth complète : inscription, connexion, déconnexion, session persistante, routes protégées
- UI : navigation cohérente, page d’accueil, dashboard après connexion, feedback (loading/erreurs/succès)
- Intégration API : appels HTTP, gestion d’erreurs, formulaires avec validation
- CRUD complet (exigence) : ressource **Cultures** (Create/Read/Update/Delete)

## Technologies (versions)

- Node.js : >= 20
- Backend : Express 5, Prisma 7
- Frontend : React 18, Vite 6, React Router (HashRouter)
- Auth : Clerk
- Styles/UI : Tailwind + composants UI déjà présents dans le projet

## Démarrage local

### Installation (monorepo)

À la racine :

```bash
npm install
```

### 1) Backend

Dans un terminal :

```bash
npm run dev:backend
```

Créer `Nomina-backend/.env` à partir de l’exemple :

- Voir : [Nomina-backend/.env.example](Nomina-backend/.env.example)

Puis lancer :

```bash
npm run dev:backend
```

Backend par défaut : `http://localhost:3000`

### 2) Frontend (desktop)

Dans un 2e terminal :

```bash
npm run dev:desktop
```

Frontend Vite : `http://localhost:5173`

Option Electron (UI + Electron) :

```bash
npm run app:dev
```

## Variables d’environnement (sans secrets)

### Backend (Nomina-backend/.env)

- `DATABASE_URL` : connexion Prisma
- `CLERK_SECRET_KEY` : clé serveur Clerk
- `ADMIN_CLERK_USER_ID` : userId Clerk de l’admin
- `CORS_ORIGIN` : origin(s) autorisées, ex. `http://localhost:5173`
- `PORT` : port du backend

### Frontend (Nomina-desktop/.env.local)

- `VITE_CLERK_PUBLISHABLE_KEY` : clé publique Clerk
- `VITE_API_BASE_URL` : URL du backend (ex. `http://localhost:3000`)

## Captures d’écran (à inclure pour la remise)

Ajoute au moins **3 captures** montrant :
1. Page de connexion / inscription
2. Dashboard après connexion
3. CRUD Cultures (liste + formulaire)

> Astuce : tu peux créer un dossier `docs/screenshots/` et y mettre tes images, puis les référencer ici.

## Auteurs

- Nom : ____________________
- Matricule : ______________

## Dépôts

- Monorepo : (à remplir) https://github.com/<user>/<repo>
