/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: {
      ink: '#242424', cream: '#F7F1E3', saffron: '#E58A24', maroon: '#263A73', gold: '#C79A3B', clay: '#C96F3B', leaf: '#176B67'
    },
    fontFamily: { display: ['"Playfair Display"','Georgia','serif'], body: ['"DM Sans"','ui-sans-serif','system-ui','sans-serif'] },
    boxShadow: { warm: '0 20px 60px rgba(38,58,115,.13)', card: '0 10px 30px rgba(23,107,103,.08)' },
    keyframes: { float: { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-5px)' } }, fadeUp: { from:{opacity:'0',transform:'translateY(10px)'}, to:{opacity:'1',transform:'translateY(0)'} } },
    animation: { float: 'float 6s ease-in-out infinite', fadeUp: 'fadeUp .5s ease both' }
  } },
  plugins: []
}
