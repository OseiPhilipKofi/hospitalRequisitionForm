/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006A6A',
          container: '#6FF7F6',
          on: '#FFFFFF',
          onContainer: '#002020',
        },
        secondary: {
          DEFAULT: '#9C4333',
          container: '#FFDAD4',
          on: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#F4FBFA',
          dim: '#D4DBDA',
          container: '#E6EEED',
          lowest: '#FFFFFF',
          highest: '#DCE4E3',
        },
        outline: '#6F7978',
      },
      fontFamily: {
        sans: ['"Roboto Flex"', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        m3: '1.75rem',
        m3lg: '1.25rem',
      },
      boxShadow: {
        m3: '0 1px 3px rgba(0, 32, 32, 0.12), 0 4px 12px rgba(0, 32, 32, 0.08)',
      },
    },
  },
  plugins: [],
};
