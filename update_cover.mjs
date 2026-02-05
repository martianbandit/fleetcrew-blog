import 'dotenv/config';
import mysql from 'mysql2/promise';

async function updateCover() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  const articleId = 300001;
  const coverImageUrl = 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663032418579/ENUDCYqnetFknMBT.png';
  
  await connection.execute(
    `UPDATE articles SET coverImage = ? WHERE id = ?`,
    [coverImageUrl, articleId]
  );
  
  console.log("✓ Image de couverture mise à jour avec succès!");
  
  // Vérifier
  const [articles] = await connection.execute(
    `SELECT id, title, coverImage FROM articles WHERE id = ?`,
    [articleId]
  );
  
  console.log("\n=== ARTICLE MIS À JOUR ===");
  console.log(articles[0]);
  
  await connection.end();
}

updateCover().catch(console.error);
