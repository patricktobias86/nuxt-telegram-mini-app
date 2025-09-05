<template>
  <nav
    class="fixed bottom-0 inset-x-0 border-t border-sectionSeparator bg-bg backdrop-blur supports-[backdrop-filter]:bg-bg50"
    :class="[rootClass]"
    role="tablist"
  >
    <ul class="mx-auto grid" :style="gridStyle">
      <li v-for="item in items" :key="item.key">
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="h-14 w-full flex flex-col items-center justify-center gap-1 text-xs text-hint hover:text-text transition-colors"
          :class="{ 'text-text': currentActiveKey === item.key }"
          :aria-current="currentActiveKey === item.key ? 'page' : undefined"
        >
          <Icon v-if="item.icon" :name="item.icon" class="h-5 w-5" :class="currentActiveKey === item.key ? 'text-text' : ''" />
          <span :class="currentActiveKey === item.key ? 'text-text' : ''">{{ item.label }}</span>
        </NuxtLink>
        <button
          v-else
          type="button"
          class="h-14 w-full flex flex-col items-center justify-center gap-1 text-xs text-hint hover:text-text transition-colors"
          :class="{ 'text-text': currentActiveKey === item.key }"
          :aria-current="currentActiveKey === item.key ? 'page' : undefined"
          @click="onSelect(item)"
        >
          <Icon v-if="item.icon" :name="item.icon" class="h-5 w-5" :class="currentActiveKey === item.key ? 'text-text' : ''" />
          <span :class="currentActiveKey === item.key ? 'text-text' : ''">{{ item.label }}</span>
        </button>
      </li>
    </ul>
    <div class="pb-[var(--safe-area-inset-bottom)]" />
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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

const route = useRoute()

// Determine active key based on current route
const currentActiveKey = computed(() => {
  // First try to match by route path
  const matchedItem = props.items.find(item => item.to === route.path)
  if (matchedItem) {
    return matchedItem.key
  }
  
  // Fallback to modelValue prop
  return props.modelValue || ''
})

const gridStyle = computed(() => ({ gridTemplateColumns: `repeat(${Math.min(props.items.length || 1, 4)}, minmax(0, 1fr))` }))

function onSelect(item: TgNavItem) {
  emit('update:modelValue', item.key)
  emit('select', item)
}
</script>

<style scoped>
ul { max-width: 32rem; }
</style>
