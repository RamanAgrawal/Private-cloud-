/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          card: '#1a1d27',
          border: '#2a2d3e',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
        },
        danger: '#ef4444',
        success: '#22c55e',
      },
    },
  },
  plugins: [],
};
