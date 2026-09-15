import { isBlockedHost, parsePublicUrl } from "./url-guard";
import { hitMentionsName } from "./name-match";

export type PublicHit = {
  title: string;
  sourceUrl: string;
  imageUrl: string;
  thumbUrl: string;
  provider: string;
  caption: string;
  pageTitle: string;
};

const UA =
  "BeaconPublicPhotoFinder/1.0 (family-reunification research; public-sources-only)";

const SKIP_TITLE =
  /\b(icon|logo|flag|coat of arms|svg|map of|location map|signature of|wordmark|pictogram)\b/i;

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function decode(s: string) {
  return s
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

async function getJson(url: URL): Promise<unknown> {
  let lastErr = "request failed";
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 429) {
      lastErr = `${url.hostname} rate-limited`;
      await new Promise((r) => setTimeout(r, 700));
      continue;
    }
    if (!res.ok) throw new Error(`${url.hostname} ${res.status}`);
    const type = res.headers.get("content-type") || "";
    if (!type.includes("json")) throw new Error(`${url.hostname} returned non-JSON`);
    return res.json();
  }
  throw new Error(lastErr);
}

async function openverse(q: string, limit: number): Promise<PublicHit[]> {
  const url = new URL("https://api.openverse.org/v1/images/");
  url.searchParams.set("q", q);
  url.searchParams.set("page_size", String(Math.min(20, limit)));
  url.searchParams.set("mature", "false");
  const json = (await getJson(url)) as {
    results?: Array<{
      title?: string;
      url?: string;
      foreign_landing_url?: string;
      thumbnail?: string;
      creator?: string;
      source?: string;
    }>;
  };
  return (json.results ?? []).flatMap((r) => {
    const imageUrl = r.url ?? "";
    const sourceUrl = r.foreign_landing_url || imageUrl;
    if (!imageUrl) return [];
    if (SKIP_TITLE.test(r.title || "")) return [];
    return [
      {
        title: r.title || "Untitled",
        sourceUrl,
        imageUrl,
        thumbUrl: imageUrl,
        provider: `Openverse / ${r.source || "CC"}`,
        caption: [r.title, r.creator].filter(Boolean).join(" — "),
        pageTitle: r.title || "",
      },
    ];
  });
}

async function wikimedia(q: string, limit: number): Promise<PublicHit[]> {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", q);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", String(Math.min(16, limit)));
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|extmetadata|mime|size");
  url.searchParams.set("iiurlwidth", "480");
  const json = (await getJson(url)) as {
    query?: {
      pages?: Record<
        string,
        {
          title?: string;
          imageinfo?: Array<{
            url?: string;
            descriptionurl?: string;
            thumburl?: string;
            mime?: string;
            extmetadata?: {
              ImageDescription?: { value?: string };
              ObjectName?: { value?: string };
            };
          }>;
        }
      >;
    };
  };
  const pages = Object.values(json.query?.pages ?? {});
  return pages.flatMap((p) => {
    const info = p.imageinfo?.[0];
    if (!info?.url) return [];
    if (info.mime && !info.mime.startsWith("image/")) return [];
    if (info.mime === "image/svg+xml") return [];
    if (SKIP_TITLE.test(p.title || "") || SKIP_TITLE.test(info.extmetadata?.ObjectName?.value || "")) {
      return [];
    }
    const desc = stripTags(info.extmetadata?.ImageDescription?.value || "");
    const name = stripTags(info.extmetadata?.ObjectName?.value || p.title || "");
    return [
      {
        title: name.replace(/^File:/, ""),
        sourceUrl: info.descriptionurl || info.url,
        imageUrl: info.url,
        thumbUrl: info.thumburl || info.url,
        provider: "Wikimedia Commons",
        caption: desc,
        pageTitle: p.title || "",
      },
    ];
  });
}

async function wikipedia(name: string): Promise<PublicHit[]> {
  const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
  searchUrl.searchParams.set("action", "query");
  searchUrl.searchParams.set("list", "search");
  searchUrl.searchParams.set("srsearch", name);
  searchUrl.searchParams.set("srlimit", "3");
  searchUrl.searchParams.set("format", "json");
  searchUrl.searchParams.set("origin", "*");
  const search = (await getJson(searchUrl)) as {
    query?: { search?: Array<{ title: string }> };
  };
  const titles = (search.query?.search ?? []).map((s) => s.title);
  if (!titles.length) return [];

  const pageUrl = new URL("https://en.wikipedia.org/w/api.php");
  pageUrl.searchParams.set("action", "query");
  pageUrl.searchParams.set("titles", titles.join("|"));
  pageUrl.searchParams.set("prop", "pageimages|extracts|info");
  pageUrl.searchParams.set("piprop", "thumbnail|original|name");
  pageUrl.searchParams.set("pithumbsize", "800");
  pageUrl.searchParams.set("exintro", "1");
  pageUrl.searchParams.set("explaintext", "1");
  pageUrl.searchParams.set("inprop", "url");
  pageUrl.searchParams.set("format", "json");
  pageUrl.searchParams.set("origin", "*");
  const pagesJson = (await getJson(pageUrl)) as {
    query?: {
      pages?: Record<
        string,
        {
          title?: string;
          fullurl?: string;
          extract?: string;
          thumbnail?: { source?: string };
          original?: { source?: string };
        }
      >;
    };
  };

  const hits: PublicHit[] = [];
  for (const p of Object.values(pagesJson.query?.pages ?? {})) {
    const imageUrl = p.original?.source || p.thumbnail?.source;
    if (!imageUrl) continue;
    hits.push({
      title: p.title || name,
      sourceUrl: p.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title || name)}`,
      imageUrl,
      thumbUrl: p.thumbnail?.source || imageUrl,
      provider: "Wikipedia",
      caption: (p.extract || "").slice(0, 420),
      pageTitle: p.title || "",
    });
  }

  const primary = titles[0];
  if (primary) {
    const imgUrl = new URL("https://en.wikipedia.org/w/api.php");
    imgUrl.searchParams.set("action", "query");
    imgUrl.searchParams.set("titles", primary);
    imgUrl.searchParams.set("generator", "images");
    imgUrl.searchParams.set("gimlimit", "8");
    imgUrl.searchParams.set("prop", "imageinfo");
    imgUrl.searchParams.set("iiprop", "url|extmetadata|mime");
    imgUrl.searchParams.set("iiurlwidth", "480");
    imgUrl.searchParams.set("format", "json");
    imgUrl.searchParams.set("origin", "*");
    try {
      const imgs = (await getJson(imgUrl)) as {
        query?: {
          pages?: Record<
            string,
            {
              title?: string;
              imageinfo?: Array<{
                url?: string;
                descriptionurl?: string;
                thumburl?: string;
                mime?: string;
                extmetadata?: {
                  ImageDescription?: { value?: string };
                  ObjectName?: { value?: string };
                };
              }>;
            }
          >;
        };
      };
      for (const p of Object.values(imgs.query?.pages ?? {})) {
        const info = p.imageinfo?.[0];
        if (!info?.url) continue;
        if (info.mime && !info.mime.startsWith("image/")) continue;
        if (info.mime === "image/svg+xml") continue;
        if (SKIP_TITLE.test(p.title || "")) continue;
        const desc = stripTags(info.extmetadata?.ImageDescription?.value || "");
        hits.push({
          title: (p.title || "").replace(/^File:/, ""),
          sourceUrl: info.descriptionurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(primary)}`,
          imageUrl: info.url,
          thumbUrl: info.thumburl || info.url,
          provider: "Wikipedia article image",
          caption: desc || `Image used on ${primary}`,
          pageTitle: primary,
        });
      }
    } catch {
      /* article images are optional */
    }
  }
  return hits;
}

export async function runPublicCatalogSearch(data: {
  name?: string;
  query: string;
  limit?: number;
}): Promise<{ hits: PublicHit[]; notes: string[] }> {
  const limit = data.limit ?? 12;
  const notes: string[] = [];
  const subject = (data.name || data.query).trim();
  const quoted = subject.includes(" ") ? `"${subject.replace(/"/g, "")}"` : subject;

  const [wiki, commons, ov] = await Promise.allSettled([
    wikipedia(subject),
    wikimedia(quoted, limit),
    openverse(quoted, limit),
  ]);

  const hits: PublicHit[] = [];
  if (wiki.status === "fulfilled") hits.push(...wiki.value);
  else notes.push("Wikipedia did not respond.");
  if (commons.status === "fulfilled") hits.push(...commons.value);
  else notes.push("Wikimedia Commons did not respond.");
  if (ov.status === "fulfilled") hits.push(...ov.value);
  else notes.push("Openverse did not respond.");

  const named = data.name?.trim() ? hits.filter((h) => hitMentionsName(h, data.name!)) : hits;

  const seen = new Set<string>();
  const unique = named.filter((h) => {
    const k = h.imageUrl.split("?")[0];
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  if (named.length < hits.length) {
    notes.push(`Dropped ${hits.length - named.length} catalog hits that did not mention the name.`);
  }
  notes.push(
    "Automatic catalogs: Wikipedia, Wikimedia Commons, and Openverse (Creative Commons). Google, Facebook, LinkedIn, and Instagram are not scraped — use the operator links.",
  );
  return { hits: unique.slice(0, limit * 2), notes };
}

export async function inspectPublicPage(raw: string): Promise<{ title: string; imageUrl?: string; text: string }> {
  const url = parsePublicUrl(raw);
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    redirect: "follow",
    signal: AbortSignal.timeout(7000),
  });
  const finalHost = new URL(res.url).hostname;
  if (isBlockedHost(finalHost)) throw new Error("Redirect blocked");
  const html = (await res.text()).slice(0, 200_000);
  const title =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1] ||
    html.match(/<title[^>]*>([^<]+)/i)?.[1] ||
    url.hostname;
  const imageUrl =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1500);
  return { title: decode(title), imageUrl, text };
}
