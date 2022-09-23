<script setup lang="ts">
import type { Component } from 'vue'
import { computed, h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
} from '@vicons/ionicons5'
import type { RouteRecordRaw } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import Avatar from './../logo'
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const route = useRoute()
const router = useRouter()

function getMenuOptions(children: (RouteRecordRaw & PlainObject)[]) {
  return children.filter(item => item.meta?.title).map((item) => {
    const menuItem = {
      key: item.name,
      label: item.meta!.title,
      icon: item.meta!.icon,
      sort: item.sort || 0,
    } as unknown as MenuOption
    if (item.children)
      menuItem.children = getMenuOptions(item.children!).sort((a, b) => (b.sort as number - (a.sort as number)))
    return menuItem
  })
}
const menuOptions = computed(() => getMenuOptions(route.matched[0].children).sort((a, b) => (b.sort as number - (a.sort as number))))

const handleUpdateKey = (name: string, item: MenuOption) => {
  if (item.path)
    window.open(item.path as string)

  else

    router.push({ name })
}
const collapsed = ref(false)
</script>

<template>
  <NLayoutSider
    bordered show-trigger collapse-mode="width" :collapsed="collapsed" :width="220" :collapsed-width="64"
    @collapse="collapsed = true" @expand="collapsed = false"
  >
    <Avatar />
    <NMenu
      accordion :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
      :value="route.name as string" @update:value="handleUpdateKey"
    />
  </NLayoutSider>
</template>

<style scoped>

</style>
