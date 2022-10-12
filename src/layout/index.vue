<script setup lang="ts">
import Aside from './aside'
import LayoutHeader from './header'
import LayoutFooter from './footer'
import LayoutTabs from './tabs'
import { useAsyncRouteStore } from '@/store/modules/permission'

const routerStore = useAsyncRouteStore()
</script>

<template>
  <NLayout has-sider>
    <Aside />
    <n-layout class="bg-[#eee]">
      <LayoutHeader />
      <LayoutTabs class="bg-white" />
      <n-layout-content class="px-5 bg-[#eee] min-h-[calc(100vh-200px)]">
        <router-view v-slot="{ Component }">
          <div class="bg-white p-8 rounded-md shadow-2xl shadow-gray-300 p-20">
            <transition name="fade" mode="out-in">
              <keep-alive :include="routerStore.keepAliveRouters">
                <Suspense>
                  <component :is="Component" />
                  <template #fallback>
                    <n-skeleton :repeat="10" text />
                  </template>
                </Suspense>
              </keep-alive>
            </transition>
          </div>
        </router-view>
      </n-layout-content>
      <LayoutFooter />
    </n-layout>
  </NLayout>
</template>

<style scoped>

</style>
