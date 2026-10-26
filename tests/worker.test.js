import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import worker from "../worker/src/index.js";

const ORIGIN = "https://nurmohammad126641.github.io";
const env = {
  GEMINI_API_KEY: "test-key",
  ALLOWED_ORIGINS: ORIGIN,
  GEMINI_MODEL: "test-model",
  GEMINI_API_STYLE: "interactions",
  ASK_LIMITER: { limit: async () => ({ success: true }) },
};
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const ask = (body, { origin = ORIGIN, method = "POST", environment = env } = {}) =>
  worker.fetch(
    new Request("https://agent.example/ask", {
      method,
      headers: { "Content-Type": "application/json", Origin: origin },
      body: method === "POST" ? JSON.stringify(body) : undefined,
    }),
    environment,
  );

/** Fake Gemini: replies in order, and records every request body it receives. */
function fakeGemini(...replies) {
  const requests = [];
  globalThis.fetch = async (url, init) => {
    requests.push({ url, headers: init.headers, body: JSON.parse(init.body) });
    const reply = replies.shift();
    return new Response(JSON.stringify(reply.body ?? reply), { status: reply.httpStatus ?? 200 });
  };
  return requests;
}

describe("worker", () => {
  it("runs the tools Gemini asks for, then returns its answer", async () => {
    const requests = fakeGemini(
      {
        id: "i1",
        status: "requires_action",
        steps: [{ type: "function_call", id: "c1", name: "find_evidence", arguments: { skill: "Django" } }],
      },
      {
        id: "i2",
        status: "completed",
        steps: [{ type: "model_output", content: [{ type: "text", text: "I built it." }] }],
      },
    );

    const response = await ask({ question: "Do you know Django?" });
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(data, {
      answer: "I built it.",
      calls: [{ name: "find_evidence", args: { skill: "Django" } }],
      conversation: "i2",
    });
    assert.equal(requests[0].headers["x-goog-api-key"], "test-key");
    assert.equal(requests[0].body.model, "test-model");
    assert.equal(requests[1].body.previous_interaction_id, "i1");
    assert.equal(requests[1].body.input[0].call_id, "c1");
    assert.match(requests[1].body.input[0].result[0].text, /Overdue Tracking Platform/);
  });

  it("continues an earlier conversation", async () => {
    const requests = fakeGemini({
      id: "i9",
      steps: [{ type: "model_output", content: [{ type: "text", text: "Sure." }] }],
    });
    await ask({ question: "Tell me more", conversation: "i8" });
    assert.equal(requests[0].body.previous_interaction_id, "i8");
  });

  it("rejects other websites", async () => {
    const response = await ask({ question: "hi" }, { origin: "https://evil.example" });
    assert.equal(response.status, 403);
  });

  it("rejects empty or very long questions", async () => {
    assert.equal((await ask({ question: "" })).status, 400);
    assert.equal((await ask({ question: "x".repeat(301) })).status, 400);
  });

  it("reports unavailable when the key is missing or Gemini fails", async () => {
    assert.equal((await ask({ question: "hi" }, { environment: { ALLOWED_ORIGINS: ORIGIN } })).status, 503);
    fakeGemini({ httpStatus: 429, body: { error: "quota" } });
    assert.equal((await ask({ question: "hi" })).status, 503);
  });

  it("answers the browser's CORS preflight", async () => {
    const response = await ask(null, { method: "OPTIONS" });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  });
});

describe("worker (generateContent API)", () => {
  const generateEnv = { ...env, GEMINI_API_STYLE: "generate" };
  const reply = (...parts) => ({ candidates: [{ content: { role: "model", parts } }] });

  it("runs tools, sends results back with the model's turn, and returns the answer", async () => {
    const requests = fakeGemini(
      reply({ functionCall: { name: "get_contact", args: { topic: "general" } }, thoughtSignature: "sig" }),
      reply({ text: "Email me at rabbins.eng@gmail.com." }),
    );
    const response = await ask({ question: "How can I reach you?" }, { environment: generateEnv });
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.answer, "Email me at rabbins.eng@gmail.com.");
    assert.match(requests[0].url, /models\/test-model:generateContent$/);
    assert.equal(requests[1].body.contents[1].parts[0].thoughtSignature, "sig");
    assert.match(
      requests[1].body.contents[2].parts[0].functionResponse.response.result,
      /rabbins\.eng@gmail\.com/,
    );
  });

  it("blocks an answer with made-up contact details or tools", async () => {
    fakeGemini(reply({ text: "Email nur.fake@gmail.com, I also use Airflow." }));
    const response = await ask({ question: "How can I reach you?" }, { environment: generateEnv });
    assert.equal(response.status, 503);
  });

  it("sends earlier turns as conversation history", async () => {
    const requests = fakeGemini(reply({ text: "Sure." }));
    await ask(
      { question: "Tell me more", history: [{ q: "What do you do?", a: "I build data systems." }] },
      { environment: generateEnv },
    );
    assert.equal(requests[0].body.contents.length, 3);
    assert.equal(requests[0].body.contents[1].parts[0].text, "I build data systems.");
  });
});
