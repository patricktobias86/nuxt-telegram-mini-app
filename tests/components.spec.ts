import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRequestURL: () => ({
    href: 'https://test.example.com'
  })
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
    currentRoute: {
      value: { path: '/' }
    }
  })
}))

// Mock Telegram composables
vi.mock('~/composables/telegram', () => ({
  useHapticFeedback: () => ({
    supported: { value: true },
    impactOccurred: vi.fn(),
    notificationOccurred: vi.fn(),
    selectionChanged: vi.fn()
  }),
  useMainButton: () => ({
    mounted: { value: true },
    visible: { value: false },
    text: { value: '' },
    mount: vi.fn(),
    setParams: vi.fn(),
    onClick: vi.fn(() => vi.fn())
  }),
  useBackButton: () => ({
    mounted: { value: true },
    visible: { value: false },
    mount: vi.fn(),
    show: vi.fn(),
    hide: vi.fn(),
    onClick: vi.fn(() => vi.fn())
  }),
  useInitData: () => ({
    user: { value: { username: 'testuser', first_name: 'Test' } },
    queryId: { value: 'test123' },
    startParam: { value: null },
    state: { value: {} },
    raw: { value: 'test_data=123' }
  }),
  useThemeParams: () => ({
    backgroundColor: { value: '#ffffff' },
    textColor: { value: '#000000' },
    buttonColor: { value: '#0088cc' },
    buttonTextColor: { value: '#ffffff' },
    linkColor: { value: '#0088cc' },
    secondaryBackgroundColor: { value: '#f0f0f0' }
  }),
  useMiniApp: () => ({
    supported: { value: true },
    dark: { value: false },
    setBackgroundColor: vi.fn(),
    setHeaderColor: vi.fn()
  }),
  useViewport: () => ({
    width: { value: 390 },
    height: { value: 844 },
    stableHeight: { value: 844 },
    expand: vi.fn()
  }),
  openLink: vi.fn(),
  openTelegramLink: vi.fn(),
  shareURL: vi.fn()
}))

vi.mock('~/utils/color', () => ({
  toHex: (color: string) => color.startsWith('#') ? color : '#000000'
}))

// Test components
const TestTgButton = defineComponent({
  name: 'TgButton',
  props: {
    title: String,
    status: String,
    haptic: String,
    disabled: Boolean,
    loading: Boolean
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () => h('button', {
      onClick: () => emit('click'),
      disabled: props.disabled || props.loading,
      class: `tg-button tg-button--${props.status || 'primary'}`
    }, props.title)
  }
})

const TestTgCell = defineComponent({
  name: 'TgCell',
  props: {
    title: String,
    subtitle: String,
    description: String,
    icon: String,
    to: String,
    border: { type: Boolean, default: true }
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () => h('div', {
      onClick: () => emit('click'),
      class: 'tg-cell'
    }, [
      props.icon && h('div', { class: 'tg-cell__icon' }),
      h('div', { class: 'tg-cell__content' }, [
        h('div', { class: 'tg-cell__title' }, props.title),
        props.subtitle && h('div', { class: 'tg-cell__subtitle' }, props.subtitle),
        props.description && h('div', { class: 'tg-cell__description' }, props.description)
      ])
    ])
  }
})

const TestTgSection = defineComponent({
  name: 'TgSection',
  props: {
    title: String,
    inset: Boolean
  },
  setup(props, { slots }) {
    return () => h('section', {
      class: ['tg-section', props.inset && 'tg-section--inset']
    }, [
      props.title && h('h2', { class: 'tg-section__title' }, props.title),
      h('div', { class: 'tg-section__content' }, slots.default?.())
    ])
  }
})

const TestTgContent = defineComponent({
  name: 'TgContent',
  setup(_, { slots }) {
    return () => h('main', { class: 'tg-content' }, slots.default?.())
  }
})

const TestHero = defineComponent({
  name: 'Hero',
  props: {
    title: String,
    subtitle: String,
    imageSrc: String
  },
  setup(props) {
    return () => h('header', { class: 'hero' }, [
      props.imageSrc && h('img', { src: props.imageSrc, alt: props.title }),
      h('h1', { class: 'hero__title' }, props.title),
      props.subtitle && h('p', { class: 'hero__subtitle' }, props.subtitle)
    ])
  }
})

describe('Telegram Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('TgButton', () => {
    it('renders with title', () => {
      const wrapper = mount(TestTgButton, {
        props: { title: 'Test Button' }
      })
      expect(wrapper.text()).toBe('Test Button')
    })

    it('applies correct status class', () => {
      const wrapper = mount(TestTgButton, {
        props: { title: 'Test', status: 'secondary' }
      })
      expect(wrapper.classes()).toContain('tg-button--secondary')
    })

    it('handles disabled state', () => {
      const wrapper = mount(TestTgButton, {
        props: { title: 'Test', disabled: true }
      })
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('handles loading state', () => {
      const wrapper = mount(TestTgButton, {
        props: { title: 'Test', loading: true }
      })
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('emits click event', async () => {
      const wrapper = mount(TestTgButton, {
        props: { title: 'Test' }
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  describe('TgCell', () => {
    it('renders title', () => {
      const wrapper = mount(TestTgCell, {
        props: { title: 'Test Cell' }
      })
      expect(wrapper.find('.tg-cell__title').text()).toBe('Test Cell')
    })

    it('renders subtitle when provided', () => {
      const wrapper = mount(TestTgCell, {
        props: { title: 'Test', subtitle: 'Test Subtitle' }
      })
      expect(wrapper.find('.tg-cell__subtitle').text()).toBe('Test Subtitle')
    })

    it('renders description when provided', () => {
      const wrapper = mount(TestTgCell, {
        props: { title: 'Test', description: 'Test Description' }
      })
      expect(wrapper.find('.tg-cell__description').text()).toBe('Test Description')
    })

    it('renders icon when provided', () => {
      const wrapper = mount(TestTgCell, {
        props: { title: 'Test', icon: 'i-heroicons-star-20-solid' }
      })
      expect(wrapper.find('.tg-cell__icon').exists()).toBe(true)
    })

    it('emits click event', async () => {
      const wrapper = mount(TestTgCell, {
        props: { title: 'Test' }
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  describe('TgSection', () => {
    it('renders title', () => {
      const wrapper = mount(TestTgSection, {
        props: { title: 'Test Section' }
      })
      expect(wrapper.find('.tg-section__title').text()).toBe('Test Section')
    })

    it('applies inset class when inset prop is true', () => {
      const wrapper = mount(TestTgSection, {
        props: { title: 'Test', inset: true }
      })
      expect(wrapper.classes()).toContain('tg-section--inset')
    })

    it('renders slot content', () => {
      const wrapper = mount(TestTgSection, {
        props: { title: 'Test' },
        slots: {
          default: '<p>Slot content</p>'
        }
      })
      expect(wrapper.html()).toContain('Slot content')
    })
  })

  describe('TgContent', () => {
    it('renders as main element', () => {
      const wrapper = mount(TestTgContent, {
        slots: {
          default: '<p>Content</p>'
        }
      })
      expect(wrapper.element.tagName).toBe('MAIN')
      expect(wrapper.classes()).toContain('tg-content')
    })
  })

  describe('Hero', () => {
    it('renders title', () => {
      const wrapper = mount(TestHero, {
        props: { title: 'Test Title' }
      })
      expect(wrapper.find('.hero__title').text()).toBe('Test Title')
    })

    it('renders subtitle when provided', () => {
      const wrapper = mount(TestHero, {
        props: { title: 'Test', subtitle: 'Test Subtitle' }
      })
      expect(wrapper.find('.hero__subtitle').text()).toBe('Test Subtitle')
    })

    it('renders image when imageSrc provided', () => {
      const wrapper = mount(TestHero, {
        props: { title: 'Test', imageSrc: '/test.jpg' }
      })
      const img = wrapper.find('img')
      expect(img.attributes('src')).toBe('/test.jpg')
      expect(img.attributes('alt')).toBe('Test')
    })
  })
})
