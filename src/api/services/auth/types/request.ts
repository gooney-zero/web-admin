export interface IReqUpdateAuthority {
  /**
  * 名称
  * @example 超级管理员
  */
  name: string

  defaultRouter: string

  path: {
    id: string | number
  }
}
export interface IReqDeleteAuthority {
  path: {
    id: string | number
  }
}

export interface IReqAddAuthority {
  /**
  * 名称
  * @example 超级管理员
  */
  name: string

  authorityId: number
}
