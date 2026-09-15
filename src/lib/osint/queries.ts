import type { Identifiers, QueryItem } from "./types.ts";

function t(s: string | undefined) {
  return (s ?? "").trim();
}

function quote(s: string) {
  const clean = s.replace(/"/g, "").trim();
  if (!clean) return "";
  return `"${clean}"`;
}

function splitList(s: string) {
  return s
    .split(/[,;\n]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function googleWeb(q: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

function googleImages(q: string) {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`;
}

function item(group: string, label: string, query: string, i: number): QueryItem {
  return {
    id: `${group}-${i}-${label}`,
    group,
    label,
    query,
    googleWeb: googleWeb(query),
    googleImages: googleImages(query),
  };
}

function names(id: Identifiers): string[] {
  const primary = t(id.name);
  const extras = splitList(id.aliases);
  const all = primary ? [primary, ...extras] : extras;
  return [...new Set(all.map((n) => n.replace(/\s+/g, " ").trim()))];
}

function nameClause(id: Identifiers): string {
  const n = names(id);
  if (n.length === 0) return "";
  if (n.length === 1) return quote(n[0]!);
  return `(${n.map(quote).join(" OR ")})`;
}

function locClause(id: Identifiers): string {
  const city = t(id.city);
  const state = t(id.state);
  if (city && state) return `(${quote(city)} OR ${quote(state)})`;
  if (city) return quote(city);
  if (state) return quote(state);
  return "";
}

function joinAnd(parts: Array<string | undefined>) {
  return parts.map(t).filter(Boolean).join(" ");
}

export function generateQueries(id: Identifiers): QueryItem[] {
  const out: QueryItem[] = [];
  const n = nameClause(id);
  const loc = locClause(id);
  const employer = t(id.employer);
  const title = t(id.jobTitle);
  const hobbies = t(id.hobbies);
  const marital = t(id.maritalStatus);
  const keywords = t(id.keywords);
  const appearance = t(id.appearance);
  const after = t(id.afterDate);
  const before = t(id.beforeDate);
  const dateBits = joinAnd([
    after ? `after:${after.slice(0, 10)}` : "",
    before ? `before:${before.slice(0, 10)}` : "",
  ]);

  const push = (group: string, label: string, query: string) => {
    const q = query.replace(/\s+/g, " ").trim();
    if (!q) return;
    out.push(item(group, label, q, out.length));
  };

  if (!n && !employer && !keywords) return out;

  push("Identity", "Name + location", joinAnd([n, loc, keywords, dateBits]));
  push(
    "Identity",
    "Name + employer / school",
    joinAnd([n, employer ? quote(employer) : "", title ? quote(title) : "", loc, dateBits]),
  );
  push("Identity", "Name + role + location", joinAnd([n, title ? quote(title) : "", loc, keywords]));
  if (hobbies) {
    push("Identity", "Name + activity", joinAnd([n, quote(hobbies), loc]));
  }
  if (marital) {
    push("Identity", "Name + family context", joinAnd([n, quote(marital), loc]));
  }
  if (appearance) {
    push("Identity", "Name + visible traits", joinAnd([n, quote(appearance), loc]));
  }

  const photoBits = `(photo OR photograph OR picture OR portrait OR headshot OR "staff photo" OR yearbook)`;
  push("Images", "Photo keywords", joinAnd([n, loc, photoBits, dateBits]));
  push("Images", "JPG files", joinAnd([n, loc, "filetype:jpg"]));
  push("Images", "PNG files", joinAnd([n, loc, "filetype:png"]));
  push("Images", "PDF documents", joinAnd([n, loc, employer ? quote(employer) : "", "filetype:pdf"]));
  push(
    "Images",
    "Gallery / album URLs",
    joinAnd([n, "(inurl:photo OR inurl:photos OR inurl:gallery OR inurl:album OR inurl:images)"]),
  );
  push("Images", "Titled photo pages", joinAnd([n, "(intitle:photo OR intitle:gallery OR intitle:obituary)"]));
  push("Images", "News file photos", joinAnd([n, loc, `("file photo" OR "courtesy photo" OR photographed)`]));

  push(
    "Missing",
    "Missing-person language",
    joinAnd([n, loc, `(missing OR "last seen" OR "have you seen" OR "missing person" OR runaway OR abducted)`]),
  );
  push("Missing", "NamUs", joinAnd([`(site:namus.gov OR site:namus.nij.ojp.gov)`, n, loc]));
  push("Missing", "NCMEC", joinAnd(["site:missingkids.org", n, loc]));
  push("Missing", "Charley Project", joinAnd(["site:charleyproject.org", n]));
  push("Missing", "Government posters", joinAnd(["site:.gov", n, `(missing OR unidentified OR "endangered missing")`]));
  push(
    "Missing",
    "School / yearbook",
    joinAnd([n, loc, `(yearbook OR "class photo" OR "school photo" OR "team photo" OR "class of")`]),
  );
  push("Missing", "Flyers and posters", joinAnd([n, loc, `(poster OR flyer OR "amber alert" OR "missing flyer")`]));

  const platforms: Array<{ group: string; label: string; site: string; extra?: string }> = [
    { group: "LinkedIn", label: "LinkedIn profiles", site: "site:linkedin.com/in", extra: loc },
    {
      group: "LinkedIn",
      label: "LinkedIn mentions",
      site: "site:linkedin.com",
      extra: joinAnd([loc, employer ? quote(employer) : ""]),
    },
    { group: "Facebook", label: "Facebook public posts", site: "site:facebook.com", extra: loc },
    { group: "Instagram", label: "Instagram public pages", site: "site:instagram.com" },
    { group: "Flickr", label: "Flickr", site: "site:flickr.com", extra: loc },
    { group: "Meetup", label: "Meetup", site: "site:meetup.com" },
    { group: "Eventbrite", label: "Eventbrite", site: "site:eventbrite.com" },
    { group: "News", label: "Google News-style pages", site: "site:news.google.com" },
    { group: "News", label: "Press / news keywords", site: "", extra: `(news OR press OR obituary OR "annual report")` },
    { group: "Blogs", label: "Blogger", site: "site:blogspot.com" },
    { group: "Blogs", label: "WordPress.com", site: "site:wordpress.com" },
    { group: "Government", label: "US government", site: "site:.gov" },
    { group: "Government", label: "US military / state", site: "site:.mil OR site:.us" },
    { group: "Archive", label: "Internet Archive mentions", site: "site:web.archive.org" },
    { group: "Archive", label: "Cached PDFs", site: "", extra: `filetype:pdf ${dateBits}`.trim() },
  ];

  for (const p of platforms) {
    push(p.group, p.label, joinAnd([p.site, n, p.extra, loc, dateBits]));
  }

  if (employer) {
    const domainGuess = employer
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 24);
    push("Employer", "Employer name + photo", joinAnd([n, quote(employer), photoBits]));
    push("Employer", "Likely company blog", joinAnd([n, quote(employer), "(blog OR newsletter OR staff OR roster)"]));
    if (domainGuess.length > 3) {
      push("Employer", "Guessed domain (verify)", joinAnd([n, `site:${domainGuess}.com OR site:${domainGuess}.org`]));
    }
  }

  for (const handle of splitList(id.socialUsernames)) {
    const h = handle.replace(/^@/, "");
    push("Usernames", `@${h} across the web`, joinAnd([h, n || "", loc]));
    push("Usernames", `Exact handle`, quote(h));
    push("Usernames", `Instagram handle`, `site:instagram.com ${h}`);
    push("Usernames", `X / Twitter handle`, `site:x.com/${h} OR site:twitter.com/${h}`);
    push("Usernames", `Facebook handle`, `site:facebook.com/${h}`);
  }

  for (const site of splitList(id.knownWebsites)) {
    const host = site.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!host) continue;
    push("Known sites", `site:${host}`, joinAnd([`site:${host}`, n, photoBits]));
  }

  if (dateBits) {
    push("Dates", "Dated identity search", joinAnd([n, loc, employer ? quote(employer) : "", dateBits]));
  }

  const seen = new Set<string>();
  return out.filter((q) => {
    if (seen.has(q.query)) return false;
    seen.add(q.query);
    return true;
  });
}

export const QUERY_GROUPS = [
  "Identity",
  "Images",
  "Missing",
  "LinkedIn",
  "Facebook",
  "Instagram",
  "Flickr",
  "Meetup",
  "Eventbrite",
  "News",
  "Blogs",
  "Government",
  "Employer",
  "Usernames",
  "Known sites",
  "Archive",
  "Dates",
] as const;
