// Renders the small markdown subset the LLM is allowed to use: paragraphs, "- " bullets,
// **bold** and [links](url). Everything is escaped first, and links must point to a known host.

import { escapeHtml } from "./html.js";

const SAFE_LINK =
  /^(https:\/\/([a-z0-9-]+\.)*(linkedin\.com|github\.com|github\.io|wa\.me)\/|mailto:|tel:|assets\/)/i;

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
