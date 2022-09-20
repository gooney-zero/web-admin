import type { IconProps } from 'naive-ui'
import { NIcon } from 'naive-ui'
import { h } from 'vue'

export function renderIcon(icon: string, props: IconProps = { size: 12 }) {
  return () => h(NIcon, props, { default: () => h(icon) })
}
