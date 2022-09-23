import type { Router } from 'vue-router'
import { toRaw } from 'vue'
import { useAsyncRouteStore } from '@/store/modules/permission'
import { storage_token } from '@/utils/storage'
import { ROUTER_NAMES } from '@/constants/router'
import { useUserStore } from '@/store/modules/user'

let hasAsyncRouter = 0

export function createRouterGuards(router: Router) {
  const asyncRouteStore = useAsyncRouteStore()
  const userStore = useUserStore()
  router.beforeEach(async (to) => {
    const token = storage_token.value
    if (token) {
      if (!hasAsyncRouter && asyncRouteStore.asyncRouters.length === 0) {
        hasAsyncRouter++
        await userStore.getUserInfo()
        await asyncRouteStore.getRouter()
        const asyncRouters = asyncRouteStore.asyncRouters

        toRaw(asyncRouters).forEach((asyncRouter) => {
          !router.hasRoute(asyncRouter.name!) && router.addRoute(asyncRouter)
        })
        if (storage_token.value) {
          return { ...to, replace: true }
        }
        else {
          return {
            name: ROUTER_NAMES.LOGIN,
            query: { redirect: to.fullPath },
          }
        }
      }
      else {
        if (to.name === ROUTER_NAMES.LOGIN || to.name === '/')
          return false
      }
      // else {
      //   console.log(11)
      //   return { ...to, replace: true }
      // }
    }
    if (!token && to.name !== ROUTER_NAMES.LOGIN) {
      return {
        name: ROUTER_NAMES.LOGIN,
        query: {
          redirect: document.location.hash,
        },
      }
    }
  })
}
