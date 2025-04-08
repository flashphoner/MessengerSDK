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
          green: '#43B581',
          yellow: '#FAA61A',
          red: '#F04747',
          gray: '#747F8D',
          lightGrey: '#8A8F9B',
          textGrey: '#0030378A',
          borderGrey: '#E1E2EA',
          sideBarGrey: '#F0F1F5',
          lightBlue: '#0E78F830',
          textBlue: '#0E78F8',
          lightGreyGreen: '#758F93'
        }
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/typography')]
};
