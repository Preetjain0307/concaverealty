/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lodha: {
          header: '#1D3530',    // Main upper background requested by user
          panel: '#284F45',     // "Welcome back" right-side panel
          btn: '#245348',       // "Sign in" button
          btnHover: '#1B3F37',
          gold: '#C59B4E',      // Luxury champagne gold accent
          goldLight: '#DFBE79',
          cream: '#FAF9F6',     // Light luxury background
          sand: '#EFECE6',      // Lodha footer background
          stone: '#E5E0D8',     // Subtle border / card color
          dark: '#14221F',      // Primary body text
          muted: '#63706B',     // Secondary text
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(29, 53, 48, 0.06)',
        'luxury-light': '0 12px 35px -8px rgba(29, 53, 48, 0.12)',
        'gold-soft': '0 0 20px rgba(197, 155, 78, 0.25)',
      }
    },
  },
  plugins: [],
}
