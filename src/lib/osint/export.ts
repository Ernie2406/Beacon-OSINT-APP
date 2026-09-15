import type { FoundImage, Identifiers } from "./types";
import { gradeLabel } from "./score";

export function toCsv(rows: FoundImage[]): string {
  const header = [
    "grade",
    "score",
    "title",
    "sourceUrl",
    "imageUrl",
    "provider",
    "queryUsed",
    "matched",
    "explanation",
    "foundAt",
    "contextScore",
    "visualScore",
  ];
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        gradeLabel(r.grade),
        String(r.score),
        r.title,
        r.sourceUrl,
        r.imageUrl,
        r.provider,
        r.queryUsed,
        r.matched.join("; "),
        r.explanation.join(" | "),
        r.foundAt,
        String(r.contextScore),
        r.visualScore == null ? "" : String(r.visualScore),
      ]
        .map(esc)
        .join(","),
    ),
  ];
  return lines.join("\n");
}

export function toJson(id: Identifiers, rows: FoundImage[]) {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      disclaimer:
        "Public-source research only. Grades are not identity determinations. Verify every result manually.",
      identifiers: id,
      results: rows,
    },
    null,
    2,
  );
}

export function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
