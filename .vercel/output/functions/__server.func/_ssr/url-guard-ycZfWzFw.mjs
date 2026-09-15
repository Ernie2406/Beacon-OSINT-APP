//#region node_modules/.nitro/vite/services/ssr/assets/url-guard-ycZfWzFw.js
function isBlockedHost(host) {
	const h = host.toLowerCase().replace(/\.$/, "");
	if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local")) return true;
	if (h === "0.0.0.0" || h === "::" || h === "::1" || h === "[::1]") return true;
	if (h === "metadata.google.internal" || h.endsWith(".internal")) return true;
	if (/^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(h)) return true;
	if (/^0x[0-9a-f]+$/i.test(h)) return true;
	return false;
}
function parsePublicUrl(raw, httpsOnly = false) {
	const url = new URL(raw);
	if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Only http(s) URLs are allowed");
	if (httpsOnly && url.protocol !== "https:") throw new Error("https only");
	if (isBlockedHost(url.hostname)) throw new Error("Host not allowed");
	return url;
}
//#endregion
export { parsePublicUrl as n, isBlockedHost as t };
