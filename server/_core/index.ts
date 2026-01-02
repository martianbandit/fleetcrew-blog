import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getArticlesForRSS } from "../db";

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
