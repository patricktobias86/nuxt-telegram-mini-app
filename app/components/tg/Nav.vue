<template>
  <nav
    class="fixed bottom-0 inset-x-0"
    data-tg-nav
    :class="[rootClass]"
    role="tablist"
  >
    <ul class="mx-auto grid max-w-2xl" :style="gridStyle">
      <li v-for="item in items" :key="item.key">
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          :class="[itemClass, { 'text-text': currentActiveKey === item.key }]"
          :aria-current="currentActiveKey === item.key ? 'page' : undefined"
        >
          <Icon v-if="item.icon" :name="item.icon" class="h-5 w-5" :class="currentActiveKey === item.key ? 'text-text' : ''" />
          <span :class="currentActiveKey === item.key ? 'text-text' : ''">{{ item.label }}</span>
        </NuxtLink>
        <button
          v-else
          type="button"
          :class="[itemClass, { 'text-text': currentActiveKey === item.key }]"
          :aria-current="currentActiveKey === item.key ? 'page' : undefined"
          @click="onSelect(item)"
        >
          <Icon v-if="item.icon" :name="item.icon" class="h-5 w-5" :class="currentActiveKey === item.key ? 'text-text' : ''" />
          <span :class="currentActiveKey === item.key ? 'text-text' : ''">{{ item.label }}</span>
        </button>
      </li>
    </ul>
    <div v-if="safeArea" class="pb-[var(--safe-area-inset-bottom)]" />
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
  /** Background tone */
  tone?: 'default' | 'secondary'
  /** Show top border */
  border?: boolean
  /** Height of each item */
  height?: '12' | '14'
  /** Respect bottom safe area */
  safeArea?: boolean
}>(), {
  items: () => [],
  modelValue: undefined,
  rootClass: '',
  tone: 'default',
  border: true,
  height: '14',
  safeArea: true,
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

const itemClass = computed(() => [
  `h-${props.height} w-full flex flex-col items-center justify-center gap-1 text-xs text-hint hover:text-text transition-colors`
].join(' '))

const rootClass = computed(() => [
  props.border ? 'border-t border-sectionSeparator' : '',
  props.tone === 'secondary' ? 'bg-secondaryBg' : 'bg-bg',
  'backdrop-blur supports-[backdrop-filter]:bg-bg50',
].filter(Boolean).join(' '))

function onSelect(item: TgNavItem) {
  emit('update:modelValue', item.key)
  emit('select', item)
}
</script>

<style scoped>
</style>
