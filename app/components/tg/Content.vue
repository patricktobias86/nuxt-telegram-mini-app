<template>
  <component :is="asTag" :class="rootClasses">
    <slot />
  </component>
  <div class="h-2" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  as?: string
  /** Tailwind max-width class, e.g. 'max-w-2xl' (optional override) */
  maxWidthClass?: string
  /** Extra classes to merge */
  class?: string
}>(), {
  as: 'main',
  maxWidthClass: undefined,
  class: '',
})

const asTag = computed(() => props.as)

const maxWidthClass = computed(() => props.maxWidthClass || 'max-w-2xl')

const hasNav = ref(false)
onMounted(() => {
  try {
    hasNav.value = !!document.querySelector('[data-tg-nav]')
  } catch {}
})

const rootClasses = computed(() => [
  'mx-auto text-text space-y-6',
  maxWidthClass.value,
  hasNav.value ? 'pb-[calc(56px+var(--safe-area-inset-bottom))]' : '',
  props.class,
].filter(Boolean).join(' '))
</script>

<style scoped>
</style>
