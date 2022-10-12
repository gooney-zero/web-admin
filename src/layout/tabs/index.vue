<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { computed, h, nextTick, ref, watch } from 'vue'
import type { DropdownOption } from 'naive-ui'
import { tabsStore } from '@/utils/storage'
import { ROUTER_NAMES } from '@/constants/router'

const getSimpleRoute = (route: RouteLocationNormalizedLoaded) => {
  const { fullPath, hash, meta, name, params, path, query } = route
  return { fullPath, hash, meta: { ...meta }, name, params, path, query } as RouteLocationNormalizedLoaded
}
const route = useRoute()
const router = useRouter()

const showDropdownRef = ref(false)
const xRef = ref(0)
const yRef = ref(0)
const currentTab = ref('')
const options: DropdownOption[] = [
  {
    label: '关闭全部',
    key: 'all',
  },
  {
    label: '关闭左侧',
    key: 'left',
  },
  {
    label: '关闭右侧',
    key: 'right',
  },
  {
    label: '关闭其它',
    key: 'other',
  },
]

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

const openContextMenu = (e: MouseEvent) => {
  const target = (e.target as HTMLElement)
  let name = ''
  if (target.nodeName === 'SPAN')
    name = (target.offsetParent as HTMLElement).dataset.name ?? ''

  else
    name = target.dataset.name ?? ''

  if (name) {
    e.preventDefault()
    showDropdownRef.value = false
    nextTick().then(() => {
      showDropdownRef.value = true
      currentTab.value = name
      xRef.value = e.clientX
      yRef.value = e.clientY
    })
  }
}

const onClickoutside = () => {
  showDropdownRef.value = false
}

const handleSelect = (key: 'all' | 'left' | 'right' | 'other') => {
  const index = tabsStore.value.tabs.findIndex(v => currentTab.value === getFmtString(v))
  const tab = tabsStore.value.tabs[index]

  switch (key) {
    case 'all':
      tabsStore.value.tabs = []
      router.push({ name: ROUTER_NAMES.DEFAULT })
      break
    case 'other': {
      tabsStore.value.activeTab = getFmtString(tab)
      changeTab()
      tabsStore.value.tabs = [tab]
      break
    }
    case 'left': {
      if (index === 0)
        return
      tabsStore.value.tabs.splice(0, index)
      if (getFmtString(route) !== currentTab.value) {
        tabsStore.value.activeTab = getFmtString(tab)
        changeTab()
      }
      break
    }
    case 'right': {
      const len = tabsStore.value.tabs.length
      if (index === len)
        return
      tabsStore.value.tabs.splice(index + 1, len - 1)
      if (getFmtString(route) !== currentTab.value) {
        tabsStore.value.activeTab = getFmtString(tab)
        changeTab()
      }
      break
    }
  }
  onClickoutside()
}
</script>

<template>
  <div class="py-3 px-5 mb-5">
    <n-tabs
      v-model:value="tabsStore.activeTab" :closable="closable" type="card" animated
      @contextmenu.prevent="openContextMenu($event)" @update:value="changeTab" @close="handleClose"
    >
      <n-tab v-for="tag in tabsStore.tabs" :key="tag.path" :name="getFmtString(tag)">
        {{ tag.meta.title }}
      </n-tab>
    </n-tabs>
    <n-dropdown
      placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :options="options" :show="showDropdownRef"
      :on-clickoutside="onClickoutside" @select="handleSelect"
    />
  </div>
</template>

<style>
.py-3 .n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab.n-tabs-tab--active {
  background-color: rgba(32, 128, 240, 0.12) !important;
}
</style>
