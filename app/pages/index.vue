<template>
  <TgContent>
    <Hero
      title="Telegram Mini App Demo"
      subtitle="Showcasing components and SDK integrations"
      image-src="/img/nuxt-logo.svg"
    />

    <TgSection title="Navigation" inset>
      <TgCell
        title="Navigation Demo"
        subtitle="Use the bottom navigation bar to navigate"
        icon="heroicons:clipboard-solid"
      />
        <TgCell
        title="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo."
      />
        <template #append>
        Use the navigation bar at the bottom to switch between pages.
        </template>
    </TgSection>

    <TgSection title="Haptic Feedback" inset>
      <TgCell title="Supported" :description="hapticSupported" icon="i-heroicons-bolt-20-solid" :border="false" />
    </TgSection>

      <TgButton title="Impact" :disabled="!hapticSupportedBool" @click="haptic.impactOccurred('medium')" />
      <TgButton title="Notification" :disabled="!hapticSupportedBool" @click="haptic.notificationOccurred('success')" />
      <TgButton title="Selection" :disabled="!hapticSupportedBool" @click="haptic.selectionChanged()" />
      <!-- Example using TgButton's built-in haptic prop -->
      <TgButton title="Built-in Haptic (medium)" haptic="impact-medium" />

    <TgSection title="Init Data" inset>
      <TgCell title="User" :description="initUser" icon="i-heroicons-user-20-solid" />
      <TgCell title="Query ID" :description="initQueryId" />
      <TgCell title="Start Param" :description="initStartParam" :border="false" />
    </TgSection>

    <TgSection title="Mini App" inset>
      <TgCell title="Supported" :description="miniSupported" icon="i-heroicons-check-badge-20-solid" />
      <TgCell title="Dark" :description="miniDark" />
    </TgSection>

    <ClientOnly>
      <TgSection title="Theme Params" inset>
        <div class="p-4 grid grid-cols-1 gap-3 text-sm">
          <div class="flex items-center gap-2">
            <span class="inline-block w-4 h-4 rounded" :style="{ background: themeBgHex }" />
            <span>BG: {{ themeBgHex }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-block w-4 h-4 rounded" :style="{ background: themeTextHex }" />
            <span>Text: {{ themeTextHex }}</span>
          </div>
        </div>
      </TgSection>
    </ClientOnly>

    <ClientOnly>
      <TgSection title="Viewport" inset>
        <TgCell title="Width" :description="viewportWidth" />
        <TgCell title="Height" :description="viewportHeight" />
        <TgCell title="Stable Height" :description="viewportStableHeight" />
        <TgCell title="Expanded" :description="String(viewport.expanded.value ?? false)" :border="false" />
      </TgSection>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <TgButton title="Expand" haptic @click="viewport.expand" />
        <TgButton title="Fullscreen" haptic="impact-light" @click="onRequestFullscreen" />
        <TgButton title="Exit FS" haptic="impact-light" @click="onExitFullscreen" />
      </div>

    </ClientOnly>

    <TgSection title="Links" inset>
      <div class="p-4 grid grid-cols-1 sm:grid-cols-3">
        <TgButton title="Open Link" haptic @click="openLink('https://t.me/n')" />
        <TgButton title="Open Telegram" haptic @click="openTelegramLink('https://t.me/nuxt_tg_demo_bot')" />
        <TgButton title="Share URL" haptic="notification-success" :share-url="shareUrl" />
      </div>
    </TgSection>

    <div class="h-2" />
  </TgContent>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { toHex } from '~/utils/color'
import { useRequestURL } from '#app'
import {
  useHapticFeedback,
  useInitData,
  useMainButton,
  useMiniApp,
  useThemeParams,
  useViewport,
  openLink,
  openTelegramLink,
} from '~/composables/telegram'

const main = useMainButton()
const haptic = useHapticFeedback()
const init = useInitData()
const mini = useMiniApp()
const theme = useThemeParams()
const viewport = useViewport()

// SSR-safe current URL for sharing
const reqURL = useRequestURL()
const shareUrl = computed(() => import.meta.client ? window.location.href : reqURL.href)

function toggleMain() {
  const visible = !main.visible.value
  main.setParams({ is_visible: visible })
}

// Guarded access helpers to avoid early SDK store reads
const safe = function <T>(fn: () => T, fallback: T): T {
  try { return fn() } catch { return fallback }
}

// Haptic
const hapticSupported = computed(() => String(safe(() => haptic.supported.value, false)))
const hapticSupportedBool = computed(() => safe(() => !!haptic.supported.value, false))

// Mini App
const miniSupported = computed(() => String(safe(() => mini.supported.value, false)))
const miniSupportedBool = computed(() => safe(() => !!mini.supported.value, false))
const miniDark = computed(() => String(safe(() => mini.dark.value, false)))

// Init Data
const initUser = computed(() => safe(() => init.user.value?.username || init.user.value?.first_name || '—', '—'))
const initQueryId = computed(() => safe(() => init.queryId.value || '—', '—'))
const initStartParam = computed(() => safe(() => init.startParam.value || '—', '—'))

onMounted(async () => {
  // Hide Main Button since we're using TgNav for navigation
  main.mount()
  
  setTimeout(() => {
    try {
      main.setParams({ is_visible: false })
    } catch (e) {
      console.warn('Failed to hide main button:', e)
    }
  }, 500)

  // Try restore init data if not present yet (fallback for some environments)
  try {
    if (!init.state.value) init.restore()
  } catch {
    // Ignore restore errors - this is a fallback mechanism
  }
})

// Fallbacks for Theme Params and Viewport displays
const themeBgHex = computed(() => {
  const hex = toHex(theme.backgroundColor.value)
  if (hex !== '—') return hex
  if (import.meta.client) {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--tg-theme-bg-color')?.trim()
    return v || '—'
  }
  return '—'
})

const themeTextHex = computed(() => {
  const hex = toHex(theme.textColor.value)
  if (hex !== '—') return hex
  if (import.meta.client) {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--tg-theme-text-color')?.trim()
    return v || '—'
  }
  return '—'
})

const viewportWidth = computed(() => String(safe(() => viewport.width.value, undefined) ?? (import.meta.client ? window.innerWidth : '—')))
const viewportHeight = computed(() => String(safe(() => viewport.height.value, undefined) ?? (import.meta.client ? window.innerHeight : '—')))
const viewportStableHeight = computed(() => String(safe(() => viewport.stableHeight.value, undefined) ?? (import.meta.client ? window.innerHeight : '—')))

function onRequestFullscreen() {
  try { 
    viewport.requestFullscreen() 
  } catch {
    // Ignore viewport fullscreen errors - fallback to browser API
  }
  if (import.meta.client && document.fullscreenEnabled && !document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {})
  }
}

function onExitFullscreen() {
  try { 
    viewport.exitFullscreen() 
  } catch {
    // Ignore viewport fullscreen errors - fallback to browser API
  }
  if (import.meta.client && document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {})
  }
}
</script>

<style scoped>
</style>
