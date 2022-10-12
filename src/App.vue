<script lang="ts" setup>
import { useUserStore } from './store/modules/user'
import GlobalProvider from '@/components/GlobalProvider'
const userStore = useUserStore()
</script>

<template>
  <GlobalProvider>
    <router-view />
  </GlobalProvider>
</template>
