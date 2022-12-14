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

const { loading: loadingData, data, run: getAllOfUser } = useRequest(getUsers, { manual: true })
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
          return new Error('???????????????????????????')
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
          return new Error('????????????????????????')
        return true
      },
    },
  ],
  nickName: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value)
        return new Error('???????????????????????????')
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
        return new Error('???????????????????????????')

      return true
    },
  },
  authorityId: {
    required: true,
    validator(rule: FormItemRule, value: number) {
      if (value < 0)
        return new Error('?????????????????????')
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
  modelRef.value = originModel
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
      window.$message.error(errors[0][0].message || '?????????????????????')
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
      window.$message.error(errors[0][0].message || '?????????????????????')
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
    title: '?????????',
    key: 'userName',
  },
  {
    title: '??????',
    key: 'nickName',
  },
  {
    title: '?????????',
    key: 'phone',
  },
  {
    title: '??????',
    key: 'email',
  },
  {
    title: '????????????',
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
    title: '??????',
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
              default: () => '??????',
              icon: renderIcon(PersonRemoveOutline),
            }),
            default: () => h('p', null, { default: () => '????????????????????????????' }),
            footer: () => h('div', {
              class: 'flex justify-end',
            }, [
              h(NButton, {
                type: 'info',
                class: 'ml-2',
                size: 'tiny',
                onClick: () => deleteUserHandle(row.uuid),
              }, {
                default: () => '??????',
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
            default: () => '??????',
            icon: renderIcon(CreateOutline),

          }),
          h(NButton, {
            text: true,
            size: 'tiny',
            type: 'info',
            onClick: resetPassword,
          }, {
            default: () => '????????????',
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
      ????????????
    </NButton>
  </div>
  <n-data-table :loading="loadingData" :columns="columns" :data="data?.data" :pagination="false" :bordered="false" :max-height="1000" />

  <n-modal
    v-model:show="showModal" :mask-closable="false" :close-on-esc="false" class="custom-card" :style="bodyStyle"
    preset="card" title="??????" size="huge" :bordered="false"
  >
    <NForm
      ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{
        maxWidth: '640px',
      }" :show-label="true" :model="modelRef" :rules="rules"
    >
      <NFormItem v-if="isAdd" path="userName" label="?????????">
        <NInput v-model:value="modelRef.userName" placeholder="??????????????????" @keydown.enter.prevent />
      </NFormItem>
      <NFormItem v-if="isAdd" path="password" label="??????">
        <NInput v-model:value="modelRef.password" type="text" placeholder="???????????????" @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="nickName" label="??????">
        <NInput v-model:value="modelRef.nickName" type="text" placeholder="???????????????" @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="phone" label="?????????">
        <NInput
          v-model:value="modelRef.phone" :allow-input="onlyAllowNumber" type="text" placeholder="??????????????????"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem path="email" label="??????">
        <n-auto-complete v-model:value="modelRef.email" :options="autoCompleteOptions" placeholder="???????????????" />
        <!-- <NInput  type="text" placeholder="???????????????" @keydown.enter.prevent /> -->
      </NFormItem>
      <n-form-item label="????????????" path="authorityId">
        <n-tree-select v-model:value="modelRef.authorityId" placeholder="?????????????????????" :options="authorityList" />
      </n-form-item>
      <n-form-item label="????????????" path="enable">
        <NSwitch v-model:value="modelRef.enable" />
      </n-form-item>
      <n-form-item label="??????" path="enable">
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
              ?????????????????????????????????????????????
            </n-text>
          </n-upload-dragger>
        </n-upload>
      </n-form-item>

      <NRow :gutter="[0, 24]">
        <NCol :span="24">
          <div class="flex justify-end">
            <NButton :loading="loading" type="primary" @click="handleValidateButtonClick">
              ??????
            </NButton>
          </div>
        </NCol>
      </NRow>
    </NForm>
  </n-modal>
</template>

