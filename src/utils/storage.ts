import { useLocalStorage, useSessionStorage } from '@vueuse/core'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { STORAGE_KEYS } from '@/constants/storage'

interface ITabStore {
  activeTab: string
  tabs: RouteLocationNormalizedLoaded[]
}

export const storage_token = useLocalStorage(STORAGE_KEYS.ACCESS_TOKEN, '')

export const tabsStore = useSessionStorage<ITabStore>(STORAGE_KEYS.TABS, {
  activeTab: '',
  tabs: [],
})
