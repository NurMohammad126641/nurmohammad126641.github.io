// Guardrail for LLM answers: every email, phone number, link and technology in an answer
// must come from the sources (the visitor's question and the tool results). Anything else
// is treated as made up, and the answer is not shown.

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

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const termPattern = (term, flags = "") => new RegExp(`(^|[^\\w.])${escapeRegex(term)}($|[^\\w])`, flags);
const TERM_PATTERNS = TECH_TERMS.map((term) => [term, termPattern(term), termPattern(term, "i")]);

/** @returns {string[]} details in the answer that the sources don't back up (empty = safe to show) */
export function findUnsupportedClaims(answer, sources) {
  const source = sources.join("\n");
  const sourceLower = source.toLowerCase();
  const sourceDigits = source.replace(/\D/g, "");
  const problems = new Set();

  for (const email of answer.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) ?? []) {
    if (!sourceLower.includes(email.toLowerCase())) problems.add(email);
  }
  for (const phone of answer.match(/\+?\d[\d\s()-]{7,}\d/g) ?? []) {
    if (!sourceDigits.includes(phone.replace(/\D/g, ""))) problems.add(phone.trim());
  }
  for (const url of answer.match(/https?:\/\/[^\s)\]>]+/g) ?? []) {
    if (!sourceLower.includes(url.replace(/[.,;:!?]+$/, "").toLowerCase())) problems.add(url);
  }
  for (const [term, inAnswer, inSource] of TERM_PATTERNS) {
    if (inAnswer.test(answer) && !inSource.test(source)) problems.add(term);
  }
  return [...problems];
}
