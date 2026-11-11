// The floating chat bubble: a Messenger-style launcher in the corner of every page.
// - The chat code loads on the first open, so the page stays fast.
// - Suggested questions follow the section the visitor is reading.
// - A one-time hello appears after the visitor has looked around for a few seconds.
// - On phones the chat opens as a full-screen sheet, and the tab bar's "Ask AI" opens it too.

import { $, $$ } from "../lib/dom.js";

const TEASER_KEY = "chatHelloSeen";
const TEASER_DELAY = 8000;

// Questions that fit what the visitor is looking at (each one is answered from real profile data).
const QUESTIONS_FOR = {
  hero: [
    "What do you do?",
    "What's your biggest impact?",
    "Show me a demo",
    "Why work with you?",
    "How can I contact you?",
  ],
  work: [
    "How did you make OD Tracker fast?",
    "Show me the OD Tracker demo",
    "Tell me about the chatbot",
    "How does the branch report engine work?",
    "Did you build it alone?",
  ],
  agent: [
    "How does this agent work?",
    "Show me your AI work",
    "Tell me about the chatbot",
    "What do you do?",
  ],
  experience: [
    "What did you do at TallyKhata?",
    "Tell me about Padakhep",
    "What do you want in your next role?",
    "Django & PostgreSQL?",
  ],
  stack: [
    "What's your tech stack?",
    "Django & PostgreSQL?",
    "Have you used Power BI?",
    "Show me your AI work",
  ],
  contact: [
    "How can I contact you?",
    "What do you want in your next role?",
    "Why work with you?",
    "Can I see your CV?",
  ],
};
const SECTION_GROUP = { "open-source": "work", writing: "contact" };

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode: the hello may show again next visit, that's fine */
    }
  },
};

/** The section crossing 45% of the screen, the same rule the nav highlight uses. */
function currentSection() {
  const line = innerHeight * 0.45;
  let current = "hero";
  $$(".hero, #work, #open-source, #agent, #experience, #stack, #writing, #contact").forEach((s) => {
    if (s.getBoundingClientRect().top <= line) current = s.id || "hero";
  });
  return SECTION_GROUP[current] || current;
}

export function initChatBubble() {
  const dock = $("#chatdock");
  const panel = $("#chat-panel");
  const launcher = $("#chat-launcher");
  const closeBtn = $("#chat-close");
  const teaser = $("#chat-teaser");
  if (!dock || !panel || !launcher) return {};

  const phone = matchMedia("(max-width: 900px)");
  let chat = null; // { ask, setSuggestions } once chat.js has loaded
  let loading = null;
  let lastFocus = null;

  const loadChat = () => {
    loading ||= import("../agent/chat.js").then(({ initChat }) => (chat = initChat()));
    return loading;
  };

  const hideTeaser = (remember = true) => {
    if (!teaser.hidden) teaser.hidden = true;
    if (remember) storage.set(TEASER_KEY, "1");
  };

  // --- Phones: keep the chat inside the part of the screen the keyboard leaves free ---
  // Mobile browsers slide the keyboard over the page without shrinking it, so a full-height chat
  // would hide its own text box. The visual viewport is the part still visible: size the chat to it.
  const vv = window.visualViewport;
  let lockedScroll = 0;
  let fullHeight = 0; // the chat's height with no keyboard, to tell when the keyboard is up
  const log = () => $("#agent-log");

  function fitToViewport() {
    if (panel.hidden || !phone.matches || !vv) return;
    panel.style.height = `${Math.round(vv.height)}px`;
    panel.style.top = `${Math.round(vv.offsetTop)}px`;
    fullHeight = Math.max(fullHeight, vv.height);
    const keyboardUp = vv.height < fullHeight * 0.8;
    panel.classList.toggle("kb-open", keyboardUp);
    if (keyboardUp) log().scrollTop = log().scrollHeight; // keep the latest message in view
  }

  function lockPage() {
    // iPhone Safari ignores overflow:hidden on the page, so pin the page in place instead.
    lockedScroll = scrollY;
    document.body.style.top = `-${lockedScroll}px`;
    document.body.classList.add("chat-locked");
  }

  function unlockPage() {
    if (!document.body.classList.contains("chat-locked")) return;
    document.body.classList.remove("chat-locked");
    document.body.style.top = "";
    scrollTo({ top: lockedScroll, behavior: "instant" });
  }

  if (vv) {
    vv.addEventListener("resize", fitToViewport);
    vv.addEventListener("scroll", fitToViewport);
  }
  phone.addEventListener?.("change", () => {
    if (!phone.matches) {
      panel.style.height = panel.style.top = "";
      panel.classList.remove("kb-open");
      unlockPage();
    }
  });

  async function open(question) {
    hideTeaser();
    const wasOpen = !panel.hidden;
    if (!wasOpen) {
      lastFocus = document.activeElement;
      panel.hidden = false;
      launcher.setAttribute("aria-expanded", "true");
      document.body.classList.add("chat-open");
      if (phone.matches) {
        // Like a messenger app: the phone's Back button closes the chat instead of leaving the site.
        // (Pushed before the page is pinned, so going back restores the visitor's real scroll spot.)
        if (!history.state?.chat) history.pushState({ chat: true }, "");
        fullHeight = 0;
        lockPage();
        fitToViewport();
      }
      requestAnimationFrame(() => panel.classList.add("in"));
    }
    await loadChat();
    if (!wasOpen) chat.setSuggestions(QUESTIONS_FOR[currentSection()]);
    if (question) chat.ask(question);
    // On phones, don't pop the keyboard over the chat unless the visitor taps the input.
    if (!phone.matches) $("#agent-q").focus({ preventScroll: true });
  }

  function close(fromBackButton = false) {
    if (panel.hidden) return;
    if (!fromBackButton && history.state?.chat) history.back(); // drop the entry Back would have closed
    panel.classList.remove("in");
    launcher.setAttribute("aria-expanded", "false");
    document.body.classList.remove("chat-open");
    panel.hidden = true;
    panel.style.height = panel.style.top = "";
    panel.classList.remove("kb-open");
    unlockPage();
    (lastFocus && document.contains(lastFocus) ? lastFocus : launcher).focus({ preventScroll: true });
  }

  launcher.addEventListener("click", () => (panel.hidden ? open() : close()));
  closeBtn.addEventListener("click", () => close());
  addEventListener("popstate", () => {
    if (!panel.hidden) close(true);
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) close();
  });

  // Every "Ask my agent" link on the page opens the chat instead of scrolling.
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest('a[href="#agent"], [data-open-chat]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger.dataset.ask);
  });

  // The one-time hello: after the visitor scrolls past the top and has spent a few seconds on the page.
  if (!storage.get(TEASER_KEY)) {
    let timer = null;
    const maybeShow = () => {
      if (timer || scrollY < 140) return;
      timer = setTimeout(() => {
        if (panel.hidden && !storage.get(TEASER_KEY)) teaser.hidden = false;
      }, TEASER_DELAY);
      removeEventListener("scroll", maybeShow);
    };
    addEventListener("scroll", maybeShow, { passive: true });
    $(".teaser-open", teaser).addEventListener("click", () => open());
    $(".teaser-x", teaser).addEventListener("click", () => hideTeaser());
  }

  // Fetch the chat code early so the first open is instant: as soon as the visitor shows interest,
  // or quietly a few seconds after the page has loaded (it never delays the first paint).
  ["pointerenter", "focus", "touchstart"].forEach((type) =>
    launcher.addEventListener(type, loadChat, { once: true, passive: true }),
  );
  const whenIdle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1));
  addEventListener("load", () => setTimeout(() => whenIdle(loadChat), 3000), { once: true });

  return { open, close };
}
