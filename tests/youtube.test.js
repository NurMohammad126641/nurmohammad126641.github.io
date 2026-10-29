import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { embedSrc, videoId } from "../js/lib/youtube.js";

describe("videoId", () => {
  it("reads the id from a share link, with or without a time", () => {
    assert.equal(videoId("https://youtu.be/abc123XYZ_-"), "abc123XYZ_-");
    assert.equal(videoId("https://youtu.be/abc123XYZ_-?t=57"), "abc123XYZ_-");
  });
});

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
