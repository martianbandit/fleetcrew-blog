import { useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function RSS() {
  const { data: articles } = trpc.rss.feed.useQuery();

  useEffect(() => {
    if (articles && articles.length > 0) {
      // Generate RSS XML
      const baseUrl = window.location.origin;
      const rssXml = generateRSSFeed(articles, baseUrl);
      
      // Create blob and download
      const blob = new Blob([rssXml], { type: "application/rss+xml" });
      const url = URL.createObjectURL(blob);
      
      // Redirect to the RSS content
      const newWindow = window.open("", "_self");
      if (newWindow) {
        newWindow.document.write(`<pre>${escapeHtml(rssXml)}</pre>`);
      }
    }
  }, [articles]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-muted-foreground">Génération du flux RSS...</p>
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateRSSFeed(articles: any[], baseUrl: string): string {
  const now = new Date().toUTCString();
  
  const items = articles.map(article => {
    const pubDate = article.publishedAt ? new Date(article.publishedAt).toUTCString() : now;
    const link = `${baseUrl}/articles/${article.slug}`;
    const description = article.excerpt || article.content?.substring(0, 200) + "...";
    
    return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FleetCrew Blog - Gestion de Flottes au Québec</title>
    <link>${baseUrl}</link>
    <description>Blog spécialisé en gestion de flottes au Québec. Articles sur la mécanique, technologies, IA, maintenance préventive et conformité SAAQ.</description>
    <language>fr-CA</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/fleetcrew-icon.png</url>
      <title>FleetCrew Blog</title>
      <link>${baseUrl}</link>
    </image>
    ${items}
  </channel>
</rss>`;
}
