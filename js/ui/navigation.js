// Highlights the current section in the top nav and the phone tab bar,
// and handles phone-only behaviour: collapsed stories, tab bar visibility.

import { $$ } from "../lib/dom.js";

// Which tab-bar item lights up for each section.
const TAB_FOR_SECTION = {
  hero: "top",
  work: "work",
  "open-source": "work",
  agent: "agent",
  experience: "experience",
  stack: "experience",
  writing: "contact",
  contact: "contact",
};

export function initNavigation() {
  const navLinks = $$(".nav-links a");
  const tabLinks = $$(".dock a");
  const sections = $$(".hero, #work, #open-source, #agent, #experience, #stack, #writing, #contact");

  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
    const tab = TAB_FOR_SECTION[id];
    if (tab) tabLinks.forEach((a) => a.classList.toggle("active", a.dataset.sec === tab));
  };

  // The active section is the one crossing 45% of the screen height.
  let queued = false;
  const updateActive = () => {
    queued = false;
    const line = innerHeight * 0.45;
    let current = sections[0];
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top <= line) current = s;
    });
    setActive(current.id || "hero");
  };
  addEventListener(
    "scroll",
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(updateActive);
      }
    },
    { passive: true },
  );
  updateActive();

  // Phones: long case-study stories start collapsed.
  if (matchMedia("(max-width: 900px)").matches) {
    $$("details.story, details.tools-details").forEach((d) => {
      d.open = false;
    });
  }

  // The tab bar stays out of the way on the first screen and slides in once you scroll.
  const markScrolled = () => document.body.classList.toggle("scrolled", scrollY >= 140);
  markScrolled();
  addEventListener("scroll", markScrolled, { passive: true });

  // Hide it while the on-screen keyboard is open.
  document.addEventListener("focusin", (e) => {
    if (e.target.matches("input, textarea")) document.body.classList.add("typing");
  });
  document.addEventListener("focusout", (e) => {
    if (e.target.matches("input, textarea")) document.body.classList.remove("typing");
  });
}
