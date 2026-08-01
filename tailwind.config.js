/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:  '#E8622A',
          orange2: '#F07030',
          green:   '#4CAF82',
          blue:    '#4A7CC7',
          yellow:  '#F5C842',
          red:     '#E24B4A',
          purple:  '#9B59B6',
        },
        surface: {
          bg:      'rgba(var(--color-bg), <alpha-value>)',
          panel:   'rgba(var(--color-panel), <alpha-value>)',
          card:    'rgba(var(--color-card), <alpha-value>)',
          card2:   'rgba(var(--color-card2), <alpha-value>)',
          border:  'rgba(var(--color-border), <alpha-value>)',
          muted:   'rgba(var(--color-muted), <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      fontSize: {
        '3xl': '1.25rem',   // 20px (Compact)
        '4xl': '1.5rem',    // 24px (Compact)
        '5xl': '1.75rem',   // 28px (Compact)
        '6xl': '2.125rem',  // 34px (Compact)
        '7xl': '2.625rem',  // 42px (Compact)
      },
      fontWeight: {
        medium: '300',     // Light instead of Medium (500)
        semibold: '400',   // Regular instead of Semibold (600)
        bold: '400',       // Regular instead of Bold (700)
        extrabold: '400',  // Regular instead of Extra Bold (800)
        black: '500',      // Medium instead of Black (900)
      },
    },
  },
  plugins: [],
}
