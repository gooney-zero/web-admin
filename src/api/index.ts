import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { compile } from 'path-to-regexp'
import qs from 'qs'
import { nextTick } from 'vue'
import { formConfig } from './form'
import { storage_token } from '@/utils/storage'
import { HTTP_STATUS } from '@/constants/httpStatus'

export interface Response<T> {
  code: number
  data: T
  msg: string
}

export interface RequestConfig<T = DataType> {
  url: string
  method: AxiosRequestConfig['method']
  dataType?: T
  isPath?: boolean
  // async?: boolean;
}

export type DataType = 'json' | 'form'

const instance = axios.create({
  timeout: 30 * 1000,
  baseURL: import.meta.env.VITE_BASE_URL,
})

instance.interceptors.request.use(
  (req) => {
    const token = storage_token.value
    if (token && req.headers)
      req.headers.Authorization = token
    return req
  },
  err => Promise.reject(err),
)

instance.interceptors.response.use(
  (res) => {
    const data = res.data
    if ([HTTP_STATUS.SUCCESS, 304, 201].includes(res.status)) {
      if ([HTTP_STATUS.LOGIN_HAS_EXPIRED, HTTP_STATUS.NOT_LOGGED_IN].includes(data.code)) {
        // if (data.code === HTTP_STATUS.LOGIN_HAS_EXPIRED) {
        window.localStorage.clear()
        window.sessionStorage.clear()
        window.location.reload()
        return
        // }
      }
      return data
    }
    nextTick(() => {
      window.$message.error(data.message)
    })

    return Promise.reject(new Error(data.message))
  },
)

export function fetchGet<Res, Req extends PlainObject = {}>(config: Omit<RequestConfig, 'method' | 'async'>) {
  const { url, isPath } = config
  return (body: Req = {} as any, params = {}) => {
    let u = ''
    if (isPath) {
      u = compile(url, { encode: encodeURIComponent })(body)
      const p = qs.stringify(params)
      if (p)
        u += `?${p}`
    }
    else {
      const query = qs.stringify(body)
      u = `${url}${query ? `?${query}` : ''}`
    }

    return instance.get(u) as Promise<Response<Res>>
  }
}

export function fetchPost<Res, Req extends PlainObject>(
  config: Omit<RequestConfig, 'method' | 'async'>,
) {
  const { url, dataType, isPath } = config
  const formFlag = dataType === 'form'

  return (body: Req) => {
    let u = url
    let reqBody: any = body

    if (isPath) {
      const { path, ...data } = body
      reqBody = data
      if (path)
        u = compile(url, { encode: encodeURIComponent })(path)
    }
    return instance.post(u, reqBody, formFlag ? formConfig : {}) as Promise<Response<Res>>
  }
}
