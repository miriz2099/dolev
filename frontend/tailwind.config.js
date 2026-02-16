/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dolev-blue": "#1a73e8",
        "dolev-dark": "#0d47a1",
      },
    },
  },
  plugins: [],
};
