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
