import assert from "node:assert/strict";
import { test } from "node:test";
import { emptyIdentifiers } from "./types.ts";
import { generateQueries } from "./queries.ts";

test("empty identifiers produce no queries", () => {
  assert.equal(generateQueries(emptyIdentifiers()).length, 0);
});

test("name produces platform, image, and missing-person operators", () => {
  const q = generateQueries({ ...emptyIdentifiers(), name: "Ada Lovelace", city: "London" });
  const groups = new Set(q.map((x) => x.group));
  assert.ok(groups.has("LinkedIn"));
  assert.ok(groups.has("Facebook"));
  assert.ok(groups.has("Instagram"));
  assert.ok(groups.has("Flickr"));
  assert.ok(groups.has("Missing"));
  assert.ok(groups.has("Images"));
  assert.ok(q.some((x) => x.query.includes("site:linkedin.com")));
  assert.ok(q.some((x) => x.query.includes("filetype:pdf")));
  assert.ok(q.some((x) => x.query.includes("site:missingkids.org")));
  assert.ok(q.every((x) => x.query.includes("Ada Lovelace") || x.query.includes('"Ada Lovelace"')));
});

test("dates add after/before operators", () => {
  const q = generateQueries({
    ...emptyIdentifiers(),
    name: "Ada Lovelace",
    afterDate: "1842-01-01",
    beforeDate: "1853-01-01",
  });
  assert.ok(q.some((x) => x.query.includes("after:1842-01-01")));
  assert.ok(q.some((x) => x.query.includes("before:1853-01-01")));
});
