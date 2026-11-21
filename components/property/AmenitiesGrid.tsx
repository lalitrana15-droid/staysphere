"use client";

import { useState } from "react";
import {
  BedDouble, Snowflake, Droplets, Wifi, Tv, Shirt, Utensils, Sparkles, Car, Waves, Trees,
  CookingPot, Flame, ShieldCheck, Coffee, Bath, Check, Refrigerator, Wind, Dumbbell, Gamepad2,
  type LucideIcon,
} from "lucide-react";

const ICONS: [RegExp, LucideIcon][] = [
  [/bed|linen|pillow|blanket/i, BedDouble],
  [/air ?condition|\bac\b|cooling/i, Snowflake],
  [/hot water|geyser|shower|water/i, Droplets],
  [/wi-?fi|internet/i, Wifi],
  [/\btv\b|television|theatre/i, Tv],
  [/wardrobe|clothes|hanger|iron/i, Shirt],
  [/restaurant|dining|chef|crockery|cutlery|toaster|kettle|rice cooker/i, Utensils],
  [/housekeeping|cleaning|soap|shampoo|conditioner|hygiene|towel|essentials/i, Sparkles],
  [/parking/i, Car],
  [/pool|jacuzzi/i, Waves],
  [/garden|lawn|terrace|patio|outdoor|balcony|gazebo/i, Trees],
  [/kitchen|microwave|stove|induction|oven/i, CookingPot],
  [/bbq|bonfire|fire pit/i, Flame],
  [/cctv|security|first aid|fire extinguisher|safe/i, ShieldCheck],
  [/tea|coffee/i, Coffee],
  [/bath|tub/i, Bath],
  [/refrigerator|fridge/i, Refrigerator],
  [/fan|dryer/i, Wind],
  [/gym|spa|sauna/i, Dumbbell],
  [/game|play/i, Gamepad2],
];

function iconFor(name: string): LucideIcon {
  return ICONS.find(([re]) => re.test(name))?.[1] ?? Check;
}

export function AmenitiesGrid({ amenities, initial = 12 }: { amenities: string[]; initial?: number }) {
  const [all, setAll] = useState(false);
  const list = Array.from(new Set(amenities.map((a) => a.trim()).filter(Boolean)));
  const shown = all ? list : list.slice(0, initial);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4">
        {shown.map((a) => {
          const Icon = iconFor(a);
          return (
            <div key={a} className="flex items-center gap-3 text-charcoal/80 dark:text-ivory/80">
              <Icon className="w-[18px] h-[18px] flex-none text-gold-600 dark:text-gold-400" strokeWidth={1.5} />
              <span className="text-sm font-sans">{a}</span>
            </div>
          );
        })}
      </div>
      {list.length > initial && (
        <button
          onClick={() => setAll((v) => !v)}
          className="mt-5 text-sm font-sans font-medium text-gold-600 dark:text-gold-400 hover:underline"
        >
          {all ? "Show fewer amenities" : `View all ${list.length} amenities →`}
        </button>
      )}
    </div>
  );
}
