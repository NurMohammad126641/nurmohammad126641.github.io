import { EMAIL } from "../config.js";
import { $ } from "../lib/dom.js";

export async function copyEmail() {
  const status = $("#copied");
  try {
    await navigator.clipboard.writeText(EMAIL);
    status.textContent = "Copied " + EMAIL;
  } catch {
    status.textContent = EMAIL;
  }
  setTimeout(() => {
    status.textContent = "";
  }, 3500);
}

export function initContact() {
  $("#copy-email").addEventListener("click", copyEmail);
}
