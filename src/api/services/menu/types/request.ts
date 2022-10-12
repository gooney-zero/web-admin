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

// tslint:disable
/**
 * caixin
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface Meta
 */
export interface Meta {
  /**
   * title
   * @type {string}
   * @memberof Meta
   */
  title: string
  /**
   * icon
   * @type {string}
   * @memberof Meta
   */
  icon: string
  /**
   * keepalive
   * @type {boolean}
   * @memberof Meta
   */
  keepAlive: boolean
}

export interface IReqAddMenu {
  /**
     * 菜单名称
     * @type {string}
     * @memberof CreateBasemenuDto
     */
  name: string
  /**
   * 路径
   * @type {string}
   * @memberof CreateBasemenuDto
   */
  path: string
  /**
   * 排序
   * @type {number}
   * @memberof CreateBasemenuDto
   */
  sort: number
  /**
   * 组件路径
   * @type {string}
   * @memberof CreateBasemenuDto
   */
  component: string
  /**
   *
   * @type {Meta}
   * @memberof CreateBasemenuDto
   */
  meta: Meta
  /**
   * 父级菜单ID 0是根菜单
   * @type {number}
   * @memberof CreateBasemenuDto
   */
  parentId: number
}
