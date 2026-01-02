import { Link } from "wouter";
import { Truck, Mail, ExternalLink } from "lucide-react";

const externalResources = [
  { name: "SAAQ Québec", url: "https://saaq.gouv.qc.ca/" },
  { name: "MTQ", url: "https://www.transports.gouv.qc.ca/" },
  { name: "CNESST", url: "https://www.cnesst.gouv.qc.ca/" },
  { name: "Carfax Canada", url: "https://www.carfax.ca/" },
  { name: "AQTR", url: "https://www.aqtr.com/" },
  { name: "ATA", url: "https://www.trucking.org/" },
  { name: "Fleet Owner", url: "https://www.fleetowner.com/" },
];

const categories = [
  { name: "Mécanique & Maintenance", slug: "mecanique-maintenance" },
  { name: "Technologies & Innovation", slug: "technologies-innovation" },
  { name: "Intelligence Artificielle", slug: "intelligence-artificielle" },
  { name: "Gestion de Flottes", slug: "gestion-flottes" },
  { name: "Conformité SAAQ", slug: "conformite-saaq" },
  { name: "Actualités", slug: "actualites" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Fleet<span className="text-primary">Crew</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Votre source d'information sur la gestion de flottes, la mécanique automobile, 
              les technologies et l'intelligence artificielle au Québec.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>contact@fleetcrew.ca</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Catégories
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/articles?category=${category.slug}`}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/innovations" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Innovations
                </Link>
              </li>
            </ul>
          </div>

          {/* External Resources */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Ressources
            </h3>
            <ul className="space-y-2">
              {externalResources.map((resource) => (
                <li key={resource.name}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground/80 hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {resource.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FleetCrew. Tous droits réservés.
            </p>
            <p className="text-sm text-muted-foreground">
              Fait avec passion au Québec 🍁
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
