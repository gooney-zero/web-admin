<script setup lang="ts" name="user">
import { useRequest } from 'vue-request'
import type { DataTableColumns, FormInst, FormItemRule, FormRules } from 'naive-ui'
import { NButton, NPopover, NSwitch, NTag } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { AddCircleOutline, AddSharp, CreateOutline, CutOutline, PersonRemoveOutline } from '@vicons/ionicons5'
import { addUser, deleteUser, getUsers, updateUser } from '@/api/services/user/user'
import type { User } from '@/api/services/user/types/response'
import { IconComp, renderIcon } from '@/utils/icon'
import { getAuthorityList } from '@/api/services/auth/auth'
import { useUserStore } from '@/store/modules/user'
import { HTTP_STATUS } from '@/constants/httpStatus'

const { data, run: getAllOfUser } = useRequest(getUsers, { manual: true })
const { loading, run: saveUser } = useRequest(addUser, { manual: true })
const { run: delUser } = useRequest(deleteUser, { manual: true })
const { run: setUser } = useRequest(updateUser, { manual: true })

getAllOfUser()

const pageParams = ref({ page: 1, pageSize: 10 })
const isAdd = ref(true)
const { data: authorityData } = useRequest(getAuthorityList, { defaultParams: [pageParams.value] })
const userStore = useUserStore()

const showModal = ref(false)
const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value)
const originModel = {
  userName: 'ceshi111',

  password: 'ceshi111',

  authorityId: -1,

  nickName: 'ceshi111',

  sideMode: '',

  headerImg: '',

  phone: '',

  email: '',

  enable: true,
}

const modelRef = ref({
  userName: 'ceshi111',

  password: 'ceshi111',

  authorityId: -1,

  nickName: 'ceshi111',

  sideMode: '',

  headerImg: '',

  phone: '',

  email: '',

  enable: true,
})

const formRef = ref<FormInst | null>(null)

const authorityList = computed(() => authorityData.value?.data.list.map(item => (
  {
    label: item.name,
    key: item.authorityId,
  }
)))

const rules: FormRules = {
  userName: [
    {
      key: 'not_check',
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (value.length < 5)
          return new Error('请输入正确的用户名')
        return true
      },
      trigger: ['blur'],
    },
  ],
  password: [
    {
      key: 'not_check',
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (value.length < 6)
          return new Error('请输入正确的密码')
        return true
      },
    },
  ],
  nickName: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value)
        return new Error('请输入正确的用户名')
      return true
    },
    trigger: ['blur'],
  },
  phone: {
    trigger: ['input'],
    validator: (rule: FormItemRule, value: string) => {
      if (value === '')
        return true
      if (!/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(value))
        return new Error('请输入正确的手机号')

      return true
    },
  },
  authorityId: {
    required: true,
    validator(rule: FormItemRule, value: number) {
      if (value < 0)
        return new Error('请选择用户角色')
      return true
    },
  },
}

const autoCompleteOptions = computed(() => {
  return ['@gmail.com', '@163.com', '@qq.com', '@outlook.com'].map((suffix) => {
    const prefix = modelRef.value.email.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix,
    }
  })
})

const bodyStyle = {
  width: '600px',
}

const deleteUserHandle = async (uid: string) => {
  const res = await delUser({ uuid: uid })
  if (res?.code === HTTP_STATUS.SUCCESS)
    getAllOfUser()
  else
    window.$message.error(res!.msg)
}

const resetPassword = () => {
  console.log('resetPassword')
}

const openModalDailog = () => {
  isAdd.value = true
  showModal.value = true
}
const checkAdd = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      saveUser({
        ...modelRef.value,
        enable: Number(modelRef.value.enable),
        authorityId: modelRef.value.authorityId,
        authorities: [modelRef.value.authorityId],
      }).then((res) => {
        if (res?.code === 200) {
          showModal.value = false
          getAllOfUser()
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
  })
}
const checkEdit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      setUser({
        ...modelRef.value,
        uuid: (modelRef.value as any).uuid,
        enable: Number(modelRef.value.enable),
        authorities: [modelRef.value.authorityId],
      }).then((res) => {
        if (res?.code === 200) {
          showModal.value = false
          getAllOfUser()
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

const columns: DataTableColumns<User> = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: '用户名',
    key: 'userName',
  },
  {
    title: '昵称',
    key: 'nickName',
  },
  {
    title: '手机号',
    key: 'phone',
  },
  {
    title: '邮箱',
    key: 'email',
  },
  {
    title: '用户角色',
    key: 'authorities',
    render(row) {
      const tags = row.authorities.map((authority) => {
        return h(
          NTag,
          {
            class: 'mr-2',
            type: 'info',
            bordered: false,
          },
          {
            default: () => authority.name,
          },
        )
      })
      return tags
    },

  },
  {
    title: '启用',
    key: 'enable',
    render: (row) => {
      return h(
        NSwitch,
        {
          value: row.enable === 1,
          onUpdateValue: async (value: boolean) => {
            const res = await setUser({
              uuid: row.uuid,
              enable: Number(value),
            })
            if (res?.code === HTTP_STATUS.SUCCESS)
              getAllOfUser()
            else
              window.$message.error(res!.msg)
          },
        },
      )
    },
  },
  {
    title: 'Action',
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
                onClick: () => deleteUserHandle(row.uuid),
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
              modelRef.value = Object.assign(modelRef.value, { ...row, authorityId: row.authorities[0]?.authorityId, enable: Boolean(row.enable) })
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
            onClick: resetPassword,
          }, {
            default: () => '重置密码',
            icon: renderIcon(CutOutline),

          }),
        ],
      )
    },
  },
]
</script>

<template>
  <div class="mb-4">
    <NButton type="info" @click="openModalDailog">
      <template #icon>
        <IconComp :comp="AddSharp" />
      </template>
      新增用户
    </NButton>
  </div>
  <n-data-table :columns="columns" :data="data?.data" :pagination="false" :bordered="false" :max-height="1000" />

  <n-modal
    v-model:show="showModal" :mask-closable="false" :close-on-esc="false" class="custom-card" :style="bodyStyle"
    preset="card" title="用户" size="huge" :bordered="false"
  >
    <NForm
      ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{
        maxWidth: '640px',
      }" :show-label="true" :model="modelRef" :rules="rules"
    >
      <NFormItem v-if="isAdd" path="userName" label="用户名">
        <NInput v-model:value="modelRef.userName" placeholder="请输入用户名" @keydown.enter.prevent />
      </NFormItem>
      <NFormItem v-if="isAdd" path="password" label="密码">
        <NInput v-model:value="modelRef.password" type="text" placeholder="请输入密码" @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="nickName" label="昵称">
        <NInput v-model:value="modelRef.nickName" type="text" placeholder="请输入昵称" @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="phone" label="手机号">
        <NInput
          v-model:value="modelRef.phone" :allow-input="onlyAllowNumber" type="text" placeholder="请输入手机号"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem path="email" label="邮箱">
        <n-auto-complete v-model:value="modelRef.email" :options="autoCompleteOptions" placeholder="请输入邮箱" />
        <!-- <NInput  type="text" placeholder="请输入邮箱" @keydown.enter.prevent /> -->
      </NFormItem>
      <n-form-item label="用户角色" path="authorityId">
        <n-tree-select v-model:value="modelRef.authorityId" placeholder="请选择用户角色" :options="authorityList" />
      </n-form-item>
      <n-form-item label="是否启用" path="enable">
        <NSwitch v-model:value="modelRef.enable" />
      </n-form-item>
      <n-form-item label="头像" path="enable">
        <n-upload
          accept="image/*" directory-dnd :default-upload="false"
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f" :max="5"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <AddCircleOutline />
              </n-icon>
            </div>
            <n-text style="font-size: 16px">
              点击或者拖动图片到该区域来上传
            </n-text>
          </n-upload-dragger>
        </n-upload>
      </n-form-item>

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
</template>

