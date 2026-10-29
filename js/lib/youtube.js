// Reads youtu.be share links and turns them into privacy-enhanced embed URLs. No DOM access, so it runs in
// Node tests too.

// youtu.be/ID?t=SECONDS -> ID
export const videoId = (href) => new URL(href).pathname.slice(1);

// youtu.be/ID?t=SECONDS -> youtube-nocookie embed that starts playing at that second.
export function embedSrc(href) {
  const start = Number.parseInt(new URL(href).searchParams.get("t") || "0", 10) || 0;
  return `https://www.youtube-nocookie.com/embed/${videoId(href)}?autoplay=1&rel=0&playsinline=1&start=${start}`;
}
