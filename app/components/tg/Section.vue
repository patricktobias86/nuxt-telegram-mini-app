<template>
  <section :class="sectionClass">
    <header v-if="title" class="px-4 pt-4 pb-2">
      <h2 class="text-[13px] font-semibold tracking-wide text-accent uppercase">{{ title }}</h2>
    </header>
    <div class="bg-bg" :class="bodyClass">
      <slot />
    </div>
    <footer v-if="$slots.append" class="px-4 py-3 text-[13px] text-hint" :class="appendBorder ? 'border-t border-sectionSeparator' : ''">
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
  class?: string
}>(), {
  title: undefined,
  inset: false,
  appendBorder: true,
  class: '',
})

const sectionClass = computed(() => [props.inset ? 'px-3' : '', props.class].filter(Boolean).join(' '))
const bodyClass = computed(() => [props.inset ? 'rounded-2xl overflow-hidden' : 'rounded', 'border border-sectionSeparator'].join(' '))
</script>

<style scoped>
</style>
