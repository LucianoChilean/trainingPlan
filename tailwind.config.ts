import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#0f1117',
        bg2:     '#1a1d27',
        bg3:     '#22263a',
        card:    '#1e2135',
        accent:  '#6c63ff',
        accent2: '#ff6584',
        cgreen:  '#43e97b',
        cyellow: '#f9ca24',
        corange: '#fd9644',
        cred:    '#fc5c65',
        ctext:   '#e8eaf6',
        ctext2:  '#9fa8c7',
        border:  '#2e3250',
      },
      borderRadius: { DEFAULT: '12px' },
    },
  },
  plugins: [],
}

export default config
