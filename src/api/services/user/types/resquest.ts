export interface IReqDataLogin {
  username: string
  password: string
}

export interface IReqAddUser {
  /**
   * 申请登录账号
   * @example gooney
   */
  userName: string

  /**
     * 申请登录密码
     * @example 123456
     */
  password: string

  /**
     * @example 999
     */
  authorityId: number

  /**
     * 需要设置的权限数组
     * @example [999]
     */
  authorities: number[]
  /**
     * @example gooney
     */

  nickName: string

  sideMode?: string

  headerImg?: string

  baseColor?: string

  activeColor?: string

  phone?: string

  email?: string

  enable?: number
}
