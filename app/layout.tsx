import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://staysphere.com"),
  title: {
    default: "StaySphere — Global Luxury Stay Distribution Network",
    template: "%s | StaySphere",
  },
  description:
    "Discover extraordinary luxury villas, estates, and private retreats across India, Dubai, Bali and beyond. The world's most curated luxury stay marketplace.",
  keywords: [
    "luxury villas India",
    "luxury villas Udaipur",
    "luxury villas Goa",
    "luxury villas Jaipur",
    "private pool villas India",
    "luxury stays marketplace",
    "villa rentals India",
    "StaySphere",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://staysphere.com",
    siteName: "StaySphere",
    title: "StaySphere — Global Luxury Stay Distribution Network",
    description:
      "Discover extraordinary luxury villas and private retreats across India and the world.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=90",
        width: 1200,
        height: 630,
        alt: "StaySphere Luxury Stays",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StaySphere — Global Luxury Stay Distribution Network",
    description:
      "Discover extraordinary luxury villas and private retreats across India and the world.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
