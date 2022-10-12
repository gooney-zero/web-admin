<script setup lang="ts" name="admin">
import { useAsyncRouteStore } from '@/store/modules/permission'

const routerStore = useAsyncRouteStore()
</script>

<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <div :key="route.name!">
          <keep-alive :include="routerStore.keepAliveRouters">
            <component :is="Component" />
          </keep-alive>
        </div>
      </transition>
    </router-view>
  </div>
</template>

<style scoped>

</style>
