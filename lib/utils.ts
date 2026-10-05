import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGuestCount(count: number): string {
  return `${count} ${count === 1 ? "Guest" : "Guests"}`;
}

export function formatBedrooms(count: number): string {
  return `${count} ${count === 1 ? "Bedroom" : "Bedrooms"}`;
}

export function formatBathrooms(count: number): string {
  return `${count} ${count === 1 ? "Bathroom" : "Bathrooms"}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
