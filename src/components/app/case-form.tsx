import type { ReactNode } from "react";
import { Field } from "./field";
import { Button } from "@/components/ui/button";
import { useCase } from "@/lib/osint/store";
import { generateQueries } from "@/lib/osint/queries";
import { searchPublicMedia } from "@/lib/osint/public-search";
import { fingerprintFromUrl } from "@/lib/osint/hash";
import { emptyIdentifiers } from "@/lib/osint/types";
import { Eraser, Search, Waypoints } from "lucide-react";

export function CaseForm() {
  const id = useCase((s) => s.identifiers);
  const set = useCase((s) => s.setIdentifiers);
  const setTab = useCase((s) => s.setTab);
  const ingest = useCase((s) => s.ingestHits);
  const setSearching = useCase((s) => s.setSearching);
  const searching = useCase((s) => s.searching);
  const setError = useCase((s) => s.setError);

  async function runPublic() {
    const subject = id.name.trim() || id.keywords.trim() || id.employer.trim();
    if (subject.length < 2) {
      setError("Add at least a name or a distinctive keyword first.");
      return;
    }
    setError(null);
    setSearching(true);
    try {
      const { hits, notes } = await searchPublicMedia({
        data: { name: id.name.trim() || undefined, query: subject, limit: 12 },
      });
      const ref = useCase.getState().refPrint;
      const visualMap: Record<string, Awaited<ReturnType<typeof fingerprintFromUrl>>> = {};
      if (ref) {
        await Promise.all(
          hits.slice(0, 12).map(async (h) => {
            visualMap[h.imageUrl] = await fingerprintFromUrl(h.thumbUrl || h.imageUrl);
          }),
        );
      }
      ingest(hits, subject, visualMap);
      useCase.setState((s) => ({ ...s, notes }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Public search failed");
    } finally {
      setSearching(false);
    }
  }

  const queryCount = generateQueries(id).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-xl font-medium tracking-tight">Case identifiers</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Fill in only what you know. Empty fields are ignored. Nothing here logs into private
          accounts or bypasses paywalls.
        </p>
      </div>

      <ol className="grid gap-2 sm:grid-cols-4">
        {[
          { n: "01", t: "Identify", d: "Name, place, school, traits" },
          { n: "02", t: "Operators", d: "Open public web & image searches" },
          { n: "03", t: "Reverse", d: "Enhance a known photo" },
          { n: "04", t: "Grade", d: "Compare context, not just faces" },
        ].map((s) => (
          <li key={s.n} className="rounded-lg border border-border bg-surface px-3 py-3">
            <p className="font-mono text-xs text-muted">{s.n}</p>
            <p className="mt-1 text-sm font-medium">{s.t}</p>
            <p className="mt-0.5 text-xs text-muted">{s.d}</p>
          </li>
        ))}
      </ol>

      <Section title="Who">
        <Field
          label="Full name"
          value={id.name}
          onChange={(v) => set({ name: v })}
          placeholder="As it may appear in public records"
        />
        <Field
          label="Aliases / nicknames"
          value={id.aliases}
          onChange={(v) => set({ aliases: v })}
          placeholder="Maiden names, nicknames, misspellings"
          hint="Comma-separated"
        />
        <div className="sm:col-span-2">
          <Field
            label="Visible traits (optional)"
            value={id.appearance}
            onChange={(v) => set({ appearance: v })}
            placeholder="Hair color, eyes, clothing last seen, scars, glasses"
            hint="Used in operators and caption matching. Not a biometric profile."
            area
          />
        </div>
      </Section>

      <Section title="Where / when">
        <Field label="City" value={id.city} onChange={(v) => set({ city: v })} />
        <Field label="State / region" value={id.state} onChange={(v) => set({ state: v })} />
        <Field
          label="After date"
          type="date"
          value={id.afterDate}
          onChange={(v) => set({ afterDate: v })}
        />
        <Field
          label="Before date"
          type="date"
          value={id.beforeDate}
          onChange={(v) => set({ beforeDate: v })}
        />
      </Section>

      <Section title="School, work, activity">
        <Field
          label="Employer / school / agency"
          value={id.employer}
          onChange={(v) => set({ employer: v })}
        />
        <Field label="Job title / role / grade" value={id.jobTitle} onChange={(v) => set({ jobTitle: v })} />
        <Field
          label="Hobbies / sports / activities"
          value={id.hobbies}
          onChange={(v) => set({ hobbies: v })}
        />
        <Field
          label="Family context (optional)"
          value={id.maritalStatus}
          onChange={(v) => set({ maritalStatus: v })}
          placeholder="Only if it appears in public captions"
        />
      </Section>

      <Section title="Online presence">
        <Field
          label="Social usernames"
          value={id.socialUsernames}
          onChange={(v) => set({ socialUsernames: v })}
          placeholder="@handles, comma-separated"
        />
        <Field
          label="Known websites"
          value={id.knownWebsites}
          onChange={(v) => set({ knownWebsites: v })}
          placeholder="example.org"
        />
        <div className="sm:col-span-2">
          <Field
            label="Other keywords"
            value={id.keywords}
            onChange={(v) => set({ keywords: v })}
            placeholder="Event names, unit names, unique phrases"
            area
          />
        </div>
      </Section>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setTab("operators")}>
          <Waypoints />
          Build {queryCount} operator{queryCount === 1 ? "" : "s"}
        </Button>
        <Button variant="secondary" onClick={runPublic} disabled={searching}>
          <Search />
          {searching ? "Searching public catalogs…" : "Search public catalogs"}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            set({
              name: "Ada Lovelace",
              city: "London",
              keywords: "mathematician computing",
              jobTitle: "mathematician",
              appearance: "dark hair, portrait",
            });
          }}
        >
          Load public sample
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            useCase.setState({ identifiers: emptyIdentifiers() });
          }}
        >
          <Eraser />
          Clear fields
        </Button>
      </div>
      {searching ? (
        <p className="text-sm text-muted">
          Querying Wikipedia, Wikimedia Commons, and Openverse. Results are filtered to pages that
          mention the name.
        </p>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
