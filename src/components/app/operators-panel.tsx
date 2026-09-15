import { generateQueries, QUERY_GROUPS } from "@/lib/osint/queries";
import { useCase } from "@/lib/osint/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Images } from "lucide-react";
import { useMemo, useState } from "react";

export function OperatorsPanel() {
  const id = useCase((s) => s.identifiers);
  const queries = useMemo(() => generateQueries(id), [id]);
  const [copied, setCopied] = useState<string | null>(null);
  const [active, setActive] = useState<string>("all");
  const groups = QUERY_GROUPS.filter((g) => queries.some((q) => q.group === g));
  const shown = active === "all" ? queries : queries.filter((q) => q.group === active);

  function copy(text: string, key: string) {
    void navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1200);
  }

  if (!id.name.trim() && !id.employer.trim() && !id.keywords.trim()) {
    return (
      <p className="text-sm text-muted">
        Add a name, employer, or keyword on the Case tab to generate operators.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-medium tracking-tight">Search operators</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            {queries.length} public Google queries. Each opens in a new tab. These do not log you
            in or scrape the destination.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => copy(queries.map((q) => q.query).join("\n"), "all")}
          >
            <Copy />
            {copied === "all" ? "Copied" : "Copy all"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              queries.slice(0, 6).forEach((q, i) => {
                window.setTimeout(() => window.open(q.googleImages, "_blank", "noopener"), i * 200);
              });
            }}
          >
            <Images />
            Open first 6 image searches
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip active={active === "all"} onClick={() => setActive("all")} label={`All ${queries.length}`} />
        {groups.map((g) => (
          <Chip
            key={g}
            active={active === g}
            onClick={() => setActive(g)}
            label={`${g} ${queries.filter((q) => q.group === g).length}`}
          />
        ))}
      </div>

      {groups
        .filter((g) => active === "all" || active === g)
        .map((group) => (
          <section key={group} className="flex flex-col gap-3">
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted">{group}</h3>
            <ul className="flex flex-col gap-2">
              {shown
                .filter((q) => q.group === group)
                .map((q) => (
                  <li
                    key={q.id}
                    className="rounded-lg border border-border-strong bg-surface p-3 sm:p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-medium text-fg">{q.label}</p>
                      <Badge>{group}</Badge>
                    </div>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs text-muted">
                      {q.query}
                    </pre>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => copy(q.query, q.id)}>
                        <Copy />
                        {copied === q.id ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={q.googleWeb} target="_blank" rel="noreferrer">
                          <ExternalLink />
                          Web
                        </a>
                      </Button>
                      <Button size="sm" asChild>
                        <a href={q.googleImages} target="_blank" rel="noreferrer">
                          <Images />
                          Images
                        </a>
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-9 rounded-full bg-accent px-3 text-xs font-medium text-accent-fg"
          : "h-9 rounded-full border border-border px-3 text-xs font-medium text-muted hover:bg-subtle"
      }
    >
      {label}
    </button>
  );
}
