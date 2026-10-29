// Everything the agent knows about me. Tools read from here; nothing is generated.

import { LINKS } from "../config.js";
import { link, list } from "../lib/html.js";

export const PROJECTS = {
  ai: [
    `<b>AI Analytics Chatbot</b> (Padakhep, 2026): a Gemini-powered assistant inside our reporting dashboard. It uses function calling and agentic workflows to pick the right function, query the live database and return a chart from a plain-English question. ${link(LINKS.chatbotPost, "LinkedIn post")}`,
    `<b>n8n automation</b>: daily end-of-day microfinance reports to management, plus real-time alerts when a system or process goes down.`,
    `<b>Learning in public</b>: I write about RAG and AI agents on ${link(LINKS.linkedin, "LinkedIn")}, and completed the Multi-Agent AI Systems course (Udemy, 2026).`,
  ],
  data: [
    `<b>Branch Report Automation Engine</b>: pulls data from all 406 branches at the same time, retries failed calls automatically, and builds a ~730K-row, 100%-accurate master report. 2–3 days of work now takes under 2 hours.`,
    `<b>Central PostgreSQL Data Warehouse</b> (in progress): Python ETL/ELT pipelines bringing multi-source financial data together.`,
    `<b>At TallyKhata</b>: end-to-end ETL from REST APIs and JSON into PostgreSQL for automated financial reporting.`,
  ],
  backend: [
    `<b>Overdue Tracking Platform</b>: Django REST Framework, PostgreSQL, Celery and Redis, with secure authentication and REST APIs. Used by 4,000+ staff across 406 branches.`,
    `<b>payments-ops-monitoring</b> (open source): parallel read-only PostgreSQL metrics with baseline anomaly detection; CI tests it against a real PostgreSQL. ${link(LINKS.paymentsDemo, "Live demo")}`,
  ],
  bi: [
    `<b>Microfinance Operations Dashboard</b>: Metabase on a partitioned PostgreSQL backend with Python ETL, replacing 10+ Excel files. Tracks portfolio health, collections vs target, disbursements and zones. ${link(LINKS.metabasePost, "LinkedIn post")}`,
    `<b>KPI and fraud-detection dashboards</b> at TallyKhata (Python, SQL, Looker Studio, Google Sheets API): +80% visibility into transactions.`,
    `I also use <b>Power BI</b> at Padakhep, plus Excel with Power Query.`,
  ],
  featured: [
    `<b>Overdue Tracking Platform</b>: Django platform used by 4,000+ staff across 406 branches.`,
    `<b>AI Analytics Chatbot</b>: plain-English questions in, charts out, with Gemini function calling.`,
    `<b>Branch Report Automation Engine</b>: 2–3 days of manual work → under 2 hours, 100% accurate.`,
    `<b>Microfinance Operations Dashboard</b>: one live Metabase screen replaced 10+ Excel files.`,
    `Ask about any of them for the full story.`,
  ],
  impact: [
    `<b>406 branches, 4,000+ users</b> on the Overdue Tracking Platform I built.`,
    `<b>2–3 days → under 2 hours</b> for a ~730K-row branch report, with 100% accuracy.`,
    `<b>10+ Excel files → 1 live dashboard</b> for management.`,
    `<b>−40% downtime</b> from monitoring and alerting at TallyKhata, and <b>+80%</b> visibility from KPI dashboards.`,
  ],
  open_source: [
    `${link(LINKS.paymentsDemo, "payments-ops-monitoring")}: payments metrics, anomaly alerts, live dashboard built by CI.`,
    `${link(LINKS.redmineDemo, "redmine-issue-reporter")}: weekly support reports from the Redmine API with Pandas and Jinja2.`,
    `${link(LINKS.github + "/sms-balance-monitor", "sms-balance-monitor")}: a Selenium bot with browser tests in CI.`,
    `${link(LINKS.github + "/nextjs-social-feed", "nextjs-social-feed")}: full-stack Next.js and Prisma.`,
  ],
};

// One project in depth, for get_projects({ name }).
export const DETAILS = {
  overdue: {
    title: "Overdue Tracking Platform",
    match: /overdue|tracking platform|loan tracking/,
    html: `<p><b>Overdue Tracking Platform</b> (Padakhep): one platform instead of manual Excel tracking, used daily by <b>4,000+ staff across 406 branches</b>.</p>${list(
      [
        "<b>Built with</b> Django REST Framework and PostgreSQL, Celery and Redis for background jobs, secure authentication and REST API integration.",
        "<b>Covers</b> overdue member entries and actions, field visits, legal actions and reports.",
        "<b>Rollout</b>: I presented it to the head office executive team, piloted it in the Karwan Bazar branch, trained every staff member there (on their phones too) and collected their feedback before the wider rollout.",
      ],
    )}<p><a href="#demo">Watch the demo</a> · ${link(LINKS.pilotPost, "The Karwan Bazar pilot on LinkedIn")}</p>`,
  },
  report: {
    title: "Branch Report Automation Engine",
    match: /branch report|report automation|automation engine|master report|730k/,
    html: `<p><b>Branch Report Automation Engine</b> (Padakhep): a report that took <b>2–3 days</b> of manual work now runs in <b>under 2 hours</b>, with 100% accuracy.</p>${list(
      [
        "Python calls the REST APIs of all 406 branches at the same time.",
        "If a branch call fails, it retries automatically. At this scale, some calls always fail.",
        "Every result is checked, then merged into a ~730K-row master report.",
      ],
    )}`,
  },
  chatbot: {
    title: "AI Analytics Chatbot",
    match: /chat ?bot|analytics assistant|ai assistant/,
    html: `<p><b>AI Analytics Chatbot</b> (Padakhep, 2026): anyone in the organisation asks for a report in plain English and gets the chart back in seconds, with no SQL.</p>${list(
      [
        "Gemini-powered, inside the reporting dashboard.",
        "Function calling and agentic workflows pick the right function, query the live database and return the chart.",
        "The model never writes free-form SQL. It chooses from well-defined tools, which keeps answers accurate and safe. This agent works the same way.",
      ],
    )}<p>${link(LINKS.chatbotPost, "See it on LinkedIn")}</p>`,
  },
  metabase: {
    title: "Microfinance Operations Dashboard",
    match: /metabase|operations dashboard|microfinance dashboard/,
    html: `<p><b>Microfinance Operations Dashboard</b> (Padakhep): one live screen replaced <b>10+ Excel files</b> for management.</p>${list(
      [
        "Metabase on a partitioned PostgreSQL backend, fed by custom Python ETL.",
        "Runs on a self-managed Linux server, with role-based access and auto-refresh.",
        "Tracks portfolio health, collections against target, disbursement trends and zone performance.",
      ],
    )}<p>${link(LINKS.metabasePost, "See it on LinkedIn")}</p>`,
  },
  warehouse: {
    title: "Central PostgreSQL Data Warehouse",
    match: /central .*warehouse|warehouse project|the (data )?warehouse/,
    html: `<p><b>Central PostgreSQL Data Warehouse</b> (Padakhep, in progress): Python ETL/ELT pipelines bringing multi-source financial data into one warehouse for analytics and automated reporting.</p>`,
  },
};

export const EXPERIENCE = {
  padakhep: `<p><b>Data, BI &amp; Automation Engineer</b> at Padakhep Manabik Unnayan Kendra (microfinance NGO, Analytics &amp; Digital Transformation Team), Aug 2025 – present.</p>${list(
    [
      "Overdue Tracking Platform for 4,000+ users across 406 branches",
      "Gemini-powered analytics chatbot",
      "730K-row branch report automated: 2–3 days → under 2 hours",
      "PostgreSQL data warehouse and n8n automation",
    ],
  )}`,
  tallykhata: `<p><b>Junior Engineer</b> (Jun 2024 – Jul 2025) and <b>Product Engineer Intern</b> (Mar – May 2024) at Progoti Systems Limited (TallyKhata), a fintech.</p>${list(
    [
      "Supported Bangla QR payments for 100K+ merchants across NPSB, bKash, Rocket and 30+ banks",
      "Resolved payment disputes on live PostgreSQL/MySQL production data, and automated routine ones",
      "KPI and fraud dashboards (+80% visibility); monitoring and alerting (−40% downtime)",
    ],
  )}`,
};

// Skills with evidence. `more` is the project a follow-up ("tell me more") opens;
// `covers` drops a broader skill when this narrower one already answers the question.
export const SKILLS = [
  {
    match: /postgres/,
    name: "PostgreSQL",
    more: "overdue",
    evidence: [
      "Production database behind the Overdue Tracking Platform",
      "Partitioned PostgreSQL backend for the Metabase dashboard",
      "Building a central PostgreSQL data warehouse",
      "Live production data for payment disputes at TallyKhata",
    ],
  },
  {
    match: /django|drf|rest framework/,
    name: "Django & DRF",
    more: "overdue",
    evidence: [
      "Built the Overdue Tracking Platform on Django REST Framework (4,000+ users)",
      "Secure authentication and REST API integration",
      "Celery and Redis for background jobs",
    ],
  },
  {
    match: /celery|redis|background jobs?|queues?\b/,
    name: "Celery & Redis",
    more: "overdue",
    evidence: ["Background and scheduled jobs for the Overdue Tracking Platform"],
  },
  {
    match: /\bapis?\b|\brest(ful)?\b(?! framework)|endpoints?|integrations?\b/,
    name: "REST APIs",
    more: "report",
    evidence: [
      "Built REST APIs with Django REST Framework for the Overdue Tracking Platform",
      "Branch report automation calls all 406 branch APIs in parallel",
      "ETL from REST APIs and JSON into PostgreSQL at TallyKhata",
    ],
  },
  {
    match: /power ?bi/,
    name: "Power BI",
    more: "metabase",
    evidence: ["Used at Padakhep for reporting", "Plus Metabase and Looker Studio dashboards in production"],
  },
  {
    match: /looker|data studio/,
    name: "Looker Studio",
    evidence: ["KPI and fraud-detection dashboards at TallyKhata (+80% visibility)"],
  },
  {
    match: /bigquery/,
    name: "BigQuery",
    evidence: ["Part of my data toolkit alongside PostgreSQL and MySQL"],
  },
  {
    match: /mysql/,
    name: "MySQL",
    evidence: ["Live production data for payment investigations at TallyKhata"],
  },
  {
    match: /database|\bdbs?\b|dbms|schema|indexing/,
    name: "Databases",
    more: "metabase",
    evidence: [
      "PostgreSQL in production: the Overdue Tracking Platform, a partitioned BI backend and a central data warehouse",
      "PostgreSQL and MySQL production data at TallyKhata",
      "BigQuery for analytics",
      "Schema design, indexing and query optimization",
    ],
  },
  {
    match: /docker|containers?\b/,
    name: "Docker",
    evidence: ["My open-source projects ship with Docker; CI runs them against a real PostgreSQL service"],
  },
  {
    match: /\bgit\b|github actions|ci\/cd|\bci\b|devops/,
    name: "Git & CI/CD",
    evidence: [
      "GitHub Actions on every public repo: lint, tests, secret scanning",
      "CI builds and deploys my live demo dashboards",
    ],
  },
  {
    match: /chart\.?js/,
    name: "Chart.js",
    covers: "JavaScript & Next.js",
    evidence: [
      "The live payments-ops-monitoring dashboard is built with Chart.js, and CI rebuilds it on every push",
    ],
  },
  {
    match: /google sheets|sheets api|gsheets/,
    name: "Google Sheets API",
    covers: "REST APIs",
    evidence: [
      "KPI and fraud-detection dashboards at TallyKhata used the Google Sheets API with Python and SQL (+80% visibility)",
    ],
  },
  {
    match: /fraud/,
    name: "Fraud monitoring",
    evidence: [
      "Built fraud-detection dashboards on live production data at TallyKhata",
      "Real-time alerts for service health and financial thresholds (−40% downtime)",
    ],
  },
  {
    match: /beautiful ?soup|bs4|openpyxl|gunicorn|middleware|sessions?\b|caching|cache\b|\bauth\w*/,
    name: "Python & Django toolkit",
    more: "overdue",
    evidence: [
      "Secure authentication on the Overdue Tracking Platform (Django)",
      "Django middleware, sessions and caching, with Gunicorn and Docker for deployment",
      "BeautifulSoup for web scraping and OpenPyXL for Excel files in my Python automation",
    ],
  },
  {
    match: /selenium|playwright|scrap\w*|\bbots?\b|web automation|headless/,
    name: "Browser automation",
    evidence: [
      "sms-balance-monitor: a Selenium bot handling OTP and pop-ups",
      "API and load testing with Postman, JMeter and Selenium at TallyKhata",
    ],
  },
  {
    match: /\btest(s|ing)?\b|\bqa\b|postman|jmeter/,
    name: "Testing",
    evidence: [
      "API and load testing with Postman, JMeter and Selenium at TallyKhata",
      "Automated tests in CI on every public repo",
    ],
  },
  {
    match: /n8n|workflow automation/,
    name: "n8n",
    evidence: ["Daily management reports and real-time system alerts at Padakhep"],
  },
  {
    match: /pandas|numpy/,
    name: "Pandas",
    more: "report",
    evidence: ["Report automation and the redmine-issue-reporter project"],
  },
  {
    match: /\bexcel\b|power query|xlookup|pivot|spreadsheets?/,
    name: "Excel",
    more: "metabase",
    evidence: ["Power Query, pivot tables and XLOOKUP", "Replaced 10+ Excel files with one live dashboard"],
  },
  {
    match: /linux|ubuntu|\bservers?\b(?!-side| side)/,
    name: "Linux",
    more: "metabase",
    evidence: ["Self-managed Linux server running the Metabase dashboard"],
  },
  {
    match: /\betl\b|\belt\b|pipelines?|warehous/,
    name: "ETL & warehousing",
    more: "report",
    evidence: [
      "730K-row branch report pipeline with self-healing retries",
      "Central PostgreSQL data warehouse (in progress)",
      "ETL from REST APIs into PostgreSQL at TallyKhata",
    ],
  },
  {
    match: /multithread\w*|parallel|concurren\w*|performance|optimi[sz]\w*|speed/,
    name: "Performance & concurrency",
    more: "report",
    evidence: [
      "Parallel pulls across 406 branches: 2–3 days → under 2 hours",
      "PostgreSQL partitioning behind the operations dashboard",
      "Indexing and query optimization on production databases",
    ],
  },
  {
    match: /quality|accura\w*|validat\w*|reliab\w*/,
    name: "Data quality",
    more: "report",
    evidence: [
      "Every branch result is validated before merging, so the 730K-row report is 100% accurate",
      "Self-healing retries recover failed pulls automatically",
      "My open-source repos run tests against a real PostgreSQL in CI",
    ],
  },
  {
    match:
      /\blead\w*|stakeholders?|presentations?|\bpresent(ed|ing)?\b|\btrain(ed|ing)?\b|mentor\w*|communicat\w*|soft skills?|teamwork|team player/,
    name: "Leadership & communication",
    more: "overdue",
    evidence: [
      "Presented the Overdue Tracking Platform to Padakhep's head office executive team",
      "Ran the Karwan Bazar branch pilot: trained every staff member, including on their phones, and collected their feedback before rollout",
      "Write about AI and data engineering on LinkedIn",
    ],
  },
  {
    match: /react|next\.?js|javascript|typescript|\bjs\b|frontend|front-end|prisma/,
    name: "JavaScript & Next.js",
    evidence: [
      "nextjs-social-feed: a full-stack Next.js and Prisma app (open source)",
      "Frontend isn't my main focus. I'm strongest on data and backend.",
    ],
  },
  {
    match: /\bsql\b/,
    name: "SQL",
    evidence: [
      "Daily work on production PostgreSQL and MySQL: schema design, indexing, query optimization",
      "Every dashboard and report I build starts with SQL",
    ],
  },
  {
    match: /python/,
    name: "Python",
    more: "report",
    evidence: ["My main language: Django platform, ETL pipelines, report automation, AI chatbot, bots"],
  },
];

// Tools I haven't used in production: say so, and point to the closest real experience.
export const NOT_YET = [
  {
    match: /tableau|qlik/,
    answer:
      "Not used in a real project yet. I build dashboards every day with Power BI, Metabase and Looker Studio, so the same skills carry over.",
  },
  {
    match: /airflow|dagster|prefect|luigi/,
    answer: "Not yet. I schedule and run jobs with cron, Celery and n8n, with automatic retries and alerts.",
  },
  {
    match: /pyspark|spark|hadoop|databricks|kafka|flink/,
    answer:
      "Not used in a real project yet. My biggest job, a ~730K-row report from 406 branches, runs on Python (multithreading), Pandas and PostgreSQL.",
  },
  {
    match: /\baws\b|amazon web services|azure|\bgcp\b|google cloud|\bcloud\b/,
    answer:
      "On Google Cloud I use BigQuery, and I run my own services on Linux servers with Docker. I haven't used AWS or Azure in a real project yet.",
  },
  {
    match: /kubernetes|k8s|terraform|ansible/,
    answer:
      "Not yet. I package apps with Docker, run them on Linux servers and automate with GitHub Actions.",
  },
  {
    match: /fastapi|flask|spring|laravel/,
    answer:
      "I build my APIs with Django REST Framework, so API design, login security and background jobs are familiar. I haven't used this one in a real project yet.",
  },
  {
    match: /snowflake|redshift|\bdbt\b|synapse/,
    answer: "Not yet. I build data warehouses on PostgreSQL (one is in progress now) and use BigQuery.",
  },
  {
    match: /mongo\w*|nosql|cassandra|dynamo\w*/,
    answer: "My real projects use SQL databases (PostgreSQL and MySQL), plus Redis for job queues.",
  },
  {
    match: /langchain|llama.?index|crewai|autogen|langgraph/,
    answer:
      "I build agents directly with LLM APIs (function calling), without a framework. I also write about RAG and AI agents on LinkedIn.",
  },
  {
    match: /tensorflow|pytorch|keras|scikit|sklearn|deep learning|computer vision|\bnlp\b/,
    answer:
      "I studied machine learning with Python at BASIS (BITM). My real AI work is with large language models: function calling and agentic workflows. I haven't used this one in a real project yet.",
  },
];

export const STACK = `<p>My main tools:</p>${list([
  "<b>Programming &amp; Backend</b>: Python, SQL, Django, Django ORM, JavaScript, REST APIs, auth, middleware, sessions, caching",
  "<b>Databases &amp; Warehousing</b>: PostgreSQL, MySQL, BigQuery, Redis, query optimization, indexing, schema design",
  "<b>Data Engineering &amp; ETL</b>: ETL/ELT pipelines, data warehousing, Pandas, OpenPyXL, data validation, Google Sheets API",
  "<b>AI Integration &amp; Agents</b>: LLM APIs, LLM integration, agentic workflows, n8n",
  "<b>Automation &amp; Web Scraping</b>: Python automation, multithreading, Selenium, Playwright, BeautifulSoup, headless browsers",
  "<b>BI &amp; Visualization</b>: Power BI, Metabase, Looker Studio, Chart.js",
  "<b>DevOps &amp; Testing</b>: Docker, Gunicorn, Git, GitHub, Postman, JMeter",
  "<b>Domain</b>: fintech, digital payments, microfinance MIS, fraud monitoring",
])}<p>Ask about any one of them and I'll show where I used it.</p>`;
