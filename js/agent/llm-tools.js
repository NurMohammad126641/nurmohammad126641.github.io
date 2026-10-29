// Tool definitions for the LLM (Gemini function calling) and the code that runs them.
// Shared by the Cloudflare Worker, which executes tools, and the chat window, which shows the trace.

import { DETAILS, EXPERIENCE, NOT_YET, PROJECTS, SKILLS } from "./knowledge.js";
import { TOOLS } from "./tools.js";

const PROJECT_DOMAINS = Object.keys(PROJECTS);
const PROJECT_NAMES = Object.keys(DETAILS);

export const TOOL_DECLARATIONS = [
  {
    type: "function",
    name: "get_profile",
    description:
      "Nur's profile. 'about' is a short summary, 'pitch' gives three reasons to work with Nur, 'stack' lists all skills by group, 'roles' says what roles and projects Nur is open to.",
    parameters: {
      type: "object",
      properties: { section: { type: "string", enum: ["about", "pitch", "stack", "roles"] } },
      required: ["section"],
    },
  },
  {
    type: "function",
    name: "get_projects",
    description:
      "Nur's work. Pass 'domain' for a list (ai, data, backend, bi, impact = biggest results, open_source, featured = best projects), or 'project' for one project in depth: overdue (Overdue Tracking Platform, also called OD Tracker 2.0, with its demo videos, mobile version, OD Monitor and reporting dashboard), report (Branch Report Automation Engine), chatbot (AI Analytics Chatbot), metabase (Microfinance Operations Dashboard), warehouse (Central PostgreSQL Data Warehouse).",
    parameters: {
      type: "object",
      properties: {
        domain: { type: "string", enum: PROJECT_DOMAINS },
        project: { type: "string", enum: PROJECT_NAMES },
      },
    },
  },
  {
    type: "function",
    name: "get_experience",
    description:
      "Nur's jobs: padakhep (current role, microfinance NGO), tallykhata (fintech, junior engineer and intern), or all.",
    parameters: {
      type: "object",
      properties: { company: { type: "string", enum: ["padakhep", "tallykhata", "all"] } },
      required: ["company"],
    },
  },
  {
    type: "function",
    name: "find_evidence",
    description:
      "Check one skill, tool or technology. Returns where Nur used it, an honest 'not used yet' with the closest real experience, or 'not found'. Call once per skill.",
    parameters: {
      type: "object",
      properties: { skill: { type: "string", description: "One skill name, e.g. 'Django' or 'Tableau'." } },
      required: ["skill"],
    },
  },
  {
    type: "function",
    name: "get_education",
    description: "Nur's degree and certifications.",
    parameters: { type: "object", properties: {} },
  },
  {
    type: "function",
    name: "get_contact",
    description:
      "How to reach Nur: email, phone, WhatsApp, CV. Topic 'hiring' for salary, notice period or start date; 'interview' to set up a call; 'location' for where Nur is based.",
    parameters: {
      type: "object",
      properties: { topic: { type: "string", enum: ["general", "hiring", "interview", "location"] } },
    },
  },
];

/** Find a skill in the profile: real evidence, an honest "not yet", or just the name if it's unknown. */
export function lookupSkill(name) {
  const text = " " + String(name).toLowerCase().trim() + " ";
  const known = SKILLS.find((skill) => skill.match.test(text));
  if (known) return known;
  const notYet = NOT_YET.find((entry) => entry.match.test(text));
  const title = String(name).trim().slice(0, 40) || "that";
  return notYet ? { name: title, answer: notYet.answer } : { name: title };
}

/**
 * Convert an LLM tool call into the argument shape the tools (and the trace) use.
 * @returns {{tool: string, arg: *, argText: string}}
 */
export function toToolCall(name, args = {}) {
  const argText = Object.entries(args)
    .map(([key, value]) => `${key}="${value}"`)
    .join(", ");
  switch (name) {
    case "get_profile":
      return { tool: name, arg: args.section === "about" ? null : (args.section ?? null), argText };
    case "get_projects":
      if (DETAILS[args.project]) return { tool: name, arg: { name: args.project }, argText };
      return { tool: name, arg: PROJECTS[args.domain] ? args.domain : "featured", argText };
    case "get_experience":
      return { tool: name, arg: EXPERIENCE[args.company] ? args.company : "all", argText };
    case "find_evidence":
      return { tool: name, arg: lookupSkill(args.skill ?? ""), argText };
    case "get_education":
      return { tool: name, arg: null, argText };
    case "get_contact":
      return { tool: name, arg: args.topic && args.topic !== "general" ? args.topic : null, argText };
    default:
      return null;
  }
}

const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };

/** Tool output is HTML for the chat window; the model gets plain text with links kept as markdown. */
export function htmlToText(html) {
  return html
    .replace(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")
    .replace(/<li>/g, "\n- ")
    .replace(/<\/p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|#39);/g, (entity) => ENTITIES[entity])
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/** Run a tool the model asked for and return plain text for the model to read. */
export function runTool(name, args) {
  const call = toToolCall(name, args);
  if (!call) return `Unknown tool "${name}".`;
  return htmlToText(TOOLS[call.tool](call.arg));
}
