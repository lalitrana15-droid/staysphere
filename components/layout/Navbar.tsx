"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Destinations",
    href: "/destinations",
    children: [
      { label: "Udaipur", href: "/destinations/udaipur" },
      { label: "Goa", href: "/destinations/goa" },
      { label: "Jaipur", href: "/destinations/jaipur" },
      { label: "Jodhpur", href: "/destinations/jodhpur" },
      { label: "Kasauli", href: "/destinations/kasauli" },
      { label: "Mussoorie", href: "/destinations/mussoorie" },
      { label: "Lonavala", href: "/destinations/lonavala" },
      { label: "Alibaug", href: "/destinations/alibaug" },
      { label: "Dubai", href: "/destinations/dubai" },
      { label: "Bali", href: "/destinations/bali" },
    ],
  },
  { label: "Experiences", href: "/experiences" },
  { label: "About", href: "/about" },
  { label: "Agent Program", href: "/agent-program" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || !isHome
          ? "bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-stone-200/60 dark:border-stone-800/60 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="luxury-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start group">
            <span
              className={cn(
                "font-display text-2xl font-light tracking-[0.08em] transition-colors duration-300",
                scrolled || !isHome
                  ? "text-charcoal dark:text-ivory"
                  : "text-white"
              )}
            >
              StaySphere
            </span>
            <span
              className={cn(
                "text-[9px] font-sans font-medium tracking-[0.25em] uppercase transition-colors duration-300",
                scrolled || !isHome
                  ? "text-gold-500"
                  : "text-gold-300"
              )}
            >
              Luxury Stays
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 text-[11px] font-sans font-medium tracking-[0.15em] uppercase transition-all duration-200",
                    scrolled || !isHome
                      ? "text-charcoal/70 dark:text-ivory/70 hover:text-gold-600 dark:hover:text-gold-400"
                      : "text-white/80 hover:text-white",
                    pathname === item.href &&
                      (scrolled || !isHome)
                      ? "text-gold-600 dark:text-gold-400"
                      : ""
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  )}
                </Link>

                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                    <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 shadow-luxury py-2 w-44">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-2 text-[11px] font-sans font-medium tracking-[0.1em] uppercase text-charcoal/70 dark:text-ivory/70 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-all duration-150"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "p-2 transition-colors duration-200",
                  scrolled || !isHome
                    ? "text-charcoal/60 dark:text-ivory/60 hover:text-charcoal dark:hover:text-ivory"
                    : "text-white/60 hover:text-white"
                )}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Enquire CTA */}
            <Link
              href="/contact"
              className={cn(
                "hidden lg:inline-flex items-center gap-2 px-6 py-2.5 text-[11px] font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300",
                scrolled || !isHome
                  ? "bg-charcoal dark:bg-ivory text-ivory dark:text-charcoal hover:bg-gold-600 dark:hover:bg-gold-500 hover:text-white dark:hover:text-white"
                  : "bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-charcoal"
              )}
            >
              Enquire Now
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "lg:hidden p-2 transition-colors duration-200",
                scrolled || !isHome
                  ? "text-charcoal dark:text-ivory"
                  : "text-white"
              )}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-500",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-white dark:bg-[#0A0A0A] border-t border-stone-200/60 dark:border-stone-800/60 px-6 py-6">
          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block py-3 text-sm font-sans font-medium tracking-[0.1em] uppercase text-charcoal/70 dark:text-ivory/70 hover:text-gold-600 dark:hover:text-gold-400 border-b border-stone-100 dark:border-stone-900 transition-colors duration-200"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1 py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2 text-xs font-sans tracking-[0.08em] uppercase text-charcoal/50 dark:text-ivory/50 hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/contact" className="btn-primary w-full justify-center">
              Enquire Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
