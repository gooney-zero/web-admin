import type { IResDataGetMenus } from './types/response'
import { fetchGet } from '@/api'

export const getMenus = fetchGet<IResDataGetMenus[]>({
  url: '/basemenus/getMenus',
})
