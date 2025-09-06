# Contributing Guide

Thank you for your interest in contributing to the Nuxt Telegram Mini App Template! This guide will help you understand the project structure and development workflow.

## 🏗️ Project Architecture

### Directory Structure Overview

```
root/
├── app/                     # Main application code (Nuxt srcDir)
│   ├── assets/             # Static assets and stylesheets
│   │   └── css/
│   │       ├── main.css    # Global CSS with Telegram theme variables
│   │       └── tailwind.css # Tailwind CSS imports
│   ├── components/         # Reusable Vue components
│   │   ├── ErrorBoundary.vue # Error boundary component
│   │   ├── Hero.vue        # Page hero component
│   │   └── tg/             # Telegram-specific components
│   │       ├── Button.vue  # Telegram button component
│   │       ├── Cell.vue    # List cell component
│   │       ├── Content.vue # Main content wrapper
│   │       ├── Nav.vue     # Bottom navigation
│   │       └── Section.vue # Content sections
│   ├── composables/        # Vue composables for reusable logic
│   │   └── telegram.ts     # Telegram WebApp SDK integration
│   ├── pages/              # File-based routing pages
│   │   ├── index.vue       # Home page with main demo
│   │   ├── components.vue  # Components showcase page
│   │   ├── utilities.vue   # Utilities and tools demo
│   │   └── functions.vue     # Functions page example
│   ├── types/              # TypeScript type definitions
│   │   └── telegram-webapp.ts # Telegram WebApp types
│   └── utils/              # Utility functions
│       └── color.ts        # Color conversion utilities
├── server/                 # Nuxt server API
│   └── api/
│       └── verify-telegram-data.post.ts # Telegram data verification
├── public/                 # Static public assets
│   ├── _redirects         # Netlify redirects
│   ├── robots.txt         # SEO robots file
│   └── img/               # Images
├── tests/                  # Test files
│   ├── telegram.spec.ts    # Telegram composables tests
│   ├── components.spec.ts  # Component unit tests
│   └── pages.spec.ts       # Page integration tests
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vitest.config.ts        # Vitest testing configuration
└── netlify.toml            # Netlify deployment configuration
```

## 🧩 Component Architecture

### Telegram Components (`app/components/tg/`)

All Telegram-specific components follow a consistent API pattern:

#### TgButton
- **Purpose**: Telegram-styled buttons with haptic feedback
- **Props**: `title`, `status`, `haptic`, `disabled`, `loading`, `shareUrl`
- **Events**: `click`
- **Usage**: Interactive buttons throughout the app

#### TgCell
- **Purpose**: List item cells with consistent styling
- **Props**: `title`, `subtitle`, `description`, `icon`, `to`, `border`
- **Events**: `click`
- **Usage**: Navigation items, settings, content lists

#### TgSection
- **Purpose**: Content grouping with proper spacing
- **Props**: `title`, `inset`
- **Usage**: Organizing content into logical sections

#### TgContent
- **Purpose**: Main content wrapper with safe areas
- **Usage**: Primary content container for all pages

#### TgNav
- **Purpose**: Bottom navigation bar
- **Props**: `modelValue`, `items`
- **Events**: `select`, `update:modelValue`
- **Usage**: App navigation

### Design Principles

1. **Telegram Native Feel**: All components match Telegram's design language
2. **Accessibility**: Proper ARIA labels and keyboard navigation
3. **Responsive**: Works on all device sizes
4. **Theme Aware**: Automatically adapts to Telegram's theme
5. **Type Safe**: Full TypeScript support

## 🔧 Telegram SDK Integration

### Composables Architecture

The `app/composables/telegram.ts` file provides Vue composables for all Telegram WebApp features:

#### Core Composables

```typescript
// Main WebApp instance
useTelegramWebApp()

// Navigation
useBackButton()
useMainButton()

// User interaction
useHapticFeedback()

// Data access
useInitData()
useThemeParams()

// App control
useMiniApp()
useViewport()
```

#### Usage Pattern

```vue
<script setup lang="ts">
import { useMainButton, useHapticFeedback } from '~/composables/telegram'

const main = useMainButton()
const haptic = useHapticFeedback()

onMounted(() => {
  // Configure main button
  main.mount()
  main.setParams({
    is_visible: true,
    is_active: true,
    text: 'My Action'
  })
  
  // Handle click
  const off = main.onClick(() => {
    haptic.impactOccurred('medium')
    // Your action here
  })
  
  // Cleanup
  onBeforeUnmount(() => off?.())
})
</script>
```

## 🎨 Styling System

### Tailwind Integration

The project uses Tailwind CSS with custom Telegram theme integration:

#### Theme Variables

```css
/* app/assets/css/main.css */
:root {
  --tg-theme-bg-color: #ffffff;
  --tg-theme-text-color: #000000;
  --tg-theme-hint-color: #999999;
  /* ... more theme variables */
}
```

#### Custom Tailwind Classes

```css
/* Telegram-specific utilities */
.bg-tg-bg { @apply bg-[var(--tg-theme-bg-color)]; }
.text-tg { @apply text-[var(--tg-theme-text-color)]; }
.text-hint { @apply text-[var(--tg-theme-hint-color)]; }
```

#### Component Styling Patterns

1. Use Telegram theme variables for colors
2. Follow mobile-first responsive design
3. Ensure proper touch targets (44px minimum)
4. Use consistent spacing scale

## 📱 Page Structure

### Standard Page Template

```vue
<template>
  <TgContent>
    <Hero 
      title="Page Title"
      subtitle="Page description"
      image-src="/img/hero-image.svg"
    />
    
    <TgSection title="Section Title" inset>
      <!-- Section content -->
    </TgSection>
    
    <div class="h-2" /> <!-- Bottom spacing -->
  </TgContent>

  <TgNav v-model="activeTab" :items="navItems" @select="onSelectTab" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useMainButton } from '~/composables/telegram'

const router = useRouter()
const main = useMainButton()

// Navigation setup
const activeTab = ref('current-page')
const navItems = [
  { key: 'home', label: 'Home', icon: 'i-heroicons-home-20-solid', to: '/' },
  // ... other nav items
]

function onSelectTab(item: NavItem) {
  if (item.to) router.push(item.to)
}

// Main button setup
onMounted(() => {
  main.mount()
  main.setParams({ is_visible: true, text: 'Action' })
  
  const off = main.onClick(() => {
    // Action handler
  })
  
  onBeforeUnmount(() => off?.())
})
</script>
```

## 🧪 Testing Strategy

### Test Structure

1. **Unit Tests** (`*.spec.ts`): Individual component and function testing
2. **Integration Tests**: Page-level functionality testing
3. **E2E Tests**: Full user journey testing (to be implemented)

### Testing Utilities

- **Vitest**: Fast unit test runner
- **Vue Test Utils**: Vue component testing
- **Happy DOM**: Lightweight DOM implementation
- **Mock System**: Comprehensive Telegram API mocking

### Writing Tests

```typescript
// Component test example
import { mount } from '@vue/test-utils'

describe('TgButton', () => {
  it('renders with correct props', () => {
    const wrapper = mount(TgButton, {
      props: { title: 'Test Button', status: 'primary' }
    })
    
    expect(wrapper.text()).toBe('Test Button')
    expect(wrapper.classes()).toContain('tg-button--primary')
  })
})
```

## 🚀 Development Workflow

### Getting Started

1. **Clone and install**:
   ```bash
   git clone <your-repo>
   cd nuxt-telegram-mini-app
   npm install
   ```

2. **Start development**:
   ```bash
   npm run dev
   ```

3. **Run tests**:
   ```bash
   npm run test
   npm run test:watch
   ```

### Adding New Features

#### 1. Adding a New Page

1. Create `app/pages/new-page.vue`
2. Follow the standard page template
3. Add to navigation items in other pages
4. Write integration tests

#### 2. Adding a New Component

1. Create component in appropriate directory
2. Follow TypeScript prop definitions
3. Add proper styling with Tailwind
4. Write unit tests
5. Document props and usage

#### 3. Adding Telegram Features

1. Extend composables in `app/composables/telegram.ts`
2. Follow existing patterns for error handling
3. Add TypeScript types if needed
4. Test with actual Telegram WebApp
5. Add mock implementations for tests

### Code Style Guidelines

1. **TypeScript**: Use strict typing, avoid `any`
2. **Vue 3**: Use Composition API with `<script setup>`
3. **Formatting**: Use ESLint
4. **Naming**: Use descriptive names, follow Vue conventions
5. **Comments**: Document complex logic and Telegram-specific behavior

### Git Workflow

1. **Branch naming**: `feature/description`, `fix/description`, `docs/description`
2. **Commits**: Use conventional commits format
3. **PRs**: Include description, screenshots for UI changes
4. **Reviews**: All changes require review for template updates

## 📦 Deployment

### Netlify Deployment

The template is configured for zero-config Netlify deployment:

1. **Build settings** are in `netlify.toml`
2. **Functions** are in `netlify/functions/`
3. **Redirects** are in `public/_redirects`

### Manual Deployment

1. Build the project: `npm run generate`
2. Deploy the `dist` folder to your hosting provider
3. Configure redirects for SPA routing

### Environment Variables

- `ENV`: Set to `production` for production builds
- Add others as needed for your specific implementation

## 🤝 Contributing Process

1. **Fork** the repository
2. **Create** a feature branch from `main`
3. **Make** your changes following the guidelines
4. **Test** your changes thoroughly
5. **Update** documentation if needed
6. **Submit** a pull request with clear description

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Telegram WebApp tested (if applicable)

## Screenshots
Include screenshots for UI changes
```

## 🆘 Troubleshooting

### Common Issues

1. **TypeScript Errors**: Check import paths and type definitions
2. **Telegram SDK**: Ensure you're testing in actual Telegram context
3. **Styling Issues**: Verify Tailwind classes and theme variables
4. **Build Errors**: Check Node.js version and dependencies

### Getting Help

- Check existing issues on GitHub
- Read Telegram Mini Apps documentation
- Ask questions in GitHub Discussions
- Review test files for usage examples

---

**Happy coding! 🚀**
