import Link from "next/link";
import Image from "next/image";
import { destinations } from "@/data/destinations";
import { getPropertiesByDestination } from "@/data/properties";

export default function AdminDestinationsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-charcoal dark:text-ivory">
            Destinations
          </h1>
          <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 mt-1">
            {destinations.length} destinations in the network
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {destinations.map((destination) => {
          const props = getPropertiesByDestination(destination.slug);
          return (
            <div
              key={destination.id}
              className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 overflow-hidden"
            >
              <div className="relative h-36">
                <Image
                  src={destination.hero_image}
                  alt={destination.name}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-3 left-4">
                  <h3 className="font-serif text-lg font-light text-white">
                    {destination.name}
                  </h3>
                  <p className="text-xs font-sans text-white/70">
                    {destination.state ? `${destination.state}, ` : ""}
                    {destination.country}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-charcoal/50 dark:text-ivory/50">
                    {props.length} {props.length === 1 ? "property" : "properties"}
                  </span>
                  <div className="flex gap-3">
                    <Link
                      href={`/destinations/${destination.slug}`}
                      target="_blank"
                      className="text-xs font-sans text-gold-600 dark:text-gold-400 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
