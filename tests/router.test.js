import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { editDistance, fixTypos, followUpFor, route } from "../js/agent/router.js";

const firstCall = (question, followUp) => route(question, followUp)?.calls?.[0];
const callsFor = (question) => route(question)?.calls?.map((c) => `${c.tool}(${c.argText})`);

describe("route", () => {
  const cases = [
    ["What do you do?", "get_profile()"],
    ["Why should we hire you?", 'get_profile(section="pitch")'],
    ["Why work with you?", 'get_profile(section="pitch")'],
    ["What's your tech stack?", 'get_profile(section="stack")'],
    ["What is your expected salary?", 'get_contact(topic="hiring")'],
    ["Can we schedule an interview?", 'get_contact(topic="interview")'],
    ["Where are you based?", 'get_contact(topic="location")'],
    ["How can I contact you?", "get_contact()"],
    ["What's your education?", "get_education()"],
    ["Tell me about the chatbot", 'get_projects(name="AI Analytics Chatbot")'],
    ["Tell me about the branch report automation", 'get_projects(name="Branch Report Automation Engine")'],
    ["Show me your GitHub", 'get_projects(domain="open_source")'],
    ["Show me your AI work", 'get_projects(domain="ai")'],
    ["What's your biggest impact?", 'get_projects(domain="impact")'],
    ["Can you build dashboards?", 'get_projects(domain="bi")'],
    ["Show me a case study", 'get_projects(domain="featured")'],
    ["Fintech experience?", 'get_experience(company="TallyKhata")'],
    ["What is your current role?", 'get_experience(company="Padakhep")'],
    ["How many years of experience do you have?", 'get_experience(company="all")'],
    ["Do you know Python?", 'find_evidence(skill="Python")'],
  ];
  for (const [question, expected] of cases) {
    it(`${question} → ${expected}`, () => assert.deepEqual(callsFor(question), [expected]));
  }

  it("calls one tool per skill, in the order asked", () => {
    assert.deepEqual(callsFor("Django & PostgreSQL?"), [
      'find_evidence(skill="Django & DRF")',
      'find_evidence(skill="PostgreSQL")',
    ]);
  });

  it("lets a specific skill replace a broader one", () => {
    assert.deepEqual(callsFor("Do you know Chart.js?"), ['find_evidence(skill="Chart.js")']);
    assert.deepEqual(callsFor("Google Sheets API?"), ['find_evidence(skill="Google Sheets API")']);
  });

  it("says 'not yet' for tools I haven't used, and points to the closest experience", () => {
    const { arg } = firstCall("Do you know Tableau?");
    assert.equal(arg.name, "Tableau");
    assert.match(arg.answer, /Power BI/);
  });

  it("never claims a skill that isn't in the profile", () => {
    const { arg } = firstCall("Do you know Java?");
    assert.equal(arg.name, "Java");
    assert.equal(arg.evidence, undefined);
    assert.equal(arg.answer, undefined);
  });

  it("answers greetings, thanks and questions about itself without a tool", () => {
    for (const question of ["hi", "thank you!", "How does this agent work?"]) {
      assert.ok(route(question).reply, question);
    }
  });

  it("returns null when nothing in the profile matches", () => {
    assert.equal(route("What are your weaknesses?"), null);
  });

  it("opens the last topic's project on a follow-up", () => {
    assert.equal(firstCall("tell me more", "chatbot").argText, 'name="AI Analytics Chatbot"');
    assert.equal(firstCall("tell me more", null).argText, 'domain="impact"');
  });

  it("tolerates typos", () => {
    assert.deepEqual(callsFor("djnago?"), ['find_evidence(skill="Django & DRF")']);
    assert.deepEqual(callsFor("pyhton?"), ['find_evidence(skill="Python")']);
  });
});

describe("followUpFor", () => {
  it("maps an answer to the project a follow-up should open", () => {
    assert.equal(followUpFor({ tool: "get_projects", arg: "ai" }), "chatbot");
    assert.equal(followUpFor({ tool: "get_experience", arg: "padakhep" }), "overdue");
    assert.equal(followUpFor({ tool: "get_contact", arg: null }), null);
  });
});

describe("typo helpers", () => {
  it("counts an adjacent swap as one edit", () => assert.equal(editDistance("djnago", "django"), 1));
  it("leaves ordinary words alone", () => assert.equal(fixTypos("what do you build"), "what do you build"));
});
