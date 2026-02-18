# Nomina — Projet de session (Lab 3)

Ce dépôt contient un **backend** (API) et un **frontend web** (interface React).

Application **full‑stack** :
- **Backend** : API REST Node.js/Express + Prisma
- **Frontend** : React (Vite)
- **Auth** : Clerk (inscription / connexion / déconnexion)

## Fonctionnalités (Lab 3)

- Auth complète : inscription, connexion, déconnexion, session persistante, routes protégées
- UI : navigation cohérente, page d’accueil, dashboard après connexion, feedback (loading/erreurs/succès)
- Intégration API : appels HTTP, gestion d’erreurs, formulaires avec validation
- CRUD complet (exigence) : ressource **Cultures** (Create/Read/Update/Delete)

## Technologies (versions)

- Node.js : >= 20
- Backend : Express 5, Prisma 7
- Frontend : React 18, Vite 6, React Router (BrowserRouter)
- Auth : Clerk
- Styles/UI : Tailwind + composants UI déjà présents dans le projet

## Démarrage local

### 1) Backend

```bash
cd Nomina-backend
npm install
npm run dev
```

Backend : `http://localhost:3000`

### 2) Frontend (web)

```bash
cd Nomina-frontend
npm install
npm run dev
```

Frontend : `http://localhost:5173`

## Variables d’environnement (sans secrets)

### Backend (Nomina-backend/.env)

- `DATABASE_URL` : connexion Prisma
- `CLERK_SECRET_KEY` : clé serveur Clerk
- `ADMIN_CLERK_USER_ID` : userId Clerk de l’admin
- `CORS_ORIGIN` : origin(s) autorisées, ex. `http://localhost:5173`
- `PORT` : port du backend

### Frontend (Nomina-frontend/.env.local)

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

- Monorepo : (à remplir) https://github.com/Nocturne1975/Nomina-backend.git
                         https://github.com/Nocturne1975/Nomina-frontend.git
