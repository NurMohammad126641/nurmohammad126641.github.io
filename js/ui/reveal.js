// Fade sections in as they scroll into view.

import { $$, reduceMotion } from "../lib/dom.js";

export function initReveal() {
  const targets = $$(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    targets.forEach((el) => el.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  targets.forEach((el) => observer.observe(el));
}
