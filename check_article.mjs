import 'dotenv/config';
import mysql from 'mysql2/promise';

async function checkArticle() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Récupérer l'article le plus récent
  const [articles] = await connection.execute(
    `SELECT a.id, a.title, a.slug, a.coverImage, a.categoryId, c.name as categoryName
     FROM articles a 
     LEFT JOIN categories c ON a.categoryId = c.id
     ORDER BY a.createdAt DESC LIMIT 1`
  );
  
  console.log("=== ARTICLE LE PLUS RÉCENT ===");
  console.log(articles[0]);
  
  // Récupérer les tags de l'article
  const [tags] = await connection.execute(
    `SELECT t.name, t.slug 
     FROM tags t 
     JOIN articleTags at ON t.id = at.tagId 
     WHERE at.articleId = ?`,
    [articles[0]?.id]
  );
  
  console.log("\n=== TAGS DE L'ARTICLE ===");
  console.log(tags.length > 0 ? tags : "Aucun tag trouvé");
  
  // Lister tous les tags disponibles
  const [allTags] = await connection.execute(`SELECT id, name, slug FROM tags`);
  console.log("\n=== TOUS LES TAGS DISPONIBLES ===");
  console.log(allTags);
  
  await connection.end();
}

checkArticle().catch(console.error);
