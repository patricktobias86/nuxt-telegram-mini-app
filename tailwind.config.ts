import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "~/components/**/*.{js,vue,ts}",
    "~/layouts/**/*.vue",
    "~/pages/**/*.vue",
    "~/plugins/**/*.{js,ts}",
    "~/app.vue",
    "~/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Map Telegram theme variables to Tailwind colors
        bg: 'var(--tg-theme-bg-color)',
        secondaryBg: 'var(--tg-theme-secondary-bg-color)',
        sectionBg: 'var(--tg-theme-section-bg-color)',
        text: 'var(--tg-theme-text-color)',
        hint: 'var(--tg-theme-hint-color)',
        link: 'var(--tg-theme-link-color)',
        primary: 'var(--tg-theme-button-color)',
        primaryFg: 'var(--tg-theme-button-text-color)',
        destructive: 'var(--tg-theme-destructive-text-color)',
        accent: 'var(--tg-theme-accent-text-color)',
        headerBg: 'var(--tg-theme-header-bg-color)',
        sectionSeparator: 'var(--tg-theme-section-separator-color)',
      },
      borderColor: {
        DEFAULT: 'var(--tg-theme-section-separator-color)'
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config
