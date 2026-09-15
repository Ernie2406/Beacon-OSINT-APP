import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { parsePublicUrl } from "./url-guard";
import { inspectPublicPage, runPublicCatalogSearch, type PublicHit } from "./catalog";

export type { PublicHit };
export { inspectPublicPage, runPublicCatalogSearch };

export const searchPublicMedia = createServerFn({ method: "POST" })
  .validator((data: { name?: string; query?: string; limit?: number }) => {
    const parsed = z
      .object({
        name: z.string().max(120).optional(),
        query: z.string().max(180).optional(),
        limit: z.number().min(1).max(24).optional(),
      })
      .refine((d) => (d.name?.trim().length ?? 0) >= 2 || (d.query?.trim().length ?? 0) >= 2, {
        message: "Add a name or query",
      })
      .parse(data);
    return parsed;
  })
  .handler(async ({ data }): Promise<{ hits: PublicHit[]; notes: string[] }> => {
    return runPublicCatalogSearch({
      name: data.name,
      query: (data.query || data.name || "").trim(),
      limit: data.limit,
    });
  });

export const inspectPublicUrl = createServerFn({ method: "POST" })
  .validator((data: { url: string }) => z.object({ url: z.string().url() }).parse(data))
  .handler(async ({ data }): Promise<{ title: string; imageUrl?: string; text: string }> => {
    parsePublicUrl(data.url);
    return inspectPublicPage(data.url);
  });
