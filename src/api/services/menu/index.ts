import type { IReqPathById } from '../common.types'
import type { IResDataGetMenus } from './types/response'
import type { IReqAddMenu, IReqAddMenusAuthOrity } from './types/request'
import { fetchGet, fetchPost } from '@/api'

export const getMenus = fetchGet<IResDataGetMenus[]>({
  url: '/basemenus/getMenus',
})

export const getAllOfMenu = fetchGet<IResDataGetMenus[]>({
  url: '/basemenus/getAllOfMenu',
})
export const getFlatMenus = fetchGet<IResDataGetMenus[], IReqPathById['path']>({
  url: '/basemenus/getFlatMenus/:id',
  isPath: true,
})

export const addmenuAuthority = fetchPost<null, IReqAddMenusAuthOrity>({
  url: '/basemenus/addmenuAuthority',
})

export const addMenu = fetchPost<null, IReqAddMenu>({
  url: '/basemenus/create',
})

export const updateMenu = fetchPost<null, IReqAddMenu & { id: number }>({
  url: '/basemenus/update',
})

export const removeMenuById = fetchPost<null, { id: number }>({
  url: '/basemenus/remove',
})
