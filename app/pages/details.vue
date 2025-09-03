<template>
  <TgContent>
    <Hero
      title="Details"
      subtitle="Showcasing components and SDK integrations"
      image-src="/img/hero-user.gif"
    />

    <TgSection title="Navigation" inset>
      <TgCell
        title="Use Back Button"
        subtitle="Telegram back button is shown on this page"
        icon="i-heroicons-arrow-left-circle-20-solid"
      />
      <div class="p-4">
        <TgButton title="Go Back (fallback)" haptic @click="goBack" />
      </div>
    </TgSection>

    <TgSection title="Main Button" inset>
      <TgCell title="Configured to return Home" />
      <div class="p-4">
        <TgButton title="Go Home (fallback)" haptic @click="goHome" />
      </div>
    </TgSection>

    <div class="h-2" />
  </TgContent>

  <TgNav v-model="activeTab" :items="navItems" @select="onSelectTab" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBackButton, useMainButton } from '~/composables/telegram'

const router = useRouter()
const back = useBackButton()
const main = useMainButton()

// Bottom Nav wiring
type NavItem = { key: string; label: string; icon?: string; to?: string }
const navItems: NavItem[] = [
  { key: 'home', label: 'Home', icon: 'i-heroicons-home-20-solid', to: '/' },
  { key: 'components', label: 'Components', icon: 'i-heroicons-squares-2x2-20-solid', to: '/components' },
  { key: 'utilities', label: 'Utils', icon: 'i-heroicons-wrench-screwdriver-20-solid', to: '/utilities' },
  { key: 'details', label: 'Details', icon: 'i-heroicons-document-text-20-solid', to: '/details' },
]
const activeTab = ref('details')

watch(() => router.currentRoute.value.path, (p) => {
  const match = navItems.find(i => i.to === p)
  if (match) activeTab.value = match.key
}, { immediate: true })

function onSelectTab(item: NavItem) {
  if (item.to) router.push(item.to)
}

function goBack() {
  router.back()
}

function goHome() {
  router.replace('/')
}

onMounted(() => {
  // Back Button wiring with guarded polling to avoid early store reads
  back.mount()
  const pollBack = setInterval(() => {
    try {
      // If store not ready yet, any error is swallowed
      if (back.mounted.value) {
        try { back.show() } catch {}
        clearInterval(pollBack)
      }
    } catch {}
  }, 50)
  const offBack = back.onClick(() => { goBack() })

  // Main Button wiring with guarded polling
  main.mount()
  const pollMain = setInterval(() => {
    try {
      if (main.mounted.value) {
        main.setParams({ is_visible: true, is_active: true, text: 'Go Home' })
        clearInterval(pollMain)
      }
    } catch {}
  }, 50)
  const offMain = main.onClick(() => { goHome() })

  onBeforeUnmount(() => {
    offBack?.()
    offMain?.()
  })
})
</script>

<style scoped>
</style>
