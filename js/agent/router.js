// Picks which tool(s) to call for a question, with which arguments.
// In production an LLM makes this choice; here plain rules keep the demo instant and free.

import { LINKS } from "../config.js";
import { link, list } from "../lib/html.js";
import { DETAILS, NOT_YET, SKILLS } from "./knowledge.js";
import { reachMe } from "./tools.js";

// --- Typo tolerance: "djnago" → "django" ---------------------------------------------

const VOCABULARY = [
  "python",
  "django",
  "postgresql",
  "postgres",
  "metabase",
  "dashboard",
  "dashboards",
  "tallykhata",
  "padakhep",
  "gemini",
  "chatbot",
  "pipeline",
  "pipelines",
  "warehouse",
  "selenium",
  "docker",
  "analytics",
  "automation",
  "certification",
  "certifications",
  "university",
  "whatsapp",
  "resume",
  "linkedin",
  "github",
  "fintech",
  "microfinance",
  "tableau",
  "airflow",
  "kubernetes",
  "leadership",
  "database",
  "databases",
  "celery",
  "pandas",
  "looker",
  "bigquery",
  "playwright",
  "javascript",
  "overdue",
  "experience",
  "education",
  "agentic",
  "salary",
  "interview",
];

// Optimal string alignment distance (Levenshtein plus adjacent swaps).
export function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

export function fixTypos(text) {
  return text.replace(/[a-z]{5,}/g, (word) => {
    if (VOCABULARY.includes(word)) return word;
    const maxDistance = word.length >= 8 ? 2 : 1;
    let best = word;
    let bestDistance = maxDistance + 1;
    for (const known of VOCABULARY) {
      if (Math.abs(known.length - word.length) > maxDistance) continue;
      const distance = editDistance(word, known);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = known;
      }
    }
    return best;
  });
}

// --- Display names for skills I don't have -------------------------------------------

const DISPLAY_NAMES = {
  aws: "AWS",
  gcp: "GCP",
  k8s: "Kubernetes",
  dbt: "dbt",
  fastapi: "FastAPI",
  pyspark: "PySpark",
  nosql: "NoSQL",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  langchain: "LangChain",
  llamaindex: "LlamaIndex",
  crewai: "CrewAI",
  autogen: "AutoGen",
  langgraph: "LangGraph",
  pytorch: "PyTorch",
  tensorflow: "TensorFlow",
  sklearn: "scikit-learn",
  scikit: "scikit-learn",
  nlp: "NLP",
  dynamodb: "DynamoDB",
};

export const displayName = (term) =>
  DISPLAY_NAMES[term.replace(/\s/g, "")] || term.replace(/\b\w/g, (c) => c.toUpperCase());

// --- Replies that need no tool -------------------------------------------------------

const GREETING_WORDS =
  /\b(hi+|hello|hey+|hiya|yo|salam|assalamu?|alaikum|good (morning|afternoon|evening)|there|nur|agent|bot)\b/g;
const THANKS_WORDS =
  /\b(thanks?|thank you|thx|ty|great|awesome|cool|nice|ok(ay)?|perfect|got it|so much|a lot|very|you|that s|that|is|it|bye|goodbye|see you)\b/g;

const HOW_I_WORK = `<p>Good question! Here's how I work:</p>${list([
  "You ask a question.",
  "I pick the right tool for it. For example, <code>find_evidence</code> checks a skill.",
  "The tool gets real data from Nur's profile.",
  "I answer using only that data, so I never make things up.",
])}<p>Normally Google Gemini picks the tools, using function calling. Right now I'm in quick mode: simple rules pick them, so I still answer instantly when Gemini is busy.</p>`;

const IN_PERSON = `<p>That's a great question for a real conversation rather than a canned answer from me.</p><p>Ask Nur directly: ${reachMe()}.</p>`;

const THIS_SITE = `<p>This site is plain HTML, CSS and JavaScript, with no framework. I run on Google Gemini with function calling, and a rule-based version answers if Gemini is unavailable.</p><p>The code is public: ${link(LINKS.github + "/nurmohammad126641.github.io", "see it on GitHub")}.</p>`;

// --- Routing -------------------------------------------------------------------------

// Words that describe a field rather than a specific tool, so "do you know X" skips them.
const DOMAIN_WORDS =
  /\b(data|engineer\w*|analy\w*|backend|back-end|server|bi|business|dashboards?|reports?|reporting|visuali\w*|charts?|skills?|stack|tech\w*|tools?|ai|automation|scripting|coding|programming|software|web|development|projects?|teams?|clients?)\b/;
const NOT_A_SKILL =
  /^(it|that|this|them|me|us|you|how|what|about|if|anything|something|stuff|things?|bangla|bengali|english|hindi)\b/;

const call = (tool, arg, argText = "") => ({ calls: [{ tool, arg, argText }] });
const projectDetail = (key) => call("get_projects", { name: key }, `name="${DETAILS[key].title}"`);

// The project a "tell me more" opens after each kind of answer.
const FOLLOW_UP = {
  ai: "chatbot",
  data: "report",
  backend: "overdue",
  bi: "metabase",
  impact: "overdue",
  padakhep: "overdue",
  all: "overdue",
};

export function followUpFor({ tool, arg }) {
  if (tool === "find_evidence") return arg.more ?? null;
  if (tool === "get_projects" && typeof arg === "string") return FOLLOW_UP[arg] ?? null;
  if (tool === "get_experience") return FOLLOW_UP[arg] ?? null;
  return null;
}

/**
 * Route a visitor's question.
 * @param {string} question
 * @param {string|null} followUp  project key a "tell me more" should open
 * @returns {{calls: {tool: string, arg: *, argText: string}[]} | {reply: string, note: string} | null}
 */
export function route(question, followUp = null) {
  const q = " " + fixTypos(question.toLowerCase().replace(/[^\w\s/+#.-]/g, " ")) + " ";
  const has = (pattern) => pattern.test(q);

  if (/[ঀ-৿]/.test(question)) {
    return {
      reply: `<p>In quick mode I can only answer in English. Try: <i>What do you do?</i></p>`,
      note: "Bangla question, quick mode answers in English",
    };
  }
  if (!q.replace(GREETING_WORDS, "").trim()) {
    return {
      reply: `<p>Hi! Ask me about Nur's projects, skills, work history, or how to get in touch.</p>`,
      note: "Just saying hello, no lookup needed",
    };
  }
  if (!q.replace(THANKS_WORDS, "").trim()) {
    return {
      reply: has(/\b(thanks?|thank you|thx|bye|goodbye|see you)\b/)
        ? `<p>You're welcome! To talk to Nur directly: ${reachMe()}.</p>`
        : `<p>Great! Ask me anything else about Nur's work, or reach Nur directly: ${reachMe()}.</p>`,
      note: "No lookup needed",
    };
  }
  if (
    has(
      /\b(ignore (all |the |your |previous |prior |above )*(instructions|rules|prompts?)|system prompt|your (instructions|prompt|rules)|jailbreak|developer mode)\b/,
    )
  ) {
    return {
      reply: `<p>I can't share how I'm set up, but I'm happy to answer anything about Nur's work, skills or experience.</p>`,
      note: "Not something I share",
    };
  }
  if (
    has(
      /\b(weakness\w*|a time (when )?you (failed|made a mistake)|your (biggest )?(failures?|mistakes?)|conflicts?|handle (pressure|stress|deadlines)|hobb(y|ies)|married|how old|your age|why (did|do|would) you (leave|left|quit|switch|change)\w*|leaving (your|tallykhata|padakhep))\b/,
    )
  ) {
    return { reply: IN_PERSON, note: "Best answered by Nur in person" };
  }
  if (
    has(
      /\b(this (website|site|portfolio|page)|your (website|site)|(built|made|build|make) (this|the) (site|website))\b/,
    )
  ) {
    return { reply: THIS_SITE, note: "About this site, no lookup needed" };
  }
  if (
    has(
      /\b(how (do|does) (you|it|this|this agent|the agent|this bot|this demo) work|are you (an? )?(ai|bot|real|human|llm|gpt|chatgpt)|how (were|are) you (built|made)|who (made|built) you)\b|^\s*what are you\s*$/,
    )
  ) {
    return { reply: HOW_I_WORK, note: "Explaining how I work, no lookup needed" };
  }

  // Contact and hiring questions come first: they're the ones visitors act on.
  if (
    has(
      /\b(interviews?|schedule|set up a call|book a call|meet|work together|collaborat\w*|(can|could) (i|we) work with you)\b/,
    )
  )
    return call("get_contact", "interview", `topic="interview"`);
  if (
    has(
      /\b(salar\w*|ctc|compensation|expected (pay|package)|notice period|notice|start date|when can you (start|join)|join (immediately|us|soon)|immediate(ly)? join\w*|availab\w*|remote|on-?site|hybrid|relocat\w*|visa|rates?|hourly|pricing|how much do you charge)\b/,
    )
  )
    return call("get_contact", "hiring", `topic="hiring"`);
  if (
    has(
      /\b(why (should|would|hire|work with|choose)|strengths?|stand ?out|good fit|best (at|thing)|convince|different|unique|you excel|excel at|bring to)\b/,
    )
  )
    return call("get_profile", "pitch", `section="pitch"`);
  if (
    has(
      /\b(contact|e-?mail|reach|call|phone|mobile number|(your|contact) number|whatsapp|talk (to|with) (you|nur)|let s talk|hire you|get in touch|cv|resume|linkedin)\b/,
    )
  )
    return call("get_contact", null);
  if (
    has(/\b(where (are|do) you (based|live|from|located)|based in|located|location|which city|from where)\b/)
  )
    return call("get_contact", "location", `topic="location"`);
  if (
    has(
      /\b(looking for|open to|kind of (role|job|position)|next role|job search|seeking|career goals?|what roles?|freelanc\w*|contract (work|role|job)s?|part.?time|consult\w*)\b/,
    )
  )
    return call("get_profile", "roles", `section="roles"`);
  if (
    has(
      /\b(educat\w*|degree|universit\w*|studied|(did|do) you study|certif\w*|courses?|cgpa|gpa|bsc|b\.sc|school|college|graduat\w*)\b/,
    )
  )
    return call("get_education", null);

  // Named projects and companies. Open-source repos by name first, so their "live demo" isn't the OD Tracker demo.
  if (has(/\b(payments-ops\S*|redmine\S*|sms-balance\S*|nextjs-social\S*)/))
    return call("get_projects", "open_source", `domain="open_source"`);
  for (const key in DETAILS) if (has(DETAILS[key].match)) return projectDetail(key);
  if (
    has(
      /\b(open.?source|github(?! actions)|repos?|repositor\w*|code samples?|public code|portfolio|side projects?|payments-ops\S*|redmine\S*|sms-balance\S*|nextjs-social\S*|social feed)\b/,
    )
  )
    return call("get_projects", "open_source", `domain="open_source"`);
  if (has(/\b(tallykhata|progoti|fintech|payments?|bkash|nagad|rocket|npsb|merchants?|qr)\b/))
    return call("get_experience", "tallykhata", `company="TallyKhata"`);
  if (
    has(
      /\b(padakhep|microfinance|ngo|current\w*|right now|present (job|role|company)|employer|work(ing)? (now|on now)|where do you work)\b/,
    )
  )
    return call("get_experience", "padakhep", `company="Padakhep"`);
  const ml = NOT_YET.find((entry) => entry.match.test(" machine learning "));
  if (has(/\b(machine learning|ml|deep learning)\b/)) {
    return call("find_evidence", { name: "Machine learning", answer: ml.answer }, `skill="Machine learning"`);
  }
  if (
    has(
      /\b(ai|a\.i|llms?|gemini|gpt|chatgpt|openai|claude|agents?|agentic|genai|gen ai|rag|prompt\w*|artificial intelligence)\b/,
    )
  )
    return call("get_projects", "ai", `domain="ai"`);
  if (has(/\byears?\b|how long have you|\b(senior|seniority)\b|\b(your|what) level\b|your (job )?title/))
    return call("get_experience", "all", `company="all"`);
  if (has(/\b(your team|team size|how big is (your|the) team|who do you work with)\b/))
    return call("get_experience", "padakhep", `company="Padakhep"`);
  if (
    has(
      /\b(impact|biggest|proud|achievements?|accomplish\w*|results?|numbers|metrics?|largest|scale|how (big|much|many)|datasets?)\b/,
    )
  )
    return call("get_projects", "impact", `domain="impact"`);

  // Skills: every one the question names, in the order asked, up to three tool calls.
  let found = SKILLS.map((skill) => ({ skill, at: q.search(skill.match) })).filter((m) => m.at >= 0);
  found = found
    .filter((m) => !found.some((other) => other.skill.covers === m.skill.name))
    .sort((x, y) => x.at - y.at)
    .slice(0, 3);
  if (found.length) {
    return {
      calls: found.map(({ skill }) => ({
        tool: "find_evidence",
        arg: skill,
        argText: `skill="${skill.name}"`,
      })),
    };
  }
  for (const entry of NOT_YET) {
    const m = q.match(entry.match);
    if (m) {
      const name = displayName(m[0].trim());
      return call("find_evidence", { name, answer: entry.answer }, `skill="${name}"`);
    }
  }

  // "Do you know X?" for something that isn't in my profile: check, and say so honestly.
  const asked = q.match(
    /\b(?:know|use|used|using|experience (?:with|in)|worked (?:with|on)|familiar with|skilled in|proficient in|work with|good at|expert in)\s+([a-z0-9+#.]+(?:\s(?!and\b|or\b)[a-z0-9+#.]+)?)/,
  );
  if (asked) {
    const term = asked[1].replace(/\b(the|any|a|an)\b/g, " ").trim();
    if (term && !DOMAIN_WORDS.test(term) && !NOT_A_SKILL.test(term)) {
      const name = displayName(term);
      return call("find_evidence", { name }, `skill="${name}"`);
    }
  }

  // Broad topics last.
  if (has(/\b(backend|back-end|server.?side)\b/)) return call("get_projects", "backend", `domain="backend"`);
  if (has(/\b(bi|business intelligence|dashboards?|reports?|reporting|visuali\w*|analytics|charts?)\b/))
    return call("get_projects", "bi", `domain="bi"`);
  if (
    has(/\b(skills?|stack|tech|technolog\w*|tools?|toolkit|programming languages?|what do you (use|know))\b/)
  )
    return call("get_profile", "stack", `section="stack"`);
  if (has(/\b(data|engineer\w*|analyst|analysis)\b/)) return call("get_projects", "data", `domain="data"`);
  if (
    has(
      /\b(case stud\w*|projects?|portfolio|what have you (built|made|done)|your (best )?work|show me (some|your) work)\b/,
    )
  )
    return call("get_projects", "featured", `domain="featured"`);
  if (has(/\b(experience|worked|work history|jobs?|career|companies|employment|background)\b/))
    return call("get_experience", "all", `company="all"`);
  if (has(/\b(who|about (you|yourself)|yourself|introduce|what do you do|you do|your name|summary)\b/))
    return call("get_profile", null);
  if (has(/\b(more|details?|elaborate|go on|continue|example|deeper|expand)\b/)) {
    return followUp ? projectDetail(followUp) : call("get_projects", "impact", `domain="impact"`);
  }
  return null;
}
