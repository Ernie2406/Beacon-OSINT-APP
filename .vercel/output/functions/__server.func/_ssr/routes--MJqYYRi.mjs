import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as string, n as number, r as object } from "../_libs/zod.mjs";
import { _ as Copy, a as SunMedium, c as Search, d as Images, f as FolderSearch, g as Download, h as Eraser, i as Trash2, l as ScanSearch, m as ExternalLink, n as Upload, o as ShieldAlert, p as FileJson, s as Sheet, t as Waypoints, u as Printer } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes--MJqYYRi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-sm text-fg placeholder:text-muted", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
function Field({ label, hint, value, onChange, placeholder, type = "text", area }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }),
			area ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value,
				onChange: (e) => onChange(e.target.value),
				placeholder,
				rows: 3
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type,
				value,
				onChange: (e) => onChange(e.target.value),
				placeholder
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-surface text-fg border border-border hover:bg-subtle",
			ghost: "text-fg hover:bg-subtle",
			outline: "border border-border bg-transparent text-fg hover:bg-subtle",
			danger: "bg-low text-fg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var emptyIdentifiers = () => ({
	name: "",
	aliases: "",
	city: "",
	state: "",
	employer: "",
	jobTitle: "",
	hobbies: "",
	maritalStatus: "",
	socialUsernames: "",
	knownWebsites: "",
	afterDate: "",
	beforeDate: "",
	keywords: "",
	appearance: ""
});
var defaultEnhance = () => ({
	brightness: 0,
	contrast: 0,
	sharpen: 20,
	denoise: 10,
	upscale: 1,
	crop: null
});
function t(s) {
	return (s ?? "").trim();
}
function quote(s) {
	const clean = s.replace(/"/g, "").trim();
	if (!clean) return "";
	return `"${clean}"`;
}
function splitList(s) {
	return s.split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean);
}
function googleWeb(q) {
	return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}
function googleImages(q) {
	return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`;
}
function item(group, label, query, i) {
	return {
		id: `${group}-${i}-${label}`,
		group,
		label,
		query,
		googleWeb: googleWeb(query),
		googleImages: googleImages(query)
	};
}
function names(id) {
	const primary = t(id.name);
	const extras = splitList(id.aliases);
	const all = primary ? [primary, ...extras] : extras;
	return [...new Set(all.map((n) => n.replace(/\s+/g, " ").trim()))];
}
function nameClause(id) {
	const n = names(id);
	if (n.length === 0) return "";
	if (n.length === 1) return quote(n[0]);
	return `(${n.map(quote).join(" OR ")})`;
}
function locClause(id) {
	const city = t(id.city);
	const state = t(id.state);
	if (city && state) return `(${quote(city)} OR ${quote(state)})`;
	if (city) return quote(city);
	if (state) return quote(state);
	return "";
}
function joinAnd(parts) {
	return parts.map(t).filter(Boolean).join(" ");
}
function generateQueries(id) {
	const out = [];
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
	const dateBits = joinAnd([after ? `after:${after.slice(0, 10)}` : "", before ? `before:${before.slice(0, 10)}` : ""]);
	const push = (group, label, query) => {
		const q = query.replace(/\s+/g, " ").trim();
		if (!q) return;
		out.push(item(group, label, q, out.length));
	};
	if (!n && !employer && !keywords) return out;
	push("Identity", "Name + location", joinAnd([
		n,
		loc,
		keywords,
		dateBits
	]));
	push("Identity", "Name + employer / school", joinAnd([
		n,
		employer ? quote(employer) : "",
		title ? quote(title) : "",
		loc,
		dateBits
	]));
	push("Identity", "Name + role + location", joinAnd([
		n,
		title ? quote(title) : "",
		loc,
		keywords
	]));
	if (hobbies) push("Identity", "Name + activity", joinAnd([
		n,
		quote(hobbies),
		loc
	]));
	if (marital) push("Identity", "Name + family context", joinAnd([
		n,
		quote(marital),
		loc
	]));
	if (appearance) push("Identity", "Name + visible traits", joinAnd([
		n,
		quote(appearance),
		loc
	]));
	const photoBits = `(photo OR photograph OR picture OR portrait OR headshot OR "staff photo" OR yearbook)`;
	push("Images", "Photo keywords", joinAnd([
		n,
		loc,
		photoBits,
		dateBits
	]));
	push("Images", "JPG files", joinAnd([
		n,
		loc,
		"filetype:jpg"
	]));
	push("Images", "PNG files", joinAnd([
		n,
		loc,
		"filetype:png"
	]));
	push("Images", "PDF documents", joinAnd([
		n,
		loc,
		employer ? quote(employer) : "",
		"filetype:pdf"
	]));
	push("Images", "Gallery / album URLs", joinAnd([n, "(inurl:photo OR inurl:photos OR inurl:gallery OR inurl:album OR inurl:images)"]));
	push("Images", "Titled photo pages", joinAnd([n, "(intitle:photo OR intitle:gallery OR intitle:obituary)"]));
	push("Images", "News file photos", joinAnd([
		n,
		loc,
		`("file photo" OR "courtesy photo" OR photographed)`
	]));
	push("Missing", "Missing-person language", joinAnd([
		n,
		loc,
		`(missing OR "last seen" OR "have you seen" OR "missing person" OR runaway OR abducted)`
	]));
	push("Missing", "NamUs", joinAnd([
		`(site:namus.gov OR site:namus.nij.ojp.gov)`,
		n,
		loc
	]));
	push("Missing", "NCMEC", joinAnd([
		"site:missingkids.org",
		n,
		loc
	]));
	push("Missing", "Charley Project", joinAnd(["site:charleyproject.org", n]));
	push("Missing", "Government posters", joinAnd([
		"site:.gov",
		n,
		`(missing OR unidentified OR "endangered missing")`
	]));
	push("Missing", "School / yearbook", joinAnd([
		n,
		loc,
		`(yearbook OR "class photo" OR "school photo" OR "team photo" OR "class of")`
	]));
	push("Missing", "Flyers and posters", joinAnd([
		n,
		loc,
		`(poster OR flyer OR "amber alert" OR "missing flyer")`
	]));
	const platforms = [
		{
			group: "LinkedIn",
			label: "LinkedIn profiles",
			site: "site:linkedin.com/in",
			extra: loc
		},
		{
			group: "LinkedIn",
			label: "LinkedIn mentions",
			site: "site:linkedin.com",
			extra: joinAnd([loc, employer ? quote(employer) : ""])
		},
		{
			group: "Facebook",
			label: "Facebook public posts",
			site: "site:facebook.com",
			extra: loc
		},
		{
			group: "Instagram",
			label: "Instagram public pages",
			site: "site:instagram.com"
		},
		{
			group: "Flickr",
			label: "Flickr",
			site: "site:flickr.com",
			extra: loc
		},
		{
			group: "Meetup",
			label: "Meetup",
			site: "site:meetup.com"
		},
		{
			group: "Eventbrite",
			label: "Eventbrite",
			site: "site:eventbrite.com"
		},
		{
			group: "News",
			label: "Google News-style pages",
			site: "site:news.google.com"
		},
		{
			group: "News",
			label: "Press / news keywords",
			site: "",
			extra: `(news OR press OR obituary OR "annual report")`
		},
		{
			group: "Blogs",
			label: "Blogger",
			site: "site:blogspot.com"
		},
		{
			group: "Blogs",
			label: "WordPress.com",
			site: "site:wordpress.com"
		},
		{
			group: "Government",
			label: "US government",
			site: "site:.gov"
		},
		{
			group: "Government",
			label: "US military / state",
			site: "site:.mil OR site:.us"
		},
		{
			group: "Archive",
			label: "Internet Archive mentions",
			site: "site:web.archive.org"
		},
		{
			group: "Archive",
			label: "Cached PDFs",
			site: "",
			extra: `filetype:pdf ${dateBits}`.trim()
		}
	];
	for (const p of platforms) push(p.group, p.label, joinAnd([
		p.site,
		n,
		p.extra,
		loc,
		dateBits
	]));
	if (employer) {
		const domainGuess = employer.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24);
		push("Employer", "Employer name + photo", joinAnd([
			n,
			quote(employer),
			photoBits
		]));
		push("Employer", "Likely company blog", joinAnd([
			n,
			quote(employer),
			"(blog OR newsletter OR staff OR roster)"
		]));
		if (domainGuess.length > 3) push("Employer", "Guessed domain (verify)", joinAnd([n, `site:${domainGuess}.com OR site:${domainGuess}.org`]));
	}
	for (const handle of splitList(id.socialUsernames)) {
		const h = handle.replace(/^@/, "");
		push("Usernames", `@${h} across the web`, joinAnd([
			h,
			n || "",
			loc
		]));
		push("Usernames", `Exact handle`, quote(h));
		push("Usernames", `Instagram handle`, `site:instagram.com ${h}`);
		push("Usernames", `X / Twitter handle`, `site:x.com/${h} OR site:twitter.com/${h}`);
		push("Usernames", `Facebook handle`, `site:facebook.com/${h}`);
	}
	for (const site of splitList(id.knownWebsites)) {
		const host = site.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
		if (!host) continue;
		push("Known sites", `site:${host}`, joinAnd([
			`site:${host}`,
			n,
			photoBits
		]));
	}
	if (dateBits) push("Dates", "Dated identity search", joinAnd([
		n,
		loc,
		employer ? quote(employer) : "",
		dateBits
	]));
	const seen = /* @__PURE__ */ new Set();
	return out.filter((q) => {
		if (seen.has(q.query)) return false;
		seen.add(q.query);
		return true;
	});
}
var QUERY_GROUPS = [
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
	"Dates"
];
function displaySrc(url) {
	if (!url) return url;
	if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("/")) return url;
	try {
		if (new URL(url).protocol !== "https:") return url;
		return `/api/thumb?u=${encodeURIComponent(url)}`;
	} catch {
		return url;
	}
}
function lumaAt(px, i) {
	return .299 * px[i] + .587 * px[i + 1] + .114 * px[i + 2];
}
function resample(data, w, h) {
	const src = document.createElement("canvas");
	src.width = data.width;
	src.height = data.height;
	src.getContext("2d").putImageData(data, 0, 0);
	const tmp = document.createElement("canvas");
	tmp.width = w;
	tmp.height = h;
	const tctx = tmp.getContext("2d");
	if (!tctx) return new ImageData(w, h);
	tctx.drawImage(src, 0, 0, w, h);
	return tctx.getImageData(0, 0, w, h);
}
/** 8x8 average-hash. Supporting visual signal only — not a biometric system. */
function aHashFromImageData(data) {
	const small = resample(data, 8, 8).data;
	const lumas = [];
	for (let i = 0; i < small.length; i += 4) lumas.push(lumaAt(small, i));
	const avg = lumas.reduce((a, b) => a + b, 0) / lumas.length;
	return lumas.map((v) => v >= avg ? "1" : "0").join("");
}
/** 9x8 difference-hash. More stable than aHash for cropped portraits. */
function dHashFromImageData(data) {
	const small = resample(data, 9, 8).data;
	let bits = "";
	for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
		const left = lumaAt(small, (y * 9 + x) * 4);
		const right = lumaAt(small, (y * 9 + x + 1) * 4);
		bits += left < right ? "1" : "0";
	}
	return bits;
}
function fingerprintFromImageData(data) {
	return {
		hash: aHashFromImageData(data),
		dHash: dHashFromImageData(data),
		hist: histogram(data)
	};
}
function hamming(a, b) {
	if (!a || !b || a.length !== b.length) return 64;
	let d = 0;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
	return d;
}
function histogram(data) {
	const bins = new Array(24).fill(0);
	const px = data.data;
	for (let i = 0; i < px.length; i += 16) {
		const r = Math.min(7, px[i] >> 5);
		const g = Math.min(7, px[i + 1] >> 5);
		const b = Math.min(7, px[i + 2] >> 5);
		bins[r] += 1;
		bins[8 + g] += 1;
		bins[16 + b] += 1;
	}
	const sum = bins.reduce((a, b) => a + b, 0) || 1;
	return bins.map((v) => v / sum);
}
function histCorr(a, b) {
	const n = Math.min(a.length, b.length);
	let dot = 0, na = 0, nb = 0;
	for (let i = 0; i < n; i++) {
		dot += a[i] * b[i];
		na += a[i] * a[i];
		nb += b[i] * b[i];
	}
	if (!na || !nb) return 0;
	return dot / Math.sqrt(na * nb);
}
async function fingerprintFromUrl(url) {
	try {
		const img = await loadImage(displaySrc(url));
		const canvas = document.createElement("canvas");
		const scale = Math.min(1, 256 / Math.max(img.width, img.height));
		canvas.width = Math.max(8, Math.round(img.width * scale));
		canvas.height = Math.max(8, Math.round(img.height * scale));
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		return fingerprintFromImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
	} catch {
		return null;
	}
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		if (!src.startsWith("data:") && !src.startsWith("blob:")) img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not load image"));
		img.src = src;
	});
}
function tokens(s) {
	return s.toLowerCase().replace(/['’]/g, "").split(/[^a-z0-9]+/).filter((w) => w.length > 1);
}
function haystack(img) {
	return `${img.title} ${img.caption} ${img.pageTitle} ${img.sourceUrl} ${img.provider}`.toLowerCase();
}
function containsPhrase(hay, phrase) {
	const p = phrase.trim().toLowerCase();
	if (p.length < 2) return false;
	return hay.includes(p);
}
function gradeFromScore(score, canBeHigh) {
	if (score >= 72 && canBeHigh) return "high";
	if (score >= 48) return "medium";
	if (score >= 22) return "low";
	return "insufficient";
}
function gradeLabel(g) {
	switch (g) {
		case "high": return "High confidence";
		case "medium": return "Medium confidence";
		case "low": return "Low confidence";
		default: return "Not enough evidence";
	}
}
function scoreImage(id, img, visual) {
	const hay = haystack(img);
	const signals = [];
	const matched = [];
	let context = 0;
	const name = id.name.trim();
	if (name && containsPhrase(hay, name)) {
		context += 40;
		matched.push("Name in source text");
		signals.push({
			label: "Name",
			detail: `“${name}” appears in title, caption, or URL`,
			weight: 40
		});
	} else if (name) {
		const parts = tokens(name).filter((w) => w.length > 2);
		const hits = parts.filter((p) => hay.includes(p));
		if (hits.length && hits.length === parts.length) {
			context += 24;
			matched.push("Name in source text");
			signals.push({
				label: "Name tokens",
				detail: `All name parts found (${hits.join(", ")})`,
				weight: 24
			});
		} else if (hits.length) {
			context += 8;
			signals.push({
				label: "Partial name",
				detail: `Only ${hits.join(", ")} found — possible name collision`,
				weight: 8
			});
		}
	}
	if (id.aliases.trim()) {
		const aliasHit = id.aliases.split(/[,;]/).map((a) => a.trim()).filter((a) => a && containsPhrase(hay, a));
		if (aliasHit.length) {
			context += 10;
			matched.push("Alias");
			signals.push({
				label: "Alias",
				detail: aliasHit.join(", "),
				weight: 10
			});
		}
	}
	const locHits = [id.city, id.state].map((s) => s.trim()).filter(Boolean).filter((b) => containsPhrase(hay, b));
	if (locHits.length) {
		const w = locHits.length * 8;
		context += w;
		matched.push("Location");
		signals.push({
			label: "Location",
			detail: locHits.join(", "),
			weight: w
		});
	}
	if (id.employer.trim() && containsPhrase(hay, id.employer.trim())) {
		context += 16;
		matched.push("Employer");
		signals.push({
			label: "Employer",
			detail: id.employer.trim(),
			weight: 16
		});
	}
	if (id.jobTitle.trim() && containsPhrase(hay, id.jobTitle.trim())) {
		context += 10;
		matched.push("Job title");
		signals.push({
			label: "Job title",
			detail: id.jobTitle.trim(),
			weight: 10
		});
	}
	if (id.hobbies.trim() && containsPhrase(hay, id.hobbies.trim())) {
		context += 6;
		matched.push("Hobby");
		signals.push({
			label: "Hobby",
			detail: id.hobbies.trim(),
			weight: 6
		});
	}
	if (id.appearance.trim()) {
		const hits = id.appearance.split(/[,;]+/).map((a) => a.trim()).filter((a) => a.length > 2).filter((b) => containsPhrase(hay, b));
		if (hits.length) {
			const w = Math.min(14, hits.length * 5);
			context += w;
			matched.push("Appearance");
			signals.push({
				label: "Appearance",
				detail: hits.join(", "),
				weight: w
			});
		}
	}
	for (const handle of id.socialUsernames.split(/[,;\s]+/).map((h) => h.replace(/^@/, "").trim()).filter(Boolean)) if (hay.includes(handle.toLowerCase())) {
		context += 14;
		matched.push("Username");
		signals.push({
			label: "Username",
			detail: handle,
			weight: 14
		});
	}
	for (const site of id.knownWebsites.split(/[,;\s]+/).map((s) => s.replace(/^https?:\/\//, "").split("/")[0] ?? "").filter(Boolean)) if (hay.includes(site.toLowerCase())) {
		context += 12;
		matched.push("Known website");
		signals.push({
			label: "Known site",
			detail: site,
			weight: 12
		});
	}
	if (id.keywords.trim()) {
		const kh = id.keywords.split(/[,]+/).map((k) => k.trim()).filter(Boolean).filter((k) => containsPhrase(hay, k));
		if (kh.length) {
			const w = Math.min(12, kh.length * 4);
			context += w;
			matched.push("Keywords");
			signals.push({
				label: "Keywords",
				detail: kh.join(", "),
				weight: w
			});
		}
	}
	context = Math.min(80, context);
	let visualScore = null;
	if (visual?.ref && visual.cand) {
		const distA = hamming(visual.ref.hash, visual.cand.hash);
		const distD = hamming(visual.ref.dHash || "", visual.cand.dHash || "");
		const hashSim = Math.max(0, 1 - distA / 64);
		const dSim = visual.ref.dHash && visual.cand.dHash ? Math.max(0, 1 - distD / 64) : hashSim;
		const histSim = histCorr(visual.ref.hist, visual.cand.hist);
		visualScore = Math.round((hashSim * .35 + dSim * .35 + histSim * .3) * 30);
		signals.push({
			label: "Visual similarity",
			detail: `Average-hash distance ${distA}/64; difference-hash ${distD}/64; color correlation ${(histSim * 100).toFixed(0)}%. Supporting signal only — not facial recognition.`,
			weight: visualScore
		});
	}
	const score = Math.min(100, context + (visualScore ?? 0));
	const grade = gradeFromScore(score, matched.includes("Name in source text") && (matched.includes("Location") || matched.includes("Employer") || matched.includes("Username") || matched.includes("Appearance")) || (visualScore ?? 0) >= 18 && matched.includes("Name in source text"));
	const explanation = [];
	if (signals.length === 0) explanation.push("No identifier text and no reference-image comparison. Treat as unverified.");
	else explanation.push(...signals.map((s) => `${s.label}: ${s.detail}`));
	if (grade === "high") explanation.push("High grade requires name plus another identifier, or name plus a strong visual signal. Still verify by eye. This is not a positive identification.");
	else if (grade === "medium") explanation.push("Partial match. Common names and stock photos often land here.");
	else if (grade === "low") explanation.push("Weak overlap. Likely a name collision or unrelated result.");
	else explanation.push("Insufficient data to say this is the intended person.");
	return {
		...img,
		grade,
		score,
		explanation,
		matched,
		signals,
		visualScore,
		contextScore: context
	};
}
function byScore(a, b) {
	return b.score - a.score || b.contextScore - a.contextScore;
}
var useCase = create((set, get) => ({
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
	setIdentifiers: (p) => set((s) => ({ identifiers: {
		...s.identifiers,
		...p
	} })),
	setTab: (tab) => set({ tab }),
	setEnhance: (p) => set((s) => ({ enhance: {
		...s.enhance,
		...p
	} })),
	setReference: (refDataUrl, refPrint, qualityIssues) => set({
		refDataUrl,
		refPrint,
		qualityIssues
	}),
	setEnhanced: (enhancedUrl) => set({ enhancedUrl }),
	setSearching: (searching) => set({ searching }),
	setError: (error) => set({ error }),
	ingestHits: (hits, queryUsed, visualMap) => {
		const id = get().identifiers;
		const ref = get().refPrint;
		const incoming = hits.map((h, i) => {
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
				foundAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			return scoreImage(id, base, ref && visualMap ? {
				ref,
				cand: visualMap[h.imageUrl] ?? visualMap[base.id] ?? null
			} : void 0);
		});
		set((s) => {
			const merged = [...incoming, ...s.results];
			const seen = /* @__PURE__ */ new Set();
			const unique = merged.filter((r) => {
				const k = r.imageUrl.split("?")[0];
				if (seen.has(k)) return false;
				seen.add(k);
				return true;
			});
			unique.sort(byScore);
			return {
				results: unique,
				tab: "results"
			};
		});
	},
	addManual: (img) => {
		const id = get().identifiers;
		const ref = get().refPrint;
		const scored = scoreImage(id, {
			id: `man-${Date.now()}`,
			title: img.title,
			sourceUrl: img.sourceUrl,
			imageUrl: img.imageUrl,
			thumbUrl: img.thumbUrl || img.imageUrl,
			provider: img.provider || "Manual",
			queryUsed: img.queryUsed || "manual add",
			caption: img.caption || "",
			pageTitle: img.pageTitle || img.title,
			foundAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ref && img.visual !== void 0 ? {
			ref,
			cand: img.visual
		} : void 0);
		set((s) => ({
			results: [scored, ...s.results].sort(byScore),
			tab: "results"
		}));
	},
	removeResult: (id) => set((s) => ({ results: s.results.filter((r) => r.id !== id) })),
	wipe: () => set({
		identifiers: emptyIdentifiers(),
		results: [],
		notes: [],
		error: null,
		refDataUrl: null,
		enhancedUrl: null,
		enhance: defaultEnhance(),
		qualityIssues: [],
		refPrint: null,
		historyClearedAt: (/* @__PURE__ */ new Date()).toISOString(),
		tab: "case"
	})
}));
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var searchPublicMedia = createServerFn({ method: "POST" }).validator((data) => {
	return object({
		name: string().max(120).optional(),
		query: string().max(180).optional(),
		limit: number().min(1).max(24).optional()
	}).refine((d) => (d.name?.trim().length ?? 0) >= 2 || (d.query?.trim().length ?? 0) >= 2, { message: "Add a name or query" }).parse(data);
}).handler(createSsrRpc("3a028e5c9d1952231f34a54f075ede408332bb395a5fa1799ef1953cf2c5ddb4"));
var inspectPublicUrl = createServerFn({ method: "POST" }).validator((data) => object({ url: string().url() }).parse(data)).handler(createSsrRpc("f1476ea6df29230d93f6dcc0a459e3b39701dee403c7fbd4eb98005fb1c2e2b8"));
function CaseForm() {
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
			const { hits, notes } = await searchPublicMedia({ data: {
				name: id.name.trim() || void 0,
				query: subject,
				limit: 12
			} });
			const ref = useCase.getState().refPrint;
			const visualMap = {};
			if (ref) await Promise.all(hits.slice(0, 12).map(async (h) => {
				visualMap[h.imageUrl] = await fingerprintFromUrl(h.thumbUrl || h.imageUrl);
			}));
			ingest(hits, subject, visualMap);
			useCase.setState((s) => ({
				...s,
				notes
			}));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Public search failed");
		} finally {
			setSearching(false);
		}
	}
	const queryCount = generateQueries(id).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-medium tracking-tight",
				children: "Case identifiers"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted",
				children: "Fill in only what you know. Empty fields are ignored. Nothing here logs into private accounts or bypasses paywalls."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "grid gap-2 sm:grid-cols-4",
				children: [
					{
						n: "01",
						t: "Identify",
						d: "Name, place, school, traits"
					},
					{
						n: "02",
						t: "Operators",
						d: "Open public web & image searches"
					},
					{
						n: "03",
						t: "Reverse",
						d: "Enhance a known photo"
					},
					{
						n: "04",
						t: "Grade",
						d: "Compare context, not just faces"
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-border bg-surface px-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted",
							children: s.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-medium",
							children: s.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted",
							children: s.d
						})
					]
				}, s.n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Who",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Full name",
						value: id.name,
						onChange: (v) => set({ name: v }),
						placeholder: "As it may appear in public records"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Aliases / nicknames",
						value: id.aliases,
						onChange: (v) => set({ aliases: v }),
						placeholder: "Maiden names, nicknames, misspellings",
						hint: "Comma-separated"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Visible traits (optional)",
							value: id.appearance,
							onChange: (v) => set({ appearance: v }),
							placeholder: "Hair color, eyes, clothing last seen, scars, glasses",
							hint: "Used in operators and caption matching. Not a biometric profile.",
							area: true
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Where / when",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "City",
						value: id.city,
						onChange: (v) => set({ city: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "State / region",
						value: id.state,
						onChange: (v) => set({ state: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "After date",
						type: "date",
						value: id.afterDate,
						onChange: (v) => set({ afterDate: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Before date",
						type: "date",
						value: id.beforeDate,
						onChange: (v) => set({ beforeDate: v })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "School, work, activity",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Employer / school / agency",
						value: id.employer,
						onChange: (v) => set({ employer: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Job title / role / grade",
						value: id.jobTitle,
						onChange: (v) => set({ jobTitle: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Hobbies / sports / activities",
						value: id.hobbies,
						onChange: (v) => set({ hobbies: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Family context (optional)",
						value: id.maritalStatus,
						onChange: (v) => set({ maritalStatus: v }),
						placeholder: "Only if it appears in public captions"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Online presence",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Social usernames",
						value: id.socialUsernames,
						onChange: (v) => set({ socialUsernames: v }),
						placeholder: "@handles, comma-separated"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Known websites",
						value: id.knownWebsites,
						onChange: (v) => set({ knownWebsites: v }),
						placeholder: "example.org"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Other keywords",
							value: id.keywords,
							onChange: (v) => set({ keywords: v }),
							placeholder: "Event names, unit names, unique phrases",
							area: true
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setTab("operators"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waypoints, {}),
							"Build ",
							queryCount,
							" operator",
							queryCount === 1 ? "" : "s"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: runPublic,
						disabled: searching,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {}), searching ? "Searching public catalogs…" : "Search public catalogs"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							set({
								name: "Ada Lovelace",
								city: "London",
								keywords: "mathematician computing",
								jobTitle: "mathematician",
								appearance: "dark hair, portrait"
							});
						},
						children: "Load public sample"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: () => {
							useCase.setState({ identifiers: emptyIdentifiers() });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, {}), "Clear fields"]
					})
				]
			}),
			searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Querying Wikipedia, Wikimedia Commons, and Openverse. Results are filtered to pages that mention the name."
			}) : null
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-4 sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-4 text-xs font-medium uppercase tracking-widest text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children
		})]
	});
}
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide", tone === "high" && "bg-high/20 text-high", tone === "medium" && "bg-warn/20 text-warn", tone === "low" && "bg-low/20 text-low", tone === "insufficient" && "bg-subtle text-muted", tone === "neutral" && "bg-subtle text-muted", className),
		...props
	});
}
function OperatorsPanel() {
	const id = useCase((s) => s.identifiers);
	const queries = (0, import_react.useMemo)(() => generateQueries(id), [id]);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [active, setActive] = (0, import_react.useState)("all");
	const groups = QUERY_GROUPS.filter((g) => queries.some((q) => q.group === g));
	const shown = active === "all" ? queries : queries.filter((q) => q.group === active);
	function copy(text, key) {
		navigator.clipboard.writeText(text);
		setCopied(key);
		window.setTimeout(() => setCopied(null), 1200);
	}
	if (!id.name.trim() && !id.employer.trim() && !id.keywords.trim()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Add a name, employer, or keyword on the Case tab to generate operators."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium tracking-tight",
					children: "Search operators"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: [queries.length, " public Google queries. Each opens in a new tab. These do not log you in or scrape the destination."]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => copy(queries.map((q) => q.query).join("\n"), "all"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied === "all" ? "Copied" : "Copy all"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => {
							queries.slice(0, 6).forEach((q, i) => {
								window.setTimeout(() => window.open(q.googleImages, "_blank", "noopener"), i * 200);
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Images, {}), "Open first 6 image searches"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: active === "all",
					onClick: () => setActive("all"),
					label: `All ${queries.length}`
				}), groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: active === g,
					onClick: () => setActive(g),
					label: `${g} ${queries.filter((q) => q.group === g).length}`
				}, g))]
			}),
			groups.filter((g) => active === "all" || active === g).map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xs font-medium uppercase tracking-widest text-muted",
					children: group
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: shown.filter((q) => q.group === group).map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-border-strong bg-surface p-3 sm:p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-fg",
									children: q.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: group })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-2 overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs text-muted",
								children: q.query
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => copy(q.query, q.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied === q.id ? "Copied" : "Copy"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: q.googleWeb,
											target: "_blank",
											rel: "noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {}), "Web"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: q.googleImages,
											target: "_blank",
											rel: "noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Images, {}), "Images"]
										})
									})
								]
							})
						]
					}, q.id))
				})]
			}, group))
		]
	});
}
function Chip({ active, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "h-9 rounded-full bg-accent px-3 text-xs font-medium text-accent-fg" : "h-9 rounded-full border border-border px-3 text-xs font-medium text-muted hover:bg-subtle",
		children: label
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-6 w-full touch-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow rounded-full bg-subtle",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-accent shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" })]
	});
}
function analyzeQuality(data) {
	const { width, height, data: px } = data;
	let sum = 0;
	let lap = 0;
	const w = width;
	for (let y = 1; y < height - 1; y += 2) for (let x = 1; x < width - 1; x += 2) {
		const i = (y * w + x) * 4;
		const l = .299 * px[i] + .587 * px[i + 1] + .114 * px[i + 2];
		sum += l;
		const up = ((y - 1) * w + x) * 4;
		const dn = ((y + 1) * w + x) * 4;
		const lf = (y * w + (x - 1)) * 4;
		const rt = (y * w + (x + 1)) * 4;
		const lu = .299 * px[up] + .587 * px[up + 1] + .114 * px[up + 2];
		const ld = .299 * px[dn] + .587 * px[dn + 1] + .114 * px[dn + 2];
		const ll = .299 * px[lf] + .587 * px[lf + 1] + .114 * px[lf + 2];
		const lr = .299 * px[rt] + .587 * px[rt + 1] + .114 * px[rt + 2];
		const g = 4 * l - lu - ld - ll - lr;
		lap += g * g;
	}
	const samples = Math.max(1, Math.floor((height - 2) / 2 * ((width - 2) / 2)));
	const meanLuma = sum / samples;
	const blurScore = lap / samples;
	const issues = [];
	if (width < 240 || height < 240) issues.push("Low resolution — upscaling may help");
	if (meanLuma < 55) issues.push("Dark exposure — raise brightness");
	if (meanLuma > 210) issues.push("Washed out — lower brightness, raise contrast");
	if (blurScore < 80) issues.push("Soft / blurry — add sharpening");
	if (!issues.length) issues.push("Exposure looks usable. Crop the face or torso before reverse search.");
	return {
		width,
		height,
		meanLuma,
		blurScore,
		issues
	};
}
function suggestedEnhance(q) {
	const p = {};
	if (q.meanLuma < 55) p.brightness = 36;
	else if (q.meanLuma > 210) {
		p.brightness = -18;
		p.contrast = 28;
	} else if (q.meanLuma < 90) {
		p.brightness = 16;
		p.contrast = 12;
	}
	if (q.blurScore < 80) p.sharpen = 58;
	if (q.width < 240 || q.height < 240) p.upscale = 2.5;
	else if (q.width < 480 || q.height < 480) p.upscale = 2;
	return p;
}
function clamp(n) {
	return n < 0 ? 0 : n > 255 ? 255 : n;
}
function applyEnhance(src, settings) {
	const { width, height } = src;
	let work = new ImageData(new Uint8ClampedArray(src.data), width, height);
	if (settings.crop) {
		const c = settings.crop;
		const x = Math.max(0, Math.round(c.x * width));
		const y = Math.max(0, Math.round(c.y * height));
		const w = Math.max(8, Math.round(c.w * width));
		const h = Math.max(8, Math.round(c.h * height));
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		ctx.putImageData(work, 0, 0);
		work = ctx.getImageData(x, y, Math.min(w, width - x), Math.min(h, height - y));
	}
	const b = settings.brightness;
	const c = 1 + settings.contrast / 100;
	const px = work.data;
	for (let i = 0; i < px.length; i += 4) {
		px[i] = clamp((px[i] - 128) * c + 128 + b);
		px[i + 1] = clamp((px[i + 1] - 128) * c + 128 + b);
		px[i + 2] = clamp((px[i + 2] - 128) * c + 128 + b);
	}
	if (settings.denoise > 0) work = boxBlur(work, Math.min(2, 1 + Math.round(settings.denoise / 50)));
	if (settings.sharpen > 0) work = convolveSharpen(work, settings.sharpen / 100);
	return work;
}
function boxBlur(src, r) {
	const { width, height, data } = src;
	const out = new Uint8ClampedArray(data.length);
	const w = width;
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
		let rs = 0, gs = 0, bs = 0, n = 0;
		for (let dy = -r; dy <= r; dy++) {
			const yy = y + dy;
			if (yy < 0 || yy >= height) continue;
			for (let dx = -r; dx <= r; dx++) {
				const xx = x + dx;
				if (xx < 0 || xx >= width) continue;
				const i = (yy * w + xx) * 4;
				rs += data[i];
				gs += data[i + 1];
				bs += data[i + 2];
				n++;
			}
		}
		const o = (y * w + x) * 4;
		out[o] = rs / n;
		out[o + 1] = gs / n;
		out[o + 2] = bs / n;
		out[o + 3] = data[o + 3];
	}
	return new ImageData(out, width, height);
}
function convolveSharpen(src, amount) {
	const { width, height, data } = src;
	const out = new Uint8ClampedArray(data.length);
	const k = amount;
	const c = 1 + 4 * k;
	const w = width;
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
		const o = (y * w + x) * 4;
		if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
			out[o] = data[o];
			out[o + 1] = data[o + 1];
			out[o + 2] = data[o + 2];
			out[o + 3] = data[o + 3];
			continue;
		}
		for (let ch = 0; ch < 3; ch++) {
			const ctr = data[o + ch];
			const up = data[((y - 1) * w + x) * 4 + ch];
			const dn = data[((y + 1) * w + x) * 4 + ch];
			const lf = data[(y * w + (x - 1)) * 4 + ch];
			const rt = data[(y * w + (x + 1)) * 4 + ch];
			out[o + ch] = clamp(c * ctr - k * (up + dn + lf + rt));
		}
		out[o + 3] = data[o + 3];
	}
	return new ImageData(out, width, height);
}
function imageDataToPng(data, upscale) {
	const scale = Math.max(1, Math.min(3, upscale));
	const canvas = document.createElement("canvas");
	canvas.width = Math.round(data.width * scale);
	canvas.height = Math.round(data.height * scale);
	const ctx = canvas.getContext("2d");
	const src = document.createElement("canvas");
	src.width = data.width;
	src.height = data.height;
	src.getContext("2d").putImageData(data, 0, 0);
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL("image/png");
}
async function fileToImageData(file) {
	const url = URL.createObjectURL(file);
	try {
		const img = await new Promise((res, rej) => {
			const i = new Image();
			i.onload = () => res(i);
			i.onerror = () => rej(/* @__PURE__ */ new Error("Could not read image"));
			i.src = url;
		});
		const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
		const canvas = document.createElement("canvas");
		canvas.width = Math.max(8, Math.round(img.width * scale));
		canvas.height = Math.max(8, Math.round(img.height * scale));
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	} finally {
		URL.revokeObjectURL(url);
	}
}
var TOOLS = [
	{
		name: "Google Lens",
		href: "https://lens.google.com/upload",
		note: "Upload the enhanced PNG"
	},
	{
		name: "Google Images",
		href: "https://images.google.com/",
		note: "Camera icon → upload"
	},
	{
		name: "TinEye",
		href: "https://tineye.com/",
		note: "Upload or paste"
	},
	{
		name: "Yandex Images",
		href: "https://yandex.com/images/",
		note: "Camera icon"
	},
	{
		name: "Bing Visual Search",
		href: "https://www.bing.com/visualsearch",
		note: "Upload the file"
	}
];
function ReversePanel() {
	const fileRef = (0, import_react.useRef)(null);
	const rawRef = (0, import_react.useRef)(null);
	const enhance = useCase((s) => s.enhance);
	const setEnhance = useCase((s) => s.setEnhance);
	const refDataUrl = useCase((s) => s.refDataUrl);
	const enhancedUrl = useCase((s) => s.enhancedUrl);
	const setReference = useCase((s) => s.setReference);
	const setEnhanced = useCase((s) => s.setEnhanced);
	const qualityIssues = useCase((s) => s.qualityIssues);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [cropping, setCropping] = (0, import_react.useState)(false);
	const [drag, setDrag] = (0, import_react.useState)(null);
	const [dropOver, setDropOver] = (0, import_react.useState)(false);
	async function onFile(file) {
		setBusy(true);
		try {
			const data = await fileToImageData(file);
			rawRef.current = data;
			const q = analyzeQuality(data);
			const png = imageDataToPng(data, 1);
			setReference(png, fingerprintFromImageData(data), q.issues);
			rerender(data, enhance);
		} finally {
			setBusy(false);
		}
	}
	function rerender(data, settings) {
		const out = applyEnhance(data, settings);
		const png = imageDataToPng(out, settings.upscale);
		setEnhanced(png);
		setReference(useCase.getState().refDataUrl, fingerprintFromImageData(out), analyzeQuality(out).issues);
	}
	function update(partial) {
		const next = {
			...enhance,
			...partial
		};
		setEnhance(partial);
		if (rawRef.current) rerender(rawRef.current, next);
	}
	function autoFix() {
		if (!rawRef.current) return;
		const q = analyzeQuality(rawRef.current);
		const next = {
			...defaultEnhance(),
			...suggestedEnhance(q)
		};
		setEnhance(next);
		rerender(rawRef.current, next);
	}
	function downloadEnhanced() {
		if (!enhancedUrl) return;
		const a = document.createElement("a");
		a.href = enhancedUrl;
		a.download = "beacon-enhanced.png";
		a.click();
	}
	function pointFromEvent(el, e) {
		const box = el.getBoundingClientRect();
		return {
			x: Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)),
			y: Math.min(1, Math.max(0, (e.clientY - box.top) / box.height))
		};
	}
	function finishCrop(el, e) {
		if (!cropping || !drag) return;
		const p = pointFromEvent(el, e);
		const x = Math.min(drag.x, p.x);
		const y = Math.min(drag.y, p.y);
		const w = Math.abs(p.x - drag.x);
		const h = Math.abs(p.y - drag.y);
		setDrag(null);
		if (w > .05 && h > .05) update({ crop: {
			x,
			y,
			w,
			h
		} });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-medium tracking-tight",
				children: "Reverse image workflow"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted",
				children: "Enhancement runs in your browser. The file is not uploaded to our servers. Download the result and drop it into a public reverse-image engine."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: dropOver ? "rounded-xl border border-accent bg-subtle px-4 py-6 text-center" : "rounded-xl border border-dashed border-border-strong bg-surface px-4 py-6 text-center",
				onDragOver: (e) => {
					e.preventDefault();
					setDropOver(true);
				},
				onDragLeave: () => setDropOver(false),
				onDrop: (e) => {
					e.preventDefault();
					setDropOver(false);
					const f = e.dataTransfer.files?.[0];
					if (f && f.type.startsWith("image/")) onFile(f);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Drop a reference photo here, or choose a file."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (f) onFile(f);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => fileRef.current?.click(),
							disabled: busy,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}), busy ? "Reading…" : "Upload reference photo"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: autoFix,
							disabled: !refDataUrl,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunMedium, {}), "Auto-enhance"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							disabled: !refDataUrl,
							onClick: () => {
								rawRef.current = null;
								setReference(null, null, []);
								setEnhanced(null);
								setEnhance(defaultEnhance());
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Remove photo"]
						})
					]
				})]
			}),
			qualityIssues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "rounded-lg border border-border bg-subtle px-4 py-3 text-sm text-muted",
				children: qualityIssues.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: i }, i))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "overflow-hidden rounded-xl border border-border bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "border-b border-border px-3 py-2 text-xs uppercase tracking-widest text-muted",
						children: "Original"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex min-h-56 items-center justify-center bg-bg",
						children: refDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: refDataUrl,
							alt: "Reference original",
							className: "max-h-80 w-full object-contain",
							draggable: false
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-8 text-center text-sm text-muted",
							children: "No photo yet"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "overflow-hidden rounded-xl border border-border bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
						className: "border-b border-border px-3 py-2 text-xs uppercase tracking-widest text-muted",
						children: ["Enhanced ", cropping ? "· drag to crop" : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex min-h-56 items-center justify-center bg-bg",
						onMouseDown: (e) => {
							if (!cropping) return;
							setDrag(pointFromEvent(e.currentTarget, e));
						},
						onMouseUp: (e) => finishCrop(e.currentTarget, e),
						onTouchStart: (e) => {
							if (!cropping) return;
							const t = e.touches[0];
							if (t) setDrag(pointFromEvent(e.currentTarget, t));
						},
						onTouchEnd: (e) => {
							const t = e.changedTouches[0];
							if (t) finishCrop(e.currentTarget, t);
						},
						children: enhancedUrl || refDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: enhancedUrl || refDataUrl || "",
							alt: "Enhanced reference",
							className: "max-h-80 w-full object-contain",
							draggable: false
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-8 text-center text-sm text-muted",
							children: "Adjustments appear here"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
						label: "Brightness",
						value: enhance.brightness,
						min: -80,
						max: 80,
						onChange: (v) => update({ brightness: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
						label: "Contrast",
						value: enhance.contrast,
						min: -60,
						max: 80,
						onChange: (v) => update({ contrast: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
						label: "Sharpen",
						value: enhance.sharpen,
						min: 0,
						max: 100,
						onChange: (v) => update({ sharpen: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
						label: "Denoise",
						value: enhance.denoise,
						min: 0,
						max: 100,
						onChange: (v) => update({ denoise: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
						label: "Upscale",
						value: enhance.upscale,
						min: 1,
						max: 3,
						step: .5,
						onChange: (v) => update({ upscale: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: cropping ? "default" : "secondary",
							onClick: () => setCropping((c) => !c),
							disabled: !refDataUrl,
							children: cropping ? "Drag on enhanced image to crop" : "Crop face / body"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => update({ crop: null }),
							disabled: !enhance.crop,
							children: "Reset crop"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: downloadEnhanced,
					disabled: !enhancedUrl,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Download enhanced PNG"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xs font-medium uppercase tracking-widest text-muted",
				children: "Reverse-image engines"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
				children: TOOLS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: t.href,
					target: "_blank",
					rel: "noreferrer",
					className: "flex h-full flex-col rounded-lg border border-border bg-bg px-4 py-3 hover:bg-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-4" }), t.name]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 text-xs text-muted",
						children: t.note
					})]
				}) }, t.name))
			})] })
		]
	});
}
function SliderRow({ label, value, min, max, step = 1, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-muted",
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			min,
			max,
			step,
			value: [value],
			onValueChange: (v) => onChange(v[0] ?? value)
		})]
	});
}
function toCsv(rows) {
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
		"visualScore"
	];
	const esc = (s) => `"${s.replace(/"/g, "\"\"")}"`;
	return [header.join(","), ...rows.map((r) => [
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
		r.visualScore == null ? "" : String(r.visualScore)
	].map(esc).join(","))].join("\n");
}
function toJson(id, rows) {
	return JSON.stringify({
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		disclaimer: "Public-source research only. Grades are not identity determinations. Verify every result manually.",
		identifiers: id,
		results: rows
	}, null, 2);
}
function download(filename, content, mime) {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
var GRADES = [
	"high",
	"medium",
	"low",
	"insufficient"
];
function ResultsPanel() {
	const results = useCase((s) => s.results);
	const notes = useCase((s) => s.notes);
	const identifiers = useCase((s) => s.identifiers);
	const remove = useCase((s) => s.removeResult);
	const addManual = useCase((s) => s.addManual);
	const refDataUrl = useCase((s) => s.refDataUrl);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [url, setUrl] = (0, import_react.useState)("");
	const [caption, setCaption] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const shown = (0, import_react.useMemo)(() => filter === "all" ? results : results.filter((r) => r.grade === filter), [results, filter]);
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
				visual
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
				queryUsed: "manual URL"
			});
		} finally {
			setBusy(false);
		}
	}
	function printPdf() {
		window.print();
	}
	if (results.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyAdd, {
			url,
			setUrl,
			caption,
			setCaption,
			busy,
			onAdd: addUrl
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "No images in this case yet. Run public catalogs from the Case tab, open operator image searches, then paste public URLs here."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6 print:gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium tracking-tight",
					children: "Results dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						results.length,
						" public image",
						results.length === 1 ? "" : "s",
						", ranked by evidence. Grades are hypotheses, not identifications."
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => download("beacon-results.csv", toCsv(results), "text/csv"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {}), "CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => download("beacon-results.json", toJson(identifiers, results), "application/json"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileJson, {}), "JSON"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: printPdf,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), "PDF"]
						})
					]
				})]
			}),
			notes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted print:hidden",
				children: notes.join(" ")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: filter === "all",
					onClick: () => setFilter("all"),
					label: `All ${results.length}`
				}), GRADES.map((g) => {
					const n = results.filter((r) => r.grade === g).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						active: filter === g,
						onClick: () => setFilter(g),
						label: `${gradeLabel(g)} ${n}`
					}, g);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "print:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyAdd, {
					url,
					setUrl,
					caption,
					setCaption,
					busy,
					onAdd: addUrl
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-4",
				children: shown.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, {
					row: r,
					onRemove: () => remove(r.id),
					refSrc: refDataUrl
				}, r.id))
			})
		]
	});
}
function FilterChip({ active, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "h-9 rounded-full bg-accent px-3 text-xs font-medium text-accent-fg" : "h-9 rounded-full border border-border px-3 text-xs font-medium text-muted hover:bg-subtle",
		children: label
	});
}
function EmptyAdd({ url, setUrl, caption, setCaption, busy, onAdd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "Add a public URL you found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: "We only fetch the page title and Open Graph image. Private or login-walled pages will fail and should not be used."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-[1fr_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: url,
					onChange: (e) => setUrl(e.target.value),
					placeholder: "https://…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onAdd,
					disabled: busy || !url.trim(),
					children: busy ? "Reading…" : "Add to case"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Caption / surrounding text (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					className: "mt-1",
					value: caption,
					onChange: (e) => setCaption(e.target.value),
					placeholder: "Paste nearby names, dates, or location text"
				})]
			})
		]
	});
}
function ResultCard({ row, onRemove, refSrc }) {
	const tone = row.grade === "high" ? "bg-high" : row.grade === "medium" ? "bg-warn" : row.grade === "low" ? "bg-low" : "bg-muted";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "grid gap-4 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[200px_1fr] sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0 flex-1 overflow-hidden rounded-md bg-bg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: displaySrc(row.thumbUrl || row.imageUrl),
					alt: "",
					className: "h-48 w-full object-contain sm:h-56",
					referrerPolicy: "no-referrer",
					onError: (e) => {
						const el = e.currentTarget;
						if (el.dataset.fallback === "1") return;
						el.dataset.fallback = "1";
						el.src = row.imageUrl;
					}
				})
			}), refSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden w-20 shrink-0 overflow-hidden rounded-md border border-border bg-bg sm:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: refSrc,
					alt: "Reference",
					className: "h-full w-full object-cover"
				})
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium leading-snug",
						children: row.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-xs text-muted",
						children: row.provider
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: row.grade,
						children: [
							gradeLabel(row.grade),
							" · ",
							row.score
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 overflow-hidden rounded-full bg-subtle",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `h-full ${tone}`,
						style: { width: `${Math.min(100, row.score)}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "break-all text-xs text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: row.sourceUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "underline-offset-2 hover:underline",
						children: row.sourceUrl
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: ["Query: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: row.queryUsed
					})]
				}),
				row.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "line-clamp-3 text-xs text-muted",
					children: row.caption
				}) : null,
				row.matched.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: row.matched.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: m }, m))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "list-disc space-y-1 pl-4 text-xs text-muted",
					children: row.explanation.slice(0, 5).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e }, e))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						"Found ",
						new Date(row.foundAt).toLocaleString(),
						" · context ",
						row.contextScore,
						row.visualScore != null ? ` · visual ${row.visualScore}` : " · no visual compare"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex flex-wrap gap-2 print:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: row.sourceUrl,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {}), "Source"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: onRemove,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Remove"]
					})]
				})
			]
		})]
	});
}
var TABS = [
	{
		id: "case",
		label: "Case"
	},
	{
		id: "operators",
		label: "Operators"
	},
	{
		id: "reverse",
		label: "Reverse image"
	},
	{
		id: "results",
		label: "Results"
	}
];
function AppShell() {
	const tab = useCase((s) => s.tab);
	const setTab = useCase((s) => s.setTab);
	const wipe = useCase((s) => s.wipe);
	const results = useCase((s) => s.results);
	const error = useCase((s) => s.error);
	const cleared = useCase((s) => s.historyClearedAt);
	const name = useCase((s) => s.identifiers.name);
	const searching = useCase((s) => s.searching);
	const [confirmWipe, setConfirmWipe] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-border print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 flex size-10 items-center justify-center rounded-lg border border-border bg-surface",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderSearch, { className: "size-5 text-accent" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted",
										children: "Public-source casework"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-2xl font-medium tracking-tight sm:text-3xl",
										children: "Beacon"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 max-w-xl text-sm text-muted",
										children: "Find publicly available photographs using search operators, reverse image engines, and contextual matching. Built for missing-person and family reunification research in the United States."
									})
								] })]
							}), confirmWipe ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "danger",
									onClick: () => {
										wipe();
										setConfirmWipe(false);
									},
									children: "Confirm delete"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setConfirmWipe(false),
									children: "Cancel"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => setConfirmWipe(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Delete uploads & history"]
							})]
						}),
						name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Active subject: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: name
								}),
								results.length ? ` · ${results.length} images in file` : null,
								searching ? " · searching catalogs…" : null
							]
						}) : null,
						cleared ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								"Workspace cleared ",
								new Date(cleared).toLocaleString(),
								"."
							]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mx-auto max-w-6xl px-4 sm:px-6",
					"aria-label": "Sections",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex gap-1 overflow-x-auto pb-px",
						children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab(t.id),
							className: tab === t.id ? "h-11 border-b-2 border-accent px-3 text-sm font-medium text-fg" : "h-11 border-b-2 border-transparent px-3 text-sm text-muted hover:text-fg",
							children: [t.label, t.id === "results" && results.length ? ` (${results.length})` : ""]
						}) }, t.id))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main",
				className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
				children: [
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-6 rounded-lg border border-low/40 bg-low/10 px-4 py-3 text-sm text-low",
						children: error
					}) : null,
					tab === "case" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseForm, {}) : null,
					tab === "operators" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorsPanel, {}) : null,
					tab === "reverse" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReversePanel, {}) : null,
					tab === "results" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsPanel, {}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border print:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Disclaimer, {})
				})
			})
		]
	});
}
function Disclaimer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex gap-3 text-xs leading-relaxed text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Beacon searches only information that is already public. It does not sign in to platforms, bypass paywalls, ignore robots.txt, or scrape private or restricted accounts. Automatic catalogs are limited to Wikipedia, Wikimedia Commons, and Openverse. Google, LinkedIn, Facebook, Instagram, and similar sites are reached only by operator links you choose to open." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Confidence grades combine text context (name, location, employer, captions, URLs) with an optional perceptual-hash comparison of a photo you supply. They are not facial recognition against a watchlist and must not be treated as a positive identification. False positives are common with ordinary names. Verify every image by hand before acting." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Intended use includes locating publicly posted photographs of missing or exploited children so families and investigators can reunify them. Do not use this tool to stalk, dox, harass, or surveil people. Uploads stay in this browser session until you delete them." })
			]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { Home as component };
