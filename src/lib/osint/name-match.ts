export function nameTokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);
}

export function hitMentionsName(
  hit: { title: string; caption: string; pageTitle: string; sourceUrl: string },
  name: string,
): boolean {
  const tokens = nameTokens(name);
  if (!tokens.length) return true;
  const hay = `${hit.title} ${hit.caption} ${hit.pageTitle} ${hit.sourceUrl}`.toLowerCase();
  return tokens.every((t) => hay.includes(t));
}
