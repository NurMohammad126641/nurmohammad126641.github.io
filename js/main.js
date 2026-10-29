import { initChat } from "./agent/chat.js";
import { initContact } from "./ui/contact.js";
import { initDemo } from "./ui/demo.js";
import { initNavigation } from "./ui/navigation.js";
import { initPalette } from "./ui/palette.js";
import { initReveal } from "./ui/reveal.js";
import { initSpotlight } from "./ui/spotlight.js";
import { initTheme } from "./ui/theme.js";

initTheme();
initReveal();
initNavigation();
initSpotlight();
initContact();
initDemo();
initPalette();
initChat();
