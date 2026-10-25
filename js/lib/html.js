// Small helpers for building HTML strings. No DOM access, so they run in Node tests too.

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => ENTITIES[c]);

export const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;

export const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
