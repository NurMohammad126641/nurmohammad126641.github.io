// Command palette (Ctrl/Cmd + K): jump to a section or run a quick action.

import { CV_URL, EMAIL, LINKS, PHONE, TEL, WHATSAPP_URL } from "../config.js";
import { $, reduceMotion } from "../lib/dom.js";
import { copyEmail } from "./contact.js";
import { toggleTheme } from "./theme.js";

const jumpTo = (id) => () =>
  document.getElementById(id).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
const openTab = (url) => () => window.open(url, "_blank", "noopener");

function downloadCv() {
  const a = document.createElement("a");
  a.href = CV_URL;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const COMMANDS = [
  {
    label: "Ask my AI agent",
    hint: "Section",
    run: () => {
      jumpTo("agent")();
      setTimeout(() => $("#agent-q").focus({ preventScroll: true }), 500);
    },
  },
  { label: "Selected work", hint: "Section", run: jumpTo("work") },
  { label: "Open source", hint: "Section", run: jumpTo("open-source") },
  { label: "Experience", hint: "Section", run: jumpTo("experience") },
  { label: "Stack", hint: "Section", run: jumpTo("stack") },
  { label: "Writing", hint: "Section", run: jumpTo("writing") },
  { label: "Contact", hint: "Section", run: jumpTo("contact") },
  {
    label: "Copy my email",
    hint: "Action",
    run: () => {
      jumpTo("contact")();
      copyEmail();
    },
  },
  { label: "Download my CV", hint: "Action", run: downloadCv },
  { label: "Email me", hint: "Action", run: () => (location.href = "mailto:" + EMAIL) },
  { label: "Call me", hint: PHONE, run: () => (location.href = TEL) },
  { label: "Message me on WhatsApp", hint: "Link", run: openTab(WHATSAPP_URL) },
  { label: "Open LinkedIn", hint: "Link", run: openTab(LINKS.linkedin) },
  { label: "Open GitHub", hint: "Link", run: openTab(LINKS.github) },
  { label: "Open live demo: payments monitoring", hint: "Link", run: openTab(LINKS.paymentsDemo) },
  { label: "Switch light / dark theme", hint: "Action", run: toggleTheme },
];

export function initPalette() {
  const palette = $("#palette");
  const search = $("#palette-q");
  const results = $("#palette-list");

  let matches = COMMANDS;
  let selected = 0;
  let lastFocus = null;

  function render() {
    const query = search.value.trim().toLowerCase();
    matches = COMMANDS.filter((c) => c.label.toLowerCase().includes(query));
    selected = Math.min(selected, Math.max(matches.length - 1, 0));
    results.innerHTML = matches.length
      ? matches
          .map(
            (c, i) =>
              `<li role="option" data-i="${i}" aria-selected="${i === selected}">${c.label}<small>${c.hint}</small></li>`,
          )
          .join("")
      : `<li aria-disabled="true">No matches<small>Try "agent" or "email"</small></li>`;
  }

  function open() {
    lastFocus = document.activeElement;
    palette.hidden = false;
    search.value = "";
    selected = 0;
    render();
    search.focus();
  }

  function close() {
    palette.hidden = true;
    if (lastFocus) lastFocus.focus();
  }

  function runCommand(i) {
    const command = matches[i];
    if (!command) return;
    close();
    command.run();
  }

  $("#open-palette").addEventListener("click", open);
  search.addEventListener("input", () => {
    selected = 0;
    render();
  });
  results.addEventListener("click", (e) => {
    const item = e.target.closest("li[data-i]");
    if (item) runCommand(Number(item.dataset.i));
  });
  palette.addEventListener("click", (e) => {
    if (e.target === palette) close();
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      palette.hidden ? open() : close();
      return;
    }
    if (palette.hidden) return;
    const count = Math.max(matches.length, 1);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      selected = (selected + 1) % count;
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selected = (selected - 1 + matches.length) % count;
      render();
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(selected);
    }
  });
}
