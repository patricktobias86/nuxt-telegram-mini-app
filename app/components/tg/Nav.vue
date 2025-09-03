<template>
  <nav
    class="fixed bottom-0 inset-x-0 border-t border-sectionSeparator bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80"
    :class="[rootClass]"
    role="tablist"
  >
    <ul class="mx-auto grid" :style="gridStyle">
      <li v-for="item in items" :key="item.key">
        <component
          :is="item.to ? 'NuxtLink' : 'button'"
          :to="item.to"
          type="button"
          class="h-14 w-full flex flex-col items-center justify-center gap-1 text-xs text-hint hover:text-text transition-colors"
          :aria-current="modelValue === item.key ? 'page' : undefined"
          @click="onSelect(item)"
        >
          <Icon v-if="item.icon" :name="item.icon" class="h-5 w-5" :class="modelValue === item.key ? 'text-text' : ''" />
          <span :class="modelValue === item.key ? 'text-text' : ''">{{ item.label }}</span>
        </component>
      </li>
    </ul>
    <div class="pb-[var(--safe-area-inset-bottom)]" />
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TgNavItem {
  key: string
  label: string
  icon?: string
  to?: string
}

const props = withDefaults(defineProps<{
  items: TgNavItem[]
  modelValue?: string
  /** Optional class for the root nav element */
  rootClass?: string
}>(), {
  items: () => [],
  modelValue: undefined,
  rootClass: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', item: TgNavItem): void
}>()

const modelValue = computed(() => props.modelValue)
const gridStyle = computed(() => ({ gridTemplateColumns: `repeat(${Math.min(props.items.length || 1, 4)}, minmax(0, 1fr))` }))

function onSelect(item: TgNavItem) {
  emit('update:modelValue', item.key)
  emit('select', item)
}
</script>

<style scoped>
ul { max-width: 32rem; }
</style>

