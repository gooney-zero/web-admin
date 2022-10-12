import { useRequest } from 'vue-request'
import type { DataTableColumns, DropdownOption, FormInst, FormItemRule, FormRules } from 'naive-ui'
import { NButton } from 'naive-ui'
import * as icons from '@vicons/ionicons5'
import { computed, defineComponent, h, nextTick, ref, toRaw } from 'vue'
import { AddSharp, CreateOutline, PersonRemoveOutline } from '@vicons/ionicons5'
import { IconComp, renderIcon } from '@/utils/icon'
import { HTTP_STATUS } from '@/constants/httpStatus'
import { addMenu, getAllOfMenu, removeMenuById, updateMenu } from '@/api/services/menu'
import type { IResDataGetMenus } from '@/api/services/menu/types/response'

export default defineComponent({
  components: {
    IconComp,
  },
  setup() {
    const { loading: loadingDataTable, data, run: getMenusTree } = useRequest(getAllOfMenu, { manual: true })
    const { loading: saveLoading, run: saveMenu } = useRequest(addMenu, { manual: true })
    const { loading: updateLoading, run: setMenu } = useRequest(updateMenu, { manual: true })
    const { run: deleteMenuById } = useRequest(removeMenuById, { manual: true })
    const loading = computed(() => saveLoading.value || updateLoading.value)
    getMenusTree()

    function getRootMenus(menus: any[]): any[] {
      return [...menus.map((v: any) => {
        if (v.children && v.children.length) {
          return {
            label: v.meta.title,
            value: v.id,
            children: getRootMenus(v.children),
          } as any
        }
        return {
          label: v.meta.title,
          value: v.id,
        }
      })]
    }
    const rootNode = computed(() => {
      const list = getRootMenus(toRaw(data.value?.data) ?? [])
      return [{
        label: '根目录',
        value: 0,
      }, ...list]
    })

    const isAdd = ref(true)
    const isAddChildMenu = ref(false)
    const showIconDrawerActive = ref(false)
    const currentRow = ref({} as IResDataGetMenus)

    const showModal = ref(false)
    const showDropdownRef = ref(false)
    const xRef = ref(0)
    const yRef = ref(0)
    const originModel = {
      name: '',
      path: '',
      sort: '999',
      component: 'pages/sysAdmin',
      parentId: 0,
      meta: {
        title: '',
        icon: 'HomeSharp',
        keepAlive: 0,
      },
    }

    const options: DropdownOption[] = [
      {
        label: '编辑',
        key: 'edit',
      },
      {
        label: () => h('span', { class: 'text-red' }, '删除'),
        key: 'del',
      },
    ]

    const modelRef = ref({
      name: '',
      path: '',
      sort: '999',
      component: 'pages/sysAdmin',
      parentId: 0,
      meta: {
        title: '',
        icon: 'HomeSharp',
        keepAlive: 0,
      },
    })

    const formRef = ref<FormInst | null>(null)

    const keepAliveOptions = [
      {
        label: '启用',
        value: 1,
      },
      {
        label: '不启用',
        value: 0,
      },
    ]

    const rules: FormRules = {
      'name': [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            if (!/^[a-zA-Z]+$/.test(value))
              return new Error('请输入英文字符')
            return true
          },
          trigger: ['blur'],
        },
      ],
      'path': [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            if (!/^[a-zA-Z]+$/.test(value))
              return new Error('请输入英文字符')
            return true
          },
        },
      ],
      'sort': {
        validator(rule: FormItemRule, value: string) {
          if (!/^\d+$/.test(value))
            return new Error('请输入数字')
          return true
        },
      },
      'component': {
        trigger: ['blur'],
        required: true,
        validator: (rule: FormItemRule, value: string) => {
          if (!/^[a-zA-Z | /]+$/.test(value))
            return new Error('请输入英文字符')
          return true
        },
      },
      'meta.title': {
        required: true,
        validator: (rule: FormItemRule, value: string) => {
          if (!value)
            return new Error('请输入展示名称')
          return true
        },
      },
    }

    const bodyStyle = {
      width: '600px',
    }

    const setEditInfo = (row: IResDataGetMenus) => {
      modelRef.value = Object.assign(modelRef.value, {
        ...row,
        meta: {
          ...row.meta,
          keepAlive: Number(row.meta.keepAlive),
        },
        parentId: row.parentId ?? 0,
      })
      isAdd.value = false
      isAddChildMenu.value = false
      showModal.value = true
      showDropdownRef.value = false
    }

    const setDelInfo = (row: IResDataGetMenus) => {
      const d = window.$dialog.warning({
        title: '警告',
        content: '此操作将永久删除所有角色下该菜单, 是否继续?',
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: () => {
          d.loading = true
          return deleteMenuById({ id: row.id }).then((res) => {
            if (res?.code === HTTP_STATUS.SUCCESS) {
              window.$message.success('删除成功')
              getMenusTree()
            }
            else { window.$message.error(res!.msg) }
          })
        },
      })
    }

    const handleSelect = (key: 'edit' | 'del') => {
      if (key === 'edit')
        setEditInfo(currentRow.value)

      else
        setDelInfo(currentRow.value)
    }

    const onClickoutside = () => {
      showDropdownRef.value = false
    }

    const openModalDailog = () => {
      isAdd.value = true
      isAddChildMenu.value = false
      modelRef.value = originModel
      showModal.value = true
    }
    const checkAdd = () => {
      formRef.value?.validate((errors) => {
        if (!errors) {
          const body = {
            ...modelRef.value,
            sort: window.parseInt(modelRef.value.sort),
            meta: {
              ...modelRef.value.meta,
              keepAlive: Boolean(modelRef.value.meta.keepAlive),
            },
          }

          saveMenu(body).then((res) => {
            if (res?.code === 200) {
              showModal.value = false
              getMenusTree()
              window.$message.success(res.msg)
            }
            else {
              window.$message.error(res!.msg)
            }
          })
        }
        else {
          window.$message.error(errors[0][0].message || '请填写必要信息')
        }
      })
    }
    const checkEdit = () => {
      formRef.value?.validate((errors) => {
        if (!errors) {
          setMenu({
            ...modelRef.value,
            sort: window.parseInt(modelRef.value.sort),
            meta: {
              ...modelRef.value.meta,
              keepAlive: Boolean(modelRef.value.meta.keepAlive),
            },
            id: (modelRef.value as any).id ?? currentRow.value.id,
          }).then((res) => {
            if (res?.code === 200) {
              showModal.value = false
              getMenusTree()
              window.$message.success(res.msg)
            }
            else {
              window.$message.error(res!.msg)
            }
          })
        }
        else {
          window.$message.error(errors[0][0].message || '请填写必要信息')
        }
      },
      rule => rule.key !== 'not_check',
      )
    }
    const handleValidateButtonClick = (e: any) => {
      e.preventDefault()
      if (isAdd.value)
        checkAdd()

      else
        checkEdit()
    }

    const selectIcon = (name: string) => {
      modelRef.value.meta.icon = name
      showIconDrawerActive.value = false
    }
    const renderPrefixIcon = (name: string) => {
      return (icons as any)[name]
    }

    const rowProps = (row: IResDataGetMenus) => {
      return {
        onContextmenu: (e: MouseEvent) => {
          e.preventDefault()
          showDropdownRef.value = false
          nextTick().then(() => {
            currentRow.value = row
            showDropdownRef.value = true
            xRef.value = e.clientX
            yRef.value = e.clientY
          })
        },
      }
    }

    const columns: DataTableColumns<IResDataGetMenus> = [
      {
        title: 'ID',
        key: 'id',
      },
      {
        title: '展示名称',
        key: 'title',
        render(row) {
          return row.meta.title
        },
      },
      {
        title: '图标',
        key: 'icon',
        render(row) {
          return h(IconComp, { comp: (icons as any)[row.meta.icon] })
        },
      },
      {
        title: '路由名称',
        key: 'name',
      },
      {
        title: '路由路径',
        key: 'path',
      },
      {
        title: '排序',
        key: 'sort',
      },
      {
        title: '组件路径',
        key: 'component',
      },
      {
        title: '父节点',
        key: 'parentId',
        render(row) {
          return row.parentId ?? '根节点'
        },
      },
      {
        title: 'Action',
        key: 'actions',
        // fixed: 'left',
        // width: 250,
        render(row) {
          return h(
            'div',
            [
              h(NButton, {
                text: true,
                size: 'tiny',
                type: 'info',
                class: 'pr-2',
                onClick: () => {
                  setDelInfo(row)
                },
              }, {
                default: () => '删除',
                icon: renderIcon(PersonRemoveOutline),
              }),
              h(NButton, {
                text: true,
                size: 'tiny',
                type: 'info',
                class: 'pr-2',
                onClick: () => {
                  // modelRef.value = Object.assign(modelRef.value, {
                  //   ...row,
                  //   meta: {
                  //     ...row.meta,
                  //     keepAlive: Number(row.meta.keepAlive),
                  //   },
                  //   parentId: row.parentId ?? 0,
                  // })
                  // currentRow.value = row
                  // isAdd.value = false
                  // isAddChildMenu.value = false
                  // showModal.value = true
                  setEditInfo(row)
                },
              }, {
                default: () => '编辑',
                icon: renderIcon(CreateOutline),

              }),
              h(NButton, {
                text: true,
                size: 'tiny',
                type: 'info',
                onClick: () => {
                  modelRef.value = Object.assign(modelRef.value, {
                    parentId: row.id ?? 0,
                  })
                  isAdd.value = false
                  isAddChildMenu.value = true
                  showModal.value = true
                },
              }, {
                default: () => '添加子菜单',
                icon: renderIcon(AddSharp),

              }),
            ],
          )
        },
      },
    ]
    return {
      openModalDailog,
      onClickoutside,
      xRef,
      yRef,
      handleSelect,
      options,
      showDropdownRef,
      loadingDataTable,
      rowProps,
      columns,
      data,
      showModal,
      bodyStyle,
      modelRef,
      rules,
      isAddChildMenu,
      isAdd,
      showIconDrawerActive,
      renderPrefixIcon,
      keepAliveOptions,
      rootNode,
      loading,
      handleValidateButtonClick,
      icons,
      selectIcon,
      AddSharp,
      formRef,
    }
  },
})
