import Link from "next/link";
import { LayoutDashboard, Building2, MapPin, Mail, Users, Home, LogOut, Briefcase, ShieldCheck } from "lucide-react";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Building2 },
  { label: "Destinations", href: "/admin/destinations", icon: MapPin },
  { label: "Leads", href: "/admin/leads", icon: Mail },
  { label: "Agent Applications", href: "/admin/agents", icon: Users },
  { label: "Agent Tools", href: "/admin/agent-tools", icon: Briefcase },
  { label: "Guest KYC", href: "/admin/kyc", icon: ShieldCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-charcoal dark:bg-[#080808] flex flex-col fixed h-full">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="flex flex-col">
            <span className="font-display text-xl font-light tracking-[0.08em] text-ivory">
              StaySphere
            </span>
            <span className="text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-gold-400 mt-0.5">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-xs font-sans font-medium tracking-[0.08em] uppercase text-ivory/50 hover:text-ivory hover:bg-white/5 transition-all duration-150 rounded"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-xs font-sans font-medium text-ivory/50 hover:text-ivory hover:bg-white/5 transition-all duration-150 rounded"
          >
            <Home className="w-4 h-4" />
            Back to Site
          </Link>
          <button className="flex w-full items-center gap-3 px-3 py-2.5 text-xs font-sans font-medium text-ivory/50 hover:text-red-400 hover:bg-white/5 transition-all duration-150 rounded">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
