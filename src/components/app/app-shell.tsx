import { useState } from "react";
import { CaseForm } from "./case-form";
import { OperatorsPanel } from "./operators-panel";
import { ReversePanel } from "./reverse-panel";
import { ResultsPanel } from "./results-panel";
import { useCase } from "@/lib/osint/store";
import { Button } from "@/components/ui/button";
import { FolderSearch, ShieldAlert, Trash2 } from "lucide-react";

const TABS = [
  { id: "case" as const, label: "Case" },
  { id: "operators" as const, label: "Operators" },
  { id: "reverse" as const, label: "Reverse image" },
  { id: "results" as const, label: "Results" },
];

export function AppShell() {
  const tab = useCase((s) => s.tab);
  const setTab = useCase((s) => s.setTab);
  const wipe = useCase((s) => s.wipe);
  const results = useCase((s) => s.results);
  const error = useCase((s) => s.error);
  const cleared = useCase((s) => s.historyClearedAt);
  const name = useCase((s) => s.identifiers.name);
  const searching = useCase((s) => s.searching);
  const [confirmWipe, setConfirmWipe] = useState(false);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4">
        Skip to content
      </a>
      <header className="border-b border-border print:hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-lg border border-border bg-surface">
                <FolderSearch className="size-5 text-accent" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Public-source casework</p>
                <h1 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">Beacon</h1>
                <p className="mt-1 max-w-xl text-sm text-muted">
                  Find publicly available photographs using search operators, reverse image engines,
                  and contextual matching. Built for missing-person and family reunification research
                  in the United States.
                </p>
              </div>
            </div>
            {confirmWipe ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="danger"
                  onClick={() => {
                    wipe();
                    setConfirmWipe(false);
                  }}
                >
                  Confirm delete
                </Button>
                <Button variant="ghost" onClick={() => setConfirmWipe(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setConfirmWipe(true)}>
                <Trash2 />
                Delete uploads & history
              </Button>
            )}
          </div>
          {name ? (
            <p className="text-sm text-muted">
              Active subject: <span className="text-fg">{name}</span>
              {results.length ? ` · ${results.length} images in file` : null}
              {searching ? " · searching catalogs…" : null}
            </p>
          ) : null}
          {cleared ? (
            <p className="text-xs text-muted">Workspace cleared {new Date(cleared).toLocaleString()}.</p>
          ) : null}
        </div>
        <nav className="mx-auto max-w-6xl px-4 sm:px-6" aria-label="Sections">
          <ul className="flex gap-1 overflow-x-auto pb-px">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={
                    tab === t.id
                      ? "h-11 border-b-2 border-accent px-3 text-sm font-medium text-fg"
                      : "h-11 border-b-2 border-transparent px-3 text-sm text-muted hover:text-fg"
                  }
                >
                  {t.label}
                  {t.id === "results" && results.length ? ` (${results.length})` : ""}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {error ? (
          <p className="mb-6 rounded-lg border border-low/40 bg-low/10 px-4 py-3 text-sm text-low">{error}</p>
        ) : null}
        {tab === "case" ? <CaseForm /> : null}
        {tab === "operators" ? <OperatorsPanel /> : null}
        {tab === "reverse" ? <ReversePanel /> : null}
        {tab === "results" ? <ResultsPanel /> : null}
      </main>

      <footer className="border-t border-border print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Disclaimer />
        </div>
      </footer>
    </div>
  );
}

function Disclaimer() {
  return (
    <aside className="flex gap-3 text-xs leading-relaxed text-muted">
      <ShieldAlert className="mt-0.5 size-4 shrink-0" />
      <div className="flex flex-col gap-2">
        <p>
          Beacon searches only information that is already public. It does not sign in to platforms,
          bypass paywalls, ignore robots.txt, or scrape private or restricted accounts. Automatic
          catalogs are limited to Wikipedia, Wikimedia Commons, and Openverse. Google, LinkedIn,
          Facebook, Instagram, and similar sites are reached only by operator links you choose to
          open.
        </p>
        <p>
          Confidence grades combine text context (name, location, employer, captions, URLs) with an
          optional perceptual-hash comparison of a photo you supply. They are not facial recognition
          against a watchlist and must not be treated as a positive identification. False positives
          are common with ordinary names. Verify every image by hand before acting.
        </p>
        <p>
          Intended use includes locating publicly posted photographs of missing or exploited children
          so families and investigators can reunify them. Do not use this tool to stalk, dox, harass,
          or surveil people. Uploads stay in this browser session until you delete them.
        </p>
      </div>
    </aside>
  );
}
