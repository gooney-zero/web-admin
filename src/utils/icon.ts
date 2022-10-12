import type { IconProps } from 'naive-ui'

import { NIcon } from 'naive-ui'
import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'

const defaultProps = { size: 12 }
export function renderIcon(icon: Component, props: IconProps = defaultProps) {
  return () => h(NIcon, props, { default: () => h(icon) })
}

export async function asyncRenderIcon(icon: string) {
  const { [icon]: iconComp } = (await import('@vicons/ionicons5')) as any
  return renderIcon(iconComp)
}

export const IconComp = defineComponent({
  props: {
    comp: {
      type: Object as PropType<Component>,
      required: true,
    },
  },
  render() {
    return h(NIcon, defaultProps, { default: () => h(this.comp) })
  },
})
