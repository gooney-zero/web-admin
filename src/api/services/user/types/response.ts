export interface IResDataLogin {
  access_token: string
  user: User
}

interface User {
  uuid: string
  nickName: string
  headerImg: string
  authority: PlainObject
  sideMode: string
  activeColor: string
  baseColor: string
}
