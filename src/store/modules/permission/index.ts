import { defineStore } from 'pinia'

import type { RouteComponent, RouteRecordRaw } from 'vue-router'
import { ref } from 'vue'
import { getMenus } from '@/api/services/menu'
import { asyncRenderIcon } from '@/utils/icon'

type Lazy<T> = () => Promise<T>

const viewModules = import.meta.glob('../../../pages/**/index.ts') as Record<string, Lazy<RouteComponent>>

const keepAliveRoutersArr: any[] = []

const KeepAliveFilter = (routes: RouteRecordRaw[]) => {
  routes && routes.forEach((item) => {
    // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
    if ((item.children && item.children.some(ch => ch.meta!.keepAlive)) || item.meta!.keepAlive) {
      item.component && (item.component as Lazy<RouteComponent>)().then((val) => {
        !!(val as any).default.name && keepAliveRoutersArr.push((val as any).default.name)
      })
    }

    if (item.children && item.children.length > 0)
      KeepAliveFilter(item.children)
  })
}

function routerHandle(routes: any[]): any {
  return Promise.all(routes.map(async (v: any) => {
    if (v.children && v.children.length) {
      return {
        ...v,
        meta: {
          ...v.meta,
          icon: v.meta.icon ? await asyncRenderIcon(v.meta.icon) : 'not-found',
        },
        component: getComponent(v.component),
        children: await routerHandle(v.children),
      } as any
    }
    return {
      ...v,
      meta: {
        ...v.meta,
        icon: v.meta.icon ? await asyncRenderIcon(v.meta.icon) : 'not-found',
      },
      children: null,
      component: getComponent(v.component),
    }
  }))
}

function getComponent(component: string) {
  const page = Object.keys(viewModules).find((page) => {
    return page.replace('../../../', '').replace('/index.ts', '')
      .toLocaleLowerCase() === component.toLocaleLowerCase()
  })

  return viewModules[page as string]
}

export const useAsyncRouteStore = defineStore('router', () => {
  const asyncRouters = ref<RouteRecordRaw[]>([])
  const keepAliveRouters = ref<any>([])
  const getRouter = async () => {
    const baseRouter: RouteRecordRaw[] = [{
      path: '/layout',
      name: 'layout',
      component: () => import('@/layout'),
      redirect: '/layout/dashboard',
      children: [],
    }]

    const routerRes = await getMenus()
    const asyncRouter = routerRes.data
    if (asyncRouter) {
      baseRouter[0].children = (await routerHandle(asyncRouter))
      KeepAliveFilter(baseRouter[0].children!)
      keepAliveRouters.value = keepAliveRoutersArr
      asyncRouters.value = baseRouter
    }
    return true
  }

  return {
    getRouter,
    asyncRouters,
    keepAliveRouters,
  }
})
