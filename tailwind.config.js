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
          light: '#A5D7E8',  // 吉祥物浅蓝色
          DEFAULT: '#579BB1', // 吉祥物主色调 (中等蓝)
          dark: '#3A7D8E',    // 吉祥物深蓝色 (书本/勾边色)
          bg: '#F8FBFB',      // 品牌背景浅青色
        },
        primary: {
          DEFAULT: '#579BB1',
          student: '#62B6B7',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
