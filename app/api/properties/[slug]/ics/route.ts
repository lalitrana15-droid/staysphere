import { NextResponse } from "next/server";
import { getPropertyBySlug } from "@/data/properties";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toICSDate(date: Date): string {
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds()) +
    "Z"
  );
}

function foldLine(line: string): string {
  const MAX = 75;
  if (line.length <= MAX) return line;
  let result = "";
  let i = 0;
  while (i < line.length) {
    if (i === 0) {
      result += line.substring(0, MAX);
      i = MAX;
    } else {
      result += "\r\n " + line.substring(i, i + MAX - 1);
      i += MAX - 1;
    }
  }
  return result;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const now = new Date();
  const uid = `${property.slug}-${now.getTime()}@staysphere.com`;
  const dtstamp = toICSDate(now);

  const description = property.short_description
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,");

  const summary = `${property.title} — StaySphere`;

  const location = [property.city, property.state, property.country]
    .filter(Boolean)
    .join(", ");

  const url = `https://staysphere.com/properties/${property.slug}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//StaySphere//Property Enquiry//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    foldLine(`UID:${uid}`),
    `DTSTAMP:${dtstamp}`,
    foldLine(`SUMMARY:${summary}`),
    foldLine(`DESCRIPTION:${description}\\n\\nProperty Code: ${property.code ?? "N/A"}\\nLocation: ${location}\\nBedrooms: ${property.bedrooms} | Bathrooms: ${property.bathrooms} | Max Guests: ${property.max_guests}\\n\\nEnquire at: ${url}`),
    foldLine(`LOCATION:${location}`),
    foldLine(`URL:${url}`),
    "STATUS:TENTATIVE",
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const icsContent = lines.join("\r\n");

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${property.slug}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
