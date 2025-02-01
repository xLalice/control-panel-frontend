/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
        gold: {
          500: '#FFD700',
          600: '#FFC700',
          400: '#FFEC8B',
        },
        gray: {
          800: '#171717',
          900: "#0A0A0A"
        }
      },
  	}
  },
  plugins: [require("tailwindcss-animate")],
}