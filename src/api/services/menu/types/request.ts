import type { IResDataGetMenus } from './response'

export interface IReqAddMenusAuthOrity {
  /**
 *
 * @type {Array<BaseMenusEntity>}
 * @memberof UpdateBasemenuDto
 */
  baseMenus: Array<IResDataGetMenus>
  /**
   * 需要添加菜单的权限
   * @type {number}
   * @memberof UpdateBasemenuDto
   */
  authorityId: number
}
