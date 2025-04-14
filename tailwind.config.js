module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      colors: {
        customBlue: '#1e3a8a',
        customColors: {
          green: '#3BA55D',
          yellow: '#FAA61A',
          red: '#F04747',
          gray: '#747F8D',
          lightGray: '#8A8F9B',
          textGray: '#003037',
          borderGray: '#E1E2EA',
          lightGrayBg: '#F0F1F5',
          lightBlue: '#0E78F830',
          textBlue: '#0E78F8',
          lightGrayGreen: '#758F93',
          placeholderLightGreen: '#6E8B8F',
          lightGreenHover: '#E8FFEF',
          lightRedHover: '#FFD7E3',
          lightBorderGray: '#E8E8E8',
        }
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/typography')]
};
