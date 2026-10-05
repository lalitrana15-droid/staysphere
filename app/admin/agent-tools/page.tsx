import Link from "next/link";
import Image from "next/image";
import { FileText, Download, Calendar, BedDouble, Bath, Users, Eye } from "lucide-react";
import { properties } from "@/data/properties";

export default function AgentToolsPage() {
  const grouped = properties.reduce<Record<string, typeof properties>>((acc, p) => {
    const key = p.city;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-charcoal dark:text-ivory">
          Agent Tools
        </h1>
        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 mt-1">
          Generate branded or unbranded PDF brochures and download ICS files for all {properties.length} properties
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mb-8 p-5 bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60">
        <div className="flex items-center gap-2 text-xs font-sans text-charcoal/70 dark:text-ivory/70">
          <FileText className="w-4 h-4 text-gold-500" />
          <span>Branded PDF — includes StaySphere logo &amp; contact details</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans text-charcoal/70 dark:text-ivory/70">
          <FileText className="w-4 h-4 text-charcoal/50 dark:text-ivory/50" />
          <span>Unbranded PDF — agent copy, no brand marks</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans text-charcoal/70 dark:text-ivory/70">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>ICS — calendar file for property enquiry</span>
        </div>
      </div>

      {/* Per-city groups */}
      {Object.entries(grouped).map(([city, cityProperties]) => (
        <div key={city} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-charcoal/50 dark:text-ivory/50">
              {city}
            </h2>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
            <span className="text-xs font-sans text-charcoal/40 dark:text-ivory/40">
              {cityProperties.length} {cityProperties.length === 1 ? "property" : "properties"}
            </span>
          </div>

          <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800">
                    <th className="text-left px-5 py-3 text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 dark:text-ivory/40 w-12">
                      Code
                    </th>
                    <th className="text-left px-5 py-3 text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 dark:text-ivory/40">
                      Property
                    </th>
                    <th className="text-left px-5 py-3 text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 dark:text-ivory/40 hidden md:table-cell">
                      Specs
                    </th>
                    <th className="text-right px-5 py-3 text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 dark:text-ivory/40">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cityProperties.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-stone-50 dark:border-stone-900/50 hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors"
                    >
                      {/* Code */}
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[10px] font-medium text-gold-600 dark:text-gold-400 bg-gold-500/8 dark:bg-gold-500/10 px-2 py-1 rounded-sm whitespace-nowrap">
                          {p.code ?? "—"}
                        </span>
                      </td>

                      {/* Property */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-8 flex-shrink-0 overflow-hidden bg-stone-100 dark:bg-stone-900">
                            <Image
                              src={p.images[0]}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory leading-snug">
                              {p.title}
                            </p>
                            <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 capitalize">
                              {p.property_type}
                              {p.has_pool ? " · Pool" : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Specs */}
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-3 text-xs text-charcoal/50 dark:text-ivory/50">
                          <span className="flex items-center gap-1">
                            <BedDouble className="w-3.5 h-3.5" />
                            {p.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5" />
                            {p.bathrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {p.max_guests}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {/* View on site */}
                          <Link
                            href={`/properties/${p.slug}`}
                            target="_blank"
                            title="View on site"
                            className="p-1.5 text-charcoal/30 dark:text-ivory/30 hover:text-charcoal dark:hover:text-ivory transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {/* Branded PDF */}
                          <Link
                            href={`/properties/${p.slug}/brochure?branded=true`}
                            target="_blank"
                            title="Branded PDF"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-500/10 hover:bg-gold-500/20 text-gold-600 dark:text-gold-400 text-[10px] font-sans font-medium tracking-wide uppercase transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            Branded
                          </Link>

                          {/* Unbranded PDF */}
                          <Link
                            href={`/properties/${p.slug}/brochure?branded=false`}
                            target="_blank"
                            title="Unbranded PDF"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-charcoal/70 dark:text-ivory/70 text-[10px] font-sans font-medium tracking-wide uppercase transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            Unbranded
                          </Link>

                          {/* ICS Download */}
                          <a
                            href={`/api/properties/${p.slug}/ics`}
                            download={`${p.slug}.ics`}
                            title="Download ICS"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-sans font-medium tracking-wide uppercase transition-colors"
                          >
                            <Calendar className="w-3 h-3" />
                            ICS
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
