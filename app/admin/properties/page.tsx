import Link from "next/link";
import Image from "next/image";
import { Plus, BedDouble, Bath, Users, Waves, Edit, Eye } from "lucide-react";
import { properties } from "@/data/properties";


export default function AdminPropertiesPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-charcoal dark:text-ivory">
            Properties
          </h1>
          <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 mt-1">
            {properties.length} properties in the network
          </p>
        </div>
        <Link href="/admin/properties/new" className="btn-gold text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      {/* Properties Table */}
      <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800">
                <th className="text-left px-6 py-4 text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal/50 dark:text-ivory/50">
                  Property
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal/50 dark:text-ivory/50 hidden md:table-cell">
                  Location
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal/50 dark:text-ivory/50 hidden lg:table-cell">
                  Details
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal/50 dark:text-ivory/50">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal/50 dark:text-ivory/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b border-stone-100 dark:border-stone-900 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-10 flex-shrink-0 overflow-hidden bg-stone-100 dark:bg-stone-900">
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        {property.code && (
                          <span className="font-mono text-[10px] font-medium text-gold-600 dark:text-gold-400 bg-gold-500/8 dark:bg-gold-500/10 px-1.5 py-0.5 mb-1 inline-block">
                            {property.code}
                          </span>
                        )}
                        <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">
                          {property.title}
                        </p>
                        <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 font-mono">
                          {property.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                      {property.city}
                    </p>
                    <p className="text-xs font-sans text-charcoal/40 dark:text-ivory/40">
                      {property.country}
                    </p>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-4 text-xs font-sans text-charcoal/50 dark:text-ivory/50">
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5" />
                        {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {property.max_guests}
                      </span>
                      {property.has_pool && (
                        <span className="flex items-center gap-1">
                          <Waves className="w-3.5 h-3.5" />
                          Pool
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {property.featured && (
                        <span className="inline-block px-2 py-0.5 bg-gold-500/10 text-gold-600 dark:text-gold-400 text-[9px] font-sans font-medium tracking-wide uppercase w-fit">
                          Featured
                        </span>
                      )}
                      <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[9px] font-sans font-medium tracking-wide uppercase w-fit">
                        Active
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/properties/${property.slug}`}
                        target="_blank"
                        className="text-charcoal/40 dark:text-ivory/40 hover:text-gold-500 transition-colors"
                        title="View on site"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="text-charcoal/40 dark:text-ivory/40 hover:text-gold-500 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
