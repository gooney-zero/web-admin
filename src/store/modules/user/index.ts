import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import type { User } from '@/api/services/user/types/response'
import { getUserInfo } from '@/api/services/user/user'

export const useUserStore = defineStore('user', () => {
  const { run } = useRequest(getUserInfo, {
    manual: true,
  })

  const userInfo = ref<User>({
    uuid: '',
    nickName: '',
    headerImg: '',
    authority: {},
    sideMode: 'dark',
    activeColor: '#4D70FF',
    baseColor: '#fff',
  } as User)

  const setUserInfo = (user: User) => {
    userInfo.value = user
  }

  const lauch = () => {
    run().then((r) => {
      if (r?.data)
        setUserInfo(r?.data)
    })
  }
  return {
    userInfo,
    setUserInfo,
    getUserInfo: lauch,
  }
})
