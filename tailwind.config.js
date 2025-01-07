/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'se': '320px',     // Custom extra small
        'see': '370px',     // Custom extra small
        'seee': '430px',     // Custom extra small
        'de': '480px',     // Custom extra small
        'dee': '530px',     // Custom extra small
        'sm': '640px',     // Small (default)
        'md': '768px',     // Medium (default)
        'mdd': '810px',     // Medium (default)
        'mddd': '910px',     // Medium (default)
        'e': '1000px',     // Medium (default)
        'ee': '1100px',     // Medium (default)
        'lg': '1200px',    // Large (default)
        'xl': '1280px',    // Extra Large (default)
        '2xl': '1536px',   // 2XL (default)
        '3xl': '1920px',   // Custom for larger screens
        'tall': { 'raw': '(min-height: 800px)' }, // Height-based query
        'se-only': { 'max': '321px' },  // Applies up to 639px width
        'see-only': { 'max': '390px' },  // Applies up to 639px width
        'seee-only': { 'max': '430px' },  // Applies up to 639px width
        'de-only': { 'max': '480px' },  // Applies up to 639px width
        'dee-only': { 'max': '530px' },  // Applies up to 639px width
        'sm-only': { 'max': '640px' },  // Applies up to 639px width
        'md-only': { 'max': '768px' },  // Applies up to 767px width
        'mdd-only': { 'max': '810px' },  // Applies up to 767px width
        'mddd-only': { 'max': '910px' },  // Applies up to 767px width
        'e-only': { 'max': '1000px' },  // Applies up to 767px width
        'ee-only': { 'max': '1100px' },  // Applies up to 767px width
        'lg-only': { 'max': '1023px' }, // Applies up to 1023px width
      }
    },
  },
  plugins: [],
}

