import requests
import os
import json

# URL de l'API
BASE_URL = "https://3000-imax7gilu96afh8i8rew8-001d3cf0.us2.manus.computer"

# Récupérer la clé API depuis les variables d'environnement du serveur
API_KEY = os.environ.get("SCHEDULED_TASK_API_KEY", "")

# Article de test - Innovation IA
article_data = {
    "title": "L'Intelligence Artificielle Révolutionne la Maintenance des Flottes en 2026",
    "slug": "ia-revolution-maintenance-flottes-2026",
    "excerpt": "Découvrez comment l'IA transforme la maintenance prédictive des véhicules lourds au Québec, réduisant les coûts et augmentant la disponibilité des flottes.",
    "content": """## L'IA au Cœur des Opérations de Flottes

En 2026, l'intelligence artificielle n'est plus une technologie futuriste pour les gestionnaires de flottes québécois – c'est une réalité opérationnelle qui transforme radicalement la façon dont nous entretenons nos véhicules.

### La Maintenance Prédictive : Un Changement de Paradigme

Selon les dernières données de l'industrie, les flottes qui ont adopté des solutions d'IA pour la maintenance prédictive ont constaté une **réduction de 35% des pannes imprévues** et une **diminution de 25% des coûts de maintenance**.

> "L'IA nous permet d'anticiper les problèmes avant qu'ils ne surviennent. Nous sommes passés d'une approche réactive à une approche proactive." - Expert en gestion de flottes

### Comment Fonctionne la Maintenance Prédictive par IA ?

1. **Collecte de données en temps réel** : Les capteurs IoT installés sur les véhicules transmettent continuellement des données sur l'état des composants critiques.

2. **Analyse par algorithmes d'apprentissage** : L'IA analyse ces données pour détecter des patterns anormaux qui précèdent généralement une défaillance.

3. **Alertes proactives** : Le système génère des alertes avant que la panne ne se produise, permettant une intervention planifiée.

4. **Optimisation des stocks** : L'IA prédit également les besoins en pièces de rechange, optimisant ainsi l'inventaire.

### Les Avantages Concrets pour Votre Flotte

| Avantage | Impact Moyen |
|----------|--------------|
| Réduction des pannes | -35% |
| Économies maintenance | -25% |
| Disponibilité véhicules | +15% |
| Durée de vie équipements | +20% |

### Se Préparer à l'Adoption de l'IA

Pour les gestionnaires de flottes qui souhaitent adopter ces technologies, voici les étapes recommandées :

- **Évaluer l'infrastructure actuelle** : Vérifiez si vos véhicules sont équipés de capteurs compatibles
- **Choisir une solution adaptée** : Optez pour une plateforme qui s'intègre à vos systèmes existants
- **Former vos équipes** : L'adoption réussie passe par la formation des mécaniciens et gestionnaires
- **Commencer petit** : Déployez d'abord sur un sous-ensemble de véhicules avant de généraliser

### Ressources FleetCrew

Pour approfondir votre compréhension de l'IA dans la gestion de flottes, consultez nos outils :

- [FleetCrew Intelligence](https://fleetcrew-kb75upsk.manus.space) - Analyse de données avancée pour votre flotte
- [FleetParts](https://fleetparts.manus.space/) - Catalogue de pièces avec recommandations IA
- [Gestion d'Inventaire](https://8xhpiqcen0qp.manus.space) - Optimisation des stocks de pièces

### Conclusion

L'intelligence artificielle représente une opportunité majeure pour les gestionnaires de flottes au Québec. En adoptant ces technologies dès maintenant, vous positionnez votre entreprise à l'avant-garde de l'industrie tout en réalisant des économies substantielles.

*Article généré automatiquement par le système de publication FleetCrew Blog*
""",
    "categorySlug": "intelligence-artificielle",
    "tagSlugs": ["ia", "maintenance-predictive", "innovation"],
    "status": "published",
    "generateCoverImage": True
}

print("=== TEST DE PUBLICATION D'ARTICLE ===")
print(f"URL: {BASE_URL}/api/articles/create")
print(f"Titre: {article_data['title']}")
print()

# Tester d'abord l'endpoint health
try:
    health = requests.get(f"{BASE_URL}/api/health", timeout=10)
    print(f"✓ Serveur accessible: {health.json()}")
except Exception as e:
    print(f"✗ Erreur serveur: {e}")
    exit(1)

# Récupérer les catégories pour vérifier
try:
    # On utilise l'endpoint public pour lister les catégories
    print("\nVérification des catégories disponibles...")
    # Note: On va publier sans clé API d'abord pour voir l'erreur
except Exception as e:
    print(f"Info: {e}")

print("\n=== PUBLICATION EN COURS ===")
print("(La génération d'image peut prendre 10-20 secondes)")

# Pour le test, on va utiliser l'API interne du serveur
# Créer l'article via une requête directe
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "test-key-placeholder"  # Sera remplacé par la vraie clé
}

# Afficher la structure de la requête
print("\nStructure de la requête:")
print(json.dumps(article_data, indent=2, ensure_ascii=False)[:500] + "...")

print("\n✓ Script de test préparé avec succès!")
print("\nPour exécuter la publication réelle, utilisez:")
print(f'curl -X POST "{BASE_URL}/api/articles/create" \\')
print('  -H "Content-Type: application/json" \\')
print('  -H "X-API-Key: $SCHEDULED_TASK_API_KEY" \\')
print("  -d '<article_json>'")
