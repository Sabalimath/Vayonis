# Vayonis

Vayonis est une interface SaaS de gestion des réseaux sociaux. Elle centralise la connexion des comptes, la création de publications, la programmation et le suivi d'une présence sociale depuis un espace unique.

## Fonctionnalités

- Landing page responsive
- Connexion et inscription mockées
- Onboarding en trois étapes
- Protection frontend des routes privées
- Dashboard avec statistiques et publications
- Gestion mockée des comptes sociaux
- Création, programmation et sauvegarde de publications
- Calendrier éditorial mensuel et hebdomadaire
- États UI : loading, skeleton, empty state, erreurs, toasts et confirmations
- Persistance frontend via `localStorage`

## Stack technique

- React 19
- Vite
- React Router
- Lucide React
- Context API React
- CSS natif responsive

## Installation

```bash
npm install
```

## Lancement local

```bash
npm run dev
```

L'application est ensuite disponible sur l'URL indiquée par Vite, généralement `http://localhost:5173`.

Pour générer un build de production :

```bash
npm run build
```

## Structure du projet

```text
src/
  components/       Composants UI réutilisables
  layouts/          Layout principal de l'espace connecté
  pages/            Pages et parcours applicatifs
  routes/           Protection des routes privées
  state/            AuthContext et AppContext
  styles/           Design system et styles responsive
```

## Données mockées

Vayonis fonctionne actuellement sans backend. Les utilisateurs, comptes sociaux, publications, brouillons et réponses d'onboarding sont simulés côté frontend et persistés dans `localStorage`.

Les clés utilisées sont :

- `vayonis:auth`
- `vayonis:app`

Aucune donnée n'est envoyée à Facebook, Instagram, LinkedIn, TikTok, X ou à un serveur distant.

## Limites actuelles

- Aucune authentification réelle
- Aucun backend ni base de données
- Aucun OAuth pour les réseaux sociaux
- Les actions de paramètres et certaines pages secondaires restent mockées
- Les publications et statistiques ne représentent pas des données réelles
- Les fichiers média sont prévisualisés localement uniquement

## Roadmap

- Ajouter une API et une base de données
- Remplacer l'authentification mockée par une authentification sécurisée
- Intégrer OAuth pour les réseaux sociaux
- Connecter les publications à un vrai calendrier éditorial
- Ajouter l'édition persistée des publications
- Ajouter les statistiques et notifications en temps réel
- Compléter les pages Paramètres, Comptes et Calendrier avec des workflows backend
