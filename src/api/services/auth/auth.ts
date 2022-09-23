import type { IResDataGetAuthorityList } from './types/response'
import { fetchGet } from '@/api'

export const getAuthorityList = fetchGet<IResDataGetAuthorityList, { page: number; pageSize: number }>({
  url: '/authority/getAuthorityList',
})
