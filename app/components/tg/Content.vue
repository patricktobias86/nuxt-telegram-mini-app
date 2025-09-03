<template>
  <component :is="asTag" :class="rootClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  as?: string
  /** Tailwind max-width class, e.g. 'max-w-2xl' */
  maxWidthClass?: string
  /** Adds bottom padding for bottom-nav/safe-area */
  navPadding?: boolean
  /** Extra classes to merge */
  class?: string
}>(), {
  as: 'main',
  maxWidthClass: 'max-w-2xl',
  navPadding: true,
  class: '',
})

const asTag = computed(() => props.as)

const rootClasses = computed(() => [
  'mx-auto p-4 space-y-6 text-text',
  props.maxWidthClass,
  props.navPadding ? 'pb-[calc(56px+var(--safe-area-inset-bottom))]' : '',
  props.class,
].filter(Boolean).join(' '))
</script>

<style scoped>
</style>

