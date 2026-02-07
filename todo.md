# FleetCrew Blog - TODO

## Pages principales
- [x] Page d'accueil avec présentation du blog et thématiques
- [x] Page listing des articles avec filtres et recherche
- [x] Pages d'articles individuels avec contenu riche
- [x] Section innovations FleetCrew
- [x] Interface d'administration pour gérer les articles

## Système de contenu
- [x] Schéma base de données (articles, catégories, tags, newsletter)
- [x] Routes API tRPC pour articles
- [x] Routes API tRPC pour catégories
- [x] Routes API tRPC pour tags
- [x] Routes API tRPC pour newsletter

## Catégories d'articles
- [x] Mécanique & Maintenance
- [x] Technologies & Innovation
- [x] Intelligence Artificielle
- [x] Gestion de Flottes
- [x] Conformité SAAQ
- [x] Actualités

## Fonctionnalités
- [x] Système de catégories pour organiser les articles
- [x] Système de tags pour améliorer la découvrabilité
- [x] Formulaire d'inscription newsletter
- [x] Stockage des abonnés newsletter
- [x] Filtres par catégorie
- [x] Recherche d'articles

## Innovations FleetCrew
- [x] Conformité Automatisée
- [x] Interface Mains Sales
- [x] Maintenance Prédictive
- [x] Optimisation de Flotte

## Design et UX
- [x] Design élégant et professionnel
- [x] Responsive mobile et desktop
- [x] Mode sombre
- [x] Footer avec liens ressources externes (SAAQ, MTQ, CNESST, Carfax, AQTR, ATA, Fleet Owner)

## Tests
- [x] Tests unitaires pour les routes API (catégories, tags, articles, newsletter)
- [x] Tests de contrôle d'accès admin

## Partage réseaux sociaux
- [x] Composant de partage social (Facebook, Twitter/X, LinkedIn, Email)
- [x] Intégration dans la page d'article
- [x] Bouton de copie de lien

## SEO
- [x] Ajouter meta description à la page d'accueil
- [x] Ajouter meta keywords à la page d'accueil
- [x] Ajouter meta tags Open Graph (Facebook)
- [x] Ajouter meta tags Twitter
- [x] Ajouter URL canonique
- [x] Changer la langue en français (fr)

## Publication planifiée
- [x] Analyser les services FleetCrew (FleetParts, KB, Diagnostic)
- [x] Ajouter nouvelles catégories (Transport, Maintenance Prédictive, Logiciels, Diagnostic, Camions, Véhicules hors routes)
- [x] Configurer tâche planifiée (lundi, mercredi, vendredi à 19h)
- [x] Intégrer liens vers services FleetCrew dans les articles

## Flux RSS et Contact
- [x] Créer endpoint API pour flux RSS
- [x] Ajouter icône FleetCrew dans le Header (visible sur chaque page)
- [x] Créer page/formulaire de contact avec email fleetcrewteam@manus.bot
- [x] Ajouter bouton RSS dans le footer
- [x] Ajouter lien RSS dans le head HTML
- [x] Ajouter table contactMessages dans la base de données
- [x] Ajouter liens vers services FleetCrew dans le footer
- [x] Améliorer système de newsletter avec workflow (variant full avec avantages)

## Génération d'images automatique
- [x] Créer route API pour générer des images à partir du contenu d'article
- [x] Intégrer bouton de génération dans l'interface d'administration
- [x] Sauvegarder les images générées dans S3
- [x] Afficher l'image générée comme couverture de l'article
- [x] Utiliser LLM pour créer des prompts optimisés
- [x] Aperçu de l'image dans le formulaire

## SEO Avancé
- [x] Créer sitemap.xml dynamique
- [x] Ajouter robots.txt
- [x] Meta tags dynamiques par article (titre, description, image)
- [x] Schema.org markup pour articles (Article, BlogPosting)
- [x] Breadcrumbs structurés

## Statistiques et Analytics
- [x] Compteur de vues par article
- [x] Temps de lecture moyen
- [x] Articles les plus populaires
- [x] Dashboard statistiques dans l'admin
- [x] Graphiques de tendances
- [x] Bouton J'aime avec compteur
- [x] Tracking du scroll depth

## Engagement utilisateur
- [x] Système de commentaires
- [x] Bouton "J'aime" sur les articles
- [x] Articles similaires/recommandés
- [x] Temps de lecture estimé affiché
- [x] Progression de lecture (barre de défilement)

## Contenu enrichi
- [x] Support des vidéos YouTube/Vimeo intégrées
- [x] Galeries d'images dans les articles
- [x] Table des matières automatique
- [x] Blocs de code avec coloration syntaxique (via Streamdown)
- [x] Citations et encadrés stylisés (via prose classes)

## Performance et Accessibilité
- [x] Lazy loading des images
- [x] Optimisation des images (via S3 et lazy loading)
- [x] Mode hors ligne (PWA)
- [x] Accessibilité WCAG 2.1 (skip to content, aria labels, focus visible)
- [x] Tests de performance Lighthouse

## Fonctionnalités avancées
- [x] Mode multi-auteurs
- [x] Planification de publication d'articles
- [x] Versions brouillon avec prévisualisation
- [x] Import/Export d'articles (Markdown, JSON)
- [x] Sauvegarde automatique des brouillons (via formulaire)

## Intégrations externes
- [x] Google Analytics 4
- [x] Hotjar ou équivalent pour heatmaps
- [x] Mailchimp pour newsletter avancée
- [x] Algolia pour recherche avancée
- [x] Cloudflare pour CDN et sécurité

## Monétisation (optionnel)
- [x] Espaces publicitaires
- [x] Articles sponsorisés
- [x] Abonnement premium
- [x] Contenu exclusif pour abonnés

## Bugs à corriger
- [x] Problème de connexion utilisateur (fonctionne - OAuth Manus opérationnel)

## Authentification API pour tâches planifiées
- [x] Créer système d'authentification par clé API
- [x] Créer endpoint API REST pour publication d'articles (sans OAuth)
- [x] Générer clé API sécurisée pour les tâches planifiées (utilise JWT_SECRET)
- [x] Mettre à jour les instructions des tâches planifiées
- [x] Documenter l'utilisation de l'API (API_DOCUMENTATION.md)

## API REST complète
- [x] Configurer SCHEDULED_TASK_API_KEY dans les secrets
- [x] Implémenter endpoint GET /api/articles (lister les articles)
- [x] Implémenter endpoint GET /api/articles/:id (obtenir un article)
- [x] Implémenter endpoint PUT /api/articles/:id (mettre à jour un article)
- [x] Implémenter endpoint DELETE /api/articles/:id (supprimer un article)
- [x] Implémenter endpoint PATCH /api/articles/:id/publish (publier un brouillon)
- [x] Mettre à jour la documentation API complète (API_DOCUMENTATION.md)

## Publication automatique avec Perplexity
- [x] Créer script de génération d'articles avec Perplexity API
- [x] Sélection aléatoire de catégories
- [x] Recherche d'actualité via Perplexity
- [x] Génération de contenu optimisé SEO
- [x] Insertion d'hyperliens vers services FleetCrew
- [x] Génération automatique d'image de couverture
- [x] Configuration de la tâche planifiée (lundi, mercredi, vendredi à 19h)

## Optimisation des tâches planifiées
- [x] Créer tâche lundi - Focus actualités et tendances (fleetcrew_monday_news)
- [x] Créer tâche mercredi - Focus technique et tutoriels (fleetcrew_wednesday_technical)
- [x] Créer tâche vendredi - Focus innovation et futur (fleetcrew_friday_innovation)

## Corrections article de test
- [x] Générer image de couverture pour l'article IA
- [x] Vérifier et corriger les tags de l'article (5 tags ajoutés)
- [ ] Mettre à jour le script de publication pour inclure image automatiquement

## Mise à jour tâches planifiées
- [x] Ajouter génération automatique d'image de couverture aux 3 tâches planifiées
  - fleetcrew_monday_news (lundi 19h) - actualités avec image
  - fleetcrew_wednesday_technical (mercredi 19h) - tutoriels avec image
  - fleetcrew_friday_innovation (vendredi 19h) - innovations avec image

## Corrections SEO page d'accueil
- [x] Réduire les mots-clés de 10 à 6 mots-clés ciblés
- [x] Ajuster la description meta de 164 à 158 caractères

## Diagnostic tâches planifiées
- [x] Diagnostiquer pourquoi les tâches planifiées ne publient pas d'articles
- [x] Vérifier la configuration de SCHEDULED_TASK_API_KEY
- [x] Tester les endpoints API manuellement
- [x] Créer les 3 tâches planifiées réelles dans le système Manus
  - [x] Tâche lundi 19h - Actualités et tendances avec Perplexity + navigateur
  - [x] Tâche mercredi 19h - Analyses techniques et cas pratiques avec recherche approfondie
  - [x] Tâche vendredi 19h - Innovation et vision prospective avec sources variées

## Documentation API
- [x] Créer un guide pratique de publication via l'API
- [x] Mettre à jour API_DOCUMENTATION.md avec le guide

## Mise à jour tâches planifiées v2
- [x] Créer 3 prompts d'image cyberpunk/néon basés sur le style visuel fourni
- [x] Mettre à jour les 3 tâches planifiées avec référence au guide API
- [x] Intégrer l'alternance des 3 prompts d'image dans les tâches
- [x] Mettre à jour la documentation SCHEDULED_TASKS_DOCUMENTATION.md

## Bug: Tâches planifiées - Erreur 401
- [x] Résoudre le problème: SCHEDULED_TASK_API_KEY non disponible dans l'environnement des tâches planifiées
- [x] Trouver une solution alternative d'authentification (clé API en dur dans les prompts)
- [x] Mettre à jour les 3 tâches planifiées avec la nouvelle approche
- [x] Tester la solution

## Bannière publicitaire FleetCrew Parts
- [x] Analyser le site https://fleetcrewparts.base44.app/home
- [x] Créer une image de bannière publicitaire attractive
- [x] Intégrer la bannière avec lien dans le blog
- [x] Tester l'affichage et le lien

## Bannière publicitaire FleetInspect
- [x] Créer une bannière mettant en avant l'IA et l'industrie du camion
- [x] Configurer l'alternance automatique entre FleetCrew Parts et FleetInspect
- [x] Tester l'affichage et le lien

## Emplacements publicitaires statiques (Header & Footer)
- [x] Analyser la structure actuelle du header et footer
- [x] Créer un composant HeaderAd pour le header
- [x] Créer un composant FooterAd pour le footer
- [x] Intégrer HeaderAd dans toutes les pages
- [x] Intégrer FooterAd dans toutes les pages
- [x] Optimiser selon les bonnes pratiques (lazy loading, accessibilité, performance)
- [x] Tester l'affichage sur toutes les pages

## Optimisation emplacements publicitaires
- [x] Auditer HeaderAd et FooterAd sur toutes les pages (7 pages vérifiées)
- [x] Optimiser la visibilité (contraste, taille, espacement)
- [x] Assurer la cohérence visuelle entre les pages (gradients, badges, couleurs)
- [x] Optimiser pour mobile (responsive, hidden sm)
- [x] Tester sur toutes les pages (Management UI Preview fonctionnel)
