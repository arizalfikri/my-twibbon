export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F3FA',
          100: '#D5DEEF',
          200: '#B1C9EF',
          300: '#8AAEEA',
          400: '#628ECB',
          450: '#4F74A7',
          500: '#395886',
          600: '#2F4A6F',
          700: '#253C5A',
          800: '#1C2E45',
          900: '#132030',
        },
        brand: {
          light: '#D5DEEF',
          DEFAULT: '#395886',
          dark: '#2F4A6F',
        }
      },
    },
  },
  plugins: [],
};
