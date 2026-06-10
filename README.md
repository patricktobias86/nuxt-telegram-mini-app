# 🚀 Nuxt Telegram Mini App Template

A comprehensive template for building Telegram Mini Apps using Nuxt 4, Vue 3, TypeScript, and Tailwind CSS, ready for deployment on Netlify.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC)
![Telegram API](https://img.shields.io/badge/Telegram%20API-6.2-26A5E4)

## ✨ Features

### 🎯 Core Features
- **🔧 Complete Nuxt 4 Setup** - Latest Nuxt with TypeScript support
- **📱 Telegram WebApp SDK** - Full integration with Telegram Mini App APIs
- **🎨 Tailwind CSS** - Utility-first CSS framework with Telegram theme integration
- **⚡ SPA Mode** - Optimized for Telegram Mini App deployment
- **🌐 Netlify Ready** - Pre-configured for seamless deployment

### 🧩 Components Library
- **TgButton** - Telegram-styled buttons with haptic feedback
- **TgCell** - List cells with navigation and interaction support
- **TgContent** - Main content wrapper with proper spacing
- **TgNav** - Bottom navigation bar with up to 4 menu options and icons
- **TgSection** - Content sections with proper styling
- **Hero** - Header component for pages

### 📡 Telegram SDK Integration
- **🎮 Haptic Feedback** - Impact, notification, and selection feedback
- **🔄 Main Button** - Configurable main action button
- **⬅️ Back Button** - Navigation back button control
- **👤 User Data** - Access to Telegram user information
- **🎨 Theme Integration** - Automatic Telegram theme colors
- **📐 Viewport Control** - Fullscreen, safe-area, and responsive viewport management
- **🏠 Home Screen Shortcuts** - Add/check Mini App shortcut support
- **📍 Device APIs** - Feature-detected storage, location, and motion access
- **🔗 Deep Linking** - External and Telegram link handling
- **📤 Sharing** - Built-in sharing functionality

### 🧪 Testing & Quality
- **⚡ Vitest** - Fast unit testing framework
- **🧪 Component Tests** - Comprehensive test coverage
- **🔍 TypeScript** - Full type safety
- **📋 Type Definitions** - Complete Telegram WebApp types

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### 1. Use This Template
Click the "Use this template" button on GitHub or clone the repository:

```bash
git clone https://github.com/patricktobias86/nuxt-telegram-mini-app.git my-telegram-app
cd my-telegram-app
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the demo.

### 4. Build for Production
```bash
npm run generate
```

## 📁 Project Structure

```

├── app/                     # Nuxt app directory
│   ├── assets/             # CSS and static assets
│   │   └── css/
│   │       ├── main.css    # Global styles
│   │       └── tailwind.css # Tailwind imports
│   ├── components/         # Vue components
│   │   ├── Hero.vue        # Hero component
│   │   ├── ErrorBoundary.vue
│   │   └── tg/             # Telegram components
│   │       ├── Button.vue  # Telegram button
│   │       ├── Cell.vue    # List cell
│   │       ├── Content.vue # Content wrapper
│   │       ├── Nav.vue     # Bottom navigation
│   │       └── Section.vue # Content section
│   ├── composables/        # Vue composables
│   │   └── telegram.ts     # Telegram SDK integration
│   ├── pages/              # App pages
│   │   ├── index.vue       # Home page with SDK demo
│   │   ├── components.vue  # Components showcase
│   │   ├── utilities.vue   # Utilities demo
│   │   └── functions.vue     # Functions page
│   ├── types/              # TypeScript definitions
│   │   └── telegram-webapp.ts
│   └── utils/              # Utility functions
│       └── color.ts        # Color conversion utilities
├── server/                 # Nuxt server API
│   └── api/
│       └── verify-telegram-data.post.ts # Telegram data verification
├── public/                 # Static assets
├── tests/                  # Test files
│   └── telegram.spec.ts
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.ts      # Tailwind configuration
└── vitest.config.ts        # Test configuration
```

## 🎯 Usage Guide

### Creating Your First Page

1. **Create a new page** in `app/pages/`:
```vue
<!-- app/pages/my-page.vue -->
<template>
  <TgContent>
    <Hero
      title="My Page"
      subtitle="Description of my page"
      image-src="/img/hero-user.svg"
    />
    
    <TgSection title="My Section" inset>
      <TgCell
        title="My Cell"
        subtitle="Cell description"
        icon="i-heroicons-star-20-solid"
      />
    </TgSection>
  </TgContent>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => router.push('/')
</script>
```

### Using Telegram SDK Features

```vue
<script setup lang="ts">
import { 
  useMainButton, 
  useBackButton, 
  useHapticFeedback,
  useInitData,
  useThemeParams,
  useViewport,
  useHomeScreen,
  useTelegramStorage
} from '~/composables/telegram'

const main = useMainButton()
const back = useBackButton()
const haptic = useHapticFeedback()
const init = useInitData()
const theme = useThemeParams()
const viewport = useViewport()
const homeScreen = useHomeScreen()
const storage = useTelegramStorage('device')

// Configure main button
onMounted(() => {
  main.mount()
  main.setParams({
    is_visible: true,
    is_active: true,
    text: 'My Action'
  })
  
  const off = main.onClick(() => {
    haptic.impactOccurred('medium')
    // Your action here
  })
  
  onBeforeUnmounted(() => off?.())
})

// Access user data
const userName = computed(() => init.user.value?.first_name || 'Guest')

// Newer Telegram APIs are feature-detected
function openFullscreen() {
  if (!viewport.fullscreen.value) {
    viewport.requestFullscreen()
  }
}

function rememberPreference() {
  storage.setItem('preferred_mode', theme.dark.value ? 'dark' : 'light')
}

// Use theme colors
const bgColor = computed(() => theme.backgroundColor.value)
</script>
```

### Custom Components

The template includes pre-built Telegram-styled components:

```vue
<!-- Buttons -->
<TgButton title="Primary" status="primary" haptic @click="handleClick" />
<TgButton title="Secondary" status="secondary" haptic="impact-light" />
<TgButton title="Outline" status="outline" />
<TgButton title="Destructive" status="destructive" />

<!-- Cells -->
<TgCell title="Basic Cell" subtitle="With subtitle" />
<TgCell title="With Icon" icon="i-heroicons-star-20-solid" />
<TgCell title="Navigable" to="/target-page" />
<TgCell title="Interactive" @click="handleCellClick" />

<!-- Sections -->
<TgSection title="My Section" inset>
  <!-- Section content -->
</TgSection>
```

## 🧩 Using as a Nuxt Layer

This template is compatible with Nuxt Layers, allowing you to use it as a reusable layer in other Nuxt projects or extend it with additional layers.

### What are Nuxt Layers?

Nuxt Layers provide a way to extend and customize Nuxt applications by sharing configurations, components, pages, composables, and more across multiple projects. Layers can be local directories or published npm packages.

### Using This Template as a Layer

To use this Telegram Mini App template as a layer in another Nuxt project, install it as an NPM package:

1. **Install the NPM package**:
   ```bash
   npm install nuxt-telegram-mini-app
   # or
   yarn add nuxt-telegram-mini-app
   # or
   pnpm add nuxt-telegram-mini-app
   ```

2. **Configure your Nuxt project** to extend this layer:
   ```ts
   // nuxt.config.ts
   export default defineNuxtConfig({
     extends: [
       'nuxt-telegram-mini-app'
     ],
     // Your custom config here
   })
   ```

   Alternatively, if you prefer to use a local clone or git dependency:
   ```bash
   # Clone as a subdirectory
   git clone https://github.com/patricktobias86/nuxt-telegram-mini-app.git layers/telegram-app

   # Or add as git dependency in package.json:
   # "dependencies": {
   #   "nuxt-telegram-mini-app": "github:patricktobias86/nuxt-telegram-mini-app"
   # }
   ```

   Then configure:
   ```ts
   // nuxt.config.ts
   export default defineNuxtConfig({
     extends: [
       './layers/telegram-app'
       // or 'nuxt-telegram-mini-app' for git dependency
     ],
     // Your custom config here
   })
   ```

3. **Access layer features** in your project:
   - **Components**: Use `<TgButton>`, `<TgCell>`, etc. in your pages
   - **Composables**: Import `useMainButton`, `useHapticFeedback`, etc.
   - **Pages**: Extend or override existing pages
   - **Styles**: Inherit Tailwind and Telegram theme integration

### Extending This Layer

This template includes an `extends: []` configuration, allowing you to further extend it with additional layers:

```ts
// nuxt.config.ts in this template
export default defineNuxtConfig({
  extends: [
    // Add your custom layers here
    // './layers/my-custom-layer',
    // 'my-published-layer'
  ],
  // ... rest of config
})
```

### Layer Structure

The template follows Nuxt's layer conventions:
- `app/` directory contains all extendable content
- `nuxt.config.ts` at root level defines layer configuration
- Components, pages, and composables are automatically merged

### Best Practices

- **Override selectively**: Only override what you need to customize
- **Maintain compatibility**: Keep Telegram SDK integration intact
- **Test thoroughly**: Ensure Telegram features work in your extended app
- **Version control**: Pin layer versions for stability

## 🚀 Deployment

### Manual Deployment

1. **Build the project**:
```bash
npm run generate
```

2. **Deploy the `dist` folder** to your hosting provider

### Netlify (SPA routing)

- This project uses Vue Router history mode to preserve Telegram's `#tgWebAppData` hash.
- Netlify requires a SPA redirect so deep links resolve to `index.html`.
- Included file: `public/_redirects` with `/* /index.html 200`.
- If you deploy elsewhere, add an equivalent history fallback rule.

### Environment Variables

Set these in your deployment platform:

```env
ENV=production
```

## 🧪 Testing

Run tests with:

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

The project includes:
- **Unit tests** for Telegram composables
- **Component tests** for UI components
- **Integration tests** for user flows

## 🎨 Customization

### Theme Customization

The template automatically inherits Telegram's theme colors. Customize in `app/assets/css/main.css`:

```css
:root {
  /* Telegram theme variables are automatically set */
  --custom-color: #your-color;
}
```

### Tailwind Configuration

Extend Tailwind in `tailwind.config.ts`:

```ts
export default {
  theme: {
    extend: {
      colors: {
        'custom': '#your-color',
      }
    }
  }
}
```

### Adding New Components

1. Create component in `app/components/`
2. Follow the existing patterns for styling and props
3. Add TypeScript interfaces for props
4. Include tests in `tests/`

## 📖 API Reference

### Composables

#### `useTelegramWebApp()`
- `webApp` - WebApp instance
- `isReady` - Ready state
- `isAvailable` - Availability check

#### `useMainButton()`
- `setParams(params)` - Configure button
- `onClick(callback)` - Handle clicks
- `visible` - Visibility state
- Supports shine effect, custom emoji icon, and other current BottomButton params

#### `useBackButton()`
- `show()` / `hide()` - Control visibility
- `onClick(callback)` - Handle clicks

#### `useHapticFeedback()`
- `impactOccurred(style)` - Trigger impact
- `notificationOccurred(type)` - Trigger notification
- `selectionChanged()` - Trigger selection

#### `useInitData()`
- `user` - User information
- `queryId` - Query ID
- `startParam` - Start parameter

#### `useThemeParams()`
- `backgroundColor` - Theme background
- `textColor` - Theme text color
- `buttonColor` - Theme button color
- And more theme colors...

#### `useViewport()`
- `requestFullscreen()` / `exitFullscreen()` - Toggle Telegram fullscreen when supported
- `insets` - Device safe-area insets
- `contentInsets` - Content safe-area insets

#### `useMiniApp()`
- `hideKeyboard()` - Hide the native keyboard when supported
- `lockOrientation()` / `unlockOrientation()` - Control device orientation when supported
- `enableVerticalSwipes()` / `disableVerticalSwipes()` - Control vertical swipe gestures

#### New Telegram APIs
- `useSecondaryButton()` - Control Telegram's secondary bottom button
- `useSettingsButton()` - Control the Mini App settings menu button
- `useHomeScreen()` - Add/check home screen shortcuts
- `useEmojiStatus()` - Request emoji status access and open the set-status dialog
- `useTelegramStorage(type)` - Use `cloud`, `device`, or `secure` Telegram storage
- `useLocationManager()` - Initialize and request native location data
- `useDeviceMotion()` - Access accelerometer, orientation, and gyroscope objects
- `shareToStory()`, `shareMessage()`, `downloadFile()`, `requestChat()` - Wrappers for newer Telegram actions

### Components

#### `<TgButton>`
Props-driven styling so you don’t need extra Tailwind classes.

```vue
<TgButton
  title="Label"
  status="primary|secondary|outline|danger|destructive"
  size="sm|md|lg"
  :block="true"
  :loading="false"
  :disabled="false"
  icon="i-heroicons-star-20-solid"
  icon-position="left|right"
  elevated
  uppercase
  haptic="selection|impact-light|impact-medium|impact-heavy|notification-success|notification-warning|notification-error"
  @click="handleClick"
/>
```

TgButton props

| Prop | Required | Default | Description |
| --- | --- | --- | --- |
| `title` | yes | — | Button label text |
| `status` | no | `primary` | Visual style variant |
| `size` | no | `md` | Size of the button |
| `block` | no | `true` | Full width when true |
| `loading` | no | `false` | Shows spinner and disables |
| `disabled` | no | `false` | Disables interaction |
| `icon` | no | — | Icon name for `@nuxt/icon` |
| `icon-position` | no | `left` | Icon placement relative to text |
| `elevated` | no | `false` | Adds a subtle shadow |
| `uppercase` | no | `false` | Uppercase label |
| `to` | no | — | Internal route, uses `NuxtLink` |
| `href` | no | — | External link, uses `<a>` |
| `share-url` | no | — | Triggers Telegram share on click |
| `haptic` | no | `false` | Haptic feedback type or boolean |

Notes:
- Prefer `to` (router) for internal navigation to avoid conflicts with bottom Nav.
- `small` is still supported but `size` is preferred.

#### `<TgCell>`
```vue
<TgCell
  title="Cell Title"
  subtitle="Cell Subtitle"
  :description="dynamicDescription"
  icon="i-heroicons-star-20-solid"
  color="var(--tg-theme-link-color)"
  icon-color="#888"
  tone="default|secondary"
  :border="true"
  :clickable="false"    
  :chevron="undefined|true|false"  
  to="/navigation-target"         
  href="https://example.com"
  @click="handleClick"
/>
```

TgCell props

| Prop | Required | Default | Description |
| --- | --- | --- | --- |
| `title` | no | `''` | Title text |
| `subtitle` | no | — | Subtitle text |
| `description` | no | — | Description text |
| `icon` | no | — | Icon name for `@nuxt/icon` |
| `color` | no | — | Title color override |
| `icon-color` | no | — | Icon color override |
| `line-clamp` | no | `0` | Clamp lines for text (0 = none) |
| `border` | no | `true` | Bottom divider line |
| `tone` | no | `default` | Background tone |
| `clickable` | no | `false` | Hover style even without link |
| `chevron` | no | `auto` | Force chevron visibility |
| `to` | no | — | Internal route, uses `NuxtLink` |
| `href` | no | — | External link, uses `<a>` |

#### `<TgContent>`
```vue
<TgContent as="main|section|div" />
```

Behavior

- Automatically adds bottom safe-area padding when a `<TgNav>` exists on the page.
- Default container styles: `max-w-2xl`, `p-4`, and `space-y-6`.

TgContent props

| Prop | Required | Default | Description |
| --- | --- | --- | --- |
| `as` | no | `main` | Render element |
| `max-width-class` | no | — | Optional override for container max width |
| `class` | no | `''` | Extra classes to merge |

#### `<TgSection>`
```vue
<TgSection title="Section" inset tone="default|secondary" :append-border="true" />
```

Behavior

- Rounded corners by default; larger rounding when `inset`.
- No outer border around the body.

TgSection props

| Prop | Required | Default | Description |
| --- | --- | --- | --- |
| `title` | no | — | Optional section header |
| `inset` | no | `false` | Indented, iOS-like style |
| `tone` | no | `default` | Background tone for body |
| `append-border` | no | `true` | Thin border above append slot |
| `class` | no | `''` | Extra classes on wrapper |

#### `<TgNav>`
```vue
<TgNav
  :items="navItems"
  :model-value="activeKey"
  tone="default|secondary"
  :border="true"
  height="12|14"
  :safe-area="true"
  root-class="custom-nav-class"
  @select="handleSelect"
  @update:model-value="handleActiveChange"
/>
```

TgNav props

| Prop | Required | Default | Description |
| --- | --- | --- | --- |
| `items` | yes | — | List of items `{ key, label, icon?, to? }` |
| `model-value` | no | — | Controlled active key |
| `tone` | no | `default` | Background tone |
| `border` | no | `true` | Top border visibility |
| `height` | no | `14` | Item height (Tailwind number) |
| `safe-area` | no | `true` | Adds bottom safe area spacer |
| `root-class` | no | `''` | Extra classes on root nav |

Navigation items structure:
```ts
interface TgNavItem {
  key: string        // Unique identifier
  label: string      // Display text
  icon?: string      // Icon name (optional)
  to?: string        // Route path (optional)
}
```

Routing guidance

- Use `to` (router) for internal navigation to avoid conflicts with the fixed `<TgNav>`.
- Reserve `href` for external links.

## 🔧 Configuration

### Nuxt Configuration

Key settings in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  ssr: false,              // SPA mode for Telegram
  srcDir: 'app',           // App source directory
  router: {
    options: {
      // Use history mode so Telegram's #tgWebAppData is not rewritten to a route
      hashMode: false
    }
  },
  modules: [
    '@nuxt/icon',          // Icon support
    '@nuxtjs/tailwindcss', // Tailwind CSS
  ],
  app: {
    head: {
      script: [{
        src: 'https://telegram.org/js/telegram-web-app.js?62'
      }]
    }
  }
})
```

### Telegram WebApp Script

The template automatically includes the Telegram WebApp script. The wrapper feature-detects newer APIs because the available API version depends on the user's Telegram client.

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new features
5. **Submit** a pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **📖 Documentation**: Check this README and inline code comments
- **🐛 Issues**: Report bugs via GitHub Issues
- **💡 Discussions**: Use GitHub Discussions for questions
- **📚 Telegram Docs**: [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)

## 🏗️ Built With

- [Nuxt 4](https://nuxt.com/) - The Vue.js Framework
- [Vue 3](https://vuejs.org/) - The Progressive JavaScript Framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Vitest](https://vitest.dev/) - A blazing fast unit testing framework
- [Telegram WebApp API](https://core.telegram.org/bots/webapps) - Telegram Mini Apps Platform

## 🔗 Links

- [Demo](https://your-demo-url.netlify.app) - Live demo
- [Telegram Mini Apps Guide](https://core.telegram.org/bots/webapps)
- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/)

---

**Made with ❤️ using Nuxt 4**
