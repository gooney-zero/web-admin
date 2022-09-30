import type { IReqPathById } from '../common.types'
import type { IResDataGetAuthorityList } from './types/response'
import type { IReqAddAuthority, IReqUpdateAuthority } from './types/request'
import { fetchGet, fetchPost } from '@/api'

export const getAuthorityList = fetchGet<IResDataGetAuthorityList, { page: number; pageSize: number }>({
  url: '/authority/getAuthorityList',
})

export const addAuthority = fetchPost<null, IReqAddAuthority>({
  url: '/authority/create',
})

export const updateAuthority = fetchPost<null, IReqUpdateAuthority>({
  url: '/authority/update/:id',
  isPath: true,
})

export const deleteAuthority = fetchPost<null, IReqPathById>({
  url: '/authority/delete/:id',
  isPath: true,
})

