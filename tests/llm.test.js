import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { htmlToText, lookupSkill, runTool, toToolCall, TOOL_DECLARATIONS } from "../js/agent/llm-tools.js";
import { findUnsupportedClaims } from "../js/agent/guard.js";
import { renderMarkdown } from "../js/lib/markdown.js";

describe("LLM tools", () => {
  it("declares every tool with a name, description and object parameters", () => {
    assert.equal(TOOL_DECLARATIONS.length, 6);
    for (const tool of TOOL_DECLARATIONS) {
      assert.equal(tool.type, "function");
      assert.ok(tool.name && tool.description, tool.name);
      assert.equal(tool.parameters.type, "object");
    }
  });

  it("finds real evidence, an honest 'not yet', or nothing", () => {
    assert.ok(lookupSkill("Django").evidence);
    assert.match(lookupSkill("Tableau").answer, /Power BI/);
    assert.deepEqual(lookupSkill("Java"), { name: "Java" });
  });

  it("maps model arguments onto the tools, with safe defaults", () => {
    assert.deepEqual(toToolCall("get_projects", { project: "chatbot" }).arg, { name: "chatbot" });
    assert.equal(toToolCall("get_projects", { domain: "nonsense" }).arg, "featured");
    assert.equal(toToolCall("get_profile", { section: "about" }).arg, null);
    assert.equal(toToolCall("get_contact", { topic: "general" }).arg, null);
    assert.equal(toToolCall("get_experience", { company: "unknown" }).arg, "all");
    assert.equal(toToolCall("delete_everything", {}), null);
  });

  it("gives the model plain text with links kept", () => {
    const text = runTool("get_contact", { topic: "general" });
    assert.ok(!text.includes("<p>"));
    assert.match(text, /\[LinkedIn\]\(https:\/\/www\.linkedin\.com\//);
    assert.equal(htmlToText("<p>A &amp; B</p><ul><li>one</li></ul>"), "A & B\n- one");
  });

  it("refuses unknown tools", () => {
    assert.match(runTool("rm_rf", {}), /Unknown tool/);
  });
});

describe("renderMarkdown", () => {
  it("renders paragraphs, bullets and bold", () => {
    assert.equal(
      renderMarkdown("Hello **there**\n- one\n- two"),
      "<p>Hello <b>there</b></p><ul><li>one</li><li>two</li></ul>",
    );
  });

  it("escapes HTML from the model", () => {
    assert.equal(renderMarkdown("<img src=x onerror=alert(1)>"), "<p>&lt;img src=x onerror=alert(1)&gt;</p>");
  });

  it("keeps links only to known hosts", () => {
    assert.match(
      renderMarkdown("[post](https://www.linkedin.com/posts/x)"),
      /<a href="https:\/\/www\.linkedin\.com/,
    );
    assert.equal(renderMarkdown("[click](https://evil.example/github.com/)"), "<p>click</p>");
    assert.doesNotMatch(renderMarkdown("[x](javascript:alert(1))"), /<a|javascript/);
  });
});

describe("findUnsupportedClaims", () => {
  const sources = ["Email rabbins.eng@gmail.com, call +880 1904-271946.", "I use Django and PostgreSQL."];

  it("accepts details that are in the sources", () => {
    assert.deepEqual(findUnsupportedClaims("I use **Django**. Call +880 1904-271946.", sources), []);
  });

  it("flags made-up emails, phone numbers, links and tools", () => {
    assert.deepEqual(
      findUnsupportedClaims(
        "Mail nur@x.com or call +880 1936-302302. See https://evil.example. I use Airflow and JWT.",
        sources,
      ).sort(),
      ["+880 1936-302302", "Airflow", "JWT", "https://evil.example.", "nur@x.com"].sort(),
    );
  });

  it("ignores ordinary words that look like tool names", () => {
    assert.deepEqual(findUnsupportedClaims("I excel at data work and react quickly.", sources), []);
  });
});
