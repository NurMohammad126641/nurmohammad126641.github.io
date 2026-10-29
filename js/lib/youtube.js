// Turns a youtu.be share link into a privacy-enhanced embed URL. No DOM access, so it runs in Node tests too.

// youtu.be/ID?t=SECONDS -> youtube-nocookie embed that starts playing at that second.
export function embedSrc(href) {
  const url = new URL(href);
  const id = url.pathname.slice(1);
  const start = Number.parseInt(url.searchParams.get("t") || "0", 10) || 0;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&start=${start}`;
}
