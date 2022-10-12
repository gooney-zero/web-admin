<script lang="ts" name="menu">
export { default } from './vm'
</script>

<template>
  <div class="mb-4">
    <NButton type="info" @click="openModalDailog">
      <template #icon>
        <IconComp :comp="AddSharp" />
      </template>
      新增菜单
    </NButton>
  </div>
  <n-dropdown
    placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :options="options" :show="showDropdownRef"
    :on-clickoutside="onClickoutside" @select="handleSelect"
  />
  <n-skeleton v-if="loadingDataTable" :repeat="5" text />
  <n-data-table
    v-else :row-props="rowProps" :columns="columns" :data="data?.data" :pagination="false" :bordered="false"
    :max-height="1000"
  />

  <n-modal
    v-model:show="showModal" :mask-closable="false" :close-on-esc="false" class="custom-card" :style="bodyStyle"
    preset="card" title="用户" size="huge" :bordered="false"
  >
    <NForm
      ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{
        maxWidth: '640px',
      }" :show-label="true" :model="modelRef" :rules="rules"
    >
      <NFormItem path="name" label="路由名称">
        <NInput v-model:value="modelRef.name" placeholder="请输入路由名称" @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="path" label="路由路径">
        <NInput
          v-model:value="modelRef.path" :disabled="!isAdd && !isAddChildMenu" type="text" placeholder="请输入路由名称"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem path="sort" label="排序">
        <NInput v-model:value="modelRef.sort" type="text" placeholder="请输入排序标记" @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="component" label="组件路径">
        <NInput v-model:value="modelRef.component" type="text" placeholder="如果菜单包含子菜单，请创建router-view二级路由页面" />
      </NFormItem>
      <NFormItem path="meta.title" label="展示名称">
        <n-input v-model:value="modelRef.meta.title" placeholder="请输入展示名称" />
      </NFormItem>
      <n-form-item label="图标" path="meta.icon">
        <n-input v-model:value="modelRef.meta.icon" placeholder="请选择图标" @click="showIconDrawerActive = true">
          <template #prefix>
            <n-icon :component="renderPrefixIcon(modelRef.meta.icon)" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item label="keepAlive" path="meta.keepAlive">
        <n-select v-model:value="modelRef.meta.keepAlive" placeholder="请选择用户角色" :options="keepAliveOptions" />
      </n-form-item>
      <n-form-item label="父节点" path="parentId">
        <n-cascader
          v-model:value="modelRef.parentId" :disabled="isAddChildMenu" placeholder="请选择父节点"
          :options="rootNode"
        />
        <!-- <n-cascader placeholder="没啥用的值" :options="getOptions()" check-strategy="child" size="small" /> -->
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

  <n-drawer v-model:show="showIconDrawerActive" display-directive="show" :width="502">
    <n-drawer-content>
      <NIcon
        v-for="com in icons" v-once :key="com.name" class="cursor-pointer" :size="20" :component="com"
        @click="selectIcon(com.name)"
      />
    </n-drawer-content>
  </n-drawer>
</template>

