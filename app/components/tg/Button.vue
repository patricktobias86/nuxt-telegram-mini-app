<template>
  <component :is="tag" v-bind="bind" :class="classes" :disabled="disabled" @click="onClick">
    <Icon v-if="icon" :name="icon" class="h-5 w-5" />
    <span>{{ title }}</span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { shareURL } from '~/composables/telegram'
import { useHapticFeedback } from '~/composables/telegram'

const props = withDefaults(defineProps<{
  title: string
  /** primary | outline | danger */
  status?: 'primary' | 'outline' | 'danger'
  icon?: string
  to?: string
  href?: string
  /** When set, clicking triggers share; falls back to link if provided. */
  shareUrl?: string
  block?: boolean
  small?: boolean
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
  block: true,
  small: false,
  disabled: false,
  class: '',
  haptic: false,
})

const tag = computed(() => props.to ? 'NuxtLink' : (props.href ? 'a' : 'button'))
const bind = computed(() => ({ to: props.to, href: props.href, type: 'button' }))

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-md font-medium',
  props.small ? 'text-sm h-9 px-3' : 'h-11 px-4',
  props.block ? 'w-full' : 'w-auto',
  props.status === 'primary' && 'bg-primary text-primaryFg',
  props.status === 'outline' && 'border border-sectionSeparator text-text bg-secondaryBg',
  props.status === 'danger' && 'bg-[var(--tg-theme-destructive-text-color)] text-primaryFg',
  props.disabled ? 'opacity-50 pointer-events-none' : 'hover:opacity-90',
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
  if (props.disabled) return
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
