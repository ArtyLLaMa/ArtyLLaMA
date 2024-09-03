/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'chat-bg': '#1a1a1a',
        'sidebar-bg': '#252525',
        'input-bg': '#2a2a2a',
        'button-primary': '#3b82f6',
        'button-primary-hover': '#2563eb',
        'text-primary': '#ffffff',
        'text-secondary': '#a0aec0',
        gray: {
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '1rem',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
      },
      minHeight: {
        '16': '4rem',
      },
      width: {
        'artifact': '33.333333%', // 1/3 width for the artifact panel
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
  safelist: [
    'bg-red-600',
    'text-white',
    'p-2',
    'rounded',
    'mb-2',
    'ml-2',
    'px-2',
    'py-1',
    'bg-red-700',
    'hover:bg-red-800',
    'transition-colors',
    'bg-gray-900',
    'p-4',
    'overflow-auto',
    'max-h-60',
    'text-sm',
    'whitespace-pre-wrap',
    'break-all'
  ]
}
