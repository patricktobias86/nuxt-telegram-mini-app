<template>
  <TgContent>
    <Hero
      title="Components Demo"
      subtitle="Interactive showcase of all Telegram Mini App components"
    />

    <TgSection title="Buttons" inset>
      <div class="p-4 space-y-3">
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Primary Buttons</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <TgButton title="Default Primary" status="primary" haptic />
            <TgButton title="Disabled Primary" status="primary" :disabled="true" />
          </div>
        </div>
        
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Secondary Buttons</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <TgButton title="Secondary" status="secondary" haptic="impact-light" />
            <TgButton title="Outline" status="outline" haptic="selection" />
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Special States</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <TgButton title="Loading..." status="primary" :loading="loadingButton" @click="toggleLoading" />
            <TgButton title="Destructive" status="destructive" haptic="notification-warning" />
          </div>
        </div>
      </div>
    </TgSection>

    <TgSection title="Cells & Lists" inset>
      <TgCell
        title="Basic Cell"
        subtitle="Simple cell with subtitle"
        icon="i-heroicons-star-20-solid"
      />
      <TgCell
        title="Cell with Description"
        :description="cellDescription"
        icon="i-heroicons-information-circle-20-solid"
      />
      <TgCell
        title="Interactive Cell"
        subtitle="Demo cell (no navigation)"
        icon="i-heroicons-arrow-right-circle-20-solid"
        @click="onCellClick"
      />
      <TgCell
        title="Cell with Action"
        subtitle="Custom click handler"
        icon="i-heroicons-bolt-20-solid"
        @click="onCellClick"
        :border="false"
      />
      <TgCell
        title="Router Link Cell"
        subtitle="Navigates using NuxtLink"
        icon="i-heroicons-chevron-right-20-solid"
        to="/"
      />
      <TgCell
        title="External Link Cell"
        subtitle="Opens external URL"
        icon="i-heroicons-arrow-top-right-on-square-20-solid"
        href="https://nuxt.com"
      />
    </TgSection>

    <TgSection title="Color Showcase" inset>
      <div class="p-4 space-y-4">
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Theme Colors</h3>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="color in themeColors" :key="color.name" class="flex items-center gap-2">
              <div 
                class="w-4 h-4 rounded border border-sectionSeparator"
                :style="{ backgroundColor: color.value }"
              />
              <span class="text-xs">{{ color.name }}</span>
            </div>
          </div>
        </div>
        
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Dynamic Colors</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="colorOption in backgroundColors"
              :key="colorOption.name"
              class="px-3 py-1 text-xs rounded border border-sectionSeparator"
              :style="{ backgroundColor: colorOption.value, color: colorOption.textColor }"
              @click="changeBackgroundColor(colorOption.value)"
            >
              {{ colorOption.name }}
            </button>
          </div>
        </div>
      </div>
    </TgSection>

    <TgSection title="Interactive Elements" inset>
      <div class="p-4 space-y-4">
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Form Elements</h3>
          <div class="space-y-3">
            <input
              v-model="textInput"
              type="text"
              placeholder="Enter text here..."
              class="w-full px-3 py-2 bg-secondaryBg border border-sectionSeparator rounded-lg text-text placeholder-hint"
            />
            <textarea
              v-model="textareaInput"
              rows="3"
              placeholder="Multi-line input..."
              class="w-full px-3 py-2 bg-secondaryBg border border-sectionSeparator rounded-lg text-text placeholder-hint resize-none"
            />
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Counters & Progress</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm">Counter: {{ counter }}</span>
              <div class="flex gap-2">
                <button
                  @click="counter--"
                  class="w-8 h-8 bg-button-color text-button-text rounded-full flex items-center justify-center text-sm font-medium"
                >
                  -
                </button>
                <button
                  @click="counter++"
                  class="w-8 h-8 bg-button-color text-button-text rounded-full flex items-center justify-center text-sm font-medium"
                >
                  +
                </button>
              </div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between text-sm">
                <span>Progress</span>
                <span>{{ progress }}%</span>
              </div>
              <div class="w-full h-2 bg-secondaryBg rounded-full overflow-hidden">
                <div
                  class="h-full bg-link transition-all duration-300"
                  :style="{ width: `${progress}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TgSection>

    <TgSection title="Haptic Feedback Demo" inset>
      <div class="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        <TgButton
          title="Light Impact"
          haptic="impact-light"
          status="outline"
          @click="() => {}"
        />
        <TgButton
          title="Medium Impact"
          haptic="impact-medium"
          status="outline"
          @click="() => {}"
        />
        <TgButton
          title="Heavy Impact"
          haptic="impact-heavy"
          status="outline"
          @click="() => {}"
        />
        <TgButton
          title="Success"
          haptic="notification-success"
          status="outline"
          @click="() => {}"
        />
        <TgButton
          title="Warning"
          haptic="notification-warning"
          status="outline"
          @click="() => {}"
        />
        <TgButton
          title="Error"
          haptic="notification-error"
          status="outline"
          @click="() => {}"
        />
      </div>
    </TgSection>

    <div class="h-2" />
  </TgContent>

</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useHapticFeedback, useMiniApp, useThemeParams, useMainButton } from '~/composables/telegram'

const haptic = useHapticFeedback()
const mini = useMiniApp()
const theme = useThemeParams()
const main = useMainButton()

// Interactive state
const loadingButton = ref(false)
const counter = ref(0)
const textInput = ref('')
const textareaInput = ref('')

const progress = computed(() => Math.min(100, Math.max(0, counter.value * 10)))

const cellDescription = computed(() => {
  if (textInput.value) return `You typed: "${textInput.value}"`
  return 'Type something in the input above'
})

function toggleLoading() {
  loadingButton.value = true
  setTimeout(() => {
    loadingButton.value = false
    haptic.notificationOccurred('success')
  }, 2000)
}

function onCellClick() {
  haptic.impactOccurred('medium')
  counter.value += 5
}

// Theme colors demo
const themeColors = computed(() => [
  { name: 'Background', value: theme.backgroundColor.value || 'var(--tg-theme-bg-color)' },
  { name: 'Text', value: theme.textColor.value || 'var(--tg-theme-text-color)' },
  { name: 'Button', value: theme.buttonColor.value || 'var(--tg-theme-button-color)' },
  { name: 'Button Text', value: theme.buttonTextColor.value || 'var(--tg-theme-button-text-color)' },
  { name: 'Link', value: theme.linkColor.value || 'var(--tg-theme-link-color)' },
  { name: 'Secondary BG', value: theme.secondaryBackgroundColor.value || 'var(--tg-theme-secondary-bg-color)' },
])

const backgroundColors = [
  { name: 'Default', value: 'var(--tg-theme-bg-color)', textColor: 'var(--tg-theme-text-color)' },
  { name: 'Dark', value: '#1a1a1a', textColor: '#ffffff' },
  { name: 'Blue', value: '#0088cc', textColor: '#ffffff' },
  { name: 'Green', value: '#00c896', textColor: '#ffffff' },
  { name: 'Purple', value: '#8b5cf6', textColor: '#ffffff' },
]

function changeBackgroundColor(color: string) {
  mini.setBackgroundColor(color)
  haptic.selectionChanged()
}

// Hide Main Button since we're using TgNav for navigation
onMounted(() => {
  main.mount()
  
  setTimeout(() => {
    try {
      main.setParams({ is_visible: false })
    } catch (e) {
      console.warn('Failed to hide main button:', e)
    }
  }, 500)
})
</script>
