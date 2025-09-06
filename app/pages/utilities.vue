<template>
  <TgContent>
    <Hero
      title="Utilities Demo"
    />

    <TgSection title="Link Utilities" inset>
      <div class="p-4 space-y-3">
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">External Links</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <TgButton 
              title="Open GitHub" 
              status="outline" 
              haptic 
              @click="() => openLink('https://github.com/patricktobias86/nuxt-telegram-mini-app')" 
            />
            <TgButton 
              title="Open Nuxt Docs" 
              status="outline" 
              haptic 
              @click="() => openLink('https://nuxt.com')" 
            />
          </div>
        </div>
        
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Telegram Links</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <TgButton 
              title="Telegram Channel" 
              status="outline" 
              haptic 
              @click="() => openTelegramLink('https://t.me/telegram')" 
            />
            <TgButton 
              title="Bot Platform" 
              status="outline" 
              haptic 
              @click="() => openTelegramLink('https://t.me/botfather')" 
            />
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Sharing</h3>
          <div class="grid grid-cols-1 gap-2">
            <TgButton 
              title="Share This App" 
              status="primary" 
              haptic="notification-success"
              @click="() => shareURL(shareUrl)"
            />
          </div>
        </div>
      </div>
    </TgSection>

    <TgSection title="Data Validation" inset>
      <div class="p-4 space-y-4">
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Init Data Status</h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between p-3 bg-secondary-bg rounded-lg">
              <span class="text-sm">Data Available</span>
              <div class="flex items-center gap-2">
                <div :class="[
                  'w-2 h-2 rounded-full',
                  initDataAvailable ? 'bg-green-500' : 'bg-red-500'
                ]" />
                <span class="text-xs text-hint">{{ initDataAvailable ? 'Yes' : 'No' }}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-secondary-bg rounded-lg">
              <span class="text-sm">User Identified</span>
              <div class="flex items-center gap-2">
                <div :class="[
                  'w-2 h-2 rounded-full',
                  userIdentified ? 'bg-green-500' : 'bg-red-500'
                ]" />
                <span class="text-xs text-hint">{{ userIdentified ? 'Yes' : 'No' }}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-secondary-bg rounded-lg">
              <span class="text-sm">Raw Data Length</span>
              <span class="text-xs text-hint">{{ rawDataLength }} chars</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">User Information</h3>
          <div class="space-y-2 text-sm">
            <div v-if="userData.username" class="flex justify-between p-2 bg-secondary-bg rounded">
              <span class="text-hint">Username:</span>
              <span>@{{ userData.username }}</span>
            </div>
            <div v-if="userData.firstName" class="flex justify-between p-2 bg-secondary-bg rounded">
              <span class="text-hint">First Name:</span>
              <span>{{ userData.firstName }}</span>
            </div>
            <div v-if="userData.lastName" class="flex justify-between p-2 bg-secondary-bg rounded">
              <span class="text-hint">Last Name:</span>
              <span>{{ userData.lastName }}</span>
            </div>
            <div v-if="userData.languageCode" class="flex justify-between p-2 bg-secondary-bg rounded">
              <span class="text-hint">Language:</span>
              <span>{{ userData.languageCode }}</span>
            </div>
            <div v-if="!userData.username && !userData.firstName" class="p-2 bg-secondary-bg rounded text-center text-hint">
              No user data available (not in Telegram context)
            </div>
          </div>
        </div>
      </div>
    </TgSection>

    <TgSection title="Color Utilities" inset>
      <div class="p-4 space-y-4">
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Color Converter</h3>
          <div class="space-y-3">
            <input
              v-model="testColor"
              type="text"
              placeholder="Enter a color (hex, rgb, hsl, or name)"
              class="w-full px-3 py-2 bg-secondary-bg border border-section-separator rounded-lg text-text placeholder-hint"
            />
            <div class="flex items-center justify-between p-3 bg-secondary-bg rounded-lg">
              <div class="flex items-center gap-2">
                <div 
                  class="w-6 h-6 rounded border border-section-separator"
                  :style="{ backgroundColor: convertedColor }"
                />
                <span class="text-sm">Converted:</span>
              </div>
              <span class="text-xs font-mono">{{ convertedColor }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Theme Color Analysis</h3>
          <div class="grid grid-cols-1 gap-2 text-xs">
            <div v-for="color in colorAnalysis" :key="color.name" 
                 class="flex items-center justify-between p-2 bg-secondary-bg rounded">
              <div class="flex items-center gap-2">
                <div 
                  class="w-4 h-4 rounded border border-section-separator"
                  :style="{ backgroundColor: color.hex }"
                />
                <span>{{ color.name }}</span>
              </div>
              <span class="font-mono">{{ color.hex }}</span>
            </div>
          </div>
        </div>
      </div>
    </TgSection>

    <TgSection title="Performance Monitoring" inset>
      <div class="p-4 space-y-4">
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">App Performance</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3 bg-secondary-bg rounded-lg">
              <div class="text-xs text-hint mb-1">Viewport Size</div>
              <div class="text-sm font-medium">{{ viewportInfo }}</div>
            </div>
            <div class="p-3 bg-secondary-bg rounded-lg">
              <div class="text-xs text-hint mb-1">Device Pixel Ratio</div>
              <div class="text-sm font-medium">{{ devicePixelRatio }}</div>
            </div>
            <div class="p-3 bg-secondary-bg rounded-lg">
              <div class="text-xs text-hint mb-1">Connection</div>
              <div class="text-sm font-medium">{{ connectionType }}</div>
            </div>
            <div class="p-3 bg-secondary-bg rounded-lg">
              <div class="text-xs text-hint mb-1">Memory Usage</div>
              <div class="text-sm font-medium">{{ memoryInfo }}</div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Render Performance</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm">Render Count</span>
              <span class="text-xs text-hint">{{ renderCount }}</span>
            </div>
            <TgButton 
              title="Force Re-render" 
              status="outline" 
              haptic="impact-light" 
              @click="forceRerender" 
            />
          </div>
        </div>
      </div>
    </TgSection>

    <TgSection title="Local Storage Demo" inset>
      <div class="p-4 space-y-4">
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Storage Operations</h3>
          <div class="space-y-3">
            <div class="flex gap-2">
              <input
                v-model="storageKey"
                type="text"
                placeholder="Storage key"
                class="flex-1 px-3 py-2 bg-secondary-bg border border-section-separator rounded-lg text-text placeholder-hint"
              />
              <input
                v-model="storageValue"
                type="text"
                placeholder="Storage value"
                class="flex-1 px-3 py-2 bg-secondary-bg border border-section-separator rounded-lg text-text placeholder-hint"
              />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <TgButton 
                title="Save" 
                status="primary" 
                haptic 
                :disabled="!storageKey || !storageValue"
                @click="saveToStorage" 
              />
              <TgButton 
                title="Load" 
                status="outline" 
                haptic 
                :disabled="!storageKey"
                @click="loadFromStorage" 
              />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-sm font-medium text-subtitle">Stored Data</h3>
          <div class="p-3 bg-secondary-bg rounded-lg">
            <pre class="text-xs text-hint whitespace-pre-wrap">{{ storedDataDisplay }}</pre>
          </div>
          <TgButton 
            title="Clear All Storage" 
            status="destructive" 
            haptic="notification-warning" 
            @click="clearStorage" 
          />
        </div>
      </div>
    </TgSection>

    <div class="h-2"></div>
  </TgContent>

</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRequestURL, navigateTo } from '#app'
import {
  useInitData,
  useThemeParams,
  useViewport,
  useMainButton,
  openLink,
  openTelegramLink,
  shareURL
} from '~/composables/telegram'
import { toHex } from '~/utils/color'

const init = useInitData()
const theme = useThemeParams()
const viewport = useViewport()
const main = useMainButton()

// Sharing
const reqURL = useRequestURL()
const shareUrl = computed(() => import.meta.client ? window.location.href : reqURL.href)

// Data validation
const initDataAvailable = computed(() => !!init.state.value)
const userIdentified = computed(() => !!init.user.value?.id)
const rawDataLength = computed(() => init.raw.value?.length || 0)

const userData = computed(() => ({
  username: init.user.value?.username || '',
  firstName: init.user.value?.first_name || '',
  lastName: init.user.value?.last_name || '',
  languageCode: init.user.value?.language_code || ''
}))

// Color utilities
const testColor = ref('#0088cc')
const convertedColor = computed(() => toHex(testColor.value) || testColor.value)

const colorAnalysis = computed(() => [
  { name: 'Background', hex: toHex(theme.backgroundColor.value) || '—' },
  { name: 'Text', hex: toHex(theme.textColor.value) || '—' },
  { name: 'Button', hex: toHex(theme.buttonColor.value) || '—' },
  { name: 'Link', hex: toHex(theme.linkColor.value) || '—' },
  { name: 'Hint', hex: toHex(theme.hintColor.value) || '—' },
  { name: 'Secondary BG', hex: toHex(theme.secondaryBackgroundColor.value) || '—' }
])

// Performance monitoring
const renderCount = ref(0)
const viewportInfo = computed(() => `${viewport.width.value}×${viewport.height.value}`)
const devicePixelRatio = computed(() => import.meta.client ? window.devicePixelRatio : 1)
const connectionType = computed(() => {
  if (!import.meta.client) return 'Unknown'
  // @ts-ignore
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  return connection?.effectiveType || 'Unknown'
})
const memoryInfo = computed(() => {
  if (!import.meta.client) return 'Unknown'
  // @ts-ignore
  const memory = performance.memory
  if (memory) {
    return `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`
  }
  return 'Unknown'
})

function forceRerender() {
  renderCount.value++
}

// Storage demo
const storageKey = ref('demo-key')
const storageValue = ref('Hello World')
const storedData = ref<Record<string, string>>({})

const storedDataDisplay = computed(() => {
  const data = Object.keys(storedData.value).length ? storedData.value : { 'No data': 'stored yet' }
  return JSON.stringify(data, null, 2)
})

function saveToStorage() {
  if (!import.meta.client || !storageKey.value || !storageValue.value) return
  try {
    localStorage.setItem(storageKey.value, storageValue.value)
    loadAllStoredData()
  } catch (error) {
    console.error('Storage error:', error)
  }
}

function loadFromStorage() {
  if (!import.meta.client || !storageKey.value) return
  try {
    const value = localStorage.getItem(storageKey.value)
    if (value !== null) {
      storageValue.value = value
    }
  } catch (error) {
    console.error('Storage error:', error)
  }
}

function loadAllStoredData() {
  if (!import.meta.client) return
  const data: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      data[key] = localStorage.getItem(key) || ''
    }
  }
  storedData.value = data
}

function clearStorage() {
  if (!import.meta.client) return
  localStorage.clear()
  storedData.value = {}
  storageKey.value = 'demo-key'
  storageValue.value = 'Hello World'
}

// Hide Main Button since we're using TgNav for navigation
onMounted(() => {
  renderCount.value++
  loadAllStoredData()
  
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
