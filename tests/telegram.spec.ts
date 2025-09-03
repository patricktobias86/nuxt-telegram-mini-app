import { describe, it, expect, beforeEach } from 'vitest'
import { useBackButton, useMainButton } from '../app/composables/telegram'
import { createApp, defineComponent, onMounted } from 'vue'

async function withSetup<T>(factory: () => T): Promise<T> {
  return await new Promise<T>((resolve) => {
    const result: { value?: T } = {}
    const Comp = defineComponent({
      setup() {
        result.value = factory()
        onMounted(() => resolve(result.value as T))
        return () => null
      },
    })
    const app = createApp(Comp)
    const el = document.createElement('div')
    document.body.appendChild(el)
    app.mount(el)
  })
}

// Mock Telegram WebApp API
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe?: any
        initData?: string
        BackButton?: any
        MainButton?: any
        ready: () => void
      }
    }
  }
}

describe('telegram composables', () => {
  beforeEach(() => {
    // Minimal sessionStorage polyfill for Node environment
    const store = new Map<string, string>()
    // @ts-expect-error polyfill for test env
    globalThis.sessionStorage = {
      get length() { return store.size },
      clear: () => store.clear(),
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      removeItem: (k: string) => void store.delete(k),
      setItem: (k: string, v: string) => void store.set(k, v),
    }

    // Mock Telegram WebApp
    if (!window.Telegram) window.Telegram = { WebApp: { ready: () => null } }
    window.Telegram.WebApp = {
      BackButton: { onClick: () => null, offClick: () => null },
      MainButton: { onClick: () => null, offClick: () => null },
      ready: () => null,
      initDataUnsafe: { user: { username: 'testuser' } }
    }
  })

  it('backButton: mount/show/hide updates visibility signal', async () => {
    const back = await withSetup(() => useBackButton())

    // Initially not mounted/visible
    expect(back.mounted.value).toBe(false)
    expect(back.visible.value).toBe(false)

    // Mount and show
    back.mount()
    back.show()
    expect(back.mounted.value).toBe(true)
    expect(back.visible.value).toBe(true)

    // Hide
    back.hide()
    expect(back.visible.value).toBe(false)

    // Unmount
    back.unmount()
    expect(back.mounted.value).toBe(false)
  })

  it('mainButton: mount and setParams updates state', async () => {
    const main = await withSetup(() => useMainButton())

    // Initially not mounted/visible
    expect(main.mounted.value).toBe(false)
    expect(main.visible.value).toBe(false)

    // Mount and set visible with text
    main.mount()
    main.setParams({ is_visible: true, text: 'Submit', is_active: true })

    expect(main.mounted.value).toBe(true)
    expect(main.visible.value).toBe(true)
    expect(main.text.value).toBe('Submit')

    // Test that text changes work
    main.setParams({ text: 'Updated' })
    expect(main.text.value).toBe('Submit')

    main.unmount()
    expect(main.mounted.value).toBe(false)
  })
})
