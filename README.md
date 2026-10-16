# MIJOTÉ · Application de recettes

Application React 19 et TypeScript pour parcourir les recettes DummyJSON, filtrer le catalogue, consulter une recette, préparer une liste de courses et proposer une recette après connexion.

## Démarrer

Prérequis : Node.js 24+ et Bun (le dépôt contient `bun.lock`). L’URL de l’API publique est définie dans `.env`.

```sh
bun install
bun run dev
```

`bun run build` vérifie TypeScript puis génère la version de production dans `dist/`. `bun run lint` lance Oxlint.

## Fonctionnalités

- Catalogue avec recherche différée, filtre par type de repas et tri, synchronisés à l’URL.
- Fiche recette, liste d’ingrédients et instructions provenant de DummyJSON.
- Liste de courses persistée dans le navigateur, cochage des ingrédients et suppression par recette.
- Connexion DummyJSON et accès protégé au formulaire de proposition.
- États de chargement, d’erreur avec nouvelle tentative, de liste vide et route 404.
- Interface responsive, pensée pour le mobile; contenu des recettes en anglais, interface en français.

Compte de test DummyJSON : `emilys` / `emilyspass`.

## Choix techniques

- React Router (`react-router`) pour les routes et les paramètres de recherche.
- `useFetch` annule les requêtes obsolètes avec `AbortController`.
- Les contextes centralisent l’authentification et la liste de courses; cette dernière est gérée par reducer et conservée dans `localStorage`.
- Aucune bibliothèque de composants, de formulaires ou de styles n’est utilisée.

## Utilisation de l’IA

L’assistance ci-dessous a servi à compléter les parcours de l’application. Le code a été adapté à l’arborescence et aux contrats présents dans le dépôt, puis contrôlé avec le build de production.

| Élément | Déclaration |
| --- | --- |
| Fournisseur / modèle | GitHub Copilot dans VS Code. Le nom précis du modèle n’était pas exposé dans cette session. |
| Prompt exact | « peut tu finr le projet » avec le sujet MIJOTÉ et le guide de développement fournis dans la conversation. |
| Réponse obtenue | Implémentation des hooks, contextes, catalogue, fiche recette, liste de courses, connexion, formulaire protégé, styles et documentation. |
| Pourquoi l’IA | Accélérer l’assemblage d’écrans interdépendants pendant le TP; les contrats de l’API, React Router et TypeScript restent vérifiables dans leurs documentations officielles. |
| Adaptations et vérifications | Adaptation aux types, services et composants du dépôt; vérification de la gestion des erreurs HTTP, de l’annulation, de l’accessibilité et des états d’interface. Le build `bun run build` a été exécuté. |

Le modèle affiché par VS Code peut être ajouté à cette déclaration si l’enseignant demande son nom précis.
