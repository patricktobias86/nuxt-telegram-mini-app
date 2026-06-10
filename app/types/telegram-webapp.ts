// TypeScript definitions for Telegram Web App
// Based on https://core.telegram.org/bots/webapps

export interface TelegramWebAppUser {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  added_to_attachment_menu?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

export interface TelegramWebAppChat {
  id: number
  type: 'group' | 'supergroup' | 'channel'
  title: string
  username?: string
  photo_url?: string
}

export interface TelegramWebAppInitData {
  query_id?: string
  user?: TelegramWebAppUser
  receiver?: TelegramWebAppUser
  chat?: TelegramWebAppChat
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel'
  chat_instance?: string
  start_param?: string
  can_send_after?: number
  auth_date: number
  hash: string
  signature?: string
}

export interface TelegramWebAppInsets {
  top: number
  bottom: number
  left: number
  right: number
}

export interface TelegramWebAppThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
  header_bg_color?: string
  accent_text_color?: string
  section_bg_color?: string
  section_header_text_color?: string
  subtitle_text_color?: string
  destructive_text_color?: string
  section_separator_color?: string
  bottom_bar_bg_color?: string
}

export interface TelegramWebAppBackButton {
  isVisible: boolean
  onClick(callback: () => void): void
  offClick(callback: () => void): void
  show(): void
  hide(): void
}

export interface TelegramWebAppMainButton {
  type?: 'main' | 'secondary'
  iconCustomEmojiId?: string
  text: string
  color: string
  textColor: string
  isVisible: boolean
  isActive: boolean
  hasShineEffect?: boolean
  position?: 'left' | 'right' | 'top' | 'bottom'
  readonly isProgressVisible: boolean
  setText(text: string): void
  onClick(callback: () => void): void
  offClick(callback: () => void): void
  show(): void
  hide(): void
  enable(): void
  disable(): void
  showProgress(leaveActive?: boolean): void
  hideProgress(): void
  setParams(params: {
    icon_custom_emoji_id?: string
    text?: string
    color?: string
    text_color?: string
    has_shine_effect?: boolean
    position?: 'left' | 'right' | 'top' | 'bottom'
    is_active?: boolean
    is_visible?: boolean
  }): void
}

export interface TelegramWebAppHapticFeedback {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void
  notificationOccurred(type: 'error' | 'success' | 'warning'): void
  selectionChanged(): void
}

export interface TelegramWebAppSettingsButton {
  isVisible: boolean
  onClick(callback: () => void): void
  offClick(callback: () => void): void
  show(): void
  hide(): void
}

export interface TelegramStorageError {
  error?: string
  message?: string
}

export type TelegramStorageCallback<T = boolean> = (error: TelegramStorageError | string | null, result?: T) => void

export interface TelegramWebAppCloudStorage {
  setItem(key: string, value: string, callback?: TelegramStorageCallback<boolean>): void
  getItem(key: string, callback: TelegramStorageCallback<string>): void
  getItems(keys: string[], callback: TelegramStorageCallback<Record<string, string>>): void
  removeItem(key: string, callback?: TelegramStorageCallback<boolean>): void
  removeItems(keys: string[], callback?: TelegramStorageCallback<boolean>): void
  getKeys(callback: TelegramStorageCallback<string[]>): void
}

export interface TelegramWebAppDeviceStorage {
  setItem(key: string, value: string, callback?: TelegramStorageCallback<boolean>): void
  getItem(key: string, callback: TelegramStorageCallback<string | null>): void
  removeItem(key: string, callback?: TelegramStorageCallback<boolean>): void
  clear(callback?: TelegramStorageCallback<boolean>): void
}

export interface TelegramWebAppSecureStorage extends TelegramWebAppDeviceStorage {
  getItem(key: string, callback: (error: TelegramStorageError | string | null, value?: string | null, canRestore?: boolean) => void): void
  restoreItem(key: string, callback?: TelegramStorageCallback<string | null>): void
}

export interface TelegramWebAppBiometricManager {
  isInited: boolean
  isBiometricAvailable: boolean
  biometricType: 'finger' | 'face' | 'unknown'
  isAccessRequested: boolean
  isAccessGranted: boolean
  isBiometricTokenSaved: boolean
  deviceId: string
  init(callback?: () => void): void
  requestAccess(params: { reason?: string }, callback?: (granted: boolean) => void): void
  authenticate(params: { reason?: string }, callback?: (authenticated: boolean, token?: string) => void): void
  updateBiometricToken(token: string, callback?: (updated: boolean) => void): void
  openSettings(): void
}

export interface TelegramWebAppMotionSensor {
  isStarted: boolean
  x: number
  y: number
  z: number
  start(params?: { refresh_rate?: number }, callback?: (started: boolean) => void): void
  stop(callback?: (stopped: boolean) => void): void
}

export interface TelegramWebAppDeviceOrientation {
  isStarted: boolean
  absolute: boolean
  alpha: number
  beta: number
  gamma: number
  start(params?: { refresh_rate?: number, need_absolute?: boolean }, callback?: (started: boolean) => void): void
  stop(callback?: (stopped: boolean) => void): void
}

export interface TelegramLocationData {
  latitude: number
  longitude: number
  altitude: number | null
  course: number | null
  speed: number | null
  horizontal_accuracy: number | null
  vertical_accuracy: number | null
  course_accuracy: number | null
  speed_accuracy: number | null
}

export interface TelegramWebAppLocationManager {
  isInited: boolean
  isLocationAvailable: boolean
  isAccessRequested: boolean
  isAccessGranted: boolean
  init(callback?: () => void): void
  getLocation(callback: (location: TelegramLocationData | null) => void): void
  openSettings(): void
}

export type TelegramHomeScreenStatus = 'unsupported' | 'unknown' | 'added' | 'missed'

export interface TelegramStoryShareParams {
  text?: string
  widget_link?: {
    url: string
    name?: string
  }
}

export interface TelegramEmojiStatusParams {
  duration?: number
}

export interface TelegramDownloadFileParams {
  url: string
  file_name: string
}

export interface TelegramWebApp {
  initData: string
  initDataUnsafe: TelegramWebAppInitData
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: TelegramWebAppThemeParams
  isActive?: boolean
  isExpanded: boolean
  isFullscreen?: boolean
  isOrientationLocked?: boolean
  viewportHeight: number
  viewportStableHeight: number
  safeAreaInset?: TelegramWebAppInsets
  contentSafeAreaInset?: TelegramWebAppInsets
  headerColor: string
  backgroundColor: string
  bottomBarColor: string
  isClosingConfirmationEnabled: boolean
  isVerticalSwipesEnabled: boolean
  BackButton: TelegramWebAppBackButton
  MainButton: TelegramWebAppMainButton
  SecondaryButton?: TelegramWebAppMainButton
  SettingsButton?: TelegramWebAppSettingsButton
  HapticFeedback: TelegramWebAppHapticFeedback
  CloudStorage?: TelegramWebAppCloudStorage
  BiometricManager?: TelegramWebAppBiometricManager
  Accelerometer?: TelegramWebAppMotionSensor
  DeviceOrientation?: TelegramWebAppDeviceOrientation
  Gyroscope?: TelegramWebAppMotionSensor
  LocationManager?: TelegramWebAppLocationManager
  DeviceStorage?: TelegramWebAppDeviceStorage
  SecureStorage?: TelegramWebAppSecureStorage

  isVersionAtLeast(version: string): boolean
  setHeaderColor(color: string): void
  setBackgroundColor(color: string): void
  setBottomBarColor(color: string): void
  enableClosingConfirmation(): void
  disableClosingConfirmation(): void
  enableVerticalSwipes(): void
  disableVerticalSwipes(): void
  requestFullscreen?(): void
  exitFullscreen?(): void
  lockOrientation?(): void
  unlockOrientation?(): void
  addToHomeScreen?(): void
  checkHomeScreenStatus?(callback?: (status: TelegramHomeScreenStatus) => void): void
  onEvent(eventType: string, eventHandler: (...args: any[]) => void): void
  offEvent(eventType: string, eventHandler: (...args: any[]) => void): void
  sendData(data: string): void
  switchInlineQuery(query: string, choose_chat_types?: string[]): void
  openLink(url: string, options?: { try_instant_view?: boolean }): void
  openTelegramLink(url: string): void
  openInvoice(url: string, callback?: (status: string) => void): void
  shareToStory?(mediaUrl: string, params?: TelegramStoryShareParams): void
  shareMessage?(msgId: string, callback?: (sent: boolean) => void): void
  setEmojiStatus?(customEmojiId: string, params?: TelegramEmojiStatusParams, callback?: (set: boolean) => void): void
  requestEmojiStatusAccess?(callback?: (granted: boolean) => void): void
  downloadFile?(params: TelegramDownloadFileParams, callback?: (accepted: boolean) => void): void
  hideKeyboard?(): void
  showPopup(params: {
    title?: string
    message: string
    buttons?: Array<{
      id?: string
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
      text: string
    }>
  }, callback?: (buttonId: string) => void): void
  showAlert(message: string, callback?: () => void): void
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void
  showScanQrPopup(params: {
    text?: string
  }, callback?: (text: string) => boolean): void
  closeScanQrPopup(): void
  readTextFromClipboard(callback?: (text: string) => void): void
  requestWriteAccess(callback?: (granted: boolean) => void): void
  requestContact(callback?: (granted: boolean) => void): void
  requestChat?(reqId: string, callback?: (sent: boolean) => void): void
  ready(): void
  expand(): void
  close(): void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export {}
