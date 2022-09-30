<script lang="ts" setup name="login">
import { NButton, NCol, NForm, NFormItem, NIcon, NInput, NRow, useMessage } from 'naive-ui'
import { EyeOffSharp, EyeOutline, PersonOutline } from '@vicons/ionicons5'
import type {
  FormInst,
  FormItemInst,
  FormItemRule,
  FormRules,
} from 'naive-ui'
import { ref, toRaw } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { login } from '@/api/services/user/user'
import { HTTP_STATUS } from '@/constants/httpStatus'
import { storage_token } from '@/utils/storage'
import { ROUTER_NAMES } from '@/constants/router'
import { useAsyncRouteStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'
interface ModelType {
  username: string
  password: string
}

const formRef = ref<FormInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const message = useMessage()
const isShowPassword = ref(false)
const modelRef = ref<ModelType>({
  username: 'admin',
  password: '123456',
})

const { run } = useRequest(login, {
  manual: true,
})

const router = useRouter()

const handlePasswordInput = () => {

}
const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      run(modelRef.value).then(async (r) => {
        if (!r)
          return
        if (r?.code === HTTP_STATUS.SUCCESS) {
          message.success('登录成功')
          storage_token.value = r.data.access_token

          const userStore = useUserStore()
          userStore.setUserInfo(r.data.user)
          const asyncRouteStore = useAsyncRouteStore()
          await asyncRouteStore.getRouter()
          const asyncRouters = asyncRouteStore.asyncRouters

          toRaw(asyncRouters).forEach((asyncRouter) => {
            router.addRoute(asyncRouter)
          })
          router.push({ name: ROUTER_NAMES.DEFAULT })
        }
        else {
          window.$message.error(r.msg)
        }
      })
    }
    else {
      message.error('验证失败')
    }
  })
}

const rules: FormRules = {
  username: [
    {
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
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (value.length < 6)
          return new Error('请输入正确的密码')
        return true
      },
    },
  ],
}
</script>

<template>
  <div class="flex items-center justify-center h-100vh ">
    <div
      style="--un-shadow: 0 25px 50px 10px var(--un-shadow-color, rgba(0,0,0,0.25));"
      class="w-30%  rounded-md shadow-2xl shadow-gray-300 p-20"
    >
      <NForm ref="formRef" :show-label="false" :model="modelRef" :rules="rules">
        <NFormItem path="username" label="用户名">
          <NInput v-model:value="modelRef.username" placeholder="请输入用户名" @keydown.enter.prevent>
            <template #suffix>
              <NIcon class="cursor-pointer" :component="PersonOutline" />
            </template>
          </NInput>
        </NFormItem>
        <NFormItem path="password" label="密码">
          <NInput
            v-model:value="modelRef.password" :type="isShowPassword ? 'text' : 'password'" placeholder="请输入密码"
            @input="handlePasswordInput" @keydown.enter.prevent
          >
            <template #suffix>
              <NIcon
                class="cursor-pointer" :component="isShowPassword ? EyeOutline : EyeOffSharp"
                @click="isShowPassword = !isShowPassword"
              />
              <!-- <NIcon v-show="!isShowPassword" :component="isShowPassword ? EyeOffSharp : EyeOffSharp" @click="isShowPassword = !isShowPassword" /> -->
            </template>
          </NInput>
        </NFormItem>
        <NRow :gutter="[0, 24]">
          <NCol :span="24">
            <div class="flex justify-end">
              <NButton :disabled="!modelRef.username" round type="primary" @click="handleValidateButtonClick">
                登录
              </NButton>
            </div>
          </NCol>
        </NRow>
      </NForm>
    </div>
  </div>
</template>

