// Light/dark theme. The initial theme is applied by an inline script in <head> to avoid a flash.

import { $ } from "../lib/dom.js";

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
}

export const toggleTheme = () =>
  setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");

export function initTheme() {
  $("#theme-toggle").addEventListener("click", toggleTheme);
}
