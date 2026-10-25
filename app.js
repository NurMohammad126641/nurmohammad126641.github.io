(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EMAIL = "rabbins.eng@gmail.com";
  const PHONE = "+880 1904-271946", TEL = "tel:+8801904271946";
  const CV = "assets/Nur-Mohammad-Siddiq-CV.pdf";
  const WA = "https://wa.me/8801904271946?text=Hi%20Nur%2C%20I%20saw%20your%20portfolio";
  const LINKS = {
    linkedin: "https://www.linkedin.com/in/nur-mohammad-siddiq-9a73931b6",
    github: "https://github.com/NurMohammad126641",
    chatbotPost: "https://www.linkedin.com/posts/nur-mohammad-siddiq-9a73931b6_ai-dataanalytics-gemini-activity-7502234845067227136-it21",
    metabasePost: "https://www.linkedin.com/posts/nur-mohammad-siddiq-9a73931b6_metabase-dataengineering-businessintelligence-activity-7467101477631868928-ZS6i",
    pilotPost: "https://www.linkedin.com/posts/nur-mohammad-siddiq-9a73931b6_from-idea-to-impact-field-tested-at-padakhep-activity-7417498070814339072-PMF2",
    paymentsDemo: "https://nurmohammad126641.github.io/payments-ops-monitoring/",
    redmineDemo: "https://nurmohammad126641.github.io/redmine-issue-reporter/",
  };
  const a = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;

  /* ---------- Theme ---------- */
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) { /* storage may be blocked */ }
  }
  const toggleTheme = () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
  $("#theme-toggle").addEventListener("click", toggleTheme);

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------- Active section: top nav links + phone bottom bar ---------- */
  const navLinks = $$(".nav-links a"), dockLinks = $$(".dock a");
  const DOCK_FOR = { hero: "top", work: "work", "open-source": "work", agent: "agent", experience: "experience", stack: "experience", writing: "contact", contact: "contact" };
  function setActive(id) {
    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
    const d = DOCK_FOR[id];
    if (d) dockLinks.forEach((l) => l.classList.toggle("active", l.dataset.sec === d));
  }
  // The active section is the one crossing 45% of the screen height.
  const spySections = $$(".hero, #work, #open-source, #agent, #experience, #stack, #writing, #contact");
  let spyQueued = false;
  function spy() {
    spyQueued = false;
    const line = innerHeight * 0.45;
    let current = spySections[0];
    spySections.forEach((s) => { if (s.getBoundingClientRect().top <= line) current = s; });
    setActive(current.id || "hero");
  }
  addEventListener("scroll", () => { if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); } }, { passive: true });
  spy();

  /* ---------- Phones: collapse long stories, hide bottom bar while typing ---------- */
  if (matchMedia("(max-width: 900px)").matches) {
    $$("details.story, details.tools-details").forEach((d) => { d.open = false; });
  }
  // The bar stays out of the way on the first screen and slides in once you scroll.
  const scrolled = () => document.body.classList.toggle("scrolled", scrollY >= 140);
  scrolled();
  addEventListener("scroll", scrolled, { passive: true });
  document.addEventListener("focusin", (e) => { if (e.target.matches("input, textarea")) document.body.classList.add("typing"); });
  document.addEventListener("focusout", (e) => { if (e.target.matches("input, textarea")) document.body.classList.remove("typing"); });

  /* ---------- Cursor spotlight on cards ---------- */
  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    $$(".case, .mini, .repo, .post, .stack-col, .agent-tools, .about-card").forEach((el) => {
      el.classList.add("spot");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
      el.addEventListener("pointerleave", () => { el.style.removeProperty("--mx"); el.style.removeProperty("--my"); });
    });
  }

  /* ---------- Copy email ---------- */
  async function copyEmail() {
    const out = $("#copied");
    try { await navigator.clipboard.writeText(EMAIL); out.textContent = "Copied " + EMAIL; }
    catch (e) { out.textContent = EMAIL; }
    setTimeout(() => { out.textContent = ""; }, 3500);
  }
  $("#copy-email").addEventListener("click", copyEmail);

  /* ---------- Command palette ---------- */
  const palette = $("#palette"), pq = $("#palette-q"), plist = $("#palette-list");
  const go = (id) => () => document.getElementById(id).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  const COMMANDS = [
    { label: "Ask my AI agent", hint: "Section", run: () => { go("agent")(); setTimeout(() => $("#agent-q").focus({ preventScroll: true }), 500); } },
    { label: "Selected work", hint: "Section", run: go("work") },
    { label: "Open source", hint: "Section", run: go("open-source") },
    { label: "Experience", hint: "Section", run: go("experience") },
    { label: "Stack", hint: "Section", run: go("stack") },
    { label: "Writing", hint: "Section", run: go("writing") },
    { label: "Contact", hint: "Section", run: go("contact") },
    { label: "Copy my email", hint: "Action", run: () => { go("contact")(); copyEmail(); } },
    { label: "Download my CV", hint: "Action", run: () => { const l = document.createElement("a"); l.href = CV; l.download = ""; document.body.appendChild(l); l.click(); l.remove(); } },
    { label: "Email me", hint: "Action", run: () => { location.href = "mailto:" + EMAIL; } },
    { label: "Call me", hint: PHONE, run: () => { location.href = TEL; } },
    { label: "Message me on WhatsApp", hint: "Link", run: () => window.open(WA, "_blank", "noopener") },
    { label: "Open LinkedIn", hint: "Link", run: () => window.open(LINKS.linkedin, "_blank", "noopener") },
    { label: "Open GitHub", hint: "Link", run: () => window.open(LINKS.github, "_blank", "noopener") },
    { label: "Open live demo: payments monitoring", hint: "Link", run: () => window.open(LINKS.paymentsDemo, "_blank", "noopener") },
    { label: "Switch light / dark theme", hint: "Action", run: toggleTheme },
  ];
  let filtered = COMMANDS, sel = 0, lastFocus = null;
  function renderPalette() {
    const q = pq.value.trim().toLowerCase();
    filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(filtered.length - 1, 0));
    plist.innerHTML = filtered.length
      ? filtered.map((c, i) => `<li role="option" data-i="${i}" aria-selected="${i === sel}">${c.label}<small>${c.hint}</small></li>`).join("")
      : `<li aria-disabled="true">No matches<small>Try "agent" or "email"</small></li>`;
  }
  function openPalette() { lastFocus = document.activeElement; palette.hidden = false; pq.value = ""; sel = 0; renderPalette(); pq.focus(); }
  function closePalette() { palette.hidden = true; if (lastFocus) lastFocus.focus(); }
  function runSelected(i) { const c = filtered[i]; if (!c) return; closePalette(); c.run(); }
  $("#open-palette").addEventListener("click", openPalette);
  pq.addEventListener("input", () => { sel = 0; renderPalette(); });
  plist.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) runSelected(+li.dataset.i); });
  palette.addEventListener("click", (e) => { if (e.target === palette) closePalette(); });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); palette.hidden ? openPalette() : closePalette(); return; }
    if (palette.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); closePalette(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(filtered.length, 1); renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + filtered.length) % Math.max(filtered.length, 1); renderPalette(); }
    else if (e.key === "Enter") { e.preventDefault(); runSelected(sel); }
  });

  /* ---------- Agent: tools return real profile data ---------- */
  const listify = (items) => "<ul>" + items.map((x) => `<li>${x}</li>`).join("") + "</ul>";
  const PROJECTS = {
    ai: [
      `<b>AI Analytics Chatbot</b> (Padakhep, 2026): a Gemini-powered assistant inside our reporting dashboard. It uses function calling and agentic workflows to pick the right function, query the live database and return a chart from a plain-English question. ${a(LINKS.chatbotPost, "LinkedIn post")}`,
      `<b>n8n automation</b>: daily end-of-day microfinance reports to management, plus real-time alerts when a system or process goes down.`,
      `<b>Learning in public</b>: I write about RAG and AI agents on ${a(LINKS.linkedin, "LinkedIn")}, and completed the Multi-Agent AI Systems course (Udemy, 2026).`,
    ],
    data: [
      `<b>Branch Report Automation Engine</b>: pulls data from all 406 branches at the same time, retries failed calls automatically, and builds a ~730K-row, 100%-accurate master report. 2–3 days of work now takes under 2 hours.`,
      `<b>Central PostgreSQL Data Warehouse</b> (in progress): Python ETL/ELT pipelines bringing multi-source financial data together.`,
      `<b>At TallyKhata</b>: end-to-end ETL from REST APIs and JSON into PostgreSQL for automated financial reporting.`,
    ],
    backend: [
      `<b>Overdue Tracking Platform</b>: Django REST Framework, PostgreSQL, Celery and Redis, with secure authentication and REST APIs. Used by 4,000+ staff across 406 branches.`,
      `<b>payments-ops-monitoring</b> (open source): parallel read-only PostgreSQL metrics with baseline anomaly detection; CI tests it against a real PostgreSQL. ${a(LINKS.paymentsDemo, "Live demo")}`,
    ],
    bi: [
      `<b>Microfinance Operations Dashboard</b>: Metabase on a partitioned PostgreSQL backend with Python ETL, replacing 10+ Excel files. Tracks portfolio health, collections vs target, disbursements and zones. ${a(LINKS.metabasePost, "LinkedIn post")}`,
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
      `${a(LINKS.paymentsDemo, "payments-ops-monitoring")}: payments metrics, anomaly alerts, live dashboard built by CI.`,
      `${a(LINKS.redmineDemo, "redmine-issue-reporter")}: weekly support reports from the Redmine API with Pandas and Jinja2.`,
      `${a(LINKS.github + "/sms-balance-monitor", "sms-balance-monitor")}: a Selenium bot with browser tests in CI.`,
      `${a(LINKS.github + "/nextjs-social-feed", "nextjs-social-feed")}: full-stack Next.js and Prisma.`,
    ],
  };
  // One project in depth: get_projects(name).
  const DETAILS = {
    overdue: { title: "Overdue Tracking Platform", re: /overdue|tracking platform|loan tracking/, html:
      `<p><b>Overdue Tracking Platform</b> (Padakhep): one platform instead of manual Excel tracking, used daily by <b>4,000+ staff across 406 branches</b>.</p>${listify([
        "<b>Built with</b> Django REST Framework and PostgreSQL, Celery and Redis for background jobs, secure authentication and REST API integration.",
        "<b>Covers</b> overdue member entries and actions, field visits, legal actions and reports.",
        "<b>Rollout</b>: I presented it to the head office executive team, piloted it in the Karwan Bazar branch, trained every staff member there (on their phones too) and collected their feedback before the wider rollout.",
      ])}<p>${a(LINKS.pilotPost, "The Karwan Bazar pilot on LinkedIn")}</p>` },
    report: { title: "Branch Report Automation Engine", re: /branch report|report automation|automation engine|master report|730k/, html:
      `<p><b>Branch Report Automation Engine</b> (Padakhep): a report that took <b>2–3 days</b> of manual work now runs in <b>under 2 hours</b>, with 100% accuracy.</p>${listify([
        "Python calls the REST APIs of all 406 branches at the same time.",
        "If a branch call fails, it retries automatically. At this scale, some calls always fail.",
        "Every result is checked, then merged into a ~730K-row master report.",
      ])}` },
    chatbot: { title: "AI Analytics Chatbot", re: /chat ?bot|analytics assistant|ai assistant/, html:
      `<p><b>AI Analytics Chatbot</b> (Padakhep, 2026): anyone in the organisation asks for a report in plain English and gets the chart back in seconds, with no SQL.</p>${listify([
        "Gemini-powered, inside the reporting dashboard.",
        "Function calling and agentic workflows pick the right function, query the live database and return the chart.",
        "The model never writes free-form SQL. It chooses from well-defined tools, which keeps answers accurate and safe. This agent works the same way.",
      ])}<p>${a(LINKS.chatbotPost, "See it on LinkedIn")}</p>` },
    metabase: { title: "Microfinance Operations Dashboard", re: /metabase|operations dashboard|microfinance dashboard/, html:
      `<p><b>Microfinance Operations Dashboard</b> (Padakhep): one live screen replaced <b>10+ Excel files</b> for management.</p>${listify([
        "Metabase on a partitioned PostgreSQL backend, fed by custom Python ETL.",
        "Runs on a self-managed Linux server, with role-based access and auto-refresh.",
        "Tracks portfolio health, collections against target, disbursement trends and zone performance.",
      ])}<p>${a(LINKS.metabasePost, "See it on LinkedIn")}</p>` },
    warehouse: { title: "Central PostgreSQL Data Warehouse", re: /central .*warehouse|warehouse project|the (data )?warehouse/, html:
      `<p><b>Central PostgreSQL Data Warehouse</b> (Padakhep, in progress): Python ETL/ELT pipelines bringing multi-source financial data into one warehouse for analytics and automated reporting.</p>` },
  };
  const EXPERIENCE = {
    padakhep: `<p><b>Data, BI &amp; Automation Engineer</b> at Padakhep Manabik Unnayan Kendra (microfinance NGO, Analytics &amp; Digital Transformation Team), Aug 2025 – present.</p><ul><li>Overdue Tracking Platform for 4,000+ users across 406 branches</li><li>Gemini-powered analytics chatbot</li><li>730K-row branch report automated: 2–3 days → under 2 hours</li><li>PostgreSQL data warehouse and n8n automation</li></ul>`,
    tallykhata: `<p><b>Junior Engineer</b> (Jun 2024 – Jul 2025) and <b>Product Engineer Intern</b> (Mar – May 2024) at Progoti Systems Limited (TallyKhata), a fintech.</p><ul><li>Supported Bangla QR payments for 100K+ merchants across NPSB, bKash, Rocket and 30+ banks</li><li>Resolved payment disputes on live PostgreSQL/MySQL production data, and automated routine ones</li><li>KPI and fraud dashboards (+80% visibility); monitoring and alerting (−40% downtime)</li></ul>`,
  };
  // Skills with evidence. `more` names the project a follow-up ("tell me more") opens.
  const SKILLS = [
    { re: /postgres/, name: "PostgreSQL", more: "overdue", ev: ["Production database behind the Overdue Tracking Platform", "Partitioned PostgreSQL backend for the Metabase dashboard", "Building a central PostgreSQL data warehouse", "Live production data for payment disputes at TallyKhata"] },
    { re: /django|drf|rest framework/, name: "Django & DRF", more: "overdue", ev: ["Built the Overdue Tracking Platform on Django REST Framework (4,000+ users)", "Secure authentication and REST API integration", "Celery and Redis for background jobs"] },
    { re: /celery|redis|background jobs?|queues?\b/, name: "Celery & Redis", more: "overdue", ev: ["Background and scheduled jobs for the Overdue Tracking Platform"] },
    { re: /\bapis?\b|\brest(ful)?\b(?! framework)|endpoints?|integrations?\b/, name: "REST APIs", more: "report", ev: ["Built REST APIs with Django REST Framework for the Overdue Tracking Platform", "Branch report automation calls all 406 branch APIs in parallel", "ETL from REST APIs and JSON into PostgreSQL at TallyKhata"] },
    { re: /power ?bi/, name: "Power BI", more: "metabase", ev: ["Used at Padakhep for reporting", "Plus Metabase and Looker Studio dashboards in production"] },
    { re: /looker|data studio/, name: "Looker Studio", ev: ["KPI and fraud-detection dashboards at TallyKhata (+80% visibility)"] },
    { re: /bigquery/, name: "BigQuery", ev: ["Part of my data toolkit alongside PostgreSQL and MySQL"] },
    { re: /mysql/, name: "MySQL", ev: ["Live production data for payment investigations at TallyKhata"] },
    { re: /database|\bdbs?\b|dbms/, name: "Databases", more: "metabase", ev: ["PostgreSQL in production: the Overdue Tracking Platform, a partitioned BI backend and a central data warehouse", "PostgreSQL and MySQL production data at TallyKhata", "BigQuery for analytics", "Schema design, indexing and query optimization"] },
    { re: /docker|containers?\b/, name: "Docker", ev: ["My open-source projects ship with Docker; CI runs them against a real PostgreSQL service"] },
    { re: /\bgit\b|github actions|ci\/cd|\bci\b|devops/, name: "Git & CI/CD", ev: ["GitHub Actions on every public repo: lint, tests, secret scanning", "CI builds and deploys my live demo dashboards"] },
    { re: /selenium|playwright|scrap\w*|\bbots?\b|web automation/, name: "Browser automation", ev: ["sms-balance-monitor: a Selenium bot handling OTP and pop-ups", "API and load testing with Postman, JMeter and Selenium at TallyKhata"] },
    { re: /\btest(s|ing)?\b|\bqa\b|postman|jmeter/, name: "Testing", ev: ["API and load testing with Postman, JMeter and Selenium at TallyKhata", "Automated tests in CI on every public repo"] },
    { re: /n8n|workflow automation/, name: "n8n", ev: ["Daily management reports and real-time system alerts at Padakhep"] },
    { re: /pandas|numpy/, name: "Pandas", more: "report", ev: ["Report automation and the redmine-issue-reporter project"] },
    { re: /\bexcel\b|power query|xlookup|pivot|spreadsheets?/, name: "Excel", more: "metabase", ev: ["Power Query, pivot tables and XLOOKUP", "Replaced 10+ Excel files with one live dashboard"] },
    { re: /linux|ubuntu|\bservers?\b(?!-side| side)/, name: "Linux", more: "metabase", ev: ["Self-managed Linux server running the Metabase dashboard"] },
    { re: /\betl\b|\belt\b|pipelines?|warehous/, name: "ETL & warehousing", more: "report", ev: ["730K-row branch report pipeline with self-healing retries", "Central PostgreSQL data warehouse (in progress)", "ETL from REST APIs into PostgreSQL at TallyKhata"] },
    { re: /multithread\w*|parallel|concurren\w*|performance|optimi[sz]\w*|speed/, name: "Performance & concurrency", more: "report", ev: ["Parallel pulls across 406 branches: 2–3 days → under 2 hours", "PostgreSQL partitioning behind the operations dashboard", "Indexing and query optimization on production databases"] },
    { re: /quality|accura\w*|validat\w*|reliab\w*/, name: "Data quality", more: "report", ev: ["Every branch result is validated before merging, so the 730K-row report is 100% accurate", "Self-healing retries recover failed pulls automatically", "My open-source repos run tests against a real PostgreSQL in CI"] },
    { re: /\blead\w*|stakeholders?|presentations?|\bpresent(ed|ing)?\b|\btrain(ed|ing)?\b|mentor\w*|communicat\w*|soft skills?|teamwork|team player/, name: "Leadership & communication", more: "overdue", ev: ["Presented the Overdue Tracking Platform to Padakhep's head office executive team", "Ran the Karwan Bazar branch pilot: trained every staff member, including on their phones, and collected their feedback before rollout", "Write about AI and data engineering on LinkedIn"] },
    { re: /react|next\.?js|javascript|typescript|\bjs\b|frontend|front-end|prisma/, name: "JavaScript & Next.js", ev: ["nextjs-social-feed: a full-stack Next.js and Prisma app (open source)", "Frontend isn't my main focus. I'm strongest on data and backend."] },
    { re: /\bsql\b/, name: "SQL", ev: ["Daily work on production PostgreSQL and MySQL: schema design, indexing, query optimization", "Every dashboard and report I build starts with SQL"] },
    { re: /python/, name: "Python", more: "report", ev: ["My main language: Django platform, ETL pipelines, report automation, AI chatbot, bots"] },
  ];
  // Tools I haven't used in production: say so, and point to the closest real experience.
  const NEAR = [
    { re: /tableau|qlik/, say: "Not used in a real project yet. I build dashboards every day with Power BI, Metabase and Looker Studio, so the same skills carry over." },
    { re: /airflow|dagster|prefect|luigi/, say: "Not yet. I schedule and run jobs with cron, Celery and n8n, with automatic retries and alerts." },
    { re: /pyspark|spark|hadoop|databricks|kafka|flink/, say: "Not used in a real project yet. My biggest job, a ~730K-row report from 406 branches, runs on Python (multithreading), Pandas and PostgreSQL." },
    { re: /\baws\b|amazon web services|azure|\bgcp\b|google cloud|\bcloud\b/, say: "On Google Cloud I use BigQuery, and I run my own services on Linux servers with Docker. I haven't used AWS or Azure in a real project yet." },
    { re: /kubernetes|k8s|terraform|ansible/, say: "Not yet. I package apps with Docker, run them on Linux servers and automate with GitHub Actions." },
    { re: /fastapi|flask|spring|laravel/, say: "I build my APIs with Django REST Framework, so API design, login security and background jobs are familiar. I haven't used this one in a real project yet." },
    { re: /snowflake|redshift|\bdbt\b|synapse/, say: "Not yet. I build data warehouses on PostgreSQL (one is in progress now) and use BigQuery." },
    { re: /mongo\w*|nosql|cassandra|dynamo\w*/, say: "My real projects use SQL databases (PostgreSQL and MySQL), plus Redis for job queues." },
    { re: /langchain|llama.?index|crewai|autogen|langgraph/, say: "I build agents directly with the Gemini API (function calling), without a framework. I also write about RAG and AI agents on LinkedIn." },
    { re: /tensorflow|pytorch|keras|scikit|sklearn|deep learning|computer vision|\bnlp\b/, say: "I studied machine learning with Python at BASIS (BITM). My real AI work is with large language models: Gemini function calling and agentic workflows. I haven't used this one in a real project yet." },
  ];
  const CANON = { aws: "AWS", gcp: "GCP", k8s: "Kubernetes", dbt: "dbt", fastapi: "FastAPI", pyspark: "PySpark", nosql: "NoSQL", mongodb: "MongoDB", mongo: "MongoDB", langchain: "LangChain", llamaindex: "LlamaIndex", crewai: "CrewAI", autogen: "AutoGen", langgraph: "LangGraph", pytorch: "PyTorch", tensorflow: "TensorFlow", sklearn: "scikit-learn", scikit: "scikit-learn", nlp: "NLP", dynamodb: "DynamoDB" };
  const pretty = (w) => CANON[w.replace(/\s/g, "")] || w.replace(/\b\w/g, (c) => c.toUpperCase());
  const STACK = `<p>My main tools:</p>${listify([
    "<b>Backend</b>: Python, Django &amp; DRF, Celery, Redis, REST APIs",
    "<b>Data</b>: PostgreSQL, MySQL, BigQuery, Pandas, ETL/ELT &amp; warehousing",
    "<b>AI &amp; automation</b>: Gemini API &amp; LLMs, agentic workflows, n8n, Selenium &amp; Playwright",
    "<b>BI</b>: Power BI, Metabase, Looker Studio, Excel &amp; Power Query",
    "<b>DevOps</b>: Docker, Git, GitHub Actions, Linux",
  ])}<p>Ask about any one of them and I'll show where I used it.</p>`;
  const reachMe = () => `${a("mailto:" + EMAIL, EMAIL)} or ${a(WA, "WhatsApp")}`;

  const TOOLS = {
    get_profile: (section) => section === "pitch"
      ? `<p>Three reasons, all with proof:</p>${listify([
          "<b>My work is used every day.</b> My platform runs in 406 branches for 4,000+ users, not just in a demo.",
          "<b>I'm up to date with AI.</b> I built a Gemini chatbot that uses function calling, and I write about RAG and AI agents.",
          "<b>I care about getting it right.</b> Checks, automatic retries and tests keep my 730K-row report 100% accurate.",
        ])}<p>Want to talk? ${a("mailto:" + EMAIL, EMAIL)}</p>`
      : section === "stack" ? STACK
      : section === "roles" ? `<p>I'm open to talking about <b>data engineering, BI, and Python backend and automation roles</b>, especially where AI is part of the work.</p><p>The easiest way to start: ${reachMe()}.</p>`
      : `<p>I'm Nur Mohammad Siddiq, a <b>Data, BI &amp; Automation Engineer</b> in Dhaka with 2.5+ years of experience. I build data, backend and AI systems that people use every day: Python, Django, PostgreSQL, data pipelines, dashboards and AI agents, mostly for microfinance and fintech.</p><p>Right now I'm building a central PostgreSQL data warehouse at Padakhep.</p>`,
    get_projects: (x) => typeof x === "string" ? listify(PROJECTS[x]) : DETAILS[x.name].html,
    get_experience: (company) => company === "all"
      ? `<p><b>2.5+ years</b> in total, in microfinance and fintech:</p>` + EXPERIENCE.padakhep + EXPERIENCE.tallykhata
      : EXPERIENCE[company],
    find_evidence: (s) => s.ev ? `<p>Where I've used <b>${s.name}</b>:</p>${listify(s.ev)}`
      : s.say ? `<p><b>${s.name}</b>: ${s.say}</p>`
      : `<p>I couldn't find <b>${esc(s.name)}</b> in my projects or work, so I won't claim it.</p><p>My main skills are Python, Django, PostgreSQL, data pipelines, BI dashboards and AI agents. Ask about any of them and I'll show proof.</p>`,
    get_education: () => listify([
      "<b>B.Sc. in Electrical &amp; Electronic Engineering</b>, Bangladesh University (2020–2023), CGPA 3.47/4.00",
      "Data Science &amp; Machine Learning Using Python, BASIS (BITM), 2024",
      "The Data Engineer Bootcamp, Udemy, 2025",
      "Multi-Agent AI Systems, Udemy, 2026",
    ]),
    get_contact: (topic) => (topic === "hiring"
        ? `<p>It's best to talk about salary, notice period, start date and work setup directly. I'm happy to set up a call.</p>`
        : topic === "interview" ? `<p>Happy to talk! The quickest way to set a time:</p>`
        : topic === "location" ? `<p>I'm based in <b>Dhaka, Bangladesh</b>.</p>` : "")
      + `<p>Email ${a("mailto:" + EMAIL, EMAIL)}, call <a href="${TEL}">${PHONE}</a>, or ${a(WA, "message me on WhatsApp")}.</p><p>My CV: <a href="${CV}" download>download the PDF</a>. I'm also on ${a(LINKS.linkedin, "LinkedIn")} and ${a(LINKS.github, "GitHub")}.</p>`,
  };

  /* ---------- Router: picks the tool(s) and arguments from the question ---------- */
  // Small typo fixer for the words that matter ("djnago" → "django").
  const VOCAB = ["python", "django", "postgresql", "postgres", "metabase", "dashboard", "dashboards", "tallykhata", "padakhep", "gemini", "chatbot", "pipeline", "pipelines", "warehouse", "selenium", "docker", "analytics", "automation", "certification", "certifications", "university", "whatsapp", "resume", "linkedin", "github", "fintech", "microfinance", "tableau", "airflow", "kubernetes", "leadership", "database", "databases", "celery", "pandas", "looker", "bigquery", "playwright", "javascript", "overdue", "experience", "education", "agentic", "salary", "interview"];
  function editDistance(s, t) {
    const d = Array.from({ length: s.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= t.length; j++) d[0][j] = j;
    for (let i = 1; i <= s.length; i++) for (let j = 1; j <= t.length; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
    return d[s.length][t.length];
  }
  const fixTypos = (q) => q.replace(/[a-z]{5,}/g, (w) => {
    if (VOCAB.includes(w)) return w;
    const max = w.length >= 8 ? 2 : 1;
    let best = w, bestD = max + 1;
    for (const v of VOCAB) {
      if (Math.abs(v.length - w.length) > max) continue;
      const dist = editDistance(w, v);
      if (dist < bestD) { bestD = dist; best = v; }
    }
    return best;
  });

  const GREETING = /\b(hi+|hello|hey+|hiya|yo|salam|assalamu?|alaikum|good (morning|afternoon|evening)|there|nur|agent|bot)\b/g;
  const THANKS = /\b(thanks?|thank you|thx|ty|great|awesome|cool|nice|ok(ay)?|perfect|got it|so much|a lot|very|you|that s|that|is|it|bye|goodbye|see you)\b/g;
  const one = (tool, arg, argText) => ({ calls: [{ tool, arg, argText }] });
  const detail = (key) => one("get_projects", { name: key }, `name="${DETAILS[key].title}"`);
  const MORE_OF = { ai: "chatbot", data: "report", backend: "overdue", bi: "metabase", impact: "overdue", padakhep: "overdue", all: "overdue" };
  const DOMAIN_WORDS = /\b(data|engineer\w*|analy\w*|backend|back-end|server|bi|business|dashboards?|reports?|reporting|visuali\w*|charts?|skills?|stack|tech\w*|tools?|ai|automation|scripting|coding|programming|software|web|development|projects?|teams?|clients?)\b/;
  let followUp = null; // project a "tell me more" should open

  function route(raw) {
    const q = " " + fixTypos(raw.toLowerCase().replace(/[^\w\s/+#.-]/g, " ")) + " ";
    const has = (re) => re.test(q);
    if (!q.replace(GREETING, "").trim()) return { reply: `<p>Hi! Ask me about Nur's projects, skills, work history, or how to get in touch.</p>`, note: "Just saying hello, no lookup needed" };
    if (has(/\b(thanks?|thank you|thx|bye|goodbye)\b/) && !q.replace(THANKS, "").trim()) return { reply: `<p>You're welcome! To talk to Nur directly: ${reachMe()}.</p>`, note: "No lookup needed" };
    if (has(/\b(how (do|does) (you|it|this|this agent|the agent|this bot|this demo) work|are you (an? )?(ai|bot|real|human|llm|gpt|chatgpt)|how (were|are) you (built|made)|who (made|built) you)\b|^\s*what are you\s*$/))
      return { reply: `<p>Good question! Here's how I work:</p>${listify([
        "You ask a question.",
        "I pick the right tool for it. For example, <code>find_evidence</code> checks a skill.",
        "The tool gets real data from Nur's profile.",
        "I answer using only that data, so I never make things up.",
      ])}<p>To keep this demo fast and free, I pick tools with simple rules. In real projects, an AI model like Gemini picks the tools. Nur built the AI Analytics Chatbot this way.</p>`, note: "Explaining how I work, no lookup needed" };

    if (has(/\b(interviews?|schedule|set up a call|book a call|meet)\b/)) return one("get_contact", "interview", `topic="interview"`);
    if (has(/\b(salar\w*|ctc|compensation|expected (pay|package)|notice period|notice|start date|when can you (start|join)|join (immediately|us|soon)|immediate(ly)? join\w*|availab\w*|remote|on-?site|hybrid|relocat\w*|visa)\b/)) return one("get_contact", "hiring", `topic="hiring"`);
    if (has(/\b(why (should|would|hire)|strengths?|stand ?out|good fit|best (at|thing)|convince|different|unique|you excel|excel at|bring to)\b/)) return one("get_profile", "pitch", `section="pitch"`);
    if (has(/\b(contact|e-?mail|reach|call|phone|mobile number|(your|contact) number|whatsapp|talk (to|with) (you|nur)|let s talk|hire you|get in touch|cv|resume|linkedin)\b/)) return one("get_contact", null, "");
    if (has(/\b(where (are|do) you (based|live|from|located)|based in|located|location|which city|from where)\b/)) return one("get_contact", "location", `topic="location"`);
    if (has(/\b(looking for|open to|kind of (role|job|position)|next role|job search|seeking|career goals?|what roles?)\b/)) return one("get_profile", "roles", `section="roles"`);
    if (has(/\b(educat\w*|degree|universit\w*|studied|(did|do) you study|certif\w*|courses?|cgpa|gpa|bsc|b\.sc|school|college|graduat\w*)\b/)) return one("get_education", null, "");
    for (const key in DETAILS) if (has(DETAILS[key].re)) return detail(key);
    if (has(/\b(open.?source|github(?! actions)|repos?|repositor\w*|code samples?|public code|portfolio|side projects?|payments-ops\S*|redmine\S*|sms-balance\S*|nextjs-social\S*|social feed)\b/)) return one("get_projects", "open_source", `domain="open_source"`);
    if (has(/\b(tallykhata|progoti|fintech|payments?|bkash|nagad|rocket|npsb|merchants?|qr)\b/)) return one("get_experience", "tallykhata", `company="TallyKhata"`);
    if (has(/\b(padakhep|microfinance|ngo|current\w*|right now|present (job|role|company)|employer|work(ing)? (now|on now)|where do you work)\b/)) return one("get_experience", "padakhep", `company="Padakhep"`);
    if (has(/\b(ai|a\.i|llms?|gemini|gpt|chatgpt|openai|claude|agents?|agentic|genai|gen ai|machine learning|ml|rag|prompt\w*|artificial intelligence)\b/)) return one("get_projects", "ai", `domain="ai"`);
    if (has(/\byears?\b|how long have you/)) return one("get_experience", "all", `company="all"`);
    if (has(/\b(impact|biggest|proud|achievements?|accomplish\w*|results?|numbers|metrics?|largest|scale|how (big|much|many)|datasets?)\b/)) return one("get_projects", "impact", `domain="impact"`);

    // Skills: every one the question names, in the order asked (up to 3 tool calls).
    const found = SKILLS.map((s) => ({ s, at: q.search(s.re) })).filter((x) => x.at >= 0).sort((x, y) => x.at - y.at).slice(0, 3);
    if (found.length) return { calls: found.map(({ s }) => ({ tool: "find_evidence", arg: s, argText: `skill="${s.name}"` })) };
    for (const n of NEAR) { const m = q.match(n.re); if (m) { const name = pretty(m[0].trim()); return one("find_evidence", { name, say: n.say }, `skill="${name}"`); } }
    // "Do you know X?" for something not in my profile: check, and say so honestly.
    const m = q.match(/\b(?:know|use|used|using|experience (?:with|in)|worked (?:with|on)|familiar with|skilled in|proficient in|work with|good at|expert in)\s+([a-z0-9+#.]+(?:\s(?!and\b|or\b)[a-z0-9+#.]+)?)/);
    if (m) {
      const term = m[1].replace(/\b(the|any|a|an)\b/g, " ").trim();
      if (term && !DOMAIN_WORDS.test(term) && !/^(it|that|this|them|me|us|you|how|what|about|if|anything|something|stuff|things?|bangla|bengali|english|hindi)\b/.test(term))
        return one("find_evidence", { name: pretty(term) }, `skill="${pretty(term)}"`);
    }

    if (has(/\b(backend|back-end|server.?side)\b/)) return one("get_projects", "backend", `domain="backend"`);
    if (has(/\b(bi|business intelligence|dashboards?|reports?|reporting|visuali\w*|analytics|charts?)\b/)) return one("get_projects", "bi", `domain="bi"`);
    if (has(/\b(skills?|stack|tech|technolog\w*|tools?|toolkit|programming languages?|what do you (use|know))\b/)) return one("get_profile", "stack", `section="stack"`);
    if (has(/\b(data|engineer\w*|analyst|analysis)\b/)) return one("get_projects", "data", `domain="data"`);
    if (has(/\b(case stud\w*|projects?|portfolio|what have you (built|made|done)|your (best )?work|show me (some|your) work)\b/)) return one("get_projects", "featured", `domain="featured"`);
    if (has(/\b(experience|worked|work history|jobs?|career|companies|employment|background)\b/)) return one("get_experience", "all", `company="all"`);
    if (has(/\b(who|about (you|yourself)|yourself|introduce|what do you do|you do|your name|summary)\b/)) return one("get_profile", null, "");
    if (has(/\b(more|details?|elaborate|go on|continue|example|deeper|expand)\b/))
      return followUp ? detail(followUp) : one("get_projects", "impact", `domain="impact"`);
    return null;
  }

  /* ---------- Chat UI ---------- */
  const log = $("#agent-log"), form = $("#agent-form"), input = $("#agent-q"), chips = $("#agent-chips");
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
  // Follow the answer as it grows, but never scroll the latest question out of view,
  // so a long answer is read from its start.
  let anchor = null;
  const scrollLog = () => {
    const bottom = log.scrollHeight - log.clientHeight;
    log.scrollTop = anchor ? Math.min(bottom, anchor.getBoundingClientRect().top - log.getBoundingClientRect().top + log.scrollTop - 8) : bottom;
  };
  let busy = false;

  function add(cls, html) { const d = document.createElement("div"); d.className = "msg " + cls; d.innerHTML = html; log.appendChild(d); scrollLog(); return d; }

  async function typeInto(el, html) {
    if (reduceMotion) { el.innerHTML = html; return; }
    // Reveal the answer block by block so it feels live without breaking markup.
    const tmp = document.createElement("div"); tmp.innerHTML = html;
    const blocks = [...tmp.childNodes];
    el.innerHTML = "";
    for (const b of blocks) {
      if (b.nodeName === "UL") {
        const ul = document.createElement("ul"); el.appendChild(ul);
        for (const li of [...b.children]) { ul.appendChild(li); scrollLog(); await sleep(140); }
      } else { el.appendChild(b); scrollLog(); await sleep(160); }
    }
  }

  function highlightTool(names) {
    $$(".agent-tools li").forEach((li) => li.classList.toggle("hit", names.some((n) => li.querySelector("code").textContent.startsWith(n))));
  }

  // Each step reads in plain English first, with the real function call underneath.
  const AREA = { ai: "AI work", data: "data engineering work", backend: "backend work", bi: "BI and dashboard work", impact: "biggest results", open_source: "open-source code", featured: "best projects" };
  const COMPANY = { padakhep: "Padakhep", tallykhata: "TallyKhata" };
  const examples = (n) => `${n} real example${n === 1 ? "" : "s"}`;
  function explain(c) { // → [while working, when done]
    const x = c.arg;
    switch (c.tool) {
      case "get_profile":
        return x === "pitch" ? ["Finding reasons to hire Nur", "Found 3 reasons to hire Nur"]
          : x === "stack" ? ["Looking up Nur's skills", "Found Nur's skills and tools"]
          : x === "roles" ? ["Looking up the roles Nur wants", "Found the roles Nur is open to"]
          : ["Looking up Nur's profile", "Found Nur's profile"];
      case "get_projects":
        return typeof x === "string" ? [`Looking up Nur's ${AREA[x]}`, `Found Nur's ${AREA[x]}`]
          : [`Opening the ${DETAILS[x.name].title} project`, `Opened the ${DETAILS[x.name].title} project`];
      case "get_experience":
        return x === "all" ? ["Looking up Nur's work history", "Found Nur's work history"]
          : [`Looking up Nur's work at ${COMPANY[x]}`, `Found Nur's work at ${COMPANY[x]}`];
      case "find_evidence": {
        const name = esc(x.name);
        return [`Checking Nur's ${name} experience`, x.ev ? `Checked ${name}: found ${examples(x.ev.length)}`
          : x.say ? `Checked ${name}: not used in a real project yet` : `Checked ${name}: not found in Nur's profile`];
      }
      case "get_education": return ["Looking up Nur's education", "Found Nur's degree and courses"];
      default: return x === "location" ? ["Looking up where Nur is based", "Found where Nur is based"] : ["Looking up how to reach Nur", "Found how to reach Nur"];
    }
  }
  const step = (icon, say, code = "") => `<div class="step"><span class="say"><i aria-hidden="true">${icon}</i>${say}</span>${code && `<code>${code}</code>`}</div>`;
  const codeOf = (c) => `<span class="fn">${c.tool}</span>(${esc(c.argText)})`;

  const FALLBACK_CHIPS = ["What's your tech stack?", "Tell me about the chatbot", "Django & PostgreSQL?"];
  async function ask(question) {
    const q = question.trim().slice(0, 160);
    if (!q || busy) return;
    busy = true;
    anchor = add("user", `<span>${esc(q)}</span>`);
    scrollLog();
    const bot = add("bot", "");
    try {
      const r = route(q);
      if (!r || r.reply) {
        highlightTool([]);
        bot.innerHTML = `<div class="trace">${r ? step("✓", r.note) : step("–", "Nothing about this in Nur's profile, so I won't guess")}</div><div class="answer"></div>`;
        await sleep(300);
        await typeInto($(".answer", bot), r ? r.reply
          : `<p>I don't have that in Nur's profile, so I won't guess. You can ask Nur directly: ${reachMe()}.</p><p>Or try one of these:</p><div class="inline-chips">${FALLBACK_CHIPS.map((c) => `<button type="button">${c}</button>`).join("")}</div>`);
        return;
      }
      const calls = r.calls;
      highlightTool(calls.map((c) => c.tool));
      const t0 = performance.now();
      bot.innerHTML = `<div class="trace working">${calls.map((c) => step("…", explain(c)[0], codeOf(c))).join("")}<span class="caret"></span></div>`;
      await sleep(calls.length > 1 ? 720 : 520);
      const result = calls.map((c) => TOOLS[c.tool](c.arg)).join("");
      const ms = Math.max(1, Math.round(performance.now() - t0 - (reduceMotion ? 0 : calls.length > 1 ? 720 : 520)));
      const timing = `<span class="ms"> · ${calls.length > 1 ? `${calls.length} tools, ` : ""}${ms} ms</span>`;
      bot.innerHTML = `<div class="trace">${calls.map((c, i) => step("✓", explain(c)[1], codeOf(c) + (i === calls.length - 1 ? timing : ""))).join("")}</div><div class="answer"></div>`;
      await typeInto($(".answer", bot), result);
      // Remember the topic so "tell me more" opens the right project next.
      const c = calls[0];
      followUp = c.tool === "find_evidence" ? c.arg.more || null
        : c.tool === "get_projects" && typeof c.arg === "string" ? MORE_OF[c.arg] || null
        : c.tool === "get_experience" ? MORE_OF[c.arg] || null
        : null;
    } finally {
      busy = false;
    }
  }

  const SUGGESTIONS = ["What do you do?", "How does this agent work?", "Show me your AI work", "What's your biggest impact?", "Django & PostgreSQL?", "Fintech experience?", "Why should we hire you?", "How can I contact you?"];
  chips.innerHTML = SUGGESTIONS.map((s) => `<button type="button">${s}</button>`).join("");
  chips.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) ask(b.textContent); });
  log.addEventListener("click", (e) => { const b = e.target.closest(".inline-chips button"); if (b) ask(b.textContent); });
  form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value; input.value = ""; ask(v); });

  add("bot", `<div class="answer"><p>Hi, I'm Nur's AI agent. I answer as Nur, using only real facts from Nur's profile. Ask anything, or tap a question below.</p></div>`);
})();
