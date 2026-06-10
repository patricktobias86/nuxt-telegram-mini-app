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
          <div class="space-y-5">
            <label class="block rounded-2xl bg-secondaryBg px-4 py-3">
              <span class="mb-2 block text-xs text-hint">Display name</span>
              <input
                v-model="formName"
                type="text"
                placeholder="Your name"
                class="min-h-10 w-full bg-transparent text-base text-text placeholder-hint outline-none focus-visible:ring-2 focus-visible:ring-link/40"
              />
            </label>

            <label class="block rounded-2xl bg-secondaryBg px-4 py-3">
              <span class="mb-2 block text-xs text-hint">Notes</span>
              <textarea
                v-model="formNotes"
                rows="3"
                placeholder="Add a short note"
                class="min-h-20 w-full resize-none bg-transparent text-base text-text placeholder-hint outline-none focus-visible:ring-2 focus-visible:ring-link/40"
              />
            </label>

            <div class="space-y-2">
              <p class="px-4 text-xs uppercase tracking-normal text-hint">Notifications</p>
              <div class="overflow-hidden rounded-2xl bg-secondaryBg">
                <label class="flex min-h-16 items-center justify-between gap-3 px-4 py-3 active:bg-bg/60">
                  <span class="min-w-0 text-base font-medium text-text">Notifications</span>
                  <input
                    v-model="notificationsEnabled"
                    type="checkbox"
                    class="peer sr-only"
                    @change="onFormSelection"
                  />
                  <span
                    class="relative h-8 w-12 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-link/40"
                    :class="notificationsEnabled ? 'bg-primary' : 'bg-bg'"
                  >
                    <span
                      class="absolute left-1 top-1 h-6 w-6 rounded-full bg-primaryFg shadow-sm transition-transform"
                      :class="notificationsEnabled ? 'translate-x-4' : 'translate-x-0'"
                    />
                  </span>
                </label>

                <label class="flex min-h-16 items-center justify-between gap-3 border-t border-sectionSeparator px-4 py-3 active:bg-bg/60">
                  <span class="min-w-0">
                    <span class="block text-base font-medium text-text">Updates</span>
                    <span class="block text-sm text-hint">Include product news in this demo profile</span>
                  </span>
                  <input
                    v-model="termsAccepted"
                    type="checkbox"
                    class="peer sr-only"
                    @change="onFormSelection"
                  />
                  <span
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-link/40"
                    :class="termsAccepted ? 'border-primary bg-primary text-primaryFg' : 'border-hint/40 text-transparent'"
                  >
                    <Icon name="i-heroicons-check-20-solid" class="h-5 w-5" />
                  </span>
                </label>
              </div>
            </div>

            <div class="space-y-2">
              <p class="px-4 text-xs uppercase tracking-normal text-hint">Visibility</p>
              <div class="overflow-hidden rounded-2xl bg-secondaryBg">
                <label
                  v-for="option in visibilityOptions"
                  :key="option.value"
                  class="flex min-h-14 items-center gap-4 border-b border-sectionSeparator px-4 py-3 last:border-b-0 active:bg-bg/60"
                >
                  <input
                    v-model="selectedVisibility"
                    type="radio"
                    name="visibility"
                    :value="option.value"
                    class="peer sr-only"
                    @change="onFormSelection"
                  />
                  <span
                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-link/40"
                    :class="selectedVisibility === option.value ? 'border-primary' : 'border-hint/40'"
                  >
                    <span
                      class="h-3.5 w-3.5 rounded-full transition-colors"
                      :class="selectedVisibility === option.value ? 'bg-primary' : 'bg-transparent'"
                    />
                  </span>
                  <span class="text-base font-medium text-text">{{ option.label }}</span>
                </label>
              </div>
            </div>

            <div class="space-y-2">
              <p class="px-4 text-xs uppercase tracking-normal text-hint">Mode</p>
              <div class="grid grid-cols-3 rounded-2xl bg-secondaryBg p-1">
                <button
                  v-for="option in modeOptions"
                  :key="option.value"
                  type="button"
                  class="min-h-11 rounded-xl px-2 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link/40"
                  :class="selectedMode === option.value ? 'bg-primary text-primaryFg' : 'text-text active:bg-bg/70'"
                  @click="selectMode(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="overflow-hidden rounded-2xl bg-secondaryBg">
              <label class="relative flex min-h-16 items-center justify-between gap-3 border-b border-sectionSeparator px-4 py-3 active:bg-bg/60">
                <span class="text-base font-medium text-text">Category</span>
                <span class="flex min-w-0 items-center gap-1 text-base text-hint">
                  <span class="truncate">{{ selectedCategoryLabel }}</span>
                  <Icon name="i-heroicons-chevron-right-20-solid" class="h-5 w-5 shrink-0" />
                </span>
                <select
                  v-model="selectedCategory"
                  aria-label="Category"
                  class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  @change="onFormSelection"
                >
                  <option
                    v-for="option in categoryOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </label>

              <label class="block px-4 py-3">
                <span class="mb-3 flex items-center justify-between gap-3 text-base">
                  <span class="font-medium text-text">Intensity</span>
                  <span class="text-hint">{{ sliderValue }}%</span>
                </span>
                <input
                  v-model.number="sliderValue"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  class="tg-native-range h-8 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link/40"
                  :style="{ '--range-value': `${sliderValue}%` }"
                  @change="onFormSelection"
                />
              </label>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Counters & Progress</h3>
          <div class="overflow-hidden rounded-2xl bg-secondaryBg">
            <div class="flex min-h-24 items-center justify-between gap-4 px-4 py-4">
              <span class="text-lg font-medium text-text">Counter</span>
              <div class="grid shrink-0 grid-cols-[3.25rem_3rem_3.25rem] items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease counter"
                  class="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-2xl bg-bg text-3xl font-light leading-none text-primary transition-colors active:bg-sectionSeparator focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link/40"
                  @click="decrementCounter"
                >
                  <span class="-mt-1">-</span>
                </button>
                <output class="text-center text-2xl font-semibold tabular-nums text-text">
                  {{ counter }}
                </output>
                <button
                  type="button"
                  aria-label="Increase counter"
                  class="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-2xl bg-bg text-3xl font-light leading-none text-primary transition-colors active:bg-sectionSeparator focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link/40"
                  @click="incrementCounter"
                >
                  <span class="-mt-1">+</span>
                </button>
              </div>
            </div>

            <div class="border-t border-sectionSeparator px-4 py-5">
              <div class="mb-4 flex items-center justify-between gap-3">
                <span class="text-lg font-medium text-text">Progress</span>
                <output class="text-xl tabular-nums text-hint">{{ progress }}%</output>
              </div>
              <div
                class="h-3 w-full overflow-hidden rounded-full bg-bg"
                role="progressbar"
                :aria-valuenow="progress"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Counter progress"
              >
                <div
                  class="h-full rounded-full bg-primary transition-all duration-300"
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
const formName = ref('Your name')
const formNotes = ref('')
const notificationsEnabled = ref(true)
const termsAccepted = ref(true)
const selectedVisibility = ref('friends')
const selectedMode = ref('auto')
const selectedCategory = ref('personal')
const sliderValue = ref(60)

const progress = computed(() => Math.min(100, Math.max(0, counter.value * 10)))

const cellDescription = computed(() => {
  if (formName.value) return `You typed: "${formName.value}"`
  return 'Type something in the input above'
})

const visibilityOptions = [
  { label: 'Everyone', value: 'everyone' },
  { label: 'Friends', value: 'friends' },
  { label: 'Only me', value: 'private' },
]

const modeOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

const categoryOptions = [
  { label: 'Personal', value: 'personal' },
  { label: 'Work', value: 'work' },
  { label: 'Travel', value: 'travel' },
]

const selectedCategoryLabel = computed(() => {
  return categoryOptions.find(option => option.value === selectedCategory.value)?.label || selectedCategory.value
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

function onFormSelection() {
  haptic.selectionChanged()
}

function selectMode(value: string) {
  if (selectedMode.value === value) return
  selectedMode.value = value
  onFormSelection()
}

function decrementCounter() {
  counter.value -= 1
  haptic.selectionChanged()
}

function incrementCounter() {
  counter.value += 1
  haptic.selectionChanged()
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

<style scoped>
.tg-native-range {
  appearance: none;
  background: transparent;
}

.tg-native-range::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 9999px;
  background: linear-gradient(
    to right,
    var(--tg-theme-button-color) 0%,
    var(--tg-theme-button-color) var(--range-value, 60%),
    var(--tg-theme-bg-color) var(--range-value, 60%),
    var(--tg-theme-bg-color) 100%
  );
}

.tg-native-range::-webkit-slider-thumb {
  appearance: none;
  width: 28px;
  height: 28px;
  margin-top: -12px;
  border: 0;
  border-radius: 9999px;
  background: var(--tg-theme-button-color);
  box-shadow: 0 2px 8px rgb(0 0 0 / 24%);
}

.tg-native-range::-moz-range-track {
  height: 4px;
  border-radius: 9999px;
  background: var(--tg-theme-bg-color);
}

.tg-native-range::-moz-range-progress {
  height: 4px;
  border-radius: 9999px;
  background: var(--tg-theme-button-color);
}

.tg-native-range::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 9999px;
  background: var(--tg-theme-button-color);
  box-shadow: 0 2px 8px rgb(0 0 0 / 24%);
}
</style>
