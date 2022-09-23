import type { IResBaseData } from '../../types'

export interface IResDataGetAuthorityList {
  list: List[]
  total: number
}

interface List extends IResBaseData {
  name: string

  authorityId: number

  defaultRouter: string
}
