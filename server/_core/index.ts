import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getArticlesForRSS, getAllCategories, createArticle, getAllTags, getCategoryBySlug, getTagBySlug, setArticleTags, getUserByOpenId } from "../db";
import { ENV } from "./env";
import { generateImage } from "./imageGeneration";
import { invokeLLM } from "./llm";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // robots.txt endpoint
  app.get("/robots.txt", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin pages
Disallow: /admin

# Allow all crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
`;
    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  // Sitemap XML endpoint
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const articles = await getArticlesForRSS(1000);
      const categories = await getAllCategories();
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const now = new Date().toISOString();

      // Static pages
      const staticPages = [
        { loc: baseUrl, priority: '1.0', changefreq: 'daily' },
        { loc: `${baseUrl}/articles`, priority: '0.9', changefreq: 'daily' },
        { loc: `${baseUrl}/innovations`, priority: '0.8', changefreq: 'weekly' },
        { loc: `${baseUrl}/contact`, priority: '0.6', changefreq: 'monthly' },
      ];

      // Category pages
      const categoryPages = categories.map(cat => ({
        loc: `${baseUrl}/articles?category=${cat.id}`,
        priority: '0.7',
        changefreq: 'weekly'
      }));

      // Article pages
      const articlePages = articles.map(article => ({
        loc: `${baseUrl}/articles/${article.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: article.publishedAt ? new Date(article.publishedAt).toISOString() : now
      }));

      const allPages = [...staticPages, ...categoryPages, ...articlePages];

      const urlEntries = allPages.map(page => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${'lastmod' in page ? page.lastmod : now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;

      res.set('Content-Type', 'application/xml; charset=utf-8');
      res.send(sitemapXml);
    } catch (error) {
      console.error('Sitemap error:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // RSS Feed endpoint
  app.get("/rss.xml", async (req, res) => {
    try {
      const articles = await getArticlesForRSS(20);
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      const items = articles.map(article => {
        const pubDate = article.publishedAt ? new Date(article.publishedAt).toUTCString() : new Date().toUTCString();
        const link = `${baseUrl}/articles/${article.slug}`;
        const description = article.excerpt || (article.content?.substring(0, 200) + "...");
        
        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
      }).join("");

      const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FleetCrew Blog - Gestion de Flottes au Québec</title>
    <link>${baseUrl}</link>
    <description>Blog spécialisé en gestion de flottes au Québec. Articles sur la mécanique, technologies, IA, maintenance préventive et conformité SAAQ.</description>
    <language>fr-CA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/fleetcrew-icon.png</url>
      <title>FleetCrew Blog</title>
      <link>${baseUrl}</link>
    </image>${items}
  </channel>
</rss>`;

      res.set('Content-Type', 'application/rss+xml; charset=utf-8');
      res.send(rssXml);
    } catch (error) {
      console.error('RSS feed error:', error);
      res.status(500).send('Error generating RSS feed');
    }
  });

  // ==================== API REST pour tâches planifiées ====================
  
  // Middleware d'authentification par clé API
  const apiKeyAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey || apiKey !== ENV.scheduledTaskApiKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }
    next();
  };

  // Endpoint pour créer un article via API (pour tâches planifiées)
  app.post('/api/articles/create', apiKeyAuth, async (req, res) => {
    try {
      const { title, content, excerpt, categorySlug, tagSlugs, coverImage, status, generateCoverImage } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      // Get category by slug or use default
      let categoryId = 1; // Default category
      if (categorySlug) {
        const category = await getCategoryBySlug(categorySlug);
        if (category) categoryId = category.id;
      }

      // Get owner user for authorId
      const ownerUser = await getUserByOpenId(ENV.ownerOpenId);
      const authorId = ownerUser?.id || 1;

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now().toString(36);

      // Generate cover image if requested
      let finalCoverImage = coverImage;
      if (generateCoverImage && !coverImage) {
        try {
          // Create optimized prompt using LLM
          const promptResponse = await invokeLLM({
            messages: [
              {
                role: 'system',
                content: 'Tu es un expert en création de prompts pour la génération d\'images. Crée un prompt court et précis en anglais pour une image de couverture d\'article de blog professionnel. Le style doit être moderne, technologique, avec des tons cyan/turquoise sur fond sombre. Maximum 100 mots.'
              },
              {
                role: 'user',
                content: `Crée un prompt pour une image de couverture pour cet article:\nTitre: ${title}\nRésumé: ${excerpt || content.substring(0, 200)}`
              }
            ]
          });
          
          const messageContent = promptResponse.choices?.[0]?.message?.content;
          const imagePrompt = (typeof messageContent === 'string' ? messageContent : null) || 
            `Professional blog cover image about ${title}, modern tech style, cyan tones, dark background`;
          
          const imageResult = await generateImage({ prompt: imagePrompt });
          if (imageResult?.url) {
            finalCoverImage = imageResult.url;
          }
        } catch (imgError) {
          console.error('Image generation failed:', imgError);
        }
      }

      // Calculate read time
      const wordCount = content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      // Create article
      const article = await createArticle({
        title,
        slug,
        excerpt: excerpt || content.substring(0, 200) + '...',
        content,
        coverImage: finalCoverImage || null,
        categoryId,
        authorId,
        status: status || 'published',
        featured: false,
        readTime,
        publishedAt: status === 'published' ? new Date() : null,
      });

      // Add tags if provided
      if (article && tagSlugs && Array.isArray(tagSlugs)) {
        const allTags = await getAllTags();
        const tagIds = tagSlugs
          .map((slug: string) => allTags.find(t => t.slug === slug)?.id)
          .filter((id: number | undefined): id is number => id !== undefined);
        
        if (tagIds.length > 0) {
          await setArticleTags(article.id, tagIds);
        }
      }

      res.json({ 
        success: true, 
        article: {
          id: article?.id,
          slug,
          title,
          url: `/articles/${slug}`
        }
      });
    } catch (error) {
      console.error('API article creation error:', error);
      res.status(500).json({ error: 'Failed to create article', details: String(error) });
    }
  });

  // Endpoint pour obtenir les catégories disponibles
  app.get('/api/categories', apiKeyAuth, async (req, res) => {
    try {
      const categories = await getAllCategories();
      res.json({ categories: categories.map(c => ({ id: c.id, name: c.name, slug: c.slug })) });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Endpoint pour obtenir les tags disponibles
  app.get('/api/tags', apiKeyAuth, async (req, res) => {
    try {
      const tags = await getAllTags();
      res.json({ tags: tags.map(t => ({ id: t.id, name: t.name, slug: t.slug })) });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tags' });
    }
  });

  // Endpoint de santé pour vérifier que l'API fonctionne
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
