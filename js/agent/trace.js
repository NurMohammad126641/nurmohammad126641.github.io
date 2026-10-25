// Plain-English line for each tool call, shown above the call itself.

import { escapeHtml } from "../lib/html.js";
import { DETAILS } from "./knowledge.js";

const AREA = {
  ai: "AI work",
  data: "data engineering work",
  backend: "backend work",
  bi: "BI and dashboard work",
  impact: "biggest results",
  open_source: "open-source code",
  featured: "best projects",
};
const COMPANY = { padakhep: "Padakhep", tallykhata: "TallyKhata" };

const examples = (n) => `${n} real example${n === 1 ? "" : "s"}`;

/** @returns {[string, string]} the line shown while the tool runs, and once it has returned */
export function describeCall({ tool, arg }) {
  switch (tool) {
    case "get_profile":
      if (arg === "pitch") return ["Finding reasons to work with Nur", "Found 3 reasons to work with Nur"];
      if (arg === "stack") return ["Looking up Nur's skills", "Found Nur's skills and tools"];
      if (arg === "roles") return ["Looking up what Nur is open to", "Found what Nur is open to"];
      return ["Looking up Nur's profile", "Found Nur's profile"];

    case "get_projects":
      if (typeof arg === "string") return [`Looking up Nur's ${AREA[arg]}`, `Found Nur's ${AREA[arg]}`];
      return [
        `Opening the ${DETAILS[arg.name].title} project`,
        `Opened the ${DETAILS[arg.name].title} project`,
      ];

    case "get_experience":
      if (arg === "all") return ["Looking up Nur's work history", "Found Nur's work history"];
      return [`Looking up Nur's work at ${COMPANY[arg]}`, `Found Nur's work at ${COMPANY[arg]}`];

    case "find_evidence": {
      const name = escapeHtml(arg.name);
      const result = arg.evidence
        ? `found ${examples(arg.evidence.length)}`
        : arg.answer
          ? "not used in a real project yet"
          : "not found in Nur's profile";
      return [`Checking Nur's ${name} experience`, `Checked ${name}: ${result}`];
    }

    case "get_education":
      return ["Looking up Nur's education", "Found Nur's degree and courses"];

    default:
      if (arg === "location") return ["Looking up where Nur is based", "Found where Nur is based"];
      return ["Looking up how to reach Nur", "Found how to reach Nur"];
  }
}
