export function displaySrc(url: string) {
  if (!url) return url;
  if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("/")) return url;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return url;
    return `/api/thumb?u=${encodeURIComponent(url)}`;
  } catch {
    return url;
  }
}
