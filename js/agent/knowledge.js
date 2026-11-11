// Everything the agent knows about me. Tools read from here; nothing is generated.

import { LINKS } from "../config.js";
import { link, list } from "../lib/html.js";

export const PROJECTS = {
  ai: [
    `<b>AI Analytics Chatbot</b> (Padakhep, live since August 2026): a Gemini-powered assistant inside our reporting dashboard. It uses function calling and agentic workflows to pick the right function, query the live database and return a chart from a plain-English question, in 5–10 seconds. 30–40 managers use it every day. ${link(LINKS.chatbotPost, "LinkedIn post")}`,
    `<b>AI-assisted engineering</b>: I build with AI coding agents such as Claude Code as a pair programmer, so I ship faster. The architecture, reviews and production decisions stay mine.`,
    `<b>n8n automation</b>: daily end-of-day microfinance reports to management, plus real-time alerts when a system or process goes down.`,
    `<b>Learning in public</b>: I write about RAG and AI agents on ${link(LINKS.linkedin, "LinkedIn")}, and completed the Multi-Agent AI Systems course (Udemy, 2026).`,
  ],
  data: [
    `<b>Branch Report Automation Engine</b>: integrated directly with the MIS through its internal REST API (no browser, no manual downloads), pulls data from all 406 branches at the same time, retries failed calls automatically, and builds a ~730K-row, 100%-accurate master report. 7 staff spent 2–3 days on it every month; now it takes under 2 hours, so it runs every week.`,
    `<b>Central PostgreSQL Data Warehouse</b> (in progress): Python ETL/ELT pipelines bringing multi-source financial data together.`,
    `<b>At TallyKhata</b>: end-to-end ETL from REST APIs and JSON into PostgreSQL for automated financial reporting.`,
  ],
  backend: [
    `<b>Overdue Tracking Platform</b>: Django REST Framework, PostgreSQL, Celery, Redis, nginx and PgBouncer, with secure authentication and REST APIs. Built solo, with Claude Code as an AI pair-programmer; it replaced SharePoint/Excel tracking for 4,000+ staff across 406 branches. Heavy pages went from 10+ seconds to under 1 second.`,
    `<b>payments-ops-monitoring</b> (open source): parallel read-only PostgreSQL metrics with baseline anomaly detection; CI tests it against a real PostgreSQL. ${link(LINKS.paymentsDemo, "Live demo")}`,
  ],
  bi: [
    `<b>Microfinance Operations Dashboard</b>: Metabase on a partitioned PostgreSQL warehouse that syncs from production every 10 minutes, replacing 10+ Excel files for 50+ executives. Tracks portfolio health, collections vs target, disbursements and zones. ${link(LINKS.metabasePost, "LinkedIn post")}`,
    `<b>KPI and fraud-detection dashboards</b> at TallyKhata (Python, SQL, Looker Studio, Google Sheets API): +80% visibility into transactions. Rebuilt on demo data so you can try it: ${link(LINKS.lookerDashboard, "open the live dashboard")}`,
    `I also use <b>Power BI</b> at Padakhep, plus Excel with Power Query.`,
  ],
  featured: [
    `<b>Overdue Tracking Platform</b>: built solo, now Padakhep's official overdue-tracking system for 4,000+ staff across 406 branches. ${link(LINKS.demoTour, "Watch the demo")}`,
    `<b>AI Analytics Chatbot</b>: plain-English questions in, charts out in 5–10 seconds, with Gemini function calling.`,
    `<b>Branch Report Automation Engine</b>: 7 staff × 2–3 days of manual work → under 2 hours, 100% accurate.`,
    `<b>Microfinance Operations Dashboard</b>: one live Metabase screen replaced 10+ Excel files for 50+ executives.`,
    `<b>Payments KPI &amp; Fraud Monitor</b>: my TallyKhata payments and fraud dashboards, rebuilt in Looker Studio on demo data. ${link(LINKS.lookerDashboard, "Open the live dashboard")}`,
    `Ask about any of them for the full story.`,
  ],
  proof: [
    `<b>Live dashboard you can click through</b>: the Payments KPI &amp; Fraud Monitor, my TallyKhata payments and fraud dashboards rebuilt in Looker Studio on demo data. ${link(LINKS.lookerDashboard, "Open the live dashboard")}`,
    `<b>Demo videos</b> of the Overdue Tracking Platform, which 4,000+ staff use across 406 branches (demo data): ${link(LINKS.demoTour, "full tour")}, ${link(LINKS.demoMobile, "mobile")}, ${link(LINKS.demoReporting, "reporting dashboard")}.`,
    `<b>LinkedIn posts</b> on the ${link(LINKS.chatbotPost, "AI Analytics Chatbot")} and the ${link(LINKS.metabasePost, "Microfinance Operations Dashboard")}.`,
    `<b>Open-source code</b> on ${link(LINKS.github, "GitHub")}, with tests in CI.`,
  ],
  impact: [
    `<b>406 branches, 4,000+ users</b> on the Overdue Tracking Platform I built solo: 10–15K visits and ৳2–3 million in borrower collections recorded every day.`,
    `<b>Instant collections</b>: field collections used to reach head office the same evening. Now they arrive the moment they're posted, and a report takes 1 minute instead of 30.`,
    `<b>2–3 days → under 2 hours</b> for a ~730K-row branch report, with 100% accuracy. It now runs every week instead of once a month.`,
    `<b>Hours → 5–10 seconds</b> for a new chart, with my Gemini analytics chatbot.`,
    `<b>10+ Excel files → 1 live dashboard</b> that 50+ executives use regularly.`,
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
  // Before "overdue", so "dashboard demo" opens this rather than the OD Tracker videos.
  payments: {
    title: "Payments KPI & Fraud Monitor",
    match:
      /looker|data studio|fraud[- ](detection|dashboards?|monitor\w*|rules?|radar|alerts?)|kpi dashboards?|payments? (kpi|dashboards?|monitor\w*)|live dashboards?|dashboard (demo|link|url)|demo dashboards?|interactive dashboards?|tallykhata dashboards?/,
    html: `<p><b>Payments KPI &amp; Fraud Monitor</b>: at TallyKhata I built KPI and fraud-detection dashboards on live production data, which improved financial and transaction visibility by <b>80%</b>. I rebuilt them in Looker Studio on demo data, so you can click through them: ${link(LINKS.lookerDashboard, "open the live dashboard")}.</p>${list(
      [
        "<b>How it worked at TallyKhata</b>: Python and SQL pulled the numbers from the production databases, and the Google Sheets API fed them to Looker Studio.",
        "<b>Payments Pulse</b>: transactions, value, success rate and failures by provider (bKash, Nagad, Rocket, NPSB and cards), the top reasons payments fail, and an hourly radar that flags outages against the usual level.",
        "<b>Fraud Radar</b>: five detection rules, how many alerts each one raises, how many turn out to be real fraud, the amount blocked and how fast alerts get reviewed.",
        "<b>Demo data</b>: synthetic, 60 days, generated with Python. No real customer data.",
      ],
    )}<p>It's also on this page: <a href="#live-dashboard">see the dashboard card</a>.</p>`,
  },
  overdue: {
    title: "Overdue Tracking Platform",
    match:
      /overdue|tracking platform|loan tracking|od tracker|od monitor|\bdemos?\b|\bvideos?\b|in action|mobile (app|version)|reporting dashboard|borrowers?|collections? (entry|entries|posting)|(loan|overdue) recovery|recovery rate|karwan|sharepoint|\bpilot\b|roll.?out/,
    html: `<p><b>Overdue Tracking Platform</b> (OD Tracker 2.0, Padakhep): I built it solo, and it's now Padakhep's official overdue-tracking system, used daily by <b>4,000+ staff across 406 branches</b>.</p>${list(
      [
        "<b>The problem</b>: overdue loans lived in one Excel file on SharePoint. Field staff walked back to the office to enter collections, everyone opened the same file in the evening, entries had no timestamp, and typed text broke the dropdown columns.",
        "<b>Timeline</b>: started in October 2025, core built in about a month, pilot live in the Karwan Bazar branch in January 2026, about 2 months of monitoring the pilot, then rolled out to all 406 branches in batches. I still ship new features and fixes.",
        "<b>Who did what</b>: I designed, built and run it solo. Padakhep's ICT team set up the server; I handle everything from staging to production.",
        "<b>Built with</b> Django REST Framework and PostgreSQL, Celery and Redis for background jobs and caching, PgBouncer, nginx and Docker, with secure authentication and REST API integration.",
        "<b>Hardest part</b>: version one was plain Django with no pagination or caching, and heavy pages took 10+ seconds. I moved the APIs to Django REST Framework and added pagination, Redis caching, database indexes, nginx and PgBouncer. Those pages now load in under 1 second.",
        "<b>Impact</b>: 10–15K visits and ৳2–3 million in borrower collections recorded every day. Collections reach head office the moment they're posted (before: the same evening), a report takes 1 minute instead of 30, every entry is timestamped and validated, and overdue recovery has improved noticeably. The executive team gave it a big round of applause.",
        "<b>Covers</b> overdue member entries, recovery actions up an 8-step ladder from first notice to court case, field visits, approvals and reports, with role-based access from field officer to head office.",
        "<b>Also</b>: a mobile version installed straight from the browser, an OD Monitor for live staff activity, and a reporting dashboard that reads a separate warehouse in under half a second.",
        "<b>Rollout</b>: I presented it to the head office executive team, piloted it in the Karwan Bazar branch, trained every staff member there (on their phones too) and collected their feedback before the wider rollout.",
        "<b>Confidential</b>: borrower and loan counts are Padakhep's internal data, so I don't share them.",
      ],
    )}<p>Demo videos (demo data): ${link(LINKS.demoTour, "full tour")}, ${link(LINKS.demoMobile, "mobile")}, ${link(LINKS.demoReporting, "reporting dashboard")} and ${link(LINKS.demoMonitor, "OD Monitor")}. Or <a href="#demo">watch them on this page</a>.</p><p>${link(LINKS.pilotPost, "The Karwan Bazar pilot on LinkedIn")}</p>`,
  },
  report: {
    title: "Branch Report Automation Engine",
    match:
      /branch report|report automation|automation engine|master report|730k|monthly report|weekly report|threadpool|xlsxwriter|exponential backoff/,
    html: `<p><b>Branch Report Automation Engine</b> (Padakhep): the full-month branch report, the month's source of truth, took <b>7 staff 2–3 days</b>. Now it runs in <b>under 2 hours</b>, 100% accurate, so we get it every week instead of once a month.</p>${list(
      [
        "<b>Before</b>: staff downloaded all 406 branches one by one from the MIS portal (region-wide downloads were too big), then pasted them into one sheet. Reports came late, and weekly monitoring was impossible.",
        "<b>Timeline</b>: version one (November 2025) drove the portal in a browser with Selenium. In February 2026 I rebuilt it solo in about a week. It's now integrated directly with the MIS through its internal REST API: no browser, no manual downloads.",
        "<b>Exact output</b>: it rebuilds the portal's 89-column report logic (multi-loan rows, subtotals and totals), so the file matches a manual export cell for cell.",
        "<b>Speed and reliability</b>: 10–14 parallel workers (Python ThreadPoolExecutor), exponential backoff on rate limits and timeouts plus a final retry pass, oversized branches split into smaller batches automatically, and atomic writes with resume, so a crash or network drop loses nothing.",
        "<b>Consolidation</b>: streams ~730K rows into one Excel workbook with xlsxwriter at constant memory, about 4.4× faster than before, keeping leading-zero IDs as text and money as numbers.",
        "<b>Proof it's right</b>: every run checks serial continuity, leftover subtotal or blank rows, and the row count against an audit sheet. Totals are matched with the MIS summary report.",
        "<b>Where it runs</b>: on the server, as a feature inside OD Tracker 2.0. Authorized staff pick a date range and download the Excel file.",
        "<b>Impact</b>: gave 7 staff back 2–3 days every month, so they now finish their other important work early.",
      ],
    )}`,
  },
  chatbot: {
    title: "AI Analytics Chatbot",
    match:
      /chat ?bot|analytics assistant|ai assistant|function.?calling|banglish|text.?to.?sql|nl2sql|natural language (report|quer)/,
    html: `<p><b>AI Analytics Chatbot</b> (Padakhep, live since August 2026): managers ask for a report in plain English or Banglish and get the chart back in <b>5–10 seconds</b>, with no SQL. Before, a new report went from the manager to my boss to me, and took hours, sometimes a day.</p>${list(
      [
        "<b>Built</b> solo in about a month, on Gemini Flash, inside the OD Tracker 2.0 reporting dashboard. Charts are drawn with Chart.js.",
        "<b>How it stays accurate</b>: the model never writes SQL. Function calling picks one of 12 well-defined functions, such as get_revenue(period, group_by), queries the live database and returns the chart. The screen shows which function ran, so every answer can be checked.",
        "<b>Unclear question?</b> It asks back instead of guessing.",
        "<b>Data security</b>: each manager sees only the branches in their own scope. My Django code enforces that from the logged-in user, so the AI can't get around it.",
        "<b>Usage</b>: 30–40 managers a day, up to about 5 charts each. It keeps improving from their feedback, and new functions are added as needs come in.",
        "<b>Example</b>: “I want to see last month's revenue report in a bar chart, day wise” returns a daily bar chart.",
        "This portfolio agent works the same way: the AI picks tools, and the facts come only from real data.",
      ],
    )}<p>${link(LINKS.chatbotPost, "See it on LinkedIn")}</p>`,
  },
  metabase: {
    title: "Microfinance Operations Dashboard",
    match: /metabase|operations dashboard|microfinance dashboard|executive dashboard/,
    html: `<p><b>Microfinance Operations Dashboard</b> (Padakhep, live since June 2026): one live Metabase screen replaced <b>10+ Excel files</b>, and <b>50+ executives</b> use it regularly.</p>${list(
      [
        "<b>Before</b>: reports were built by hand in Excel after the data came in, so nobody saw the real picture until someone finished the sheet.",
        "<b>Built</b> solo in about a month. Metabase reads my PostgreSQL data warehouse, which custom Python ETL syncs from the production database every 10 minutes. Plain SQL sits behind every chart.",
        "<b>Design choices</b>: the dashboard never touches the production database, so dozens of executives can't slow down the live system. Big tables are partitioned, so queries scan only the slices they need. It runs on a Linux server I manage, with role-based access.",
        "<b>Tracks</b> portfolio health, collections against target, disbursement trends and zone performance.",
        "<b>Why Metabase</b>: it's open source and self-hosted, so financial data stays on our own server and 50+ viewers need no per-user licence. It connects straight to PostgreSQL. I use Power BI too, for other reporting.",
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
      "Built the Overdue Tracking Platform solo, with Claude Code as an AI pair-programmer: Padakhep's official overdue system for 4,000+ users across 406 branches; heavy pages went from 10+ seconds to under 1 second",
      "Gemini-powered analytics chatbot: 30–40 managers a day get charts in 5–10 seconds",
      "730K-row branch report automated: 2–3 days → under 2 hours, now weekly",
      "Partitioned PostgreSQL warehouse synced every 10 minutes, with a Metabase dashboard for 50+ executives; plus n8n automation",
    ],
  )}`,
  tallykhata: `<p><b>Junior Engineer</b> (Jun 2024 – Jul 2025) and <b>Product Engineer Intern</b> (Mar – May 2024) at Progoti Systems Limited (TallyKhata), a fintech.</p>${list(
    [
      "Supported Bangla QR payments for 100K+ merchants across NPSB, bKash, Rocket and 30+ banks",
      "Resolved payment disputes on live PostgreSQL/MySQL production data, and automated routine ones",
      "KPI and fraud dashboards (+80% visibility); monitoring and alerting (−40% downtime)",
    ],
  )}<p>The dashboards, rebuilt on demo data: ${link(LINKS.lookerDashboard, "open the live dashboard")}.</p>`,
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
    evidence: [
      "Background and scheduled jobs for the Overdue Tracking Platform",
      "Redis caching, with pagination and indexes, took heavy pages from 10+ seconds to under 1 second",
    ],
  },
  {
    match: /\bapis?\b|\brest(ful)?\b(?! framework)|endpoints?|integrations?\b/,
    name: "REST APIs",
    more: "report",
    evidence: [
      "Built REST APIs with Django REST Framework for the Overdue Tracking Platform",
      "Branch report automation is integrated directly with the MIS through its internal REST API, pulling 406 branches in parallel",
      "ETL from REST APIs and JSON into PostgreSQL at TallyKhata",
    ],
  },
  {
    match: /power ?bi/,
    name: "Power BI",
    more: "metabase",
    evidence: [
      "Used at Padakhep for reporting",
      "For the executive dashboard I chose Metabase instead: self-hosted, so data stays on our server, and no per-user licence for 50+ viewers",
      "Plus Looker Studio dashboards in production",
    ],
  },
  {
    match: /looker|data studio/,
    name: "Looker Studio",
    more: "payments",
    evidence: [
      "KPI and fraud-detection dashboards at TallyKhata (+80% visibility)",
      `Rebuilt on demo data so you can try it: ${link(LINKS.lookerDashboard, "the live Payments KPI &amp; Fraud Monitor")}`,
    ],
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
    match: /nginx|pgbouncer|connection pool\w*|load balanc\w*|gunicorn/,
    name: "nginx & PgBouncer",
    more: "overdue",
    evidence: [
      "OD Tracker 2.0 runs behind nginx (HTTPS, static files, load balancing) across two Django app servers on Gunicorn",
      "PgBouncer pools the PostgreSQL connections",
    ],
  },
  {
    match: /system design|architect\w*|scalab\w*|scaling|high availability/,
    name: "System design",
    more: "overdue",
    evidence: [
      "OD Tracker 2.0: nginx in front of two Django app servers, PgBouncer, Redis caching, Celery workers and a separate reporting warehouse; heavy pages went from 10+ seconds to under 1 second",
      "Branch report engine: 10–14 parallel workers across 406 branches, exponential backoff, automatic batch splitting, and atomic writes with resume",
      "AI chatbot: the model can only call 12 well-defined functions, and data scope is enforced in Django, not by the AI",
    ],
  },
  {
    match: /\bpwa\b|progressive web app|responsive|mobile[- ]first/,
    name: "Mobile web (PWA)",
    more: "overdue",
    evidence: [
      "OD Tracker 2.0 installs on phones straight from the browser: thumb-first navigation, loan cards and photo proof",
    ],
  },
  {
    match: /database|\bdbs?\b|dbms|schema|indexing|data model\w*/,
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
      "My Gemini analytics chatbot draws its charts with Chart.js",
      "The live payments-ops-monitoring dashboard is built with Chart.js, and CI rebuilds it on every push",
    ],
  },
  {
    match: /google sheets|sheets api|gsheets/,
    name: "Google Sheets API",
    covers: "REST APIs",
    more: "payments",
    evidence: [
      "KPI and fraud-detection dashboards at TallyKhata used the Google Sheets API with Python and SQL (+80% visibility)",
      `Rebuilt on demo data: ${link(LINKS.lookerDashboard, "open the live dashboard")}`,
    ],
  },
  {
    match: /fraud/,
    name: "Fraud monitoring",
    more: "payments",
    evidence: [
      "Built fraud-detection dashboards on live production data at TallyKhata",
      "Real-time alerts for service health and financial thresholds (−40% downtime)",
      `Rebuilt on demo data: ${link(LINKS.lookerDashboard, "open the live Fraud Radar")}`,
    ],
  },
  {
    match: /beautiful ?soup|bs4|openpyxl|middleware|sessions?\b|caching|cache\b|\bauth\w*/,
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
      "Version one of my branch report engine drove the MIS portal with Selenium, before I rebuilt it on the API",
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
      "OD Tracker 2.0: heavy pages from 10+ seconds to under 1 second with Django REST Framework, pagination, Redis caching and indexes",
      "Streaming ~730K rows into one Excel workbook at constant memory, about 4.4× faster",
      "PostgreSQL partitioning behind the operations dashboard",
      "Indexing and query optimization on production databases",
    ],
  },
  {
    match: /quality|accura\w*|validat\w*|reliab\w*/,
    name: "Data quality",
    more: "report",
    evidence: [
      "Every branch report run checks serial continuity, leftover subtotal or blank rows, and the row count against an audit sheet; totals are matched with the MIS summary report",
      "Self-healing retries recover failed pulls automatically",
      "OD Tracker 2.0 replaced free-text Excel entries with validated, timestamped records",
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
    match: /claude|copilot|cursor\b|ai.?assisted|ai coding|pair.?program\w*|vibe.?cod\w*/,
    name: "AI-assisted engineering",
    more: "overdue",
    evidence: [
      "I build with AI coding agents such as Claude Code as a pair programmer, so I ship faster",
      "The architecture, code reviews and every production decision are mine, and I can walk through any part of the code",
      "Built OD Tracker 2.0 solo this way: in production for 4,000+ users across 406 branches",
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
    match: /micro-?services?/,
    answer:
      "Not as separate microservices yet. OD Tracker 2.0 is one Django app behind nginx, with Celery workers, Redis and a separate reporting warehouse, and it serves 4,000+ users.",
  },
  {
    match:
      /tensorflow|pytorch|keras|scikit|sklearn|deep learning|computer vision|\bnlp\b|machine learning|\bml\b/,
    answer:
      "I studied machine learning with Python at BASIS (BITM). My real AI work is with large language models: function calling and agentic workflows. I haven't used this one in a real project yet.",
  },
];

export const STACK = `<p>My main tools:</p>${list([
  "<b>Programming &amp; Backend</b>: Python, SQL, Django, Django ORM, JavaScript, REST APIs, auth, middleware, sessions, caching, Django REST Framework, Celery, nginx, PgBouncer",
  "<b>Databases &amp; Warehousing</b>: PostgreSQL, MySQL, BigQuery, Redis, query optimization, indexing, schema design",
  "<b>Data Engineering &amp; ETL</b>: ETL/ELT pipelines, data warehousing, Pandas, OpenPyXL, data validation, Google Sheets API, Excel (Power Query, pivot tables, XLOOKUP)",
  "<b>AI Integration &amp; Agents</b>: Gemini API, LLM integration, agentic workflows, n8n, Claude Code (AI-assisted development)",
  "<b>Automation &amp; Web Scraping</b>: Python automation, multithreading, Selenium, Playwright, BeautifulSoup, headless browsers",
  "<b>BI &amp; Visualization</b>: Power BI, Metabase, Looker Studio, Chart.js",
  "<b>DevOps &amp; Testing</b>: Docker, Gunicorn, Git, GitHub, Postman, JMeter, Linux, GitHub Actions",
  "<b>Domain</b>: fintech, digital payments, microfinance MIS, fraud monitoring",
])}<p>Ask about any one of them and I'll show where I used it.</p>`;
