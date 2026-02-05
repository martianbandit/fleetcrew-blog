import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

/**
 * Composant pour gérer les meta tags SEO dynamiques
 * Met à jour le titre et les meta tags Open Graph/Twitter
 */
export function SEOHead({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: SEOHeadProps) {
  const siteName = "FleetCrew Blog";
  const defaultDescription = "Blog spécialisé en gestion de flottes au Québec. Articles sur la mécanique, technologies, IA, maintenance préventive et conformité SAAQ.";
  const defaultImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032418579/LoCpTFkzqhhIzFAe.png";

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const updateMeta = (property: string, content: string, isName = false) => {
      const attr = isName ? "name" : "property";
      let meta = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMeta("description", metaDescription, true);
    updateMeta("keywords", tags.length > 0 ? tags.join(", ") : "gestion de flottes, Québec, mécanique automobile, maintenance préventive, SAAQ", true);

    // Open Graph tags
    updateMeta("og:title", fullTitle);
    updateMeta("og:description", metaDescription);
    updateMeta("og:image", metaImage.startsWith("http") ? metaImage : `${window.location.origin}${metaImage}`);
    updateMeta("og:url", currentUrl);
    updateMeta("og:type", type === "article" ? "article" : "website");
    updateMeta("og:site_name", siteName);
    updateMeta("og:locale", "fr_CA");

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image", true);
    updateMeta("twitter:title", fullTitle, true);
    updateMeta("twitter:description", metaDescription, true);
    updateMeta("twitter:image", metaImage.startsWith("http") ? metaImage : `${window.location.origin}${metaImage}`, true);

    // Article-specific tags
    if (type === "article") {
      if (publishedTime) {
        updateMeta("article:published_time", publishedTime);
      }
      if (modifiedTime) {
        updateMeta("article:modified_time", modifiedTime);
      }
      if (author) {
        updateMeta("article:author", author);
      }
      if (section) {
        updateMeta("article:section", section);
      }
      tags.forEach((tag, index) => {
        updateMeta(`article:tag:${index}`, tag);
      });
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

    // Cleanup function to reset to defaults when component unmounts
    return () => {
      document.title = siteName;
    };
  }, [fullTitle, metaDescription, metaImage, currentUrl, type, publishedTime, modifiedTime, author, section, tags]);

  // This component doesn't render anything visible
  return null;
}

export default SEOHead;
