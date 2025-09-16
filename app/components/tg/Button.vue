<template>
  <div class="px-3">
    <component :is="tag" v-bind="bind" :class="classes" :disabled="disabled || loading" @click="onClick">
    <Icon v-if="loading" name="i-heroicons-arrow-path-20-solid" class="h-5 w-5 animate-spin" />
    <Icon v-if="icon && iconPosition === 'left' && !loading" :name="icon" class="h-5 w-5" />
    <span>{{ title }}</span>
    <Icon v-if="icon && iconPosition === 'right' && !loading" :name="icon" class="h-5 w-5" />
  </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { shareURL, useHapticFeedback  } from '~/composables/telegram'

const props = withDefaults(defineProps<{
  title: string
  /**
   * Visual style of the button
   * - 'primary' (default)
   * - 'secondary' (subtle background)
   * - 'outline' (bordered)
   * - 'danger' | 'destructive' (red)
   */
  status?: 'primary' | 'secondary' | 'outline' | 'danger' | 'destructive'
  icon?: string
  /** Where to render the icon */
  iconPosition?: 'left' | 'right'
  to?: string
  href?: string
  /** When set, clicking triggers share; falls back to link if provided. */
  shareUrl?: string
  /** Full-width button */
  block?: boolean
  /** Deprecated in favor of `size`, kept for back-compat */
  small?: boolean
  /** Control size */
  size?: 'sm' | 'md' | 'lg'
  /** Loading state disables interactions */
  loading?: boolean
  /** Elevation shadow */
  elevated?: boolean
  /** Uppercase label */
  uppercase?: boolean
  disabled?: boolean
  class?: string
  /**
   * Optional haptic feedback on click.
   * - 'selection' (default when true)
   * - 'impact-light' | 'impact-medium' | 'impact-heavy'
   * - 'notification-success' | 'notification-warning' | 'notification-error'
   */
  haptic?: boolean | 'selection' | 'impact-light' | 'impact-medium' | 'impact-heavy' | 'notification-success' | 'notification-warning' | 'notification-error'
}>(), {
  status: 'primary',
  iconPosition: 'left',
  block: true,
  small: false,
  size: undefined,
  loading: false,
  elevated: false,
  uppercase: false,
  disabled: false,
  class: '',
  haptic: false,
})

const tag = computed(() => props.to ? 'NuxtLink' : (props.href ? 'a' : 'button'))
const bind = computed(() => ({ to: props.to, href: props.href, type: 'button' }))

const sizeClass = computed(() => {
  const size = props.size || (props.small ? 'sm' : 'md')
  if (size === 'sm') return 'text-sm h-9 px-3'
  if (size === 'lg') return 'h-12 px-5 text-base'
  return 'h-11 px-4'
})

const variantClass = computed(() => {
  const v = props.status
  if (v === 'outline') return 'border border-sectionSeparator text-text bg-secondaryBg'
  if (v === 'secondary') return 'bg-secondaryBg text-text'
  if (v === 'danger' || v === 'destructive') return 'bg-[var(--tg-theme-destructive-text-color)] text-primaryFg'
  return 'bg-primary text-primaryFg'
})

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 font-medium rounded-md',
  sizeClass.value,
  props.block ? 'w-full' : 'w-auto',
  variantClass.value,
  (props.disabled || props.loading) ? 'opacity-50 pointer-events-none' : 'hover:opacity-90',
  props.elevated ? 'shadow-sm' : '',
  props.uppercase ? 'uppercase' : '',
  // visual feedback
  'transition-transform transition-opacity duration-150 active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
  props.class,
].filter(Boolean).join(' '))

const haptic = useHapticFeedback()

function triggerHaptic() {
  if (!props.haptic) return
  const kind = props.haptic === true ? 'selection' : props.haptic
  try {
    if (kind === 'selection') haptic.selectionChanged()
    else if (kind.startsWith('impact-')) {
      const style = kind.split('-')[1] as 'light' | 'medium' | 'heavy'
      haptic.impactOccurred(style)
    }
    else if (kind.startsWith('notification-')) {
      const n = kind.split('-')[1] as 'success' | 'warning' | 'error'
      haptic.notificationOccurred(n)
    }
  } catch {}
}

function onClick(e: Event) {
  if (props.disabled || props.loading) return
  // Haptic first for immediate feedback
  triggerHaptic()
  if (props.shareUrl) {
    e.preventDefault()
    shareURL(props.shareUrl)
  }
}
</script>

<style scoped>
</style>
