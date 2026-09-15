import type { ConfidenceGrade, FoundImage, Identifiers, MatchSignal, VisualPrint } from "./types.ts";
import { hamming, histCorr } from "./hash.ts";

function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1);
}

function haystack(img: Pick<FoundImage, "title" | "caption" | "pageTitle" | "sourceUrl" | "provider">) {
  return `${img.title} ${img.caption} ${img.pageTitle} ${img.sourceUrl} ${img.provider}`.toLowerCase();
}

function containsPhrase(hay: string, phrase: string) {
  const p = phrase.trim().toLowerCase();
  if (p.length < 2) return false;
  return hay.includes(p);
}

export function gradeFromScore(score: number, canBeHigh: boolean): ConfidenceGrade {
  if (score >= 72 && canBeHigh) return "high";
  if (score >= 48) return "medium";
  if (score >= 22) return "low";
  return "insufficient";
}

export function gradeLabel(g: ConfidenceGrade) {
  switch (g) {
    case "high":
      return "High confidence";
    case "medium":
      return "Medium confidence";
    case "low":
      return "Low confidence";
    default:
      return "Not enough evidence";
  }
}

export function scoreImage(
  id: Identifiers,
  img: Omit<FoundImage, "grade" | "score" | "explanation" | "matched" | "signals" | "visualScore" | "contextScore">,
  visual?: { ref: VisualPrint; cand: VisualPrint | null },
): FoundImage {
  const hay = haystack(img);
  const signals: MatchSignal[] = [];
  const matched: string[] = [];
  let context = 0;

  const name = id.name.trim();
  if (name && containsPhrase(hay, name)) {
    context += 40;
    matched.push("Name in source text");
    signals.push({ label: "Name", detail: `“${name}” appears in title, caption, or URL`, weight: 40 });
  } else if (name) {
    const parts = tokens(name).filter((w) => w.length > 2);
    const hits = parts.filter((p) => hay.includes(p));
    if (hits.length && hits.length === parts.length) {
      context += 24;
      matched.push("Name in source text");
      signals.push({
        label: "Name tokens",
        detail: `All name parts found (${hits.join(", ")})`,
        weight: 24,
      });
    } else if (hits.length) {
      context += 8;
      signals.push({
        label: "Partial name",
        detail: `Only ${hits.join(", ")} found — possible name collision`,
        weight: 8,
      });
    }
  }

  if (id.aliases.trim()) {
    const aliasHit = id.aliases
      .split(/[,;]/)
      .map((a) => a.trim())
      .filter((a) => a && containsPhrase(hay, a));
    if (aliasHit.length) {
      context += 10;
      matched.push("Alias");
      signals.push({ label: "Alias", detail: aliasHit.join(", "), weight: 10 });
    }
  }

  const locBits = [id.city, id.state].map((s) => s.trim()).filter(Boolean);
  const locHits = locBits.filter((b) => containsPhrase(hay, b));
  if (locHits.length) {
    const w = locHits.length * 8;
    context += w;
    matched.push("Location");
    signals.push({ label: "Location", detail: locHits.join(", "), weight: w });
  }

  if (id.employer.trim() && containsPhrase(hay, id.employer.trim())) {
    context += 16;
    matched.push("Employer");
    signals.push({ label: "Employer", detail: id.employer.trim(), weight: 16 });
  }

  if (id.jobTitle.trim() && containsPhrase(hay, id.jobTitle.trim())) {
    context += 10;
    matched.push("Job title");
    signals.push({ label: "Job title", detail: id.jobTitle.trim(), weight: 10 });
  }

  if (id.hobbies.trim() && containsPhrase(hay, id.hobbies.trim())) {
    context += 6;
    matched.push("Hobby");
    signals.push({ label: "Hobby", detail: id.hobbies.trim(), weight: 6 });
  }

  if (id.appearance.trim()) {
    const bits = id.appearance
      .split(/[,;]+/)
      .map((a) => a.trim())
      .filter((a) => a.length > 2);
    const hits = bits.filter((b) => containsPhrase(hay, b));
    if (hits.length) {
      const w = Math.min(14, hits.length * 5);
      context += w;
      matched.push("Appearance");
      signals.push({ label: "Appearance", detail: hits.join(", "), weight: w });
    }
  }

  for (const handle of id.socialUsernames
    .split(/[,;\s]+/)
    .map((h) => h.replace(/^@/, "").trim())
    .filter(Boolean)) {
    if (hay.includes(handle.toLowerCase())) {
      context += 14;
      matched.push("Username");
      signals.push({ label: "Username", detail: handle, weight: 14 });
    }
  }

  for (const site of id.knownWebsites
    .split(/[,;\s]+/)
    .map((s) => s.replace(/^https?:\/\//, "").split("/")[0] ?? "")
    .filter(Boolean)) {
    if (hay.includes(site.toLowerCase())) {
      context += 12;
      matched.push("Known website");
      signals.push({ label: "Known site", detail: site, weight: 12 });
    }
  }

  if (id.keywords.trim()) {
    const kws = id.keywords.split(/[,]+/).map((k) => k.trim()).filter(Boolean);
    const kh = kws.filter((k) => containsPhrase(hay, k));
    if (kh.length) {
      const w = Math.min(12, kh.length * 4);
      context += w;
      matched.push("Keywords");
      signals.push({ label: "Keywords", detail: kh.join(", "), weight: w });
    }
  }

  context = Math.min(80, context);

  let visualScore: number | null = null;
  if (visual?.ref && visual.cand) {
    const distA = hamming(visual.ref.hash, visual.cand.hash);
    const distD = hamming(visual.ref.dHash || "", visual.cand.dHash || "");
    const hashSim = Math.max(0, 1 - distA / 64);
    const dSim = visual.ref.dHash && visual.cand.dHash ? Math.max(0, 1 - distD / 64) : hashSim;
    const histSim = histCorr(visual.ref.hist, visual.cand.hist);
    visualScore = Math.round((hashSim * 0.35 + dSim * 0.35 + histSim * 0.3) * 30);
    signals.push({
      label: "Visual similarity",
      detail: `Average-hash distance ${distA}/64; difference-hash ${distD}/64; color correlation ${(histSim * 100).toFixed(0)}%. Supporting signal only — not facial recognition.`,
      weight: visualScore,
    });
  }

  const score = Math.min(100, context + (visualScore ?? 0));
  const strongContext =
    matched.includes("Name in source text") &&
    (matched.includes("Location") ||
      matched.includes("Employer") ||
      matched.includes("Username") ||
      matched.includes("Appearance"));
  const strongVisual = (visualScore ?? 0) >= 18;
  const canBeHigh = strongContext || (strongVisual && matched.includes("Name in source text"));

  const grade = gradeFromScore(score, canBeHigh);

  const explanation: string[] = [];
  if (signals.length === 0) {
    explanation.push("No identifier text and no reference-image comparison. Treat as unverified.");
  } else {
    explanation.push(...signals.map((s) => `${s.label}: ${s.detail}`));
  }
  if (grade === "high") {
    explanation.push(
      "High grade requires name plus another identifier, or name plus a strong visual signal. Still verify by eye. This is not a positive identification.",
    );
  } else if (grade === "medium") {
    explanation.push("Partial match. Common names and stock photos often land here.");
  } else if (grade === "low") {
    explanation.push("Weak overlap. Likely a name collision or unrelated result.");
  } else {
    explanation.push("Insufficient data to say this is the intended person.");
  }

  return {
    ...img,
    grade,
    score,
    explanation,
    matched,
    signals,
    visualScore,
    contextScore: context,
  };
}
