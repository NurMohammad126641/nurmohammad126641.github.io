// OD Tracker demo reel: the silent highlight loop plays only while it's on screen, and every demo link
// (the full tour, a chapter or a short demo) plays from YouTube in the same frame, loaded only on tap.

import { $, $$, reduceMotion } from "../lib/dom.js";
import { embedSrc } from "../lib/youtube.js";

export function initDemo() {
  const reel = $("#demo");
  if (!reel) return;
  const player = $(".demo-player", reel);
  const loop = $("video", player);

  let watcher;
  if (loop && !reduceMotion && "IntersectionObserver" in window) {
    watcher = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? loop.play().catch(() => {}) : loop.pause()),
      { threshold: 0.4 },
    );
    watcher.observe(loop);
  }

  const links = $$("[data-yt]", reel);
  links.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      let frame = $("iframe", player);
      if (!frame) {
        watcher?.disconnect();
        frame = document.createElement("iframe");
        frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        frame.allowFullscreen = true;
        player.replaceChildren(frame);
      }
      frame.title = link.dataset.title;
      frame.src = embedSrc(link.href);
      links.forEach((other) => other.classList.toggle("is-current", other === link));
      if (!player.contains(link)) {
        player.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      }
    }),
  );
}
