// The agent's tools. Each one takes the argument the router picked and returns HTML
// built only from knowledge.js, so the agent can't say anything that isn't in my profile.

import { CV_URL, EMAIL, LINKS, PHONE, TEL, WHATSAPP_URL } from "../config.js";
import { escapeHtml, link, list } from "../lib/html.js";
import { DETAILS, EXPERIENCE, PROJECTS, STACK } from "./knowledge.js";

export const reachMe = () => `${link("mailto:" + EMAIL, EMAIL)} or ${link(WHATSAPP_URL, "WhatsApp")}`;

const PROFILE = {
  pitch: `<p>Three reasons, all with proof:</p>${list([
    "<b>My work is used every day.</b> My platform runs in 406 branches for 4,000+ users, not just in a demo.",
    "<b>I'm up to date with AI.</b> I built a Gemini chatbot that uses function calling, and I write about RAG and AI agents.",
    "<b>I care about getting it right.</b> Checks, automatic retries and tests keep my 730K-row report 100% accurate.",
  ])}<p>Want to talk? ${link("mailto:" + EMAIL, EMAIL)}</p>`,
  stack: STACK,
  roles: `<p>I'm open to <b>new roles and projects</b> in data engineering, BI, and Python backend and automation, especially where AI is part of the work.</p><p>The easiest way to start: ${reachMe()}.</p>`,
  about: `<p>I'm Nur Mohammad Siddiq, a <b>Data, BI &amp; Automation Engineer</b> in Dhaka with 2.5+ years of experience. I build data, backend and AI systems that people use every day: Python, Django, PostgreSQL, data pipelines, dashboards and AI agents, mostly for microfinance and fintech.</p><p>Right now I'm building a central PostgreSQL data warehouse at Padakhep.</p>`,
};

const CONTACT_INTRO = {
  hiring: `<p>It's best to talk about salary, notice period, start date and work setup directly. I'm happy to set up a call.</p>`,
  interview: `<p>Happy to talk! The quickest way to set a time:</p>`,
  location: `<p>I'm based in <b>Dhaka, Bangladesh</b>.</p>`,
};

export const TOOLS = {
  get_profile: (section) => PROFILE[section] ?? PROFILE.about,

  get_projects: (arg) => (typeof arg === "string" ? list(PROJECTS[arg]) : DETAILS[arg.name].html),

  get_experience: (company) =>
    company === "all"
      ? `<p><b>2.5+ years</b> in total, in microfinance and fintech:</p>${EXPERIENCE.padakhep}${EXPERIENCE.tallykhata}`
      : EXPERIENCE[company],

  find_evidence: (skill) => {
    if (skill.evidence) return `<p>Where I've used <b>${skill.name}</b>:</p>${list(skill.evidence)}`;
    if (skill.answer) return `<p><b>${skill.name}</b>: ${skill.answer}</p>`;
    return `<p>I couldn't find <b>${escapeHtml(skill.name)}</b> in my projects or work, so I won't claim it.</p><p>My main skills are Python, Django, PostgreSQL, data pipelines, BI dashboards and AI agents. Ask about any of them and I'll show proof.</p>`;
  },

  get_education: () =>
    list([
      "<b>B.Sc. in Electrical &amp; Electronic Engineering</b>, Bangladesh University (2020–2023), CGPA 3.47/4.00",
      "Data Science &amp; Machine Learning Using Python, BASIS (BITM), 2024",
      "The Data Engineer Bootcamp, Udemy, 2025",
      "Multi-Agent AI Systems, Udemy, 2026",
    ]),

  get_contact: (topic) =>
    (CONTACT_INTRO[topic] ?? "") +
    `<p>Email ${link("mailto:" + EMAIL, EMAIL)}, call <a href="${TEL}">${PHONE}</a>, or ${link(WHATSAPP_URL, "message me on WhatsApp")}.</p>` +
    `<p>My CV: <a href="${CV_URL}" download>download the PDF</a>. I'm also on ${link(LINKS.linkedin, "LinkedIn")} and ${link(LINKS.github, "GitHub")}.</p>`,
};
