import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      colors: {
        slate: {
          50: "#EFEAE0",   // cream (page backgrounds)
          100: "#E8E4DC",  // warm gray
          200: "#D9D5CE",
          300: "#B8B3AA",
          400: "#968E84",
          500: "#756E66",
          600: "#5A544E",
          700: "#3D3A36",
          800: "#262422",
          900: "#102448",  // navy (headings, dark text)
        },
        sky: {
          50: "#FDF4ED",   // light orange (hover bg)
          100: "#FBE8DB",
          200: "#F7D1B7",
          300: "#F3BA93",
          400: "#EFA36F",
          500: "#E89B6C",  // brand orange (CTAs, rings, accents)
          600: "#D48A5E",
          700: "#C07950",
          800: "#AC6842",
          900: "#985734",
        },
        primary: {
          50: "#E8ECF2",
          100: "#D1D9E6",
          200: "#A3B3CD",
          300: "#758DB4",
          400: "#47679B",
          500: "#2A4A7A",
          600: "#102448",  // navy (buttons, active states)
          700: "#0E1D3A",
          800: "#0B1630",
          900: "#081026",
        },
        secondary: {
          DEFAULT: "#EBE8E2",
          foreground: "#102448",
        },
        accent: {
          DEFAULT: "#E89B6C",
          foreground: "#102448",
        },
        muted: {
          DEFAULT: "#EBE8E2",
          foreground: "#6B7280",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FAFAF9",
        },
        border: "#D9D5CE",
        input: "#D9D5CE",
        ring: "#E89B6C",
        background: "#EFEAE0",
        foreground: "#0d1a2d",
        card: {
          DEFAULT: "#FAF9F7",
          foreground: "#0d1a2d",
        },
        popover: {
          DEFAULT: "#FAF9F7",
          foreground: "#0d1a2d",
        },
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        sm: "0.5rem",
        md: "0.625rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
