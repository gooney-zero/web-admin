export interface IResDataGetMenus {

  'id': number
  'createdAt': string
  'updatedAt': string
  'deletedAt': null | string
  'name': string
  'path': string
  'sort': number
  'component': string
  parentId: null | number
  children: IResDataGetMenus[]
  'meta': {
    'title': string
    'icon': string
    'keepAlive': boolean
  }

}
