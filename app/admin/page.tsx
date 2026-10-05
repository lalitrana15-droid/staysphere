import { Building2, MapPin, Mail, Users, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";
import { properties } from "@/data/properties";
import { destinations } from "@/data/destinations";

const stats = [
  {
    label: "Total Properties",
    value: properties.length,
    icon: Building2,
    href: "/admin/properties",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Destinations",
    value: destinations.length,
    icon: MapPin,
    href: "/admin/destinations",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Featured Properties",
    value: properties.filter((p) => p.featured).length,
    icon: TrendingUp,
    href: "/admin/properties",
    color: "text-gold-500",
    bg: "bg-gold-500/10",
  },
  {
    label: "With Pool",
    value: properties.filter((p) => p.has_pool).length,
    icon: Eye,
    href: "/admin/properties",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-charcoal dark:text-ivory">
          Dashboard
        </h1>
        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 mt-1">
          Welcome to the StaySphere admin panel.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6 hover:shadow-luxury-sm transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded ${stat.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="font-display text-4xl font-light text-charcoal dark:text-ivory">
                {stat.value}
              </p>
              <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 mt-1 tracking-wide uppercase">
                {stat.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-sans text-sm font-medium text-charcoal dark:text-ivory tracking-wide">
              Recent Properties
            </h2>
            <Link
              href="/admin/properties"
              className="text-xs font-sans text-gold-600 dark:text-gold-400 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {properties.slice(0, 5).map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between py-2.5 border-b border-stone-100 dark:border-stone-800 last:border-0"
              >
                <div>
                  <p className="text-sm font-sans text-charcoal dark:text-ivory">
                    {property.title}
                  </p>
                  <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50">
                    {property.city}, {property.country}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {property.featured && (
                    <span className="px-2 py-0.5 bg-gold-500/10 text-gold-600 text-[9px] font-sans font-medium tracking-wide uppercase">
                      Featured
                    </span>
                  )}
                  <Link
                    href={`/properties/${property.slug}`}
                    target="_blank"
                    className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 hover:text-gold-600 dark:hover:text-gold-400"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
          <h2 className="font-sans text-sm font-medium text-charcoal dark:text-ivory tracking-wide mb-5">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              { label: "Add New Property", href: "/admin/properties/new", icon: Building2 },
              { label: "View All Leads", href: "/admin/leads", icon: Mail },
              { label: "Agent Applications", href: "/admin/agents", icon: Users },
              { label: "Manage Destinations", href: "/admin/destinations", icon: MapPin },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 border border-stone-200 dark:border-stone-800 hover:border-gold-500/40 hover:bg-gold-500/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-gold-500" />
                  <span className="text-sm font-sans text-charcoal dark:text-ivory">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Supabase Notice */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40">
            <p className="text-xs font-sans text-amber-700 dark:text-amber-400 leading-relaxed">
              <strong>Setup Required:</strong> Configure your Supabase credentials in{" "}
              <code className="font-mono">.env.local</code> to enable full admin functionality including leads management and database operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
