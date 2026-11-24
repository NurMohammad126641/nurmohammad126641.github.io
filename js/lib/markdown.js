// Renders the small markdown subset the LLM is allowed to use: paragraphs, "- " bullets,
// **bold** and [links](url). Everything is escaped first, and links must point to one of my own
// pages or profiles (exact hosts, and exact accounts where the host is shared).

import { escapeHtml } from "./html.js";

const SAFE_LINK = new RegExp(
  "^(" +
    [
      String.raw`https://nurmohammad126641\.github\.io/`,
      String.raw`https://github\.com/NurMohammad126641(/|$)`,
      String.raw`https://www\.linkedin\.com/(in/nur-mohammad-siddiq-9a73931b6|posts/nur-mohammad-siddiq-9a73931b6_)`,
      String.raw`https://youtu\.be/`,
      String.raw`https://wa\.me/8801904271946`,
      String.raw`https://lookerstudio\.google\.com/reporting/69917f8d-272c-4c04-b975-4005c7c7cd01`,
      "mailto:",
      "tel:",
      String.raw`assets/`,
      String.raw`#[\w-]+$`,
    ].join("|") +
    ")",
);

function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, url) => {
      const href = url.replace(/&amp;/g, "&");
      if (!SAFE_LINK.test(href)) return label;
      const external = href.startsWith("http") ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${escapeHtml(href)}"${external}>${label}</a>`;
    });
}

export function renderMarkdown(source) {
  const html = [];
  let items = [];
  const flushList = () => {
    if (items.length) html.push(`<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`);
    items = [];
  };
  for (const raw of String(source).split("\n")) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)/);
    if (bullet) {
      items.push(inline(bullet[1]));
    } else {
      flushList();
      if (line) html.push(`<p>${inline(line)}</p>`);
    }
  }
  flushList();
  return html.join("");
}
