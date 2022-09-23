import { fetchGet, fetchPost } from '../..'
import type { IResDataLogin, User } from './types/response'
import type { IReqAddUser, IReqDataLogin } from './types/resquest'

export const login = fetchPost<IResDataLogin, IReqDataLogin>({
  url: '/auth/login',
})

export const getUserInfo = fetchGet<User>({
  url: '/user/getUserInfo',
})

export const addUser = fetchPost<null, IReqAddUser>({
  url: '/user/create',
})

export const getUsers = fetchGet<User[]>({
  url: '/user/getUsers',
})

