/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          youtube: "#FF0000",
          vlight: "#99859F",
          vheavy: "#320B3F",
          org: "#FF7700",
        },
        animation: {
          fadeIn: "fadeIn 0.5s forwards",
          fadeOut: "fadeOut 0.5s forwards",
        },
        boxShadow: {
          'custom': '0 0 10px 0 rgba(0, 0, 0, 0.12)',  
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'], 
        },
        keyframes: {
          fadeIn: {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
          },
          fadeOut: {
            "0%": { opacity: "1" },
            "100%": { opacity: "0" },
          },
          scroll: {
            '0%': { transform: 'translateX(150px)' },
            '100%': { transform: 'translateX(calc(-300px * 6))' }
          }
        },
      },
    },
    plugins: [],
  };
  