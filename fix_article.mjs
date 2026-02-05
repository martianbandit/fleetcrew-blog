import 'dotenv/config';
import mysql from 'mysql2/promise';

async function fixArticle() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  const articleId = 300001;
  
  // Tags pertinents pour l'article sur l'IA et la maintenance
  const tagIds = [
    30009, // Maintenance prédictive
    30010, // Intelligence artificielle
    1,     // Gestion de flotte
    30011, // Télémétrie
    30008  // données en temps réel
  ];
  
  console.log("=== AJOUT DES TAGS ===");
  
  for (const tagId of tagIds) {
    try {
      await connection.execute(
        `INSERT INTO articleTags (articleId, tagId) VALUES (?, ?)`,
        [articleId, tagId]
      );
      console.log(`✓ Tag ${tagId} ajouté`);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        console.log(`- Tag ${tagId} déjà présent`);
      } else {
        console.log(`✗ Erreur tag ${tagId}: ${e.message}`);
      }
    }
  }
  
  // Vérifier les tags ajoutés
  const [tags] = await connection.execute(
    `SELECT t.name, t.slug 
     FROM tags t 
     JOIN articleTags at ON t.id = at.tagId 
     WHERE at.articleId = ?`,
    [articleId]
  );
  
  console.log("\n=== TAGS DE L'ARTICLE APRÈS CORRECTION ===");
  console.log(tags);
  
  await connection.end();
}

fixArticle().catch(console.error);
