import { ref, computed, onMounted } from 'vue'
import type {
  TelegramWebApp,
  TelegramDownloadFileParams,
  TelegramEmojiStatusParams,
  TelegramHomeScreenStatus,
  TelegramLocationData,
  TelegramStoryShareParams,
  TelegramWebAppDeviceStorage,
  TelegramWebAppInitData,
  TelegramWebAppSecureStorage,
  TelegramWebAppInsets
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

function ensureWebApp() {
  initWebApp()
  return globalWebApp || getWebApp()
}

const emptyInsets: TelegramWebAppInsets = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
}

function storageCallback<T>(resolve: (value: T) => void, reject: (reason?: unknown) => void) {
  return (error: unknown, result?: T) => {
    if (error) {
      reject(error)
      return
    }

    resolve(result as T)
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
  const mounted = ref(false)

  onMounted(() => {
    initWebApp()
    if (globalWebApp?.BackButton) {
      visible.value = globalWebApp.BackButton.isVisible ?? false
    }
  })

  return {
    supported: computed(() => !!globalWebApp?.BackButton),
    mounted: computed(() => mounted.value),
    visible: computed(() => visible.value),
    mount: () => {
      mounted.value = true
      return true
    },
    unmount: () => {
      mounted.value = false
      visible.value = false
      return true
    },
    show: () => {
      if (globalWebApp?.BackButton?.show) {
        globalWebApp.BackButton.show()
      }
      visible.value = true
    },
    hide: () => {
      if (globalWebApp?.BackButton?.hide) {
        globalWebApp.BackButton.hide()
      }
      visible.value = false
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
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
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
    signature: computed(() => state.value?.signature),
    restore: () => {
      // Official SDK handles this automatically
      return true
    }
  }
}

// Main Button
export function useMainButton() {
  const mounted = ref(false)
  const state = ref({
    icon_custom_emoji_id: '',
    text: '',
    color: '',
    text_color: '',
    has_shine_effect: false,
    is_active: false,
    is_visible: false
  })

  onMounted(() => {
    initWebApp()
    if (globalWebApp?.MainButton) {
      state.value = {
        icon_custom_emoji_id: globalWebApp.MainButton.iconCustomEmojiId || '',
        text: globalWebApp.MainButton.text || '',
        color: globalWebApp.MainButton.color || '',
        text_color: globalWebApp.MainButton.textColor || '',
        has_shine_effect: globalWebApp.MainButton.hasShineEffect || false,
        is_active: globalWebApp.MainButton.isActive || false,
        is_visible: globalWebApp.MainButton.isVisible || false
      }
    }
  })

  return {
    mounted: computed(() => mounted.value),
    enabled: computed(() => state.value.is_active),
    loaderVisible: computed(() => globalWebApp?.MainButton?.isProgressVisible || false),
    visible: computed(() => state.value.is_visible),
    state: computed(() => state.value),
    text: computed(() => state.value.text),
    textColor: computed(() => state.value.text_color || undefined),
    backgroundColor: computed(() => state.value.color || undefined),
    mount: () => {
      mounted.value = true
      return true
    },
    unmount: () => {
      mounted.value = false
      state.value.is_visible = false
      return true
    },
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
      icon_custom_emoji_id?: string
      text?: string
      color?: string
      text_color?: string
      has_shine_effect?: boolean
      position?: 'left' | 'right' | 'top' | 'bottom'
      is_active?: boolean
      is_visible?: boolean
    }) => {
      state.value = {
        ...state.value,
        ...updates
      }
      if (globalWebApp?.MainButton?.setParams) {
        globalWebApp.MainButton.setParams(updates)
      }
    }
  }
}

export function useSecondaryButton() {
  onMounted(() => {
    initWebApp()
  })

  return {
    mounted: computed(() => !!globalWebApp?.SecondaryButton),
    enabled: computed(() => globalWebApp?.SecondaryButton?.isActive || false),
    loaderVisible: computed(() => globalWebApp?.SecondaryButton?.isProgressVisible || false),
    visible: computed(() => globalWebApp?.SecondaryButton?.isVisible || false),
    text: computed(() => globalWebApp?.SecondaryButton?.text || ''),
    textColor: computed(() => globalWebApp?.SecondaryButton?.textColor),
    backgroundColor: computed(() => globalWebApp?.SecondaryButton?.color),
    position: computed(() => globalWebApp?.SecondaryButton?.position),
    onClick: (fn: () => void) => {
      if (globalWebApp?.SecondaryButton) {
        globalWebApp.SecondaryButton.onClick(fn)
        return fn
      }
      return () => {}
    },
    offClick: (fn: () => void) => {
      globalWebApp?.SecondaryButton?.offClick(fn)
    },
    setParams: (updates: {
      icon_custom_emoji_id?: string
      text?: string
      color?: string
      text_color?: string
      has_shine_effect?: boolean
      position?: 'left' | 'right' | 'top' | 'bottom'
      is_active?: boolean
      is_visible?: boolean
    }) => {
      globalWebApp?.SecondaryButton?.setParams(updates)
    }
  }
}

export function useSettingsButton() {
  onMounted(() => {
    initWebApp()
  })

  return {
    supported: computed(() => !!globalWebApp?.SettingsButton),
    visible: computed(() => globalWebApp?.SettingsButton?.isVisible || false),
    show: () => globalWebApp?.SettingsButton?.show(),
    hide: () => globalWebApp?.SettingsButton?.hide(),
    onClick: (fn: () => void) => {
      if (globalWebApp?.SettingsButton) {
        globalWebApp.SettingsButton.onClick(fn)
        return fn
      }
      return () => {}
    },
    offClick: (fn: () => void) => {
      globalWebApp?.SettingsButton?.offClick(fn)
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
    foreground: computed(() => globalWebApp?.isActive ?? true),
    fullscreen: computed(() => globalWebApp?.isFullscreen || false),
    orientationLocked: computed(() => globalWebApp?.isOrientationLocked || false),
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
    },
    enableClosingConfirmation: () => globalWebApp?.enableClosingConfirmation(),
    disableClosingConfirmation: () => globalWebApp?.disableClosingConfirmation(),
    enableVerticalSwipes: () => globalWebApp?.enableVerticalSwipes(),
    disableVerticalSwipes: () => globalWebApp?.disableVerticalSwipes(),
    lockOrientation: () => globalWebApp?.lockOrientation?.(),
    unlockOrientation: () => globalWebApp?.unlockOrientation?.(),
    hideKeyboard: () => globalWebApp?.hideKeyboard?.()
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
      ...(globalWebApp?.safeAreaInset || emptyInsets)
    })),
    contentInsets: computed(() => ({
      ...(globalWebApp?.contentSafeAreaInset || emptyInsets)
    })),
    fullscreen: computed(() => globalWebApp?.isFullscreen || false),
    requestFullscreen: () => {
      globalWebApp?.requestFullscreen?.()
    },
    exitFullscreen: () => {
      globalWebApp?.exitFullscreen?.()
    },
    expand: () => {
      if (globalWebApp) {
        globalWebApp.expand()
      }
    }
  }
}

export function useHomeScreen() {
  onMounted(() => {
    initWebApp()
  })

  const status = ref<TelegramHomeScreenStatus | undefined>()

  return {
    supported: computed(() => !!globalWebApp?.addToHomeScreen || !!globalWebApp?.checkHomeScreenStatus),
    status: computed(() => status.value),
    add: () => globalWebApp?.addToHomeScreen?.(),
    check: () => {
      globalWebApp?.checkHomeScreenStatus?.((nextStatus) => {
        status.value = nextStatus
      })
    }
  }
}

export function useEmojiStatus() {
  onMounted(() => {
    initWebApp()
  })

  return {
    supported: computed(() => !!globalWebApp?.setEmojiStatus || !!globalWebApp?.requestEmojiStatusAccess),
    set: (customEmojiId: string, params?: TelegramEmojiStatusParams) => {
      return new Promise<boolean>((resolve) => {
        if (!globalWebApp?.setEmojiStatus) {
          resolve(false)
          return
        }

        globalWebApp.setEmojiStatus(customEmojiId, params, resolve)
      })
    },
    requestAccess: () => {
      return new Promise<boolean>((resolve) => {
        if (!globalWebApp?.requestEmojiStatusAccess) {
          resolve(false)
          return
        }

        globalWebApp.requestEmojiStatusAccess(resolve)
      })
    }
  }
}

export function useTelegramStorage(type: 'cloud' | 'device' | 'secure' = 'cloud') {
  onMounted(() => {
    initWebApp()
  })

  const storage = computed(() => {
    if (type === 'device') return globalWebApp?.DeviceStorage
    if (type === 'secure') return globalWebApp?.SecureStorage
    return globalWebApp?.CloudStorage
  })

  return {
    supported: computed(() => !!storage.value),
    setItem: (key: string, value: string) => {
      return new Promise<boolean>((resolve, reject) => {
        if (!storage.value) {
          resolve(false)
          return
        }

        storage.value.setItem(key, value, storageCallback(resolve, reject))
      })
    },
    getItem: (key: string) => {
      return new Promise<string | null>((resolve, reject) => {
        if (!storage.value) {
          resolve(null)
          return
        }

        storage.value.getItem(key, storageCallback(resolve, reject))
      })
    },
    removeItem: (key: string) => {
      return new Promise<boolean>((resolve, reject) => {
        if (!storage.value) {
          resolve(false)
          return
        }

        storage.value.removeItem(key, storageCallback(resolve, reject))
      })
    },
    clear: () => {
      return new Promise<boolean>((resolve, reject) => {
        const currentStorage = storage.value as TelegramWebAppDeviceStorage | TelegramWebAppSecureStorage | undefined
        if (!currentStorage?.clear) {
          resolve(false)
          return
        }

        currentStorage.clear(storageCallback(resolve, reject))
      })
    }
  }
}

export function useLocationManager() {
  onMounted(() => {
    initWebApp()
  })

  return {
    supported: computed(() => !!globalWebApp?.LocationManager),
    inited: computed(() => globalWebApp?.LocationManager?.isInited || false),
    available: computed(() => globalWebApp?.LocationManager?.isLocationAvailable || false),
    accessRequested: computed(() => globalWebApp?.LocationManager?.isAccessRequested || false),
    accessGranted: computed(() => globalWebApp?.LocationManager?.isAccessGranted || false),
    init: () => globalWebApp?.LocationManager?.init(),
    getLocation: () => {
      return new Promise<TelegramLocationData | null>((resolve) => {
        if (!globalWebApp?.LocationManager) {
          resolve(null)
          return
        }

        globalWebApp.LocationManager.getLocation(resolve)
      })
    },
    openSettings: () => globalWebApp?.LocationManager?.openSettings()
  }
}

export function useDeviceMotion() {
  onMounted(() => {
    initWebApp()
  })

  return {
    accelerometer: computed(() => globalWebApp?.Accelerometer),
    deviceOrientation: computed(() => globalWebApp?.DeviceOrientation),
    gyroscope: computed(() => globalWebApp?.Gyroscope),
    lockOrientation: () => globalWebApp?.lockOrientation?.(),
    unlockOrientation: () => globalWebApp?.unlockOrientation?.()
  }
}

// Links and sharing
export function openLink(url: string, options?: { try_instant_view?: boolean }) {
  const webApp = ensureWebApp()
  if (webApp) {
    webApp.openLink(url, options)
  } else {
    // Fallback to regular window.open
    window.open(url, '_blank')
  }
}

export function openTelegramLink(url: string) {
  const webApp = ensureWebApp()
  if (webApp) {
    webApp.openTelegramLink(url)
  } else {
    // Fallback to regular window.open
    window.open(url, '_blank')
  }
}

export function shareURL(url: string) {
  const webApp = ensureWebApp()
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

export function shareToStory(mediaUrl: string, params?: TelegramStoryShareParams) {
  const webApp = ensureWebApp()
  if (webApp?.shareToStory) {
    webApp.shareToStory(mediaUrl, params)
  } else if (navigator.share) {
    navigator.share({ url: mediaUrl }).catch(() => {})
  }
}

export function shareMessage(messageId: string) {
  const webApp = ensureWebApp()
  return new Promise<boolean>((resolve) => {
    if (!webApp?.shareMessage) {
      resolve(false)
      return
    }

    webApp.shareMessage(messageId, resolve)
  })
}

export function downloadFile(params: TelegramDownloadFileParams) {
  const webApp = ensureWebApp()
  return new Promise<boolean>((resolve) => {
    if (!webApp?.downloadFile) {
      resolve(false)
      return
    }

    webApp.downloadFile(params, resolve)
  })
}

export function requestChat(reqId: string) {
  const webApp = ensureWebApp()
  return new Promise<boolean>((resolve) => {
    if (!webApp?.requestChat) {
      resolve(false)
      return
    }

    webApp.requestChat(reqId, resolve)
  })
}
