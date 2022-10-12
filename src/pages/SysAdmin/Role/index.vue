<script setup lang="ts" name="role">
import { useRequest } from 'vue-request'
import type { DataTableColumns, FormInst, FormItemRule, FormRules, TreeOption } from 'naive-ui'
import { NButton, NPopover, NSwitch } from 'naive-ui'
import { computed, h, ref, toRaw } from 'vue'
import { AddCircleOutline, AddSharp, CreateOutline, CutOutline, PersonRemoveOutline, SettingsOutline } from '@vicons/ionicons5'
import { addUser, deleteUser, getUsers, updateUser } from '@/api/services/user/user'
import type { User } from '@/api/services/user/types/response'
import { IconComp, renderIcon } from '@/utils/icon'
import { addAuthority, deleteAuthority, getAuthorityList, updateAuthority } from '@/api/services/auth/auth'
import { useUserStore } from '@/store/modules/user'
import { HTTP_STATUS } from '@/constants/httpStatus'
import type { IResDataGetAuthorityList } from '@/api/services/auth/types/response'
import { addmenuAuthority, getAllOfMenu, getFlatMenus } from '@/api/services/menu'
import type { IResDataGetMenus } from '@/api/services/menu/types/response'

// const createTreeData: (children: IResDataGetMenus[]) => (IResDataGetMenus & { title: string })[] = children => children.map(item => ({
//   ...item,
//   title: item.meta.title,
//   children: (item.children.length > 0 ? createTreeData(item.children) : null) as any,
// }))

const { loading, run: saveAuthority } = useRequest(addAuthority, { manual: true })
const { run: delAuthority } = useRequest(deleteAuthority, { manual: true })
const { run: setAuthority } = useRequest(updateAuthority, { manual: true })
const { data: menuList, run: getMenuList } = useRequest(getAllOfMenu, { manual: true }) as any
const { run: getAuthorityMenus, data: flatMenus } = useRequest(getFlatMenus, { manual: true })
const { data: authorityData, run: getAllOfRole, loading: loadingData } = useRequest(getAuthorityList, { manual: true })
const { run: addMenus } = useRequest(addmenuAuthority, { manual: true })

const originModel = {
  name: '',
  authorityId: '0',
  defaultRouter: 'dashboard',
}
const baseMenus = ref<IResDataGetMenus[]>([])
let currentAuthorityId = 0
const defaultCheckedKeys = ref<number[]>([])
const pageParams = ref({ page: 1, pageSize: 10 })
const isAdd = ref(true)
const showMenus = ref(false)
const showIrrelevantNodes = ref(false)
const pattern = ref('')
const showModal = ref(false)
const modelRef = ref({
  name: '',
  authorityId: '0',
  defaultRouter: 'dashboard',
})
const formRef = ref<FormInst | null>(null)
const userStore = useUserStore()
const rules: FormRules = {
  name: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value.length)
          return new Error('请输入角色名称')
        return true
      },
      trigger: ['blur'],
    },
  ],
  authorityId: {
    trigger: ['blur'],
    required: true,
    validator: (rule: FormItemRule, value: string) => {
      if (value === '')
        return true
      if (!/^\d+$/.test(value))
        return new Error('请输入正确的角色ID')

      return true
    },
  },
}
const columns: DataTableColumns<IResDataGetAuthorityList['list'][number]> = [
  {
    title: '角色ID',
    key: 'authorityId',
  },
  {
    title: '角色名称',
    key: 'name',
  },
  {
    title: '操作',
    key: 'actions',
    // fixed: 'left',
    width: 200,
    render(row) {
      return h(
        'div',
        [
          h(NPopover, {}, {
            trigger: () => h(NButton, {
              text: true,
              size: 'tiny',
              type: 'info',
              class: 'pr-2',
            }, {
              default: () => '删除',
              icon: renderIcon(PersonRemoveOutline),
            }),
            default: () => h('p', null, { default: () => '确定要删除此用户吗?' }),
            footer: () => h('div', {
              class: 'flex justify-end',
            }, [
              h(NButton, {
                type: 'info',
                class: 'ml-2',
                size: 'tiny',
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                onClick: () => deleteUserHandle(row.authorityId),
              }, {
                default: () => '确定',
              }),
            ]),
          }),
          h(NButton, {
            text: true,
            size: 'tiny',
            type: 'info',
            class: 'pr-2',
            onClick: () => {
              modelRef.value.name = row.name
              modelRef.value.defaultRouter = row.defaultRouter
              modelRef.value.authorityId = `${row.authorityId}`
              isAdd.value = false
              showModal.value = true
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
              getMenuList()
              getAuthorityMenus({ id: row.authorityId }).then((res) => {
                const menus = res!.data
                menus.forEach((item) => {
                  if (!menus.some(same => same.parentId === item.id)) {
                    defaultCheckedKeys.value.push(item.id)
                    baseMenus.value.push(item)
                  }
                })
              })
              currentAuthorityId = row.authorityId
              showMenus.value = true
            },
          }, {
            default: () => '设置权限',
            icon: renderIcon(SettingsOutline),

          }),
        ],
      )
    },
  },
]

const bodyStyle = {
  width: '600px',
}

// const menuData = computed(() => createTreeData(menuList.value?.data ?? []) as any)

const reloadList = () => {
  getAllOfRole(pageParams.value)
}

reloadList()

const deleteUserHandle = async (id: number) => {
  const res = await delAuthority({ path: { id } })
  if (res?.code === HTTP_STATUS.SUCCESS) {
    window.$message.success(res!.msg)
    reloadList()
  }
  else { window.$message.error(res!.msg) }
}

const openModalDailog = () => {
  isAdd.value = true
  showModal.value = true
}
const checkAdd = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      saveAuthority({ ...modelRef.value, authorityId: parseInt(modelRef.value.authorityId) }).then((res) => {
        if (res?.code === HTTP_STATUS.SUCCESS) {
          reloadList()
          showModal.value = false
          modelRef.value = originModel
          window.$message.success(res.msg)
        }
        else {
          window.$message.error(res!.msg)
        }
      })
    }
  })
}
const checkEdit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      setAuthority({
        path: { id: modelRef.value.authorityId },
        name: modelRef.value.name,
        defaultRouter: modelRef.value.defaultRouter,
      }).then((res) => {
        if (res?.code === HTTP_STATUS.SUCCESS) {
          getAllOfRole()
          showModal.value = false
          modelRef.value = originModel
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
  )
}
const handleValidateButtonClick = (e: any) => {
  e.preventDefault()
  if (isAdd.value)
    checkAdd()

  else
    checkEdit()
}
const renderLabel: any = (info: { option: IResDataGetMenus; checked: boolean; selected: boolean }) => {
  return info.option.meta.title
}
const updateCheckedKeys: any = (keys: Array<string | number>, option: Array<IResDataGetMenus>) => {
  baseMenus.value = option
}
const addAuthorityMenus = () => {
  const menus: IResDataGetMenus[] = []
  baseMenus.value.forEach((item) => {
    menus.push(toRaw(item))
    const parentId = item.parentId
    // 如果没有父菜单需要添加
    if (parentId !== null && !menus.some(v => v.id === parentId)) {
      const parent = flatMenus.value?.data.find(menu => menu.id === parentId)
      menus.push(toRaw(parent!))
    }
  })
  addMenus({
    baseMenus: menus,
    authorityId: currentAuthorityId,
  })
    .then((v) => {
      if (v?.code === HTTP_STATUS.SUCCESS) {
        window.$message.success(v.msg)
        if (currentAuthorityId === userStore.userInfo.authorityId)
          window.location.reload()
      }

      else { window.$message.error(v!.msg) }
    })
}
</script>

<template>
  <div class="mb-4">
    <NButton type="info" @click="openModalDailog">
      <template #icon>
        <IconComp :comp="AddSharp" />
      </template>
      新增角色
    </NButton>
  </div>
  <n-data-table
    :loading="loadingData" :columns="columns" :data="authorityData?.data.list" :pagination="false"
    :bordered="false" :max-height="1000"
  />

  <n-modal
    v-model:show="showModal" :mask-closable="false" :close-on-esc="false" class="custom-card" :style="bodyStyle"
    preset="card" title="角色" size="huge" :bordered="false"
  >
    <NForm
      ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{
        maxWidth: '640px',
      }" :show-label="true" :model="modelRef" :rules="rules"
    >
      <NFormItem path="password" label="角色ID">
        <NInput
          v-model:value="modelRef.authorityId" :disabled="!isAdd" type="text" placeholder="请输入角色ID"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem path="nickName" label="角色名称">
        <NInput v-model:value="modelRef.name" type="text" placeholder="请输入角色名称" @keydown.enter.prevent />
      </NFormItem>

      <NRow :gutter="[0, 24]">
        <NCol :span="24">
          <div class="flex justify-end">
            <NButton :loading="loading" type="primary" @click="handleValidateButtonClick">
              确定
            </NButton>
          </div>
        </NCol>
      </NRow>
    </NForm>
  </n-modal>
  <n-drawer v-model:show="showMenus" :width="502">
    <n-drawer-content>
      <!-- <template #header>
        Header
      </template> -->
      <n-space vertical :size="12">
        <n-input v-model:value="pattern" placeholder="搜索" />
        <n-tree
          :on-update:checked-keys="updateCheckedKeys" :pattern="pattern" show-irrelevant-nodes block-line cascade
          checkable :data="menuList?.data ?? []" default-expand-all :default-checked-keys="defaultCheckedKeys"
          key-field="id" :render-label="renderLabel" children-field="children" selectable
        />
      </n-space>

      <template #footer>
        <NButton @click="addAuthorityMenus">
          确定
        </NButton>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

