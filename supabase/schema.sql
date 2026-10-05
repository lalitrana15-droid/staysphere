-- StaySphere Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DESTINATIONS
CREATE TABLE destinations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  description TEXT,
  short_description TEXT,
  hero_image TEXT,
  gallery_images TEXT[],
  featured BOOLEAN DEFAULT false,
  highlights TEXT[],
  best_time_to_visit TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROPERTIES
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  destination_id UUID REFERENCES destinations(id),
  destination_slug TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  max_guests INTEGER NOT NULL DEFAULT 2,
  has_pool BOOLEAN DEFAULT false,
  description TEXT,
  short_description TEXT,
  amenities TEXT[],
  images TEXT[],
  featured BOOLEAN DEFAULT false,
  price_on_request BOOLEAN DEFAULT true,
  starting_price DECIMAL,
  currency TEXT DEFAULT 'INR',
  property_type TEXT CHECK (property_type IN ('villa', 'estate', 'penthouse', 'retreat', 'bungalow')),
  tags TEXT[],
  highlights TEXT[],
  location_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXPERIENCES
CREATE TABLE experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LEADS (general enquiries)
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  property_id TEXT,
  destination TEXT,
  check_in DATE,
  check_out DATE,
  guests INTEGER,
  enquiry_type TEXT,
  source TEXT NOT NULL DEFAULT 'contact',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AGENT LEADS
CREATE TABLE agent_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  agency_name TEXT NOT NULL,
  website TEXT,
  years_experience TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OWNER LEADS
CREATE TABLE owner_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_name TEXT NOT NULL,
  property_location TEXT NOT NULL,
  bedrooms INTEGER,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'inspected', 'onboarded', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Public read access for properties, destinations, experiences
CREATE POLICY "Public read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);

-- Allow inserting leads from anyone (service role bypasses this)
CREATE POLICY "Allow lead inserts" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow agent lead inserts" ON agent_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow owner lead inserts" ON owner_leads FOR INSERT WITH CHECK (true);

-- Admin: service role can do everything
-- Properties and destinations managed via service role (admin panel)

-- INDEXES for performance
CREATE INDEX idx_properties_destination_slug ON properties(destination_slug);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_agent_leads_status ON agent_leads(status);
