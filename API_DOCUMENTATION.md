# FleetCrew Blog - API REST Documentation Complète

> 📘 **Nouveau !** Consultez le [Guide Pratique de Publication](./GUIDE_PUBLICATION_API.md) pour un tutoriel pas-à-pas avec exemples complets.

## Authentification

L'API utilise une authentification par clé API dédiée (`SCHEDULED_TASK_API_KEY`).

### Header d'authentification

```
X-API-Key: <votre_scheduled_task_api_key>
```

ou

```
Authorization: Bearer <votre_scheduled_task_api_key>
```

## Endpoints Disponibles

### Santé de l'API

```
GET /api/health
```

Vérifie que l'API fonctionne correctement. **Aucune authentification requise.**

**Réponse:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-02T16:00:00.000Z"
}
```

---

## Articles

### Créer un article

```
POST /api/articles/create
Content-Type: application/json
X-API-Key: <votre_api_key>
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

---

### Lister les articles

```
GET /api/articles?status=published&limit=10&offset=0
X-API-Key: <votre_api_key>
```

**Paramètres de requête:**

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| status | string | Non | Filtrer par statut: "draft", "published", "archived" |
| limit | number | Non | Nombre maximum d'articles à retourner |
| offset | number | Non | Nombre d'articles à sauter (pagination) |

**Réponse:**
```json
{
  "articles": [
    {
      "id": 123,
      "title": "Titre de l'article",
      "slug": "titre-de-larticle-abc123",
      "excerpt": "Résumé de l'article...",
      "status": "published",
      "categoryId": 1,
      "authorId": 1,
      "coverImage": "https://example.com/image.jpg",
      "publishedAt": "2026-01-02T16:00:00.000Z",
      "createdAt": "2026-01-02T15:00:00.000Z",
      "url": "/articles/titre-de-larticle-abc123"
    }
  ],
  "total": 50
}
```

---

### Obtenir un article par ID

```
GET /api/articles/:id
X-API-Key: <votre_api_key>
```

**Réponse:**
```json
{
  "article": {
    "id": 123,
    "title": "Titre de l'article",
    "slug": "titre-de-larticle-abc123",
    "excerpt": "Résumé de l'article...",
    "content": "Contenu complet de l'article en Markdown...",
    "status": "published",
    "categoryId": 1,
    "authorId": 1,
    "coverImage": "https://example.com/image.jpg",
    "featured": false,
    "readTime": 5,
    "views": 150,
    "likes": 12,
    "publishedAt": "2026-01-02T16:00:00.000Z",
    "createdAt": "2026-01-02T15:00:00.000Z",
    "updatedAt": "2026-01-02T15:30:00.000Z",
    "tags": [
      { "id": 1, "name": "Maintenance", "slug": "maintenance" },
      { "id": 2, "name": "Flotte", "slug": "flotte" }
    ],
    "url": "/articles/titre-de-larticle-abc123"
  }
}
```

---

### Mettre à jour un article

```
PUT /api/articles/:id
Content-Type: application/json
X-API-Key: <votre_api_key>
```

**Corps de la requête:**
```json
{
  "title": "Nouveau titre",
  "content": "Nouveau contenu...",
  "excerpt": "Nouveau résumé",
  "categorySlug": "technologies-innovation",
  "tagSlugs": ["technologie", "innovation"],
  "coverImage": "https://example.com/new-image.jpg",
  "generateCoverImage": false,
  "status": "published"
}
```

**Paramètres:** Tous les paramètres sont optionnels. Seuls les champs fournis seront mis à jour.

**Réponse:**
```json
{
  "success": true,
  "article": {
    "id": 123,
    "slug": "titre-de-larticle-abc123",
    "title": "Nouveau titre",
    "url": "/articles/titre-de-larticle-abc123"
  }
}
```

---

### Supprimer un article

```
DELETE /api/articles/:id
X-API-Key: <votre_api_key>
```

**Réponse:**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

---

### Publier un brouillon

```
PATCH /api/articles/:id/publish
X-API-Key: <votre_api_key>
```

Change le statut d'un article de "draft" à "published" et définit la date de publication.

**Réponse:**
```json
{
  "success": true,
  "article": {
    "id": 123,
    "slug": "titre-de-larticle-abc123",
    "title": "Titre de l'article",
    "status": "published",
    "publishedAt": "2026-01-02T16:00:00.000Z",
    "url": "/articles/titre-de-larticle-abc123"
  }
}
```

---

## Catégories

### Lister les catégories

```
GET /api/categories
X-API-Key: <votre_api_key>
```

**Réponse:**
```json
{
  "categories": [
    { "id": 1, "name": "Mécanique & Maintenance", "slug": "mecanique-maintenance" },
    { "id": 2, "name": "Technologies & Innovation", "slug": "technologies-innovation" },
    { "id": 3, "name": "Intelligence Artificielle", "slug": "intelligence-artificielle" },
    { "id": 4, "name": "Gestion de Flottes", "slug": "gestion-de-flottes" },
    { "id": 5, "name": "Conformité SAAQ", "slug": "conformite-saaq" },
    { "id": 6, "name": "Actualités", "slug": "actualites" },
    { "id": 7, "name": "Transport", "slug": "transport" },
    { "id": 8, "name": "Maintenance Prédictive", "slug": "maintenance-predictive" },
    { "id": 9, "name": "Logiciels de Gestion", "slug": "logiciels-gestion" },
    { "id": 10, "name": "Diagnostic & Codes d'Erreur", "slug": "diagnostic-codes-erreur" },
    { "id": 11, "name": "Camions", "slug": "camions" },
    { "id": 12, "name": "Véhicules Hors Routes", "slug": "vehicules-hors-routes" }
  ]
}
```

---

## Tags

### Lister les tags

```
GET /api/tags
X-API-Key: <votre_api_key>
```

**Réponse:**
```json
{
  "tags": [
    { "id": 1, "name": "Maintenance", "slug": "maintenance" },
    { "id": 2, "name": "Flotte", "slug": "flotte" },
    { "id": 3, "name": "Technologie", "slug": "technologie" }
  ]
}
```

---

## Services FleetCrew à référencer

Lors de la création d'articles, incluez des liens vers ces services:

- **FleetParts** (https://fleetparts.manus.space/) - Marketplace de pièces de camions
- **FleetCrew Intelligence** (https://fleetcrew-kb75upsk.manus.space) - Intelligence opérationnelle
- **Gestion d'Inventaire** (https://8xhpiqcen0qp.manus.space) - Système de gestion d'inventaire

---

## Exemples d'utilisation

### Exemple 1 : Créer un article avec génération d'image automatique

```bash
curl -X POST https://fleetcrew.blog/api/articles/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_API_KEY" \
  -d '{
    "title": "Les meilleures pratiques de maintenance préventive",
    "content": "## Introduction\n\nLa maintenance préventive est essentielle...\n\n## Liens utiles\n\nDécouvrez [FleetParts](https://fleetparts.manus.space/) pour vos pièces.",
    "categorySlug": "maintenance-predictive",
    "tagSlugs": ["maintenance", "flotte", "quebec"],
    "generateCoverImage": true,
    "status": "published"
  }'
```

### Exemple 2 : Lister tous les articles publiés

```bash
curl -X GET "https://fleetcrew.blog/api/articles?status=published&limit=20" \
  -H "X-API-Key: VOTRE_API_KEY"
```

### Exemple 3 : Mettre à jour un article existant

```bash
curl -X PUT https://fleetcrew.blog/api/articles/123 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_API_KEY" \
  -d '{
    "title": "Titre mis à jour",
    "content": "Contenu mis à jour...",
    "status": "published"
  }'
```

### Exemple 4 : Publier un brouillon

```bash
curl -X PATCH https://fleetcrew.blog/api/articles/123/publish \
  -H "X-API-Key: VOTRE_API_KEY"
```

### Exemple 5 : Supprimer un article

```bash
curl -X DELETE https://fleetcrew.blog/api/articles/123 \
  -H "X-API-Key: VOTRE_API_KEY"
```

---

## Exemple Python complet

```python
import requests

API_URL = "https://fleetcrew.blog/api"
API_KEY = "VOTRE_API_KEY"

headers = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY
}

# 1. Créer un article
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
    "status": "draft"  # Créer en brouillon d'abord
}

response = requests.post(
    f"{API_URL}/articles/create",
    json=article_data,
    headers=headers
)

if response.status_code == 200:
    article = response.json()["article"]
    article_id = article["id"]
    print(f"Article créé: {article['url']}")
    
    # 2. Publier l'article
    publish_response = requests.patch(
        f"{API_URL}/articles/{article_id}/publish",
        headers=headers
    )
    
    if publish_response.status_code == 200:
        print("Article publié avec succès!")
    
    # 3. Lister tous les articles publiés
    list_response = requests.get(
        f"{API_URL}/articles?status=published",
        headers=headers
    )
    
    if list_response.status_code == 200:
        articles = list_response.json()["articles"]
        print(f"Total d'articles publiés: {len(articles)}")
        
    # 4. Obtenir les détails d'un article
    detail_response = requests.get(
        f"{API_URL}/articles/{article_id}",
        headers=headers
    )
    
    if detail_response.status_code == 200:
        full_article = detail_response.json()["article"]
        print(f"Article: {full_article['title']}")
        print(f"Tags: {[tag['name'] for tag in full_article['tags']]}")
```

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 400 | Requête invalide (paramètres manquants ou incorrects) |
| 401 | Non autorisé (clé API invalide ou manquante) |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

---

## Notes importantes

1. **Clé API**: La clé API `SCHEDULED_TASK_API_KEY` est configurée dans les secrets du projet. Ne la partagez jamais publiquement.

2. **Génération d'images**: L'option `generateCoverImage: true` utilise l'IA pour créer une image de couverture pertinente. Cela peut prendre quelques secondes supplémentaires.

3. **Liens FleetCrew**: Incluez toujours des liens vers les services FleetCrew dans vos articles pour améliorer la visibilité de l'écosystème.

4. **Format Markdown**: Le contenu supporte le Markdown complet, y compris les titres, listes, liens, images et blocs de code.

5. **Pagination**: Utilisez les paramètres `limit` et `offset` pour paginer les résultats lors de la liste des articles.

6. **Slugs**: Les slugs sont générés automatiquement à partir des titres lors de la création. Ils sont uniques et immuables.

7. **Temps de lecture**: Le temps de lecture est calculé automatiquement en fonction du nombre de mots (200 mots/minute).
