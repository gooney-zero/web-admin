<script setup lang="ts" name="admin">
import { useAsyncRouteStore } from '@/store/modules/permission'

const routerStore = useAsyncRouteStore()
console.log(routerStore.keepAliveRouters)
</script>

<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <transition mode="out-in" name="el-fade-in-linear">
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
