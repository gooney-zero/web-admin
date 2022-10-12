import { defineStore } from 'pinia'
import { ref } from 'vue'
import theme from '@/constants/theme'

export const useThemeStore = defineStore('theme', () => {
  const appTheme = ref(theme.appTheme)
  const appThemeList = ref(theme.appThemeList)
  return {
    appTheme,
    appThemeList,
  }
})
