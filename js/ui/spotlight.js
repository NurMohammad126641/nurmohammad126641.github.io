// Soft light that follows the cursor across cards (mouse and trackpad only).

import { $$, reduceMotion } from "../lib/dom.js";

export function initSpotlight() {
  if (reduceMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  $$(".case, .mini, .repo, .post, .stack-col, .agent-tools, .about-card").forEach((card) => {
    card.classList.add("spot");
    card.addEventListener("pointermove", (e) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - box.left + "px");
      card.style.setProperty("--my", e.clientY - box.top + "px");
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });
  });
}
