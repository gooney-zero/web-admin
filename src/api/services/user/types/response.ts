export interface IResDataLogin {
  access_token: string
  user: User
}

export interface User {
  id: number

  uuid: string

  userName: string

  nickName: string

  sideMode: string

  headerImg: string

  baseColor: string

  activeColor: string

  authorityId: number

  phone: string

  email: string

  enable: number

  authority: PlainObject

  authorities: PlainObject[]
}
