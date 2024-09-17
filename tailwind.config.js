module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        blue: {
          500: '#4299e1',
          600: '#3182ce',
          700: '#2b6cb0',
        },
        green: {
          400: '#68d391',
          500: '#48bb78',
        },
      },
      maxHeight: {
        'screen-70': '70vh',
      },
    },
  },
  plugins: [],
};
