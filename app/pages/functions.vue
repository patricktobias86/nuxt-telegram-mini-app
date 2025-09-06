<template>
  <TgContent>
    <Hero
      title="Functions"
      subtitle="Showcasing components and SDK integrations"
      image-src="/img/hero-user.svg"
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
      <TgCell title="Main Button is hidden" subtitle="Using bottom navigation instead" />
      <div class="p-4">
        <TgButton title="Demo Button" haptic @click="() => {}" />
      </div>
    </TgSection>

    <div class="h-2" />
  </TgContent>

</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBackButton, useMainButton } from '~/composables/telegram'

const back = useBackButton()
const main = useMainButton()
const router = useRouter()

function goBack() {
  if (!import.meta.client) return
  // Prefer router navigation to play nicely with Nuxt links/TgNav
  if (window.history.length > 1) {
    try { router.back() } catch { /* fallback below */ }
  } else {
    try { router.push('/') } catch { /* no-op */ }
  }
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
  // Register back handler and properly unregister on unmount
  const backHandler = () => { goBack() }
  back.onClick(backHandler)

  // Hide Main Button since we're using TgNav for navigation
  main.mount()
  const pollMain = setInterval(() => {
    try {
      if (main.mounted.value) {
        main.setParams({ is_visible: false })
        clearInterval(pollMain)
      }
    } catch {}
  }, 50)

  onBeforeUnmount(() => {
    try { back.offClick(backHandler) } catch {}
    try { back.hide() } catch {}
  })
})
</script>

<style scoped>
</style>
