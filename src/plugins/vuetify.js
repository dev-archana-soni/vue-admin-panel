import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const light = {
  dark: false,
  colors: {
    primary: '#1976D2',
    secondary: '#26A69A',
    accent: '#82B1FF',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FF5252',
    background: '#f5f5f5',
    surface: '#ffffff'
  }
}

const dark = {
  dark: true,
  colors: {
    primary: '#42A5F5',
    secondary: '#26A69A',
    accent: '#82B1FF',
    info: '#29B6F6',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    background: '#1a1a1a',
    surface: '#2c2c2c'
  }
}

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  },
  theme: {
    defaultTheme: localStorage.getItem('theme') || 'light',
    themes: { light, dark }
  }
})
