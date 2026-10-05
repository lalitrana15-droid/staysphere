"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { destinations } from "@/data/destinations";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  destination_slug: z.string().min(1),
  city: z.string().min(2),
  country: z.string().min(2),
  state: z.string().optional(),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  max_guests: z.number().min(1),
  has_pool: z.boolean(),
  featured: z.boolean(),
  property_type: z.enum(["villa", "estate", "penthouse", "retreat", "bungalow"]),
  description: z.string().min(50),
  short_description: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

interface PropertyFormProps {
  initialData?: Partial<FormData>;
  defaultValues?: Partial<FormData>;
  mode?: "create" | "edit";
  propertyId?: string;
}

export function PropertyForm({ initialData, defaultValues, mode = "create", propertyId }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { has_pool: false, featured: false, ...initialData, ...defaultValues },
  });

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput("");
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = { ...data, amenities, images };

      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url"
      ) {
        await fetch("/api/admin/properties", {
          method: mode === "edit" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: propertyId }),
        });
      }

      router.push("/admin/properties");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "input-luxury text-sm";
  const labelClass = "text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5";
  const errorClass = "text-xs text-red-400 mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
        <h2 className="font-sans text-sm font-medium text-charcoal dark:text-ivory mb-6 tracking-wide uppercase">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Title *</label>
            <input {...register("title")} className={cn(inputClass, errors.title && "border-red-400")} />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Slug *</label>
            <input {...register("slug")} className={cn(inputClass, errors.slug && "border-red-400")} placeholder="url-friendly-name" />
            {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Destination *</label>
            <select {...register("destination_slug")} className={cn(inputClass, errors.destination_slug && "border-red-400")}>
              <option value="">Select destination</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Property Type *</label>
            <select {...register("property_type")} className={inputClass}>
              {["villa", "estate", "penthouse", "retreat", "bungalow"].map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>City *</label>
            <input {...register("city")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Country *</label>
            <input {...register("country")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>State / Region</label>
            <input {...register("state")} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
        <h2 className="font-sans text-sm font-medium text-charcoal dark:text-ivory mb-6 tracking-wide uppercase">
          Property Specs
        </h2>
        <div className="grid grid-cols-3 gap-5 mb-5">
          <div>
            <label className={labelClass}>Bedrooms *</label>
            <input {...register("bedrooms", { valueAsNumber: true })} type="number" min="1" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bathrooms *</label>
            <input {...register("bathrooms", { valueAsNumber: true })} type="number" min="1" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Max Guests *</label>
            <input {...register("max_guests", { valueAsNumber: true })} type="number" min="1" className={inputClass} />
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register("has_pool")} type="checkbox" className="w-4 h-4 accent-gold-500" />
            <span className="text-sm font-sans text-charcoal dark:text-ivory">Has Pool</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register("featured")} type="checkbox" className="w-4 h-4 accent-gold-500" />
            <span className="text-sm font-sans text-charcoal dark:text-ivory">Featured Property</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
        <h2 className="font-sans text-sm font-medium text-charcoal dark:text-ivory mb-6 tracking-wide uppercase">
          Description
        </h2>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Short Description *</label>
            <input {...register("short_description")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Full Description *</label>
            <textarea {...register("description")} rows={6} className={cn(inputClass, "resize-none")} />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
        <h2 className="font-sans text-sm font-medium text-charcoal dark:text-ivory mb-6 tracking-wide uppercase">
          Amenities
        </h2>
        <div className="flex gap-3 mb-4">
          <input
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
            placeholder="Add amenity..."
            className={cn(inputClass, "flex-1")}
          />
          <button type="button" onClick={addAmenity} className="btn-gold py-2 px-4">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity) => (
            <span key={amenity} className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 dark:bg-stone-900 text-xs font-sans text-charcoal dark:text-ivory">
              {amenity}
              <button type="button" onClick={() => setAmenities(amenities.filter((a) => a !== amenity))}>
                <X className="w-3 h-3 text-charcoal/40 dark:text-ivory/40 hover:text-red-400" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
        <h2 className="font-sans text-sm font-medium text-charcoal dark:text-ivory mb-6 tracking-wide uppercase">
          Image URLs
        </h2>
        <div className="flex gap-3 mb-4">
          <input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            placeholder="Image URL..."
            className={cn(inputClass, "flex-1")}
          />
          <button type="button" onClick={addImage} className="btn-gold py-2 px-4">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {images.map((img, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs font-sans text-charcoal/60 dark:text-ivory/60 flex-1 truncate">{img}</span>
              <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}>
                <X className="w-3.5 h-3.5 text-charcoal/40 hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "edit" ? "Update Property" : "Save Property"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
