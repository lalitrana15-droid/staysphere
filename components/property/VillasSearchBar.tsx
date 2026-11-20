"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ChevronDown, Calendar, Users, Search } from "lucide-react";

interface Destination {
  city: string;
  state: string;
  count: number;
}

interface Props {
  destinations: Destination[];
  currentCity: string;
  currentGuests: number;
  currentCheckin: string;
  currentCheckout: string;
}

export function VillasSearchBar({
  destinations,
  currentCity,
  currentGuests,
  currentCheckin,
  currentCheckout,
}: Props) {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [guests, setGuests] = useState(currentGuests);
  const [checkin, setCheckin] = useState(currentCheckin);
  const [checkout, setCheckout] = useState(currentCheckout);
  const [destOpen, setDestOpen] = useState(false);
  const [destSearch, setDestSearch] = useState("");
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedCity(currentCity);
    setGuests(currentGuests);
    setCheckin(currentCheckin);
    setCheckout(currentCheckout);
  }, [currentCity, currentGuests, currentCheckin, currentCheckout]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestOpen(false);
        setDestSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredDests = destinations.filter((d) =>
    d.city.toLowerCase().includes(destSearch.toLowerCase())
  );

  const today = new Date().toISOString().split("T")[0];

  function applySearch() {
    const params = new URLSearchParams();
    if (selectedCity) params.set("city", selectedCity);
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (guests > 0) params.set("guests", String(guests));
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
    setDestOpen(false);
  }

  function formatDate(d: string) {
    if (!d) return "";
    return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#181818] shadow-sm">
      {/* Destination */}
      <div
        ref={destRef}
        className="relative flex-1 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-700"
      >
        <button
          onClick={() => setDestOpen((o) => !o)}
          className="w-full flex items-center gap-3 px-5 py-4 text-left"
        >
          <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-charcoal/40 dark:text-ivory/40 mb-0.5">
              Destination
            </p>
            <p
              className={`text-sm font-sans truncate ${
                selectedCity
                  ? "text-charcoal dark:text-ivory"
                  : "text-charcoal/30 dark:text-ivory/30"
              }`}
            >
              {selectedCity || "All destinations"}
            </p>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-charcoal/30 dark:text-ivory/30 transition-transform duration-200 ${
              destOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {destOpen && (
          <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-[#181818] border border-stone-200 dark:border-stone-700 shadow-luxury mt-1 max-h-72 overflow-hidden flex flex-col">
            <div className="p-2 border-b border-stone-100 dark:border-stone-800">
              <input
                type="text"
                placeholder="Search destinations..."
                value={destSearch}
                onChange={(e) => setDestSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-sm font-sans bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-charcoal dark:text-ivory placeholder:text-charcoal/30 dark:placeholder:text-ivory/30 focus:outline-none"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedCity("");
                  setDestOpen(false);
                  setDestSearch("");
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-sans transition-colors ${
                  !selectedCity
                    ? "bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400"
                    : "text-charcoal/70 dark:text-ivory/70 hover:bg-stone-50 dark:hover:bg-stone-800"
                }`}
              >
                All destinations
                <span className="ml-2 text-xs text-charcoal/30 dark:text-ivory/30">
                  ({destinations.reduce((s, d) => s + d.count, 0)})
                </span>
              </button>
              {filteredDests.map((d) => (
                <button
                  key={d.city}
                  onClick={() => {
                    setSelectedCity(d.city);
                    setDestOpen(false);
                    setDestSearch("");
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-sans transition-colors ${
                    selectedCity === d.city
                      ? "bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400"
                      : "text-charcoal/70 dark:text-ivory/70 hover:bg-stone-50 dark:hover:bg-stone-800"
                  }`}
                >
                  {d.city}
                  {d.state ? (
                    <span className="text-charcoal/30 dark:text-ivory/30">
                      , {d.state}
                    </span>
                  ) : null}
                  <span className="ml-2 text-xs text-charcoal/30 dark:text-ivory/30">
                    ({d.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Check-in */}
      <div className="flex items-center gap-2 px-5 py-4 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-700 md:w-44">
        <Calendar className="w-4 h-4 text-gold-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-charcoal/40 dark:text-ivory/40 mb-0.5">
            Check-in
          </p>
          <input
            type="date"
            value={checkin}
            min={today}
            onChange={(e) => {
              setCheckin(e.target.value);
              if (checkout && e.target.value >= checkout) setCheckout("");
            }}
            className="w-full text-sm font-sans bg-transparent text-charcoal dark:text-ivory focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>

      {/* Check-out */}
      <div className="flex items-center gap-2 px-5 py-4 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-700 md:w-44">
        <Calendar className="w-4 h-4 text-gold-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-charcoal/40 dark:text-ivory/40 mb-0.5">
            Check-out
          </p>
          <input
            type="date"
            value={checkout}
            min={checkin || today}
            onChange={(e) => setCheckout(e.target.value)}
            className="w-full text-sm font-sans bg-transparent text-charcoal dark:text-ivory focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center gap-3 px-5 py-4 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-700 md:w-44">
        <Users className="w-4 h-4 text-gold-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-charcoal/40 dark:text-ivory/40 mb-0.5">
            Guests
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGuests((g) => Math.max(0, g - 1))}
              className="w-5 h-5 flex items-center justify-center text-charcoal/40 dark:text-ivory/40 hover:text-charcoal dark:hover:text-ivory border border-stone-200 dark:border-stone-700 text-sm leading-none"
            >
              −
            </button>
            <span className="text-sm font-sans text-charcoal dark:text-ivory w-6 text-center">
              {guests === 0 ? "Any" : guests}
            </span>
            <button
              onClick={() => setGuests((g) => g + 1)}
              className="w-5 h-5 flex items-center justify-center text-charcoal/40 dark:text-ivory/40 hover:text-charcoal dark:hover:text-ivory border border-stone-200 dark:border-stone-700 text-sm leading-none"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={applySearch}
        className="flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white transition-colors duration-200"
      >
        <Search className="w-4 h-4" />
        <span className="text-[11px] font-sans font-semibold tracking-[0.15em] uppercase">
          Search
        </span>
      </button>

      {(checkin || checkout) && (
        <div className="hidden">
          {checkin && formatDate(checkin)} {checkout && formatDate(checkout)}
        </div>
      )}
    </div>
  );
}
