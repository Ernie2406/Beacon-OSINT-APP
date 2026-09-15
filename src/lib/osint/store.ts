import { create } from "zustand";
import {
  emptyIdentifiers,
  type EnhanceSettings,
  type FoundImage,
  type Identifiers,
  type VisualPrint,
  defaultEnhance,
} from "./types";
import { generateQueries } from "./queries";
import { scoreImage } from "./score";

type Tab = "case" | "operators" | "reverse" | "results";

type HitIn = {
  title: string;
  sourceUrl: string;
  imageUrl: string;
  thumbUrl: string;
  provider: string;
  caption: string;
  pageTitle: string;
};

type State = {
  identifiers: Identifiers;
  tab: Tab;
  results: FoundImage[];
  notes: string[];
  searching: boolean;
  error: string | null;
  refDataUrl: string | null;
  enhancedUrl: string | null;
  enhance: EnhanceSettings;
  qualityIssues: string[];
  refPrint: VisualPrint | null;
  historyClearedAt: string | null;
  setIdentifiers: (p: Partial<Identifiers>) => void;
  setTab: (t: Tab) => void;
  setEnhance: (p: Partial<EnhanceSettings>) => void;
  setReference: (dataUrl: string | null, print: VisualPrint | null, issues: string[]) => void;
  setEnhanced: (url: string | null) => void;
  setSearching: (v: boolean) => void;
  setError: (e: string | null) => void;
  ingestHits: (hits: HitIn[], queryUsed: string, visualMap?: Record<string, VisualPrint | null>) => void;
  addManual: (img: {
    title: string;
    sourceUrl: string;
    imageUrl: string;
    thumbUrl?: string;
    caption?: string;
    pageTitle?: string;
    provider?: string;
    queryUsed?: string;
    visual?: VisualPrint | null;
  }) => void;
  removeResult: (id: string) => void;
  wipe: () => void;
};

function byScore(a: FoundImage, b: FoundImage) {
  return b.score - a.score || b.contextScore - a.contextScore;
}

export const useCase = create<State>((set, get) => ({
  identifiers: emptyIdentifiers(),
  tab: "case",
  results: [],
  notes: [],
  searching: false,
  error: null,
  refDataUrl: null,
  enhancedUrl: null,
  enhance: defaultEnhance(),
  qualityIssues: [],
  refPrint: null,
  historyClearedAt: null,
  setIdentifiers: (p) => set((s) => ({ identifiers: { ...s.identifiers, ...p } })),
  setTab: (tab) => set({ tab }),
  setEnhance: (p) => set((s) => ({ enhance: { ...s.enhance, ...p } })),
  setReference: (refDataUrl, refPrint, qualityIssues) => set({ refDataUrl, refPrint, qualityIssues }),
  setEnhanced: (enhancedUrl) => set({ enhancedUrl }),
  setSearching: (searching) => set({ searching }),
  setError: (error) => set({ error }),
  ingestHits: (hits, queryUsed, visualMap) => {
    const id = get().identifiers;
    const ref = get().refPrint;
    const incoming: FoundImage[] = hits.map((h, i) => {
      const base = {
        id: `hit-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
        title: h.title,
        sourceUrl: h.sourceUrl,
        imageUrl: h.imageUrl,
        thumbUrl: h.thumbUrl,
        provider: h.provider,
        queryUsed,
        caption: h.caption,
        pageTitle: h.pageTitle,
        foundAt: new Date().toISOString(),
      };
      return scoreImage(
        id,
        base,
        ref && visualMap ? { ref, cand: visualMap[h.imageUrl] ?? visualMap[base.id] ?? null } : undefined,
      );
    });
    set((s) => {
      const merged = [...incoming, ...s.results];
      const seen = new Set<string>();
      const unique = merged.filter((r) => {
        const k = r.imageUrl.split("?")[0]!;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      unique.sort(byScore);
      return { results: unique, tab: "results" };
    });
  },
  addManual: (img) => {
    const id = get().identifiers;
    const ref = get().refPrint;
    const base = {
      id: `man-${Date.now()}`,
      title: img.title,
      sourceUrl: img.sourceUrl,
      imageUrl: img.imageUrl,
      thumbUrl: img.thumbUrl || img.imageUrl,
      provider: img.provider || "Manual",
      queryUsed: img.queryUsed || "manual add",
      caption: img.caption || "",
      pageTitle: img.pageTitle || img.title,
      foundAt: new Date().toISOString(),
    };
    const scored = scoreImage(id, base, ref && img.visual !== undefined ? { ref, cand: img.visual } : undefined);
    set((s) => ({ results: [scored, ...s.results].sort(byScore), tab: "results" }));
  },
  removeResult: (id) => set((s) => ({ results: s.results.filter((r) => r.id !== id) })),
  wipe: () =>
    set({
      identifiers: emptyIdentifiers(),
      results: [],
      notes: [],
      error: null,
      refDataUrl: null,
      enhancedUrl: null,
      enhance: defaultEnhance(),
      qualityIssues: [],
      refPrint: null,
      historyClearedAt: new Date().toISOString(),
      tab: "case",
    }),
}));

export function currentQueries() {
  return generateQueries(useCase.getState().identifiers);
}
