import { createFileRoute } from "@tanstack/react-router";
import { isBlockedHost, parsePublicUrl } from "@/lib/osint/url-guard";

export const Route = createFileRoute("/api/thumb")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const raw = new URL(request.url).searchParams.get("u");
        if (!raw) return new Response("missing url", { status: 400 });
        let target: URL;
        try {
          target = parsePublicUrl(raw, true);
        } catch {
          return new Response("url not allowed", { status: 400 });
        }
        const res = await fetch(target, {
          headers: {
            "User-Agent": "BeaconPublicPhotoFinder/1.0",
            Accept: "image/*",
          },
          signal: AbortSignal.timeout(8000),
          redirect: "follow",
        });
        if (!res.ok) return new Response("upstream error", { status: 502 });
        if (isBlockedHost(new URL(res.url).hostname)) return new Response("redirect blocked", { status: 403 });
        const type = res.headers.get("content-type") || "image/jpeg";
        if (!type.startsWith("image/")) return new Response("not an image", { status: 415 });
        const buf = await res.arrayBuffer();
        if (buf.byteLength > 2_500_000) return new Response("too large", { status: 413 });
        return new Response(buf, {
          headers: {
            "Content-Type": type.split(";")[0]!,
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
