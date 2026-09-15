import assert from "node:assert/strict";
import { test } from "node:test";
import { hitMentionsName, nameTokens } from "./name-match.ts";

test("nameTokens drops short particles", () => {
  assert.deepEqual(nameTokens("Al Gore"), ["gore"]);
  assert.deepEqual(nameTokens("Ada Lovelace"), ["ada", "lovelace"]);
});

test("hitMentionsName requires every name token", () => {
  const hit = {
    title: "Sunset over London",
    caption: "A tourist snapshot",
    pageTitle: "File:London.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:London.jpg",
  };
  assert.equal(hitMentionsName(hit, "Ada Lovelace"), false);
  assert.equal(
    hitMentionsName({ ...hit, title: "Ada Lovelace", caption: "Portrait of Ada Lovelace, 1840" }, "Ada Lovelace"),
    true,
  );
});
