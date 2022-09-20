<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import { tabsStore } from '@/utils/storage'
import { ROUTER_NAMES } from '@/constants/router'

const getSimpleRoute = (route: RouteLocationNormalizedLoaded) => {
  const { fullPath, hash, meta, name, params, path, query } = route
  console.log(route)
  return { fullPath, hash, meta: { ...meta }, name, params, path, query } as RouteLocationNormalizedLoaded
}
const route = useRoute()
const router = useRouter()

const isSame = (route1: RouteLocationNormalizedLoaded, route2: RouteLocationNormalizedLoaded) => {
  if (route1.name !== route2.name)
    return false

  if (Object.keys(route1.query).length !== Object.keys(route2.query).length || Object.keys(route1.params).length !== Object.keys(route2.params).length)
    return false

  for (const key in route1.query) {
    if (route1.query[key] !== route2.query[key])
      return false
  }
  for (const key in route1.params) {
    if (route1.params[key] !== route2.params[key])
      return false
  }
  return true
}
const getFmtString = (item: RouteLocationNormalizedLoaded) => {
  return item.name as string + JSON.stringify(item.query) + JSON.stringify(item.params)
}
const setTab = (route: RouteLocationNormalizedLoaded) => {
  if (!tabsStore.value.tabs.some(item => isSame(item, route))) {
    const o = getSimpleRoute(route)
    tabsStore.value.tabs.push(o as RouteLocationNormalizedLoaded)
  }
}
watch(
  () => route,
  (to) => {
    if (to.name === ROUTER_NAMES.LOGIN)
      return
    setTab(to)
    tabsStore.value.activeTab = getFmtString(to)
  },
  { immediate: true, deep: true },
)

const activeTabRaw = computed(() =>
  tabsStore.value.tabs.find(route => getFmtString(route) === tabsStore.value.activeTab)!,
)

const closable = computed(() => !(tabsStore.value.tabs.length === 1 && route.name === ROUTER_NAMES.DEFAULT))

const changeTab = () => {
  router.push({
    name: activeTabRaw.value.name!,
    query: activeTabRaw.value.query,
    params: activeTabRaw.value.params,
  })
}

const handleClose = (name: string) => {
  const index = tabsStore.value.tabs.findIndex(v => name === getFmtString(v))
  if (getFmtString(route) === name) {
    if (tabsStore.value.tabs.length === 1) {
      router.push({ name: ROUTER_NAMES.DEFAULT })
    }
    else {
      const rightItem = tabsStore.value.tabs[index + 1]
      const leftItem = tabsStore.value.tabs[index - 1]
      if (rightItem) {
        router.push({
          name: rightItem.name!,
          query: rightItem.query,
          params: rightItem.params,
        })
      }
      else if (leftItem) {
        router.push({
          name: leftItem.name!,
          query: leftItem.query,
          params: leftItem.params,
        })
      }
    }
  }
  tabsStore.value.tabs.splice(index, 1)
}
</script>

<template>
  <div class="p-5">
    <n-tabs
      v-model:value="tabsStore.activeTab"
      :closable="closable" type="card"
      animated
      @update:value="changeTab"
      @close="handleClose"
    >
      <n-tab v-for="tag in tabsStore.tabs" :key="tag.path" :name="getFmtString(tag)">
        {{ tag.meta.title }}
      </n-tab>
    </n-tabs>
  </div>
</template>

<style scoped>

</style>
