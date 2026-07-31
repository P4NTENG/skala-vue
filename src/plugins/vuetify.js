import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'skalaLight',
    themes: {
      skalaLight: {
        dark: false,
        colors: {
          primary: '#23825a',
          secondary: '#1d2a28',
          background: '#f3f7f5',
          surface: '#ffffff',
          'surface-variant': '#e3eee9',
          error: '#ba1a1a',
          info: '#316b83',
          success: '#23825a',
          warning: '#8a5d00',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
    },
    VCard: {
      rounded: 'xl',
    },
    VTextField: {
      color: 'primary',
      variant: 'outlined',
    },
  },
})
