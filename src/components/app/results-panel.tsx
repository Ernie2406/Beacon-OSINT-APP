import { useMemo, useState } from "react";
import { useCase } from "@/lib/osint/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ConfidenceGrade, FoundImage } from "@/lib/osint/types";
import { gradeLabel } from "@/lib/osint/score";
import { download, toCsv, toJson } from "@/lib/osint/export";
import { inspectPublicUrl } from "@/lib/osint/public-search";
import { fingerprintFromUrl } from "@/lib/osint/hash";
import { displaySrc } from "@/lib/osint/thumb";
import { ExternalLink, FileJson, Printer, Sheet, Trash2 } from "lucide-react";

const GRADES: ConfidenceGrade[] = ["high", "medium", "low", "insufficient"];

export function ResultsPanel() {
  const results = useCase((s) => s.results);
  const notes = useCase((s) => s.notes);
  const identifiers = useCase((s) => s.identifiers);
  const remove = useCase((s) => s.removeResult);
  const addManual = useCase((s) => s.addManual);
  const refDataUrl = useCase((s) => s.refDataUrl);
  const [filter, setFilter] = useState<ConfidenceGrade | "all">("all");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  const shown = useMemo(
    () => (filter === "all" ? results : results.filter((r) => r.grade === filter)),
    [results, filter],
  );

  async function addUrl() {
    if (!url.trim()) return;
    setBusy(true);
    try {
      const meta = await inspectPublicUrl({ data: { url: url.trim() } });
      const imageUrl = meta.imageUrl || url.trim();
      const visual = await fingerprintFromUrl(imageUrl);
      addManual({
        title: meta.title,
        sourceUrl: url.trim(),
        imageUrl,
        thumbUrl: imageUrl,
        caption: caption || meta.text.slice(0, 280),
        pageTitle: meta.title,
        provider: new URL(url.trim()).hostname,
        queryUsed: "manual URL",
        visual,
      });
      setUrl("");
      setCaption("");
    } catch {
      addManual({
        title: url,
        sourceUrl: url.trim(),
        imageUrl: url.trim(),
        caption,
        provider: "Manual",
        queryUsed: "manual URL",
      });
    } finally {
      setBusy(false);
    }
  }

  function printPdf() {
    window.print();
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyAdd url={url} setUrl={setUrl} caption={caption} setCaption={setCaption} busy={busy} onAdd={addUrl} />
        <p className="text-sm text-muted">
          No images in this case yet. Run public catalogs from the Case tab, open operator image
          searches, then paste public URLs here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 print:gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <h2 className="font-display text-xl font-medium tracking-tight">Results dashboard</h2>
          <p className="mt-1 text-sm text-muted">
            {results.length} public image{results.length === 1 ? "" : "s"}, ranked by evidence.
            Grades are hypotheses, not identifications.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => download("beacon-results.csv", toCsv(results), "text/csv")}
          >
            <Sheet />
            CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              download("beacon-results.json", toJson(identifiers, results), "application/json")
            }
          >
            <FileJson />
            JSON
          </Button>
          <Button variant="secondary" size="sm" onClick={printPdf}>
            <Printer />
            PDF
          </Button>
        </div>
      </div>

      {notes.length > 0 ? (
        <p className="text-xs text-muted print:hidden">{notes.join(" ")}</p>
      ) : null}

      <div className="flex flex-wrap gap-2 print:hidden">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={`All ${results.length}`} />
        {GRADES.map((g) => {
          const n = results.filter((r) => r.grade === g).length;
          return (
            <FilterChip
              key={g}
              active={filter === g}
              onClick={() => setFilter(g)}
              label={`${gradeLabel(g)} ${n}`}
            />
          );
        })}
      </div>

      <div className="print:hidden">
        <EmptyAdd url={url} setUrl={setUrl} caption={caption} setCaption={setCaption} busy={busy} onAdd={addUrl} />
      </div>

      <ul className="grid gap-4">
        {shown.map((r) => (
          <ResultCard key={r.id} row={r} onRemove={() => remove(r.id)} refSrc={refDataUrl} />
        ))}
      </ul>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
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

function EmptyAdd({
  url,
  setUrl,
  caption,
  setCaption,
  busy,
  onAdd,
}: {
  url: string;
  setUrl: (s: string) => void;
  caption: string;
  setCaption: (s: string) => void;
  busy: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm font-medium">Add a public URL you found</p>
      <p className="mt-1 text-xs text-muted">
        We only fetch the page title and Open Graph image. Private or login-walled pages will fail
        and should not be used.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
        <Button onClick={onAdd} disabled={busy || !url.trim()}>
          {busy ? "Reading…" : "Add to case"}
        </Button>
      </div>
      <div className="mt-3">
        <Label>Caption / surrounding text (optional)</Label>
        <Textarea
          className="mt-1"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Paste nearby names, dates, or location text"
        />
      </div>
    </div>
  );
}

function ResultCard({
  row,
  onRemove,
  refSrc,
}: {
  row: FoundImage;
  onRemove: () => void;
  refSrc: string | null;
}) {
  const tone =
    row.grade === "high"
      ? "bg-high"
      : row.grade === "medium"
        ? "bg-warn"
        : row.grade === "low"
          ? "bg-low"
          : "bg-muted";
  return (
    <li className="grid gap-4 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[200px_1fr] sm:p-4">
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 overflow-hidden rounded-md bg-bg">
          <img
            src={displaySrc(row.thumbUrl || row.imageUrl)}
            alt=""
            className="h-48 w-full object-contain sm:h-56"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const el = e.currentTarget;
              if (el.dataset.fallback === "1") return;
              el.dataset.fallback = "1";
              el.src = row.imageUrl;
            }}
          />
        </div>
        {refSrc ? (
          <div className="hidden w-20 shrink-0 overflow-hidden rounded-md border border-border bg-bg sm:block">
            <img src={refSrc} alt="Reference" className="h-full w-full object-cover" />
          </div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium leading-snug">{row.title}</h3>
            <p className="mt-0.5 truncate text-xs text-muted">{row.provider}</p>
          </div>
          <Badge tone={row.grade}>
            {gradeLabel(row.grade)} · {row.score}
          </Badge>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-subtle" aria-hidden>
          <div className={`h-full ${tone}`} style={{ width: `${Math.min(100, row.score)}%` }} />
        </div>
        <p className="break-all text-xs text-muted">
          <a href={row.sourceUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
            {row.sourceUrl}
          </a>
        </p>
        <p className="text-xs text-muted">
          Query: <span className="font-mono">{row.queryUsed}</span>
        </p>
        {row.caption ? <p className="line-clamp-3 text-xs text-muted">{row.caption}</p> : null}
        {row.matched.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.matched.map((m) => (
              <Badge key={m}>{m}</Badge>
            ))}
          </div>
        ) : null}
        <ul className="list-disc space-y-1 pl-4 text-xs text-muted">
          {row.explanation.slice(0, 5).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <p className="text-xs text-muted">
          Found {new Date(row.foundAt).toLocaleString()} · context {row.contextScore}
          {row.visualScore != null ? ` · visual ${row.visualScore}` : " · no visual compare"}
        </p>
        <div className="mt-1 flex flex-wrap gap-2 print:hidden">
          <Button size="sm" variant="outline" asChild>
            <a href={row.sourceUrl} target="_blank" rel="noreferrer">
              <ExternalLink />
              Source
            </a>
          </Button>
          <Button size="sm" variant="ghost" onClick={onRemove}>
            <Trash2 />
            Remove
          </Button>
        </div>
      </div>
    </li>
  );
}
