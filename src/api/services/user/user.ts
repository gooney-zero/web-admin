import { fetchPost } from '../..'
import type { IResDataLogin } from './types/response'
import type { IReqDataLogin } from './types/resquest'

export const login = fetchPost<IResDataLogin, IReqDataLogin>({
  url: '/auth/login',
})

