# Guide Pratique : Publier des Articles via l'API FleetCrew Blog

Ce guide vous explique comment publier des articles sur le blog FleetCrew en utilisant l'API REST, que ce soit manuellement ou via des tâches planifiées.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

1. **La clé API** : `SCHEDULED_TASK_API_KEY` (configurée dans les secrets du projet)
2. **L'URL de l'API** : `https://votre-domaine.com/api/articles/create`
3. **Un éditeur de texte** pour rédiger votre article en Markdown

---

## 🚀 Méthode 1 : Publication Simple (Recommandée)

Cette méthode est la plus simple et fonctionne pour 95% des cas.

### Étape 1 : Préparer votre article

Créez un fichier Markdown (`.md`) avec votre contenu :

```markdown
# Titre de votre article

## Introduction

Votre introduction ici...

## Section 1

Contenu de la section...

## Conclusion

Votre conclusion...
```

### Étape 2 : Créer le fichier JSON

Créez un fichier `article.json` avec cette structure :

```json
{
  "title": "Titre de votre article",
  "content": "",
  "excerpt": "Résumé court de l'article (150-200 caractères)",
  "categorySlug": "conformite-saaq",
  "tagSlugs": ["tag1", "tag2", "tag3"],
  "generateCoverImage": true,
  "status": "published"
}
```

**Catégories disponibles :**
- `mecanique-maintenance`
- `technologies-innovation`
- `intelligence-artificielle`
- `gestion-de-flottes`
- `conformite-saaq`
- `actualites`
- `transport`
- `maintenance-predictive`
- `logiciels-gestion`
- `diagnostic-codes-erreur`
- `camions`
- `vehicules-hors-routes`

### Étape 3 : Insérer le contenu dans le JSON

Utilisez ce script Python pour combiner votre article et le JSON :

```python
import json

# Lire votre article Markdown
with open('mon_article.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Lire le JSON
with open('article.json', 'r', encoding='utf-8') as f:
    payload = json.load(f)

# Insérer le contenu
payload['content'] = content

# Sauvegarder le JSON final
with open('article_final.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)

print("✓ Article prêt à être publié!")
```

### Étape 4 : Publier via l'API

Utilisez `curl` pour envoyer votre article :

```bash
curl -X POST https://votre-domaine.com/api/articles/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_CLE_API" \
  -d @article_final.json
```

**Réponse attendue :**
```json
{
  "success": true,
  "article": {
    "id": 123456,
    "slug": "titre-de-votre-article-abc123",
    "title": "Titre de votre article",
    "url": "/articles/titre-de-votre-article-abc123"
  }
}
```

---

## 🎯 Méthode 2 : Publication Avancée (Tâches Planifiées)

Cette méthode est utilisée par les tâches planifiées automatiques et inclut la recherche, la rédaction et la publication.

### Workflow Complet

```
1. Recherche → 2. Rédaction → 3. Préparation → 4. Publication
```

### 1. Recherche d'Actualité

Utilisez Perplexity ou le navigateur pour trouver des sujets pertinents :

```python
# Exemple de recherche avec l'outil search
queries = [
    "Quebec SAAQ truck regulations 2026",
    "nouvelles réglementations transport lourd Québec"
]
```

### 2. Rédaction de l'Article

Rédigez un article de **minimum 10 minutes de lecture** (environ 2000-2500 mots) :

**Structure recommandée :**
- Introduction accrocheuse avec statistique ou fait marquant
- 3-5 sections principales avec sous-titres
- Tableaux pour présenter des données comparatives
- Listes à puces pour les conseils pratiques
- Conclusion avec appel à l'action

**Intégration FleetCrew (IMPORTANT) :**

Intégrez subtilement 3 liens vers les services FleetCrew dans votre contenu :

```markdown
Pour faciliter cette conformité, des plateformes comme [FleetCrew Intelligence](https://fleetcrew-kb75upsk.manus.space) offrent des tableaux de bord intégrés...

Pour les pièces de rechange, [FleetParts](https://fleetparts.manus.space/) offre un catalogue complet...

Des plateformes de gestion d'inventaire comme [notre système](https://8xhpiqcen0qp.manus.space) permettent d'optimiser...
```

### 3. Préparation du JSON

Créez le payload JSON avec Python :

```python
import json

# Lire l'article
with open('article_recherche.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Créer le payload
payload = {
    "title": "Titre basé sur votre recherche",
    "content": content,
    "excerpt": "Résumé engageant de 150-200 caractères",
    "categorySlug": "conformite-saaq",  # Choisir selon le sujet
    "tagSlugs": ["saaq", "reglementation", "securite", "quebec"],
    "generateCoverImage": True,  # Génération automatique d'image
    "status": "published"
}

# Sauvegarder
with open('payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)
```

### 4. Publication

```bash
curl -X POST https://votre-domaine.com/api/articles/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${SCHEDULED_TASK_API_KEY}" \
  -d @payload.json | jq .
```

---

## 🎨 Génération Automatique d'Image

Lorsque `generateCoverImage: true`, l'API :

1. Analyse le titre et le contenu de l'article
2. Génère un prompt optimisé pour l'IA
3. Crée une image de couverture pertinente
4. Stocke l'image sur S3
5. Associe l'image à l'article

**Temps de génération :** 5-15 secondes

**Exemple de prompt généré :**
```
A professional illustration showing a futuristic holographic truck 
with safety icons and digital interface elements, representing 
Quebec road safety regulations and fleet management technology
```

---

## ✅ Checklist de Publication

Avant de publier, vérifiez :

- [ ] **Titre** : Clair, engageant, 60-80 caractères
- [ ] **Excerpt** : Résumé accrocheur, 150-200 caractères
- [ ] **Contenu** : Minimum 2000 mots (10 min de lecture)
- [ ] **Catégorie** : Slug correct parmi les 12 disponibles
- [ ] **Tags** : 4-6 tags pertinents
- [ ] **Liens FleetCrew** : 3 liens contextuels intégrés
- [ ] **Structure** : Titres H2/H3, tableaux, listes
- [ ] **Markdown** : Syntaxe correcte (gras, liens, etc.)
- [ ] **Image** : `generateCoverImage: true` activé
- [ ] **Statut** : `published` pour publication immédiate

---

## 🔧 Dépannage

### Erreur : "Invalid API Key"

**Cause :** La clé API est incorrecte ou manquante.

**Solution :**
```bash
# Vérifier que la clé est définie
echo $SCHEDULED_TASK_API_KEY

# Si vide, la définir
export SCHEDULED_TASK_API_KEY="votre_cle_ici"
```

### Erreur : "Category not found"

**Cause :** Le slug de catégorie n'existe pas.

**Solution :** Utilisez un des slugs valides listés dans la section "Catégories disponibles".

### Erreur : "Invalid JSON"

**Cause :** Le JSON est mal formaté.

**Solution :** Utilisez toujours Python avec `json.dump()` pour garantir un JSON valide :

```python
import json

payload = {...}

# Ceci garantit un JSON valide
with open('payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)
```

### L'image ne se génère pas

**Cause :** Le service de génération d'images peut prendre du temps ou échouer.

**Solution :** 
1. Vérifiez que `generateCoverImage: true`
2. Attendez 15-20 secondes
3. Si échec, l'article sera publié sans image (vous pourrez l'ajouter manuellement après)

---

## 📊 Exemple Complet : Publication d'un Article

Voici un exemple complet de A à Z :

### 1. Créer l'article (`article.md`)

```markdown
# Les Nouvelles Normes de Sécurité pour Camions au Québec

## Introduction

Le Québec a récemment introduit de nouvelles normes de sécurité...

## Les Changements Majeurs

### Dispositif de Consignation Électronique

Les entreprises doivent maintenant...

Pour gérer efficacement ces données, [FleetCrew Intelligence](https://fleetcrew-kb75upsk.manus.space) offre...

## Conclusion

Ces changements représentent une opportunité...
```

### 2. Créer le script de publication (`publish.py`)

```python
import json
import subprocess

# Lire l'article
with open('article.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Créer le payload
payload = {
    "title": "Les Nouvelles Normes de Sécurité pour Camions au Québec",
    "content": content,
    "excerpt": "Découvrez les nouvelles normes SAAQ 2026 et leur impact sur votre flotte de camions.",
    "categorySlug": "conformite-saaq",
    "tagSlugs": ["saaq", "securite", "normes", "quebec", "camions"],
    "generateCoverImage": True,
    "status": "published"
}

# Sauvegarder le JSON
with open('payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)

# Publier via curl
result = subprocess.run([
    'curl', '-X', 'POST',
    'https://votre-domaine.com/api/articles/create',
    '-H', 'Content-Type: application/json',
    '-H', f'X-API-Key: {os.environ["SCHEDULED_TASK_API_KEY"]}',
    '-d', '@payload.json'
], capture_output=True, text=True)

print(result.stdout)
```

### 3. Exécuter

```bash
python3 publish.py
```

### 4. Résultat

```json
{
  "success": true,
  "article": {
    "id": 450001,
    "slug": "les-nouvelles-normes-de-securite-pour-camions-au-quebec-xyz789",
    "title": "Les Nouvelles Normes de Sécurité pour Camions au Québec",
    "url": "/articles/les-nouvelles-normes-de-securite-pour-camions-au-quebec-xyz789"
  }
}
```

---

## 🎓 Bonnes Pratiques

### Rédaction

1. **Commencez par une statistique ou un fait marquant** pour capter l'attention
2. **Utilisez des sous-titres clairs** (H2, H3) pour structurer le contenu
3. **Intégrez des tableaux** pour comparer des données
4. **Ajoutez des listes à puces** pour les conseils pratiques
5. **Terminez par un appel à l'action** vers les services FleetCrew

### SEO

1. **Titre** : Incluez le mot-clé principal et la localisation (Québec)
2. **Excerpt** : Résumé engageant avec bénéfice clair pour le lecteur
3. **Tags** : 4-6 tags pertinents incluant mots-clés et localisation
4. **Liens internes** : 3 liens vers services FleetCrew
5. **Longueur** : Minimum 2000 mots pour un bon référencement

### Intégration FleetCrew

**❌ Mauvais exemple** (trop promotionnel) :
```markdown
Utilisez FleetCrew Intelligence, le meilleur logiciel de gestion de flotte!
```

**✅ Bon exemple** (contextuel et subtil) :
```markdown
Pour faciliter cette conformité, des plateformes comme FleetCrew Intelligence 
offrent des tableaux de bord intégrés permettant de surveiller en temps réel 
le respect des heures de conduite.
```

---

## 📚 Ressources Supplémentaires

- **Documentation API complète** : Voir `API_DOCUMENTATION.md`
- **Exemples d'articles** : Consultez les articles existants sur le blog
- **Support** : Contactez fleetcrewteam@manus.bot

---

## 🔄 Workflow des Tâches Planifiées

Les 3 tâches planifiées suivent ce workflow :

### Lundi 19h - Actualités et Tendances
1. Recherche d'actualités récentes (Perplexity + navigation web)
2. Rédaction style journalistique avec statistiques
3. Catégories : Actualités, Conformité SAAQ, Transport
4. Publication automatique

### Mercredi 19h - Analyses Techniques
1. Recherche approfondie sur sujets techniques
2. Rédaction style guide pratique avec tutoriels
3. Catégories : Mécanique, Technologies, Maintenance Prédictive
4. Publication automatique

### Vendredi 19h - Innovation et Vision
1. Recherche sur innovations et tendances futures
2. Rédaction style prospectif et inspirant
3. Catégories : Intelligence Artificielle, Technologies, Innovation
4. Publication automatique

---

**Dernière mise à jour :** 7 février 2026
