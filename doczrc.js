import { css } from 'docz-plugin-css'
export default {
  base: '/react-table/',
  title: 'Fixed Table Component',
  description: 'A React Component',
  dest: 'website',
  typescript: true,
  // src: './doc',
  protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  themeConfig: {
    mode: 'light'
  },
  hashRouter: true,
  codeSandbox: false,
  plugins: [
    css({
      preprocessor: 'sass'
    })
  ]
}
