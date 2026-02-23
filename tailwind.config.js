/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1d70d1',
          'blue-light': '#e6f0fd',
        },
        surface: {
          background: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        },
        content: {
          primary: '#0f172a',
          secondary: '#334155',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
