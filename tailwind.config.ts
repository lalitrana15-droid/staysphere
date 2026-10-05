import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#FEFDF8",
          100: "#FDF9EF",
          200: "#FAF3DC",
          300: "#F7ECC8",
          400: "#F2E0A2",
          500: "#EDD47B",
          DEFAULT: "#F5F0E8",
        },
        gold: {
          50: "#FBF7EC",
          100: "#F5EACC",
          200: "#ECD499",
          300: "#E0BB62",
          400: "#D4A235",
          500: "#C8911A",
          600: "#A87315",
          700: "#875910",
          800: "#664300",
          900: "#4A3000",
          DEFAULT: "#C8911A",
        },
        charcoal: {
          50: "#F5F5F5",
          100: "#E8E8E8",
          200: "#D0D0D0",
          300: "#A8A8A8",
          400: "#808080",
          500: "#606060",
          600: "#484848",
          700: "#383838",
          800: "#282828",
          900: "#1A1A1A",
          DEFAULT: "#2C2C2C",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-gold":
          "linear-gradient(135deg, #C8911A 0%, #E0BB62 50%, #C8911A 100%)",
        "gradient-luxury":
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        luxury:
          "0 20px 60px -10px rgba(0, 0, 0, 0.3), 0 10px 20px -5px rgba(0, 0, 0, 0.2)",
        "luxury-sm":
          "0 10px 30px -5px rgba(0, 0, 0, 0.2), 0 5px 10px -2px rgba(0, 0, 0, 0.15)",
        gold: "0 0 30px rgba(200, 145, 26, 0.3)",
        "gold-sm": "0 0 15px rgba(200, 145, 26, 0.2)",
      },
      letterSpacing: {
        luxury: "0.15em",
        widest: "0.25em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
