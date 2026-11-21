const MARKETING_IMAGE_PATTERNS = [
  "Guest_Experience_that_you_deserve",
  "ELIVAAS_Guest_Experience",
  "Alaya_Guest_Experience",
];

export function filterPropertyImages(images: string[]): string[] {
  return images.filter(
    (img) => !MARKETING_IMAGE_PATTERNS.some((p) => img.includes(p))
  );
}

/**
 * Always request our image CDN with a width. Some originals return 404 when fetched
 * without a resize parameter (e.g. Vembanad House), but every image works with ?w=.
 * Other hosts and local files are returned unchanged.
 */
export function sizedImage(url: string | undefined, width = 1200): string {
  if (!url) return "";
  if (!url.startsWith("https://img.staysvacation.com/")) return url;
  if (/[?&]w=/.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}w=${width}`;
}
