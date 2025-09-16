import { ref, computed, onMounted } from 'vue'
import type {
  TelegramWebApp,
  TelegramWebAppInitData
} from '~/types/telegram-webapp'

// Helper to get WebApp instance
function getWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp || null
}

// Shared WebApp instance
let globalWebApp: TelegramWebApp | null = null
let isInitialized = false

// Initialize WebApp once
function initWebApp() {
  if (isInitialized) return
  if (typeof window === 'undefined') return
  
  globalWebApp = getWebApp()
  if (globalWebApp) {
    globalWebApp.ready()
    isInitialized = true
  }
}

// Main composable to access Telegram WebApp
export function useTelegramWebApp() {
  const webApp = ref<TelegramWebApp | null>(null)
  const isReady = ref(false)

  onMounted(() => {
    initWebApp()
    webApp.value = globalWebApp
    isReady.value = isInitialized
  })

  return {
    webApp: computed(() => webApp.value),
    isReady: computed(() => isReady.value),
    isAvailable: computed(() => !!webApp.value)
  }
}

// Back Button
export function useBackButton() {
  const visible = ref(false)

  onMounted(() => {
    initWebApp()
    if (globalWebApp?.BackButton) {
      visible.value = globalWebApp.BackButton.isVisible
    }
  })

  return {
    supported: computed(() => !!globalWebApp?.BackButton),
    mounted: computed(() => !!globalWebApp?.BackButton),
    visible: computed(() => visible.value),
    mount: () => true, // Always available with official SDK
    unmount: () => true,
    show: () => {
      if (globalWebApp?.BackButton) {
        globalWebApp.BackButton.show()
        visible.value = true
      }
    },
    hide: () => {
      if (globalWebApp?.BackButton) {
        globalWebApp.BackButton.hide()
        visible.value = false
      }
    },
    onClick: (fn: () => void) => {
      if (globalWebApp?.BackButton) {
        globalWebApp.BackButton.onClick(fn)
        return fn
      }
      return () => {}
    },
    offClick: (fn: () => void) => {
      if (globalWebApp?.BackButton) {
        globalWebApp.BackButton.offClick(fn)
      }
    }
  }
}

// Haptic Feedback
export function useHapticFeedback() {
  onMounted(() => {
    initWebApp()
  })

  return {
    supported: computed(() => !!globalWebApp?.HapticFeedback),
    impactOccurred: (style: 'light' | 'medium' | 'heavy' = 'medium') => {
      if (globalWebApp?.HapticFeedback) {
        globalWebApp.HapticFeedback.impactOccurred(style)
      }
    },
    notificationOccurred: (type: 'error' | 'success' | 'warning') => {
      if (globalWebApp?.HapticFeedback) {
        globalWebApp.HapticFeedback.notificationOccurred(type)
      }
    },
    selectionChanged: () => {
      if (globalWebApp?.HapticFeedback) {
        globalWebApp.HapticFeedback.selectionChanged()
      }
    }
  }
}

// Init Data
export function useInitData() {
  onMounted(() => {
    initWebApp()
  })

  const state = computed<TelegramWebAppInitData | undefined>(() => 
    globalWebApp?.initDataUnsafe || undefined
  )
  
  const raw = computed<string | undefined>(() => 
    globalWebApp?.initData || undefined
  )

  return {
    state,
    raw,
    user: computed(() => state.value?.user),
    receiver: computed(() => state.value?.receiver),
    chat: computed(() => state.value?.chat),
    authDate: computed(() => state.value?.auth_date),
    queryId: computed(() => state.value?.query_id),
    startParam: computed(() => state.value?.start_param),
    restore: () => {
      // Official SDK handles this automatically
      return true
    }
  }
}

// Main Button
export function useMainButton() {
  onMounted(() => {
    initWebApp()
  })

  return {
    mounted: computed(() => !!globalWebApp?.MainButton),
    enabled: computed(() => globalWebApp?.MainButton?.isActive || false),
    loaderVisible: computed(() => globalWebApp?.MainButton?.isProgressVisible || false),
    visible: computed(() => globalWebApp?.MainButton?.isVisible || false),
    state: computed(() => ({
      text: globalWebApp?.MainButton?.text || '',
      color: globalWebApp?.MainButton?.color || '',
      text_color: globalWebApp?.MainButton?.textColor || '',
      is_active: globalWebApp?.MainButton?.isActive || false,
      is_visible: globalWebApp?.MainButton?.isVisible || false
    })),
    text: computed(() => globalWebApp?.MainButton?.text || ''),
    textColor: computed(() => globalWebApp?.MainButton?.textColor),
    backgroundColor: computed(() => globalWebApp?.MainButton?.color),
    mount: () => true, // Always available
    unmount: () => true,
    onClick: (fn: () => void) => {
      if (globalWebApp?.MainButton) {
        globalWebApp.MainButton.onClick(fn)
        return fn
      }
      return () => {}
    },
    offClick: (fn: () => void) => {
      if (globalWebApp?.MainButton) {
        globalWebApp.MainButton.offClick(fn)
      }
    },
    setParams: (updates: {
      text?: string
      color?: string
      text_color?: string
      is_active?: boolean
      is_visible?: boolean
    }) => {
      if (globalWebApp?.MainButton) {
        globalWebApp.MainButton.setParams(updates)
      }
    }
  }
}

// Mini App / Theme management
export function useMiniApp() {
  onMounted(() => {
    initWebApp()
  })

  return {
    supported: computed(() => !!globalWebApp),
    mounted: computed(() => !!globalWebApp),
    active: computed(() => true), // Always active when available
    dark: computed(() => globalWebApp?.colorScheme === 'dark'),
    state: computed(() => globalWebApp || null),
    backgroundColor: computed(() => globalWebApp?.backgroundColor),
    headerColor: computed(() => globalWebApp?.headerColor),
    bottomBarColor: computed(() => globalWebApp?.bottomBarColor),
    setBackgroundColor: (color: string) => {
      if (globalWebApp) {
        globalWebApp.setBackgroundColor(color)
      }
    },
    setHeaderColor: (color: string) => {
      if (globalWebApp) {
        globalWebApp.setHeaderColor(color)
      }
    },
    setBottomBarColor: (color: string) => {
      if (globalWebApp) {
        globalWebApp.setBottomBarColor(color)
      }
    }
  }
}

// Theme Params
export function useThemeParams() {
  onMounted(() => {
    initWebApp()
  })
  
  const themeParams = computed(() => globalWebApp?.themeParams || {})

  return {
    mounted: computed(() => !!globalWebApp),
    dark: computed(() => globalWebApp?.colorScheme === 'dark'),
    state: computed(() => themeParams.value),
    backgroundColor: computed(() => themeParams.value.bg_color),
    textColor: computed(() => themeParams.value.text_color),
    accentTextColor: computed(() => themeParams.value.accent_text_color),
    hintColor: computed(() => themeParams.value.hint_color),
    buttonColor: computed(() => themeParams.value.button_color),
    buttonTextColor: computed(() => themeParams.value.button_text_color),
    destructiveTextColor: computed(() => themeParams.value.destructive_text_color),
    linkColor: computed(() => themeParams.value.link_color),
    secondaryBackgroundColor: computed(() => themeParams.value.secondary_bg_color),
    sectionBackgroundColor: computed(() => themeParams.value.section_bg_color),
    headerBackgroundColor: computed(() => themeParams.value.header_bg_color),
    subtitleTextColor: computed(() => themeParams.value.subtitle_text_color),
    sectionHeaderTextColor: computed(() => themeParams.value.section_header_text_color),
    sectionSeparatorColor: computed(() => themeParams.value.section_separator_color)
  }
}

// Viewport
export function useViewport() {
  onMounted(() => {
    initWebApp()
  })

  return {
    mounted: computed(() => !!globalWebApp),
    width: computed(() => {
      // Telegram WebApp doesn't expose viewport width directly, use window.innerWidth
      return typeof window !== 'undefined' ? window.innerWidth : 0
    }),
    height: computed(() => globalWebApp?.viewportHeight || 0),
    stableHeight: computed(() => globalWebApp?.viewportStableHeight || 0),
    expanded: computed(() => globalWebApp?.isExpanded || false),
    stable: computed(() => {
      // Consider stable if viewport height equals stable height
      const vh = globalWebApp?.viewportHeight || 0
      const svh = globalWebApp?.viewportStableHeight || 0
      return vh === svh
    }),
    insets: computed(() => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    })),
    requestFullscreen: () => {
      // Not available in Telegram WebApp
    },
    exitFullscreen: () => {
      // Not available in Telegram WebApp
    },
    expand: () => {
      if (globalWebApp) {
        globalWebApp.expand()
      }
    }
  }
}

// Links and sharing
export function openLink(url: string, options?: { try_instant_view?: boolean }) {
  const webApp = getWebApp()
  if (webApp) {
    webApp.openLink(url, options)
  } else {
    // Fallback to regular window.open
    window.open(url, '_blank')
  }
}

export function openTelegramLink(url: string) {
  const webApp = getWebApp()
  if (webApp) {
    webApp.openTelegramLink(url)
  } else {
    // Fallback to regular window.open
    window.open(url, '_blank')
  }
}

export function shareURL(url: string) {
  const webApp = getWebApp()
  if (webApp) {
    // Use Web Share API if available, otherwise copy to clipboard
    if (navigator.share) {
      navigator.share({ url }).catch(() => {
        // Fallback to clipboard if share fails
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url)
        }
      })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
    }
  } else {
    // Fallback to navigator.share or clipboard
    if (navigator.share) {
      navigator.share({ url })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
    }
  }
}
