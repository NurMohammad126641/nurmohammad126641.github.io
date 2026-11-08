import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CV_URL, EMAIL, PHONE } from "../js/config.js";
import { DETAILS, PROJECTS, SKILLS } from "../js/agent/knowledge.js";
import { route } from "../js/agent/router.js";
import { TOOLS } from "../js/agent/tools.js";
import { describeCall } from "../js/agent/trace.js";
import { findUnsupportedClaims } from "../js/agent/guard.js";
import { htmlToText } from "../js/agent/llm-tools.js";

describe("knowledge", () => {
  it("backs every skill with at least one piece of evidence", () => {
    for (const skill of SKILLS) assert.ok(skill.evidence.length > 0, skill.name);
  });

  it("points follow-ups only at projects that exist", () => {
    for (const skill of SKILLS) if (skill.more) assert.ok(DETAILS[skill.more], skill.name);
  });
});

describe("tools", () => {
  it("renders every project list and project detail", () => {
    for (const domain of Object.keys(PROJECTS)) assert.match(TOOLS.get_projects(domain), /^<ul>/);
    for (const name of Object.keys(DETAILS)) assert.match(TOOLS.get_projects({ name }), /<b>/);
  });

  it("includes email, phone and CV in every contact answer", () => {
    for (const topic of [null, "hiring", "interview", "location"]) {
      const html = TOOLS.get_contact(topic);
      for (const detail of [EMAIL, PHONE, CV_URL]) assert.ok(html.includes(detail), `${topic}: ${detail}`);
    }
  });

  it("returns only text the guardrail accepts when the model repeats it word for word", () => {
    const outputs = [
      ...Object.keys(PROJECTS).map((domain) => TOOLS.get_projects(domain)),
      ...Object.keys(DETAILS).map((name) => TOOLS.get_projects({ name })),
      ...[null, "pitch", "stack", "roles", "build"].map((section) => TOOLS.get_profile(section)),
      ...SKILLS.map((skill) => TOOLS.find_evidence(skill)),
    ].map(htmlToText);
    for (const text of outputs) assert.deepEqual(findUnsupportedClaims(text, [text]), [], text.slice(0, 60));
  });

  it("escapes visitor text it repeats back", () => {
    const html = TOOLS.find_evidence({ name: "<img src=x onerror=alert(1)>" });
    assert.ok(!html.includes("<img"));
  });
});

describe("trace", () => {
  const questions = [
    "What do you do?",
    "Django & PostgreSQL?",
    "Do you know Tableau?",
    "Do you know Java?",
    "Tell me about the chatbot",
    "Do you have any proof?",
    "Do you know Looker Studio?",
    "Fintech experience?",
    "Where are you based?",
    "What's your education?",
  ];

  it("describes every call in plain English, before and after it runs", () => {
    for (const question of questions) {
      for (const call of route(question).calls) {
        const [working, done] = describeCall(call);
        assert.ok(working && done && !working.includes("undefined") && !done.includes("undefined"), question);
      }
    }
  });
});

describe("live dashboard", () => {
  const LOOKER = "https://lookerstudio.google.com/reporting/69917f8d-272c-4c04-b975-4005c7c7cd01";

  it("links the live dashboard wherever someone asks for proof, Looker Studio, fraud or TallyKhata", () => {
    for (const question of [
      "Do you have any proof?",
      "Do you have a live demo?",
      "Do you know Looker Studio?",
      "Any experience with fraud?",
      "Tell me about TallyKhata",
      "Show me a case study",
    ]) {
      const html = route(question)
        .calls.map((c) => TOOLS[c.tool](c.arg))
        .join("");
      assert.ok(html.includes(LOOKER), question);
    }
  });

  it("lets the model repeat the dashboard link and its numbers", () => {
    const source = htmlToText(TOOLS.get_projects({ name: "payments" }));
    const answer = `I rebuilt my TallyKhata KPI and fraud dashboards in Looker Studio: [open it](${LOOKER}). Visibility improved by 80%, and the demo covers 60 days.`;
    assert.deepEqual(findUnsupportedClaims(answer, [source]), []);
  });
});
