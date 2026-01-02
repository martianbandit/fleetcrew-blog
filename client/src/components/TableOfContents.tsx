import { useState, useEffect } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

function extractHeadings(content: string): TOCItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    
    headings.push({ id, text, level });
  }

  return headings;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const headings = extractHeadings(content);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className={cn("rounded-xl border border-border/40 bg-card/50 p-4", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold"
      >
        <span className="flex items-center gap-2">
          <List className="w-4 h-4" />
          Table des matières
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      
      {isExpanded && (
        <ul className="mt-4 space-y-2">
          {headings.map((heading, index) => (
            <li
              key={index}
              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  "text-sm text-left w-full hover:text-primary transition-colors line-clamp-2",
                  activeId === heading.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default TableOfContents;
