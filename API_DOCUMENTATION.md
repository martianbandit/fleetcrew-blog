# FleetCrew Blog - API Documentation

## Authentification

L'API utilise une authentification par clé API. La clé API est basée sur le `JWT_SECRET` du projet.

### Header d'authentification

```
X-API-Key: <votre_jwt_secret>
```

ou

```
Authorization: Bearer <votre_jwt_secret>
```

## Endpoints

### Santé de l'API

```
GET /api/health
```

Vérifie que l'API fonctionne correctement.

**Réponse:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-02T16:00:00.000Z"
}
```

### Créer un article

```
POST /api/articles/create
Content-Type: application/json
X-API-Key: <votre_jwt_secret>
```

**Corps de la requête:**
```json
{
  "title": "Titre de l'article",
  "content": "Contenu de l'article en Markdown...",
  "excerpt": "Résumé optionnel de l'article",
  "categorySlug": "mecanique-maintenance",
  "tagSlugs": ["maintenance", "flotte"],
  "coverImage": "https://example.com/image.jpg",
  "generateCoverImage": true,
  "status": "published"
}
```

**Paramètres:**

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| title | string | Oui | Titre de l'article |
| content | string | Oui | Contenu de l'article (Markdown supporté) |
| excerpt | string | Non | Résumé de l'article (auto-généré si absent) |
| categorySlug | string | Non | Slug de la catégorie (défaut: première catégorie) |
| tagSlugs | array | Non | Liste des slugs de tags à associer |
| coverImage | string | Non | URL de l'image de couverture |
| generateCoverImage | boolean | Non | Générer automatiquement une image via IA |
| status | string | Non | "draft", "published" ou "archived" (défaut: "published") |

**Réponse succès:**
```json
{
  "success": true,
  "article": {
    "id": 123,
    "slug": "titre-de-larticle-abc123",
    "title": "Titre de l'article",
    "url": "/articles/titre-de-larticle-abc123"
  }
}
```

### Lister les catégories

```
GET /api/categories
X-API-Key: <votre_jwt_secret>
```

**Réponse:**
```json
{
  "categories": [
    { "id": 1, "name": "Mécanique & Maintenance", "slug": "mecanique-maintenance" },
    { "id": 2, "name": "Technologies & Innovation", "slug": "technologies-innovation" }
  ]
}
```

### Lister les tags

```
GET /api/tags
X-API-Key: <votre_jwt_secret>
```

**Réponse:**
```json
{
  "tags": [
    { "id": 1, "name": "Maintenance", "slug": "maintenance" },
    { "id": 2, "name": "Flotte", "slug": "flotte" }
  ]
}
```

## Catégories disponibles

| Slug | Nom |
|------|-----|
| mecanique-maintenance | Mécanique & Maintenance |
| technologies-innovation | Technologies & Innovation |
| intelligence-artificielle | Intelligence Artificielle |
| gestion-de-flottes | Gestion de Flottes |
| conformite-saaq | Conformité SAAQ |
| actualites | Actualités |
| transport | Transport |
| maintenance-predictive | Maintenance Prédictive |
| logiciels-gestion | Logiciels de Gestion |
| diagnostic-codes-erreur | Diagnostic & Codes d'Erreur |
| camions | Camions |
| vehicules-hors-routes | Véhicules Hors Routes |

## Services FleetCrew à référencer

Lors de la création d'articles, incluez des liens vers ces services:

- **FleetParts** (https://fleetparts.manus.space/) - Marketplace de pièces de camions
- **FleetCrew Intelligence** (https://fleetcrew-kb75upsk.manus.space) - Intelligence opérationnelle
- **Gestion d'Inventaire** (https://8xhpiqcen0qp.manus.space) - Système de gestion d'inventaire

## Exemple d'utilisation avec cURL

```bash
# Créer un article avec génération d'image automatique
curl -X POST https://fleetcrew.blog/api/articles/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_JWT_SECRET" \
  -d '{
    "title": "Les meilleures pratiques de maintenance préventive",
    "content": "## Introduction\n\nLa maintenance préventive est essentielle...\n\n## Liens utiles\n\nDécouvrez [FleetParts](https://fleetparts.manus.space/) pour vos pièces.",
    "categorySlug": "maintenance-predictive",
    "tagSlugs": ["maintenance", "flotte", "quebec"],
    "generateCoverImage": true,
    "status": "published"
  }'
```

## Exemple d'utilisation avec Python

```python
import requests

API_URL = "https://fleetcrew.blog/api/articles/create"
API_KEY = "VOTRE_JWT_SECRET"

article_data = {
    "title": "L'IA révolutionne la gestion de flottes",
    "content": """## Introduction

L'intelligence artificielle transforme la façon dont les entreprises gèrent leurs flottes de véhicules au Québec.

## Avantages de l'IA

- Maintenance prédictive
- Optimisation des routes
- Réduction des coûts

## Découvrez nos services

- [FleetCrew Intelligence](https://fleetcrew-kb75upsk.manus.space) pour l'analyse de données
- [FleetParts](https://fleetparts.manus.space/) pour vos pièces de rechange
""",
    "categorySlug": "intelligence-artificielle",
    "tagSlugs": ["ia", "flotte", "technologie"],
    "generateCoverImage": True,
    "status": "published"
}

response = requests.post(
    API_URL,
    json=article_data,
    headers={
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
)

print(response.json())
```

## Notes importantes

1. **Clé API**: La clé API est le `JWT_SECRET` de votre projet. Ne la partagez jamais publiquement.

2. **Génération d'images**: L'option `generateCoverImage: true` utilise l'IA pour créer une image de couverture pertinente. Cela peut prendre quelques secondes supplémentaires.

3. **Liens FleetCrew**: Incluez toujours des liens vers les services FleetCrew dans vos articles pour améliorer la visibilité de l'écosystème.

4. **Format Markdown**: Le contenu supporte le Markdown complet, y compris les titres, listes, liens, images et blocs de code.
