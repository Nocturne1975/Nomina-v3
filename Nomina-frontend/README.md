# Nomina-frontend — React (Vite)

Interface web (frontend) **React/TSX** (bundlée par **Vite**) qui consomme l'API Nomina.

## Présentation

Nomina-frontend est une interface web permettant de générer des noms (personnages, lieux, objets, etc.) et de les enrichir de mini-descriptions narratives. Elle vise les auteurs, MJ, créateurs de jeux ou toute personne en quête d’inspiration.

## Stack

- **UI** : React 18 + TypeScript (TSX)
- **Routing** : React Router (BrowserRouter)
- **Dev server / build** : Vite
- **Styles** : Tailwind CSS (voir `src/styles/globals.css`)

## Installation & lancement

### Prérequis

- Node.js (LTS recommandé)

### Dev

```bash
npm install
npm run dev
```

### Variables d'environnement (Vite)

Créer un fichier `.env.local` à la racine de `Nomina-frontend` :

- `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`
- `VITE_API_BASE_URL=http://localhost:3000`

### Build

```bash
npm run build
```

## Structure du projet

- `src/` : UI React (TSX)
- `assets/` : ressources (images, icônes, etc.)

## Contact

- soniacorbin4@gmail.com
