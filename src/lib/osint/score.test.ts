import assert from "node:assert/strict";
import { test } from "node:test";
import { emptyIdentifiers } from "./types.ts";
import { gradeFromScore, scoreImage } from "./score.ts";

function base(over: Record<string, string> = {}) {
  return {
    id: "t1",
    title: over.title ?? "Unrelated stock photo",
    sourceUrl: over.sourceUrl ?? "https://example.org/x",
    imageUrl: "https://example.org/x.jpg",
    thumbUrl: "https://example.org/x.jpg",
    provider: "Test",
    queryUsed: "test",
    caption: over.caption ?? "",
    pageTitle: over.pageTitle ?? "",
    foundAt: "2026-01-01T00:00:00.000Z",
  };
}

test("name-only match cannot be high", () => {
  const id = { ...emptyIdentifiers(), name: "Ada Lovelace" };
  const r = scoreImage(id, base({ title: "Ada Lovelace", caption: "Portrait of Ada Lovelace" }));
  assert.equal(r.grade === "high", false);
  assert.ok(r.score >= 40);
  assert.ok(r.matched.includes("Name in source text"));
});

test("name plus location and employer can be high", () => {
  const id = {
    ...emptyIdentifiers(),
    name: "Ada Lovelace",
    city: "London",
    state: "England",
    employer: "Analytical Engine",
    jobTitle: "mathematician",
  };
  const r = scoreImage(
    id,
    base({
      title: "Ada Lovelace",
      caption: "Ada Lovelace, mathematician, London England, Analytical Engine staff photo",
    }),
  );
  assert.equal(r.grade, "high");
  assert.ok(r.score >= 72);
});

test("unrelated image is insufficient or low", () => {
  const id = { ...emptyIdentifiers(), name: "Ada Lovelace", city: "London" };
  const r = scoreImage(id, base({ title: "Sunset over a lake" }));
  assert.ok(r.grade === "insufficient" || r.grade === "low");
});

test("gradeFromScore respects the high gate", () => {
  assert.equal(gradeFromScore(90, false), "medium");
  assert.equal(gradeFromScore(90, true), "high");
  assert.equal(gradeFromScore(10, true), "insufficient");
});

test("partial last name is not a full name match", () => {
  const id = { ...emptyIdentifiers(), name: "Ada Lovelace" };
  const r = scoreImage(id, base({ title: "Lord Lovelace estate" }));
  assert.equal(r.matched.includes("Name in source text"), false);
});
