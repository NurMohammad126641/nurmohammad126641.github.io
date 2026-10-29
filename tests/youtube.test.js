import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { embedSrc } from "../js/lib/youtube.js";

describe("embedSrc", () => {
  it("embeds a share link from the start", () => {
    assert.equal(
      embedSrc("https://youtu.be/abc123XYZ_-"),
      "https://www.youtube-nocookie.com/embed/abc123XYZ_-?autoplay=1&rel=0&playsinline=1&start=0",
    );
  });

  it("starts at the chapter time in the link", () => {
    assert.match(embedSrc("https://youtu.be/abc123XYZ_-?t=109"), /\/embed\/abc123XYZ_-\?.*&start=109$/);
  });

  it("ignores a time it can't read", () => {
    assert.match(embedSrc("https://youtu.be/abc123XYZ_-?t=oops"), /&start=0$/);
  });
});
