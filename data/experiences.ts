import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "1",
    slug: "weddings",
    title: "Luxury Weddings",
    category: "weddings",
    description:
      "Transform your wedding into an extraordinary saga set against the backdrop of India's most breathtaking destinations. From intimate ceremonies on Udaipur lakefronts to grand Rajasthani celebrations in historic forts, StaySphere curates wedding experiences that transcend the ordinary.",
    short_description: "Extraordinary destination weddings in India's most breathtaking settings",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=90",
    featured: true,
  },
  {
    id: "2",
    slug: "corporate-retreats",
    title: "Corporate Retreats",
    category: "corporate",
    description:
      "Elevate your corporate offsite from a meeting to a transformative experience. Our luxury properties across India and the world provide the perfect canvas for leadership retreats, team-building programmes, and executive strategy sessions in an environment that inspires.",
    short_description: "Transformative corporate offsites and executive retreats",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=1200&q=90",
    featured: true,
  },
  {
    id: "3",
    slug: "private-celebrations",
    title: "Private Celebrations",
    category: "celebrations",
    description:
      "Milestone birthdays, anniversaries, family reunions — every celebration deserves a spectacular stage. Our team of luxury event specialists will transform your chosen property into a bespoke celebration experience.",
    short_description: "Bespoke milestone celebrations in exclusive private properties",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=90",
    featured: false,
  },
  {
    id: "4",
    slug: "creator-retreats",
    title: "Creator Retreats",
    category: "creator",
    description:
      "Designed for content creators, photographers, and social media professionals who demand extraordinary backdrops. Our curated creator packages include drone permits, styling support, and access to the most photogenic properties in our network.",
    short_description: "Content creation packages in cinematically stunning luxury properties",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=90",
    featured: true,
  },
  {
    id: "5",
    slug: "luxury-photography",
    title: "Luxury Photography",
    category: "photography",
    description:
      "Whether for a fashion editorial, pre-wedding shoot, or personal portfolio, our properties provide unparalleled backdrops. We coordinate with professional photographers, manage location permissions, and ensure every detail is perfect.",
    short_description: "Editorial and portfolio shoots at India's most stunning private estates",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=90",
    featured: false,
  },
  {
    id: "6",
    slug: "private-dining",
    title: "Private Dining",
    category: "dining",
    description:
      "From intimate candlelit dinners to elaborate multi-course gastronomic journeys, our chef partnerships bring Michelin-starred sensibilities to your private table. Customised menus, wine pairings, and theatrical dining experiences.",
    short_description: "Michelin-calibre private dining experiences in exclusive settings",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=90",
    featured: false,
  },
  {
    id: "7",
    slug: "airport-transfers",
    title: "Airport Transfers",
    category: "transfers",
    description:
      "Begin your luxury experience from the moment you land. Our curated fleet of premium vehicles, from BMW sedans to luxury vans, ensures seamless, comfortable transfers with professional, discreet chauffeurs.",
    short_description: "Premium chauffeur transfers to begin and end your luxury stay",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=90",
    featured: false,
  },
  {
    id: "8",
    slug: "wellness-escapes",
    title: "Wellness Escapes",
    category: "wellness",
    description:
      "Immersive wellness retreats combining Ayurveda, yoga, meditation, and nutritional therapy in the most serene luxury properties. Our wellness coordinators design personalised programmes to restore, rejuvenate, and transform.",
    short_description: "Immersive Ayurveda, yoga, and wellness retreats in luxury sanctuaries",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=90",
    featured: true,
  },
];

export function getFeaturedExperiences(): Experience[] {
  return experiences.filter((e) => e.featured);
}

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}
