import mysql from 'mysql2/promise';

const newCategories = [
  { name: 'Transport', slug: 'transport', description: 'Actualités et tendances du secteur du transport routier au Québec et au Canada' },
  { name: 'Maintenance Prédictive', slug: 'maintenance-predictive', description: 'Technologies et stratégies pour anticiper les pannes et optimiser la maintenance' },
  { name: 'Logiciels de Gestion', slug: 'logiciels-gestion', description: 'Solutions logicielles pour la gestion de flottes, ateliers et inventaires' },
  { name: 'Diagnostic & Codes d\'Erreur', slug: 'diagnostic-codes-erreur', description: 'Guide des codes d\'erreur, diagnostic OBD et résolution de problèmes' },
  { name: 'Camions', slug: 'camions', description: 'Tout sur les camions lourds : modèles, spécifications, entretien et nouveautés' },
  { name: 'Véhicules Hors Routes', slug: 'vehicules-hors-routes', description: 'Équipements et véhicules hors routes : construction, agriculture, foresterie' }
];

async function addCategories() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  for (const category of newCategories) {
    try {
      await connection.execute(
        'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description)',
        [category.name, category.slug, category.description]
      );
      console.log(`✓ Catégorie ajoutée: ${category.name}`);
    } catch (error) {
      console.error(`✗ Erreur pour ${category.name}:`, error.message);
    }
  }
  
  await connection.end();
  console.log('\\nToutes les catégories ont été traitées.');
}

addCategories().catch(console.error);
