import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Composant Breadcrumbs avec Schema.org markup
 * Améliore la navigation et le SEO
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: "Accueil", href: "/" }, ...items];

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `${typeof window !== "undefined" ? window.location.origin : ""}${item.href}` : undefined
    }))
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* Visual breadcrumbs */}
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-1 text-sm text-muted-foreground">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          
          return (
            <span key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              )}
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5" />}
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground font-medium" : ""}>
                  {index === 0 && <Home className="w-3.5 h-3.5 inline mr-1" />}
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}

export default Breadcrumbs;
