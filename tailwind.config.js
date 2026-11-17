/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '380px',
      },
      colors: {
        lodha: {
          header: '#1D3530', // Main upper background
          panel: '#284F45', // "Welcome back" panel
          btn: '#245348', // "Sign in" button
          btnHover: '#1B3F37',
          gold: '#C59B4E', // Luxury gold accent
          goldLight: '#DFBE79',
          cream: '#FAF9F6', // Light background
          sand: '#EFECE6', // Footer background
          stone: '#E5E0D8', // Subtle border/card
          dark: '#14221F', // Primary text
          muted: '#63706B', // Secondary text
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 4px 20px -2px rgba(29, 53, 48, 0.06)',
        'luxury-light': '0 12px 35px -8px rgba(29, 53, 48, 0.12)',
        'gold-soft': '0 0 20px rgba(197, 155, 78, 0.25)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};