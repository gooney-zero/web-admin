import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'
import { createRouterGuards } from './router-guards'
import { ROUTER_NAMES } from '@/constants/router'

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@/pages/Login'),
    name: ROUTER_NAMES.LOGIN,
  },
  // {
  //   path: '/view/layout',
  //   component: () => import('@/layout'),
  //   name: 'layout',
  //   children: [
  //     {
  //       path: 'sysAdmin',
  //       component: () => import('@/pages/SysAdmin'),
  //       name: 'sysAdmin',
  //       meta: {
  //         title: '系统管理员',
  //       },
  //       // children: [
  //       //   {
  //       //     path: 'sysAdmin1',
  //       //     component: import('@/pages/SysAdmin'),
  //       //     name: 'sysAdmin2',
  //       //     meta: {
  //       //       title: '系统管理员111',
  //       //     },
  //       //   },
  //       // ],
  //     },
  //   ],
  // },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name)
      router.hasRoute(name) && router.removeRoute(name)
  })
}

export async function setupRouter(app: App) {
  // 创建路由守卫
  // createRouterGuards(router, whiteNameList);

  app.use(router)
  createRouterGuards(router)
  // 路由准备就绪后挂载APP实例
  await router.isReady()
}

// router.beforeEach(async (to, from, next) => {
//   if (to.name === 'Login') {

//   }
//   if (storage_token.value) {
//     (await getRouter()).forEach((route) => {
//       router.addRoute(route)
//     })
//   }
// })
