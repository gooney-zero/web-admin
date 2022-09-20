<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { useUserStore } from '@/store/modules/user'
import { storage_token } from '@/utils/storage'
import { ROUTER_NAMES } from '@/constants/router'

const router = useRouter()
const route = useRoute()
function handleBreadClick(path: string) {
  if (path === route.path)
    return
  router.push(path)
}

const options: DropdownMixedOption[] = [
  {
    key: 'info',
    label: '个人信息',
  },
  {
    key: 'logout',
    label: '退出',
    props: {
      onClick() {
        storage_token.value = ''
        router.push({ name: ROUTER_NAMES.LOGIN, replace: true })
      },
    },
  },
]
const userStore = useUserStore()
</script>

<template>
  <n-layout-header bordered class="p-5">
    <n-page-header>
      <template #title>
        <n-breadcrumb>
          <n-breadcrumb-item
            v-for="item in route.matched.filter((item) => !!item.meta?.title)" :key="item.path"
            @click="handleBreadClick(item.path)"
          >
            <!-- <component :is="getIcon(item.meta)" /> -->
            {{ item.meta.title }}
          </n-breadcrumb-item>
        </n-breadcrumb>
      </template>
      <template #extra>
        <n-space>
          <n-dropdown trigger="hover" :options="options" placement="bottom-start">
            <n-button :bordered="false" style="padding: 0 4px">
              {{ userStore.userInfo.nickName }}
            </n-button>
          </n-dropdown>
        </n-space>
      </template>
    </n-page-header>
  </n-layout-header>
</template>

<style scoped>

</style>
