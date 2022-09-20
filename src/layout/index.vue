<script setup lang="ts">
import Aside from './aside'
import LayoutHeader from './header'
import LayoutFooter from './footer'
import LayoutTabs from './tabs'
</script>

<template>
  <NLayout has-sider>
    <Aside />
    <n-layout>
      <LayoutHeader />
      <LayoutTabs />
      <n-layout-content class="p-5">
        <router-view v-slot="{ Component }">
          <div>
            <transition mode="out-in">
              <keep-alive>
                <component :is="Component" />
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
