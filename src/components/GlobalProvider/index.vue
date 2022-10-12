<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  // NGlobalStyle,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
} from 'naive-ui'
import { ref, useSlots, watchEffect } from 'vue'
import GlobalInject from './GlobalInject.vue'
import { useThemeStore } from '@/store/modules/theme'

const themeOverrides: any = ref(null)
const themeStore = useThemeStore()
const body = document.body
watchEffect(() => {
  themeOverrides.value = {
    common: themeStore.appTheme,
  }
  body.style.setProperty('--primary-color', themeStore.appTheme.primaryColor)
  body.style.setProperty('--primary-color-hover', themeStore.appTheme.primaryColorHover)
  body.style.setProperty('--primary-color-pressed', themeStore.appTheme.primaryColorPressed)
})
</script>

<template>
  <NConfigProvider abstract :theme-overrides="themeOverrides">
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <NLoadingBarProvider>
            <GlobalInject>
              <slot />
            </GlobalInject>
          </NLoadingBarProvider>
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
