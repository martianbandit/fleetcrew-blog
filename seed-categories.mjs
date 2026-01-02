import mysql from 'mysql2/promise';

const categories = [
  { name: 'Mécanique & Maintenance', slug: 'mecanique-maintenance', description: 'Conseils et techniques pour l\'entretien de vos véhicules', icon: 'Wrench', color: '#3b82f6' },
  { name: 'Technologies & Innovation', slug: 'technologies-innovation', description: 'Les dernières avancées technologiques du secteur', icon: 'Cpu', color: '#8b5cf6' },
  { name: 'Intelligence Artificielle', slug: 'intelligence-artificielle', description: 'L\'IA au service de la gestion de flottes', icon: 'Brain', color: '#ec4899' },
  { name: 'Gestion de Flottes', slug: 'gestion-flottes', description: 'Optimisez la gestion de votre parc de véhicules', icon: 'Truck', color: '#10b981' },
  { name: 'Conformité SAAQ', slug: 'conformite-saaq', description: 'Restez conforme aux réglementations québécoises', icon: 'Shield', color: '#f59e0b' },
  { name: 'Actualités', slug: 'actualites', description: 'Les dernières nouvelles de l\'industrie', icon: 'Newspaper', color: '#6366f1' },
];

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  for (const cat of categories) {
    try {
      await connection.execute(
        'INSERT INTO categories (name, slug, description, icon, color) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE description=VALUES(description)',
        [cat.name, cat.slug, cat.description, cat.icon, cat.color]
      );
      console.log(`Created category: ${cat.name}`);
    } catch (err) {
      console.log(`Category ${cat.name} might already exist`);
    }
  }
  
  await connection.end();
  console.log('Done!');
}

seed().catch(console.error);
