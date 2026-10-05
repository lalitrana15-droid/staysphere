export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  state?: string;
  description: string;
  short_description: string;
  hero_image: string;
  gallery_images?: string[];
  featured: boolean;
  property_count?: number;
  highlights?: string[];
  best_time_to_visit?: string;
  created_at?: string;
}

export interface Property {
  id: string;
  slug: string;
  code?: string;
  title: string;
  destination_id: string;
  destination_slug: string;
  city: string;
  country: string;
  state?: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  has_pool: boolean;
  description: string;
  short_description: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  price_on_request: boolean;
  starting_price?: number;
  currency?: string;
  property_type: "villa" | "estate" | "penthouse" | "retreat" | "bungalow";
  tags?: string[];
  highlights?: string[];
  location_description?: string;
  created_at?: string;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  category: ExperienceCategory;
  description: string;
  short_description: string;
  image: string;
  icon?: string;
  featured: boolean;
}

export type ExperienceCategory =
  | "weddings"
  | "corporate"
  | "celebrations"
  | "creator"
  | "photography"
  | "dining"
  | "transfers"
  | "wellness";

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id?: string;
  destination?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  source: "contact" | "property" | "experience";
  created_at?: string;
}

export interface AgentLead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  agency_name: string;
  website?: string;
  years_experience?: number;
  message: string;
  status?: "pending" | "approved" | "rejected";
  created_at?: string;
}

export interface OwnerLead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  property_name: string;
  property_location: string;
  bedrooms?: number;
  message: string;
  status?: "pending" | "contacted" | "onboarded";
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  quote: string;
  rating: number;
  property?: string;
  stay_type?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}
