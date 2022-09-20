import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IResDataLogin } from '@/api/services/user/types/response'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<IResDataLogin['user']>({
    uuid: '',
    nickName: '',
    headerImg: '',
    authority: {},
    sideMode: 'dark',
    activeColor: '#4D70FF',
    baseColor: '#fff',
  })

  const setUserInfo = (user: IResDataLogin['user']) => {
    userInfo.value = user
  }

  return {
    setUserInfo,
    userInfo,
  }
})
