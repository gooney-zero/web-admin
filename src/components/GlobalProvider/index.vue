<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  // NGlobalStyle,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
} from 'naive-ui'
import { useSlots } from 'vue'
import GlobalInject from './GlobalInject.vue'
</script>

<template>
  <NConfigProvider abstract>
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <NLoadingBarProvider>
            <GlobalInject><slot /></GlobalInject>
          </NLoadingBarProvider>
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
