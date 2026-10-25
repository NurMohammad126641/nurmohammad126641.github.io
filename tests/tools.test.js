import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CV_URL, EMAIL, PHONE } from "../js/config.js";
import { DETAILS, PROJECTS, SKILLS } from "../js/agent/knowledge.js";
import { route } from "../js/agent/router.js";
import { TOOLS } from "../js/agent/tools.js";
import { describeCall } from "../js/agent/trace.js";

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
