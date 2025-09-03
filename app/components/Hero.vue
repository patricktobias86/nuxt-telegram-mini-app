<template>
  <section class="w-full">
    <div :class="containerClass">
      <div v-if="hasImage" class="flex justify-center">
        <img
          :src="imageSrc!"
          :alt="altText"
          class="h-28 w-28 rounded-full object-cover ring-1 ring-sectionSeparator"
          decoding="async"
          :loading="loadingAttr"
        />
      </div>

      <div :class="textWrapClass">
        <h1 class="text-2xl font-semibold text-text">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-hint">{{ subtitle }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
type Align = 'left' | 'center' | 'right'

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  imageSrc?: string
  alt?: string
  alignment?: Align // only used when image is hidden
  eagerImage?: boolean
}>(), {
  alignment: 'center',
  eagerImage: false,
})

const hasImage = computed(() => !!props.imageSrc)
const altText = computed(() => props.alt ?? props.title)
const loadingAttr = computed(() => (props.eagerImage ? 'eager' : 'lazy'))

const containerClass = computed(() => {
  if (hasImage.value) return 'flex flex-col items-center text-center gap-3 pt-6 pb-2'
  return 'flex flex-col gap-1 pt-2 pb-2'
})

const textWrapClass = computed(() => {
  if (hasImage.value) return 'text-center space-y-1'
  switch (props.alignment) {
    case 'left':
      return 'text-left'
    case 'right':
      return 'text-right'
    default:
      return 'text-center'
  }
})
</script>

<style scoped>
</style>
