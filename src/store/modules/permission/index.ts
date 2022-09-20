import { defineStore } from 'pinia'

import type { RouteRecordRaw } from 'vue-router'
import { ref } from 'vue'
import { getMenus } from '@/api/services/menu'
const viewModules = import.meta.glob('../../../pages/**/index.ts')

// function formatRouter(routes: ReturnTypePromiseFunc<typeof getMenus>['data']): RouteRecordRaw[] {
//   return routes.map(v => ({

//   }))
// }

function routerHandle(routes: any[]): RouteRecordRaw[] {
  return routes.map((v) => {
    if (v.children) {
      return {
        ...v,
        component: getComponent(v.component),
        children: routerHandle(v.children),
      }
    }
    return {
      ...v,
      component: getComponent(v.component),
    }
  })
}

function getComponent(component: string) {
  const page = Object.keys(viewModules).find((page) => {
    return page.replace('../../../', '').replace('/index.ts', '')
      .toLocaleLowerCase() === component.toLocaleLowerCase()
  })

  // console.log(page)
  return viewModules[page as string]
}

export const useAsyncRouteStore = defineStore('router', () => {
  const asyncRouters = ref<RouteRecordRaw[]>([])
  const getRouter = async () => {
    const baseRouter: RouteRecordRaw[] = [{
      path: '/layout',
      name: 'layout',
      component: () => import('@/layout'),
      redirect: '/layout/dashboard',
      children: [],
    }]

    const routerRes = await getMenus()
    if (routerRes.data) {
      baseRouter[0].children = routerHandle(routerRes.data)
      asyncRouters.value = baseRouter
    }
    return true
  }

  return {
    getRouter,
    asyncRouters,
  }
})
