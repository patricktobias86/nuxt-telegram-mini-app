<template>
  <section :class="sectionClass">
    <header v-if="title" :class="inset ? 'px-4' : 'last:pb-0'">
      <h2 class="px-3 text-sm uppercase mb-1.5" :style="{ color: 'var(--tg-theme-section-header-text-color)' }">{{ title }}</h2>
    </header>
    <div class="bg-bg" :class="bodyClass" :style="{ backgroundColor: 'var(--tg-theme-section-bg-color)' }">
      <slot />
    </div>
    <footer v-if="$slots.append" class="pt-2 px-5 text-xs text-hint" :class="appendBorder ? 'border-t border-sectionSeparator' : ''">
      <slot name="append" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  /** Adds outer rounding/indents reminiscent of iOS */
  inset?: boolean
  /** Adds a thin top border above the append slot */
  appendBorder?: boolean
  /** Inner background tone */
  tone?: 'default' | 'secondary'
  /** Inner padding of the body (removed: default only) */
  class?: string
}>(), {
  title: undefined,
  inset: false,
  appendBorder: true,
  tone: 'default',
  class: '',
})

const sectionClass = computed(() => [props.inset ? 'px-3' : '', props.class].filter(Boolean).join(' '))

const roundedClass = computed(() => props.inset ? 'rounded-2xl overflow-hidden' : 'rounded')

const paddingClass = computed(() => '')

const toneClass = computed(() => props.tone === 'secondary' ? 'bg-secondaryBg' : 'bg-bg')

const borderClass = computed(() => '')

const bodyClass = computed(() => [roundedClass.value, borderClass.value, toneClass.value, paddingClass.value].filter(Boolean).join(' '))
</script>

<style scoped>
</style>
