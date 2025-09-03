# 🚀 Nuxt Telegram Mini App Template

A comprehensive template for building Telegram Mini Apps using Nuxt 3, Vue 3, TypeScript, and Tailwind CSS, ready for deployment on Netlify.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC)

## ✨ Features

### 🎯 Core Features
- **🔧 Complete Nuxt 3 Setup** - Latest Nuxt with TypeScript support
- **📱 Telegram WebApp SDK** - Full integration with Telegram Mini App APIs
- **🎨 Tailwind CSS** - Utility-first CSS framework with Telegram theme integration
- **⚡ SPA Mode** - Optimized for Telegram Mini App deployment
- **🌐 Netlify Ready** - Pre-configured for seamless deployment

### 🧩 Components Library
- **TgButton** - Telegram-styled buttons with haptic feedback
- **TgCell** - List cells with navigation and interaction support
- **TgContent** - Main content wrapper with proper spacing
- **TgNav** - Bottom navigation bar
- **TgSection** - Content sections with proper styling
- **Hero** - Header component for pages

### 📡 Telegram SDK Integration
- **🎮 Haptic Feedback** - Impact, notification, and selection feedback
- **🔄 Main Button** - Configurable main action button
- **⬅️ Back Button** - Navigation back button control
- **👤 User Data** - Access to Telegram user information
- **🎨 Theme Integration** - Automatic Telegram theme colors
- **📐 Viewport Control** - Responsive viewport management
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
│   │   └── details.vue     # Detail page
│   ├── types/              # TypeScript definitions
│   │   └── telegram-webapp.ts
│   └── utils/              # Utility functions
│       └── color.ts        # Color conversion utilities
├── netlify/                # Netlify functions
│   └── functions/
│       └── verify-telegram-data.ts
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

  <TgNav v-model="activeTab" :items="navItems" @select="onSelectTab" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('my-page')

type NavItem = { key: string; label: string; icon?: string; to?: string }
const navItems: NavItem[] = [
  { key: 'home', label: 'Home', icon: 'i-heroicons-home-20-solid', to: '/' },
  { key: 'my-page', label: 'My Page', icon: 'i-heroicons-star-20-solid', to: '/my-page' },
]

function onSelectTab(item: NavItem) {
  if (item.to) router.push(item.to)
}
</script>
```

2. **Add navigation** to other pages by updating their `navItems` array.

### Using Telegram SDK Features

```vue
<script setup lang="ts">
import { 
  useMainButton, 
  useBackButton, 
  useHapticFeedback,
  useInitData,
  useThemeParams 
} from '~/composables/telegram'

const main = useMainButton()
const back = useBackButton()
const haptic = useHapticFeedback()
const init = useInitData()
const theme = useThemeParams()

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

## 🚀 Deployment

### Deploy to Netlify

1. **Connect your repository** to Netlify
2. **Build settings** are pre-configured in `netlify.toml`
3. **Deploy** - Netlify will automatically build and deploy

### Manual Deployment

1. **Build the project**:
```bash
npm run generate
```

2. **Deploy the `dist` folder** to your hosting provider

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

### Components

#### `<TgButton>`
```vue
<TgButton
  title="Button Text"
  status="primary|secondary|outline|destructive"
  haptic="impact-light|impact-medium|impact-heavy|notification-success|notification-warning|notification-error|selection"
  :disabled="false"
  :loading="false"
  @click="handleClick"
/>
```

#### `<TgCell>`
```vue
<TgCell
  title="Cell Title"
  subtitle="Cell Subtitle"
  :description="dynamicDescription"
  icon="heroicons-icon-name"
  to="/navigation-target"
  :border="true"
  @click="handleClick"
/>
```

## 🔧 Configuration

### Nuxt Configuration

Key settings in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  ssr: false,              // SPA mode for Telegram
  srcDir: 'app',           // App source directory
  modules: [
    '@nuxt/icon',          // Icon support
    '@nuxtjs/tailwindcss', // Tailwind CSS
    '@netlify/nuxt'        // Netlify deployment
  ],
  app: {
    head: {
      script: [{
        src: 'https://telegram.org/js/telegram-web-app.js?58',
        defer: true
      }]
    }
  }
})
```

### Telegram WebApp Script

The template automatically includes the Telegram WebApp script. The version can be updated in the Nuxt config.

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

- [Nuxt 3](https://nuxt.com/) - The Vue.js Framework
- [Vue 3](https://vuejs.org/) - The Progressive JavaScript Framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Vitest](https://vitest.dev/) - A blazing fast unit testing framework
- [Telegram WebApp API](https://core.telegram.org/bots/webapps) - Telegram Mini Apps Platform

## 🔗 Links

- [Demo](https://your-demo-url.netlify.app) - Live demo
- [Telegram Mini Apps Guide](https://core.telegram.org/bots/webapps)
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/)

---

**Made with ❤️ using Nuxt 4**
