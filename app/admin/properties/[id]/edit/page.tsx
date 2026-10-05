import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { properties } from "@/data/properties";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;
  const property = properties.find((p) => p.id === id || p.slug === id);

  if (!property) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/properties"
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-serif font-light text-charcoal dark:text-ivory">
          Edit Property
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          {property.title} — {property.city}
        </p>
      </div>

      <PropertyForm
        defaultValues={{
          title: property.title,
          slug: property.slug,
          destination_slug: property.destination_slug,
          city: property.city,
          country: property.country,
          state: property.state,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          max_guests: property.max_guests,
          has_pool: property.has_pool,
          featured: property.featured,
          property_type: property.property_type as "villa" | "estate" | "penthouse" | "retreat" | "bungalow",
          description: property.description,
          short_description: property.short_description,
        }}
        mode="edit"
        propertyId={property.id}
      />
    </div>
  );
}
