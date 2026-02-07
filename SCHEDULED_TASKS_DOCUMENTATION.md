# FleetCrew Blog - Documentation des Tâches Planifiées

## Vue d'ensemble

Le blog FleetCrew utilise 3 tâches planifiées automatiques pour publier du contenu diversifié et de haute qualité 3 fois par semaine. Chaque tâche a un angle éditorial unique, utilise des méthodologies de recherche différentes, et génère une image de couverture dans un style cyberpunk distinctif.

> **Guide de référence :** Chaque tâche doit consulter le fichier [GUIDE_PUBLICATION_API.md](./GUIDE_PUBLICATION_API.md) pour les bonnes pratiques de publication, la checklist et les conseils SEO.

## Architecture des Tâches

### Calendrier de Publication

| Jour | Heure | Tâche | Focus | Style Image |
|------|-------|-------|-------|-------------|
| Lundi | 19h00 | Publication Actualités | News et tendances du secteur | Vert Néon / Atelier |
| Mercredi | 19h00 | Publication Technique | Guides pratiques et analyses | Violet-Orange / Cyberpunk |
| Vendredi | 19h00 | Publication Innovation | Vision prospective et futur | Bleu Cyan-Rose / Futuriste |

**Fuseau horaire :** Heure de l'Est (ET) - Québec

---

## Images de Couverture : Alternance de 3 Styles

Chaque tâche utilise un prompt d'image spécifique pour maintenir une identité visuelle cohérente tout en offrant de la variété. Le style est inspiré du cyberpunk industriel avec des camions hyper-détaillés, des éclairages néon et des personnages cybernétiques.

### Prompt 1 - LUNDI (Vert Néon / Atelier Mécanique)

```
A hyper-detailed cyberpunk heavy truck (Peterbilt style) in a futuristic mechanic workshop, exposed engine with visible circuit board patterns and glowing green neon lights, a small cybernetic robot mechanic kneeling beside the truck working on the wheel, green neon LED strips illuminating the floor and truck body, holographic diagnostic screens floating in the background showing data charts, dark industrial atmosphere, metallic textures, chrome details, scattered mechanic tools and tires on the ground, ultra-realistic CGI render, 8K quality, cinematic lighting with dominant green and teal neon glow
```

### Prompt 2 - MERCREDI (Violet/Orange / Personnage Cyberpunk)

```
A massive cyberpunk semi-truck (Kenworth style) with transparent body panels revealing intricate internal machinery and glowing purple and orange circuit patterns, a mysterious hooded cybernetic figure standing beside the truck with red glowing eyes, futuristic garage environment with neon tube lights on ceiling, orange amber underglow on the truck, purple and magenta holographic displays on walls, wet metallic floor reflecting neon lights, industrial cables and pipes visible, ultra-detailed mechanical components, photoreal CGI render, 8K quality, cinematic dark atmosphere with purple magenta and warm orange neon lighting
```

### Prompt 3 - VENDREDI (Bleu Cyan / Skyline Futuriste)

```
A chrome-plated cyberpunk heavy truck (Western Star style) with transparent glass-like body showing complex blue-lit internal systems, a sleek humanoid chrome robot standing next to the truck, futuristic city skyline visible through large workshop window with pink and blue neon buildings, bright cyan and electric blue LED strips along truck frame and wheels, holographic fleet management dashboard floating above the truck hood, polished metal floor with blue neon grid lines, high-tech diagnostic equipment around, ultra-realistic CGI render, 8K quality, cinematic lighting with dominant cyan blue and pink magenta neon accents
```

### Processus de Génération d'Image

Les tâches planifiées **ne doivent PAS** utiliser `generateCoverImage: true`. À la place, elles doivent :

1. Générer l'image avec le prompt correspondant au jour de la semaine
2. Uploader l'image sur S3 via `storagePut`
3. Utiliser le champ `coverImage` avec l'URL S3 retournée

---

## Tâche 1 : Publication Lundi (Actualités)

### Objectif
Publier un article d'actualité captivant sur les dernières nouvelles du secteur du transport et de la gestion de flottes au Québec.

### Méthodologie de Recherche
1. **Recherche Perplexity (type: news)** - Dernières actualités
2. **Navigation web** - 2-3 sources gouvernementales ou médias spécialisés
3. **Sauvegarde des faits clés** - Statistiques, citations, données

### Sujets Couverts
- Nouvelles réglementations SAAQ/MTQ
- Tendances du marché du transport québécois
- Innovations récentes dans les camions
- Statistiques de l'industrie
- Événements majeurs du secteur

### Catégories Utilisées
- `actualites` - Nouvelles générales
- `conformite-saaq` - Réglementations
- `transport` - Industrie du transport
- `camions` - Véhicules spécifiques

### Style d'Écriture
- **Ton :** Journalistique et factuel
- **Longueur :** 2500+ mots (minimum 10 minutes de lecture)
- **Structure :** Titre accrocheur + 4-6 sections avec H2/H3 + tableaux de données + conclusion
- **Éléments clés :** Chiffres concrets, citations récentes, impact pour gestionnaires québécois

---

## Tâche 2 : Publication Mercredi (Technique)

### Objectif
Créer un guide pratique ou une analyse technique approfondie pour les gestionnaires de flottes et mécaniciens.

### Méthodologie de Recherche
1. **Recherche Perplexity (type: info + research)** - Informations techniques et études
2. **Navigation web** - 3-4 sources spécialisées (forums, manuels, bases de données)
3. **Sauvegarde des procédures** - Étapes, spécifications, tableaux de diagnostic

### Sujets Couverts
- Diagnostic de codes d'erreur (DTC)
- Procédures de maintenance préventive
- Comparaison de systèmes télématiques
- Optimisation de carburant
- Gestion des pneus et chaînes hivernales
- Systèmes de freinage avancés
- Entretien DEF/SCR
- Logiciels GMAO

### Catégories Utilisées
- `mecanique-maintenance` - Entretien et réparation
- `diagnostic-codes-erreur` - Diagnostic
- `logiciels-gestion` - Outils logiciels
- `maintenance-predictive` - Maintenance avancée
- `technologies-innovation` - Systèmes modernes

### Style d'Écriture
- **Ton :** Pédagogique et précis
- **Longueur :** 2500+ mots (minimum 10 minutes de lecture)
- **Structure :** Guide complet avec étapes numérotées + tableaux + checklist + erreurs à éviter
- **Éléments clés :** Instructions actionnables, termes techniques expliqués, astuces pro

---

## Tâche 3 : Publication Vendredi (Innovation)

### Objectif
Créer un article inspirant sur les innovations et tendances futures qui transformeront la gestion de flottes.

### Méthodologie de Recherche
1. **Recherche multi-sources Perplexity** - research (études) + news (innovations) + info (contexte)
2. **Navigation web** - 4-5 sources diverses (constructeurs, médias tech, think tanks, startups, gouvernement)
3. **Sauvegarde des projections** - Dates, coûts, citations de leaders, études de cas

### Sujets Couverts
- Camions autonomes
- Transition électrique/hydrogène
- Intelligence artificielle et ML
- Blockchain pour supply chain
- Réalité augmentée pour formation
- Jumeaux numériques (digital twins)
- Connectivité 5G et IoT
- Économie circulaire
- Carburants alternatifs
- Plateformes collaboratives

### Catégories Utilisées
- `intelligence-artificielle` - IA et ML
- `technologies-innovation` - Innovations générales
- `maintenance-predictive` - Maintenance avancée
- `gestion-de-flottes` - Stratégie globale
- `vehicules-hors-routes` - Véhicules spéciaux

### Style d'Écriture
- **Ton :** Visionnaire mais réaliste
- **Longueur :** 2500+ mots (minimum 10 minutes de lecture)
- **Structure :** État des lieux + technologies émergentes + scénarios 2028-2030 + préparation + vision
- **Éléments clés :** Timeline, projections chiffrées, storytelling, questions rhétoriques

---

## Intégration FleetCrew (Obligatoire)

Chaque article DOIT inclure 3 liens contextuels vers les services FleetCrew, intégrés de manière subtile et naturelle (jamais promotionnelle).

### Services à Référencer

| Service | URL | Contexte d'utilisation |
|---------|-----|------------------------|
| FleetCrew Intelligence | https://fleetcrew-kb75upsk.manus.space | Analyse de données, intelligence opérationnelle |
| FleetParts | https://fleetparts.manus.space/ | Pièces, équipements, marketplace |
| Gestion d'Inventaire | https://8xhpiqcen0qp.manus.space | Optimisation des stocks, gestion d'inventaire |

### Exemples d'Intégration Naturelle

**Bon exemple (contextuel) :**
> "Pour faciliter cette conformité, des plateformes comme [FleetCrew Intelligence](https://fleetcrew-kb75upsk.manus.space) offrent des tableaux de bord intégrés permettant de surveiller en temps réel le respect des heures de conduite."

**Mauvais exemple (promotionnel) :**
> "Utilisez FleetCrew Intelligence, le meilleur logiciel de gestion de flotte!"

---

## Processus de Publication Automatique

### Flux de Travail

```
1. Déclenchement (cron lundi/mercredi/vendredi 19h)
   ↓
2. Consulter GUIDE_PUBLICATION_API.md pour bonnes pratiques
   ↓
3. Recherche Perplexity + Navigation web (2-5 sources)
   ↓
4. Sauvegarde des données dans fichier temporaire
   ↓
5. Rédaction de l'article (2500+ mots, 10 min de lecture)
   ↓
6. Sélection catégorie + 4-6 tags
   ↓
7. Génération image avec prompt du jour (vert/violet/bleu)
   ↓
8. Upload image sur S3
   ↓
9. Création payload JSON avec Python json.dump()
   ↓
10. Publication via API REST (POST /api/articles/create)
   ↓
11. Vérification de la publication
```

### Endpoint API

```bash
POST https://fleetcrew.blog/api/articles/create
```

### Authentification

```
X-API-Key: $SCHEDULED_TASK_API_KEY
```

### Paramètres de Publication

```json
{
  "title": "Titre de l'article",
  "content": "Contenu Markdown complet (2500+ mots)...",
  "excerpt": "Résumé de 150-200 caractères",
  "categorySlug": "slug-de-categorie",
  "tagSlugs": ["tag1", "tag2", "tag3", "tag4"],
  "coverImage": "https://url-s3-de-limage-generee.jpg",
  "status": "published"
}
```

**Important :** Utiliser `coverImage` avec l'URL S3 de l'image générée, **PAS** `generateCoverImage: true`.

---

## Gestion des Tags

### Tags Recommandés par Thème

| Thème | Tags suggérés |
|-------|--------------|
| Actualités | maintenance, flotte, quebec, saaq, technologie, innovation, reglementation, transport, camions, securite |
| Technique | maintenance, diagnostic, tutoriel, guide, mecanique, reparation, preventif, systeme, equipement, formation |
| Innovation | innovation, futur, technologie, ia, autonome, electrique, transformation, strategie, tendance, 2030 |

Les tags sont automatiquement créés lors de la publication si le slug n'existe pas.

---

## Activation des Tâches

**Important :** Les tâches ont été créées mais ne sont **pas encore activées**.

Pour les activer, l'utilisateur doit :
1. Accéder à l'interface de gestion des tâches planifiées dans Manus
2. Activer chacune des 3 tâches individuellement
3. Vérifier que les horaires sont corrects (19h00 ET)

Une fois activées, les tâches s'exécuteront automatiquement chaque semaine selon le calendrier défini.

---

## Dépannage

### Problème : Aucun article n'est publié

1. Vérifier que les tâches sont activées dans l'interface Manus
2. Vérifier que SCHEDULED_TASK_API_KEY est configurée
3. Tester l'API manuellement avec curl
4. Consulter les logs des tâches

### Problème : Image de couverture non générée

1. Vérifier que le prompt d'image est correct pour le jour
2. Vérifier que l'upload S3 a réussi
3. Tester la génération d'image manuellement

### Problème : Catégorie ou tags invalides

1. Consulter la liste des catégories : `GET /api/categories`
2. Consulter la liste des tags : `GET /api/tags`
3. Utiliser les slugs exacts (ex: `mecanique-maintenance`, pas `mecanique_maintenance`)

---

## Contact et Support

Pour toute question ou problème avec les tâches planifiées :
- Email : fleetcrewteam@manus.bot
- Documentation API : [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Guide de publication : [GUIDE_PUBLICATION_API.md](./GUIDE_PUBLICATION_API.md)
- Support Manus : https://help.manus.im

---

*Dernière mise à jour : 7 février 2026*
