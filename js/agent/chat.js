// The chat window: shows each question, the tool calls behind the answer, then the answer.

import { AGENT_API_URL } from "../config.js";
import { $, $$, reduceMotion, sleep } from "../lib/dom.js";
import { escapeHtml } from "../lib/html.js";
import { renderMarkdown } from "../lib/markdown.js";
import { toToolCall } from "./llm-tools.js";
import { followUpFor, route } from "./router.js";
import { reachMe, TOOLS } from "./tools.js";
import { describeCall } from "./trace.js";

const SUGGESTIONS = [
  "What do you do?",
  "How does this agent work?",
  "Show me your AI work",
  "What's your biggest impact?",
  "Django & PostgreSQL?",
  "Fintech experience?",
  "Why work with you?",
  "How can I contact you?",
];
const FALLBACK_SUGGESTIONS = ["What's your tech stack?", "Tell me about the chatbot", "Django & PostgreSQL?"];

const chips = (labels) => labels.map((label) => `<button type="button">${label}</button>`).join("");
const step = (icon, text, code = "") =>
  `<div class="step"><span class="say"><i aria-hidden="true">${icon}</i>${text}</span>${code && `<code>${code}</code>`}</div>`;
const codeOf = ({ tool, argText }) => `<span class="fn">${tool}</span>(${escapeHtml(argText)})`;

function timeout(ms) {
  if (AbortSignal.timeout) return AbortSignal.timeout(ms);
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

/** Ask the Gemini agent (via the Cloudflare Worker). Returns null if it's unavailable for any reason. */
async function askGemini(question, history) {
  if (!AGENT_API_URL) return null;
  try {
    const response = await fetch(`${AGENT_API_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
      signal: timeout(15000),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.answer === "string" && Array.isArray(data.calls) ? data : null;
  } catch {
    return null;
  }
}

export function initChat() {
  const log = $("#agent-log");
  const form = $("#agent-form");
  const input = $("#agent-q");
  const suggestions = $("#agent-chips");

  let busy = false;
  let followUp = null; // rule-based mode: project a "tell me more" should open
  const history = []; // Gemini mode: recent questions and answers, so follow-ups make sense
  let anchor = null; // latest question; long answers are read from their start

  const scrollLog = () => {
    const bottom = log.scrollHeight - log.clientHeight;
    log.scrollTop = anchor
      ? Math.min(
          bottom,
          anchor.getBoundingClientRect().top - log.getBoundingClientRect().top + log.scrollTop - 8,
        )
      : bottom;
  };

  const addMessage = (kind, html) => {
    const message = document.createElement("div");
    message.className = "msg " + kind;
    message.innerHTML = html;
    log.appendChild(message);
    scrollLog();
    return message;
  };

  // Reveal an answer block by block so it feels live without breaking the markup.
  async function typeInto(el, html) {
    if (reduceMotion) {
      el.innerHTML = html;
      return;
    }
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    el.innerHTML = "";
    for (const block of [...tmp.childNodes]) {
      if (block.nodeName === "UL") {
        const ul = document.createElement("ul");
        el.appendChild(ul);
        for (const item of [...block.children]) {
          ul.appendChild(item);
          scrollLog();
          await sleep(140);
        }
      } else {
        el.appendChild(block);
        scrollLog();
        await sleep(160);
      }
    }
  }

  const highlightTools = (names) => {
    $$(".agent-tools li").forEach((li) => {
      const signature = li.querySelector("code").textContent;
      li.classList.toggle(
        "hit",
        names.some((name) => signature.startsWith(name)),
      );
    });
  };

  async function ask(question) {
    const text = question.trim().slice(0, 160);
    if (!text || busy) return;
    busy = true;
    anchor = addMessage("user", `<span>${escapeHtml(text)}</span>`);
    scrollLog();
    const bot = addMessage("bot", "");

    try {
      if (AGENT_API_URL) {
        const started = performance.now();
        bot.innerHTML = `<div class="trace working">${step("…", "Gemini is reading your question")}<span class="caret"></span></div>`;
        const gemini = await askGemini(text, history.slice(-3));
        if (gemini) {
          history.push({ q: text, a: gemini.answer });
          const calls = gemini.calls.map((c) => toToolCall(c.name, c.args)).filter(Boolean);
          highlightTools(calls.map((c) => c.tool));
          const seconds = ((performance.now() - started) / 1000).toFixed(1);
          const timing = `<span class="ms"> · Gemini · ${seconds} s</span>`;
          const steps = calls.length
            ? calls.map((c, i) =>
                step("✓", describeCall(c)[1], codeOf(c) + (i === calls.length - 1 ? timing : "")),
              )
            : [step("✓", "Answered by Gemini, no lookup needed", timing)];
          bot.innerHTML = `<div class="trace">${steps.join("")}</div><div class="answer"></div>`;
          await typeInto($(".answer", bot), renderMarkdown(gemini.answer));
          return;
        }
      }

      const result = route(text, followUp);

      if (!result || result.reply) {
        highlightTools([]);
        const note = result
          ? step("✓", result.note)
          : step("–", "Nothing about this in Nur's profile, so I won't guess");
        bot.innerHTML = `<div class="trace">${note}</div><div class="answer"></div>`;
        await sleep(300);
        const answer = result
          ? result.reply
          : `<p>I don't have that in Nur's profile, so I won't guess. You can ask Nur directly: ${reachMe()}.</p><p>Or try one of these:</p><div class="inline-chips">${chips(FALLBACK_SUGGESTIONS)}</div>`;
        await typeInto($(".answer", bot), answer);
        return;
      }

      const { calls } = result;
      const thinkTime = calls.length > 1 ? 720 : 520;
      highlightTools(calls.map((c) => c.tool));
      const started = performance.now();
      bot.innerHTML = `<div class="trace working">${calls.map((c) => step("…", describeCall(c)[0], codeOf(c))).join("")}<span class="caret"></span></div>`;
      await sleep(thinkTime);

      const answer = calls.map((c) => TOOLS[c.tool](c.arg)).join("");
      const ms = Math.max(1, Math.round(performance.now() - started - (reduceMotion ? 0 : thinkTime)));
      const timing = `<span class="ms"> · ${calls.length > 1 ? `${calls.length} tools, ` : ""}${ms} ms</span>`;
      const steps = calls.map((c, i) =>
        step("✓", describeCall(c)[1], codeOf(c) + (i === calls.length - 1 ? timing : "")),
      );
      bot.innerHTML = `<div class="trace">${steps.join("")}</div><div class="answer"></div>`;
      await typeInto($(".answer", bot), answer);
      followUp = followUpFor(calls[0]);
    } finally {
      busy = false;
    }
  }

  suggestions.innerHTML = chips(SUGGESTIONS);
  suggestions.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (button) ask(button.textContent);
  });
  log.addEventListener("click", (e) => {
    const button = e.target.closest(".inline-chips button");
    if (button) ask(button.textContent);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const question = input.value;
    input.value = "";
    ask(question);
  });

  addMessage(
    "bot",
    `<div class="answer"><p>Hi, I'm Nur's AI agent. I answer as Nur, using only real facts from Nur's profile. Ask anything, or tap a question below.</p></div>`,
  );
}
