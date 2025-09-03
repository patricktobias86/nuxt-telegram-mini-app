<template>
  <component :is="wrapperTag" v-bind="wrapperBind" :class="rootClass">
    <div v-if="icon" class="shrink-0 h-6 w-6 flex items-center justify-center">
      <Icon :name="icon" class="h-5 w-5" :style="iconStyle" />
    </div>
    <div class="min-w-0 flex-1">
      <div class="text-sm font-medium" :style="titleStyle">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="subtitle || $slots.subtitle" class="text-xs text-hint">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
      <div v-if="description || $slots.description" class="text-xs text-hint" :style="descStyle">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
    <Icon v-if="isLink" name="i-heroicons-chevron-right-20-solid" class="h-5 w-5 text-hint" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  subtitle?: string
  icon?: string
  /** E.g. '#3ea6ff' or 'var(--tg-theme-link-color)' */
  color?: string
  iconColor?: string
  /** Line clamp for description/title (0 = none) */
  lineClamp?: number
  /** Show divider under the cell */
  border?: boolean
  /** Route location; renders a NuxtLink when set */
  to?: string
  /** External link; renders an anchor when set */
  href?: string
  class?: string
}>(), {
  title: '',
  description: undefined,
  subtitle: undefined,
  icon: undefined,
  color: undefined,
  iconColor: undefined,
  lineClamp: 0,
  border: true,
  to: undefined,
  href: undefined,
  class: '',
})

const isLink = computed(() => !!(props.to || props.href))

const wrapperTag = computed(() => props.to ? 'NuxtLink' : (props.href ? 'a' : 'div'))
const wrapperBind = computed(() => ({ to: props.to, href: props.href }))

const clampStyle = computed(() => props.lineClamp > 0
  ? { display: '-webkit-box', WebkitLineClamp: String(props.lineClamp), WebkitBoxOrient: 'vertical', overflow: 'hidden' }
  : {})

const titleStyle = computed(() => ({ ...(props.color ? { color: props.color } : {}), ...clampStyle.value }))
const descStyle = computed(() => clampStyle.value)
const iconStyle = computed(() => props.iconColor ? { color: props.iconColor } : {})

const rootClass = computed(() => [
  'w-full flex items-center gap-3 px-4 py-3 bg-bg',
  props.border ? 'border-b border-sectionSeparator last:border-b-0' : '',
  isLink.value ? 'hover:bg-secondaryBg transition-colors' : '',
  props.class,
].filter(Boolean).join(' '))
</script>

<style scoped>
</style>
