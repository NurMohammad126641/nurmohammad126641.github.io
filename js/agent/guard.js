// Guardrail for LLM answers: every email, phone number, link, number, technology and claim
// about how I worked in an answer must come from the sources (tool results and known facts,
// never the visitor's own words). Anything else is treated as made up, and the answer is
// not shown.

// Technologies a model might add from its own general knowledge. Matched case-sensitively in
// the answer (they're proper names, so "excel at" or "react quickly" don't count).
const TECH_TERMS = [
  "Java",
  "JWT",
  "OAuth",
  "Airflow",
  "dbt",
  "Spark",
  "PySpark",
  "Hadoop",
  "Databricks",
  "Kafka",
  "Flink",
  "Tableau",
  "Qlik",
  "AWS",
  "Azure",
  "GCP",
  "Kubernetes",
  "Terraform",
  "Ansible",
  "FastAPI",
  "Flask",
  "Laravel",
  "MongoDB",
  "Cassandra",
  "DynamoDB",
  "Snowflake",
  "Redshift",
  "BigQuery",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "scikit-learn",
  "LangChain",
  "LlamaIndex",
  "OpenAI",
  "ChatGPT",
  "Claude",
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "TypeScript",
  "Rust",
  "C#",
  ".NET",
  "PHP",
  "Kotlin",
  "GraphQL",
  "Elasticsearch",
  "RabbitMQ",
  "Jenkins",
  "GitLab",
  "Power BI",
  "Metabase",
  "Looker",
  "Excel",
  "Selenium",
  "Playwright",
  "Celery",
  "Redis",
  "MySQL",
  "Docker",
  "n8n",
  "Gemini",
  "Pandas",
  "Chart.js",
];

// Claims about how I worked that a model might invent ("I built it alone", "I led a team of 5").
// Words in one pattern back each other up: a source saying "solo" allows "alone".
const WORK_CLAIMS = [
  /\b(alone|single-?handed\w*|by myself|on my own|solo)\b/i,
  /\b(led|lead|managed|manage|managing|leading) (a|the|my|an?) (\w+ )?team\b/i,
  /\bteam of \d+/i,
];

// Never in an answer, whatever the sources say. Employer-specific names come in at runtime
// (the Worker's PRIVATE_TERMS secret), so they aren't published in this repo.
const NEVER = [/\bcredentials?\b/i, /\bpasswords?\b/i, /\bapi[- ]?keys?\b/i];

const EMAIL_PATTERN = /[\w.+-]+@[\w-]+(\.[\w-]+)+/g;
const PHONE_PATTERN = /\+?\d[\d\s()-]{7,}\d/g;
const LINK_PATTERN = /https?:\/\/[^\s)\]>]+/g;

const BANGLA_DIGITS = /[০-৯]/g;
const toAscii = (text) => text.replace(BANGLA_DIGITS, (d) => String(d.charCodeAt(0) - 0x09e6));
// "4,000" and "4000" are the same number.
const plainNumbers = (text) => toAscii(text).replace(/(\d),(?=\d{3}\b)/g, "$1");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const termPattern = (term, flags = "") => new RegExp(`(^|[^\\w.])${escapeRegex(term)}($|[^\\w])`, flags);
const TERM_PATTERNS = TECH_TERMS.map((term) => [term, termPattern(term), termPattern(term, "i")]);

/**
 * @param {string[]} privateTerms  words that must never appear, matched case-insensitively
 * @returns {string[]} details in the answer that the sources don't back up (empty = safe to show)
 */
export function findUnsupportedClaims(answer, sources, privateTerms = []) {
  const source = sources.join("\n");
  const sourceLower = source.toLowerCase();
  const sourceDigits = source.replace(/\D/g, "");
  const problems = new Set();

  for (const email of answer.match(EMAIL_PATTERN) ?? []) {
    if (!sourceLower.includes(email.toLowerCase())) problems.add(email);
  }
  for (const phone of answer.match(PHONE_PATTERN) ?? []) {
    if (!sourceDigits.includes(phone.replace(/\D/g, ""))) problems.add(phone.trim());
  }
  for (const url of answer.match(LINK_PATTERN) ?? []) {
    if (!sourceLower.includes(url.replace(/[.,;:!?]+$/, "").toLowerCase())) problems.add(url);
  }
  for (const [term, inAnswer, inSource] of TERM_PATTERNS) {
    if (inAnswer.test(answer) && !inSource.test(source)) problems.add(term);
  }
  for (const claim of WORK_CLAIMS) {
    const found = answer.match(claim);
    if (found && !claim.test(source)) problems.add(found[0]);
  }
  // Numbers with two or more digits (counts, percentages, years, timings) must appear in a source.
  // Emails, links and phone numbers were checked whole above.
  const prose = answer.replace(EMAIL_PATTERN, " ").replace(LINK_PATTERN, " ").replace(PHONE_PATTERN, " ");
  const sourceNumbers = new Set(plainNumbers(source).match(/\d+(\.\d+)?/g));
  for (const number of plainNumbers(prose).match(/\d+(\.\d+)?/g) ?? []) {
    if (number.replace(".", "").length >= 2 && !sourceNumbers.has(number)) problems.add(number);
  }
  for (const word of [...NEVER, ...privateTerms.map((term) => new RegExp(escapeRegex(term), "i"))]) {
    const found = answer.match(word);
    if (found) problems.add(found[0]);
  }
  return [...problems];
}
