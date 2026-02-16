
# Nomina-desktop — Electron + React (Vite)

Application desktop basée sur **Electron** avec une UI **React/TSX** (bundlée par **Vite**).

---

## Table des matières

- [Nomina-desktop — Electron + React (Vite)](#nomina-desktop--electron--react-vite)
  - [Table des matières](#table-des-matières)
  - [Présentation](#présentation)
  - [Architecture technique](#architecture-technique)
  - [Installation \& lancement](#installation--lancement)
    - [Prérequis](#prérequis)
    - [Dev (UI src)](#dev-ui-src)
    - [Dev (Electron)](#dev-electron)
    - [Dev (1 commande)](#dev-1-commande)
    - [Online + Desktop](#online--desktop)
    - [Offline (cache + outbox)](#offline-cache--outbox)
    - [Variables d'environnement (Vite)](#variables-denvironnement-vite)
  - [Structure du projet](#structure-du-projet)
  - [Contribution \& contact](#contribution--contact)
  - [Licence](#licence)

---

## Présentation

Nomina-desktop est une application graphique permettant de générer des noms (personnages, lieux, objets, etc.) et de les enrichir de mini-descriptions narratives. Elle vise les auteurs, MJ, créateurs de jeux ou toute personne en quête d’inspiration.

---

## Architecture technique

- **UI** : React 18 + TypeScript (TSX)
- **Dev server / build** : Vite
- **Desktop shell** : Electron
- **Styles** : Tailwind CSS (voir `src/styles/globals.css`)

---

## Installation & lancement

### Prérequis

- Node.js (LTS recommandé)

### Dev (UI src)

```bash
npm install
npm run dev
```

### Dev (Electron)

1) Démarrer Vite : `npm run dev`

2) Dans un autre terminal :

```bash
npm run electron:dev
```

### Dev (1 commande)

Lance Vite + Electron ensemble :

```bash
npm run app:dev
```

### Online + Desktop

- L'UI (Vite/React) peut tourner **en ligne** (déployée) et **en desktop** (Electron) sans changer le code.
- Les deux pointent vers le **même backend** via `VITE_API_BASE_URL`.

### Offline (cache + outbox)

- Les requêtes `GET` sont **mises en cache** localement et relues si le réseau est indisponible.
- Les mutations (`POST/PUT/PATCH/DELETE`) sont **mises en file d'attente (outbox)** hors-ligne et rejouées quand le réseau revient.
- La démo affiche l'état réseau + la taille de l'outbox.

### Variables d'environnement (Vite)

Créer un fichier `.env.local` à la racine de Nomina-desktop :

- `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`
- `VITE_API_BASE_URL=https://<ton-backend-azure>.azuresrcsites.net`
```

### Build

```bash
npm run build
npm run electron
```

---

## Structure du projet

- `electron/` : process principal Electron (fenêtre, chargement dev/prod)
- `src/` : UI React (TSX)
- `assets/` : ressources (images, icônes, etc.)

---

## Contribution & contact

- Pour contribuer : crée une issue ou une pull request sur le dépôt GitHub.
- Pour retours : soniacorbin4@gmail.com

> Nomina-desktop est un projet en cours. Contributions, idées et retours sont les bienvenus — ouvre une issue ou contacte-moi directement.

---

## Licence

MIT License — voir fichier LICENSE.
