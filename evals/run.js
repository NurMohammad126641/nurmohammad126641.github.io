// Runs evals/cases.js against the live agent and prints a pass/fail line per question.
// The Worker allows 8 questions a minute, so this asks one every 10 seconds (about 6 minutes).
// Usage: npm run eval

import { ALWAYS_FORBIDDEN, CASES } from "./cases.js";
import { AGENT_API_URL } from "../js/config.js";

const ORIGIN = "https://nurmohammad126641.github.io";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ask(question, history) {
  const response = await fetch(`${AGENT_API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN },
    body: JSON.stringify({ question, history }),
  });
  return response.ok ? response.json() : { status: response.status };
}

let passed = 0;
let total = 0;
for (const item of CASES) {
  const turns = Array.isArray(item[0]) ? item : [item];
  const history = [];
  for (const [question, must, mustNot] of turns) {
    total++;
    const data = await ask(question, history);
    if (data.status) {
      const reason = data.status === 429 ? "rate limited" : "blocked or unavailable";
      console.log(`fallback  ${question}  (HTTP ${data.status}, ${reason}; the rule-based agent answers)`);
    } else {
      history.push({ q: question, a: data.answer, sig: data.sig });
      const ok =
        (!must || must.test(data.answer)) &&
        !mustNot?.test(data.answer) &&
        !ALWAYS_FORBIDDEN.test(data.answer);
      if (ok) passed++;
      console.log(`${ok ? "pass" : "FAIL"}      ${question}\n          ${data.answer.replace(/\n+/g, " ")}`);
    }
    await sleep(10000);
  }
}
console.log(`\n${passed}/${total} passed`);
process.exitCode = passed === total ? 0 : 1;
