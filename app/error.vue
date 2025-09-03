<template>
  <div class="min-h-screen tg-bg flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-tg-text">
          {{ error?.statusCode === 404 ? 'Page Not Found' : 'Something went wrong' }}
        </h1>
        <p class="text-tg-hint">
          {{ error?.statusCode === 404 
            ? 'The page you\'re looking for doesn\'t exist.' 
            : 'We encountered an unexpected error. Please try again.' 
          }}
        </p>
      </div>

      <div class="space-y-3">
        <button 
          @click="handleError"
          class="w-full bg-tg-button text-tg-button-text py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          {{ error?.statusCode === 404 ? 'Go Home' : 'Try Again' }}
        </button>
        
        <button 
          @click="clearAndReload"
          class="w-full border border-tg-button text-tg-button py-3 px-4 rounded-lg font-medium hover:bg-tg-button hover:text-tg-button-text transition-colors"
        >
          Clear Cache & Reload
        </button>
      </div>

      <details class="text-left text-sm text-tg-hint">
        <summary class="cursor-pointer hover:text-tg-text">Technical Details</summary>
        <div class="mt-2 p-3 bg-tg-secondary-bg rounded border text-xs font-mono">
          <div><strong>Status:</strong> {{ error?.statusCode || 'Unknown' }}</div>
          <div><strong>Message:</strong> {{ error?.statusMessage || 'No details available' }}</div>
          <div><strong>URL:</strong> {{ error?.url || 'Unknown' }}</div>
          <div v-if="telegramInfo"><strong>Telegram:</strong> {{ telegramInfo }}</div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Define props for the error
const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
    url?: string
  }
}>()

// Get Telegram context info for debugging
const telegramInfo = computed(() => {
  if (typeof window === 'undefined') return null
  
  const info: string[] = []
  
  // Check if running in Telegram
  const tg = (window as any)?.Telegram?.WebApp
  if (tg) {
    info.push('In Telegram WebApp')
    info.push(`Platform: ${tg.platform || 'unknown'}`)
    info.push(`Version: ${tg.version || 'unknown'}`)
  }
  
  // Check for hash parameters
  const hash = window.location.hash
  if (hash && hash.includes('tgWebApp')) {
    info.push('Has TG hash params')
  }
  
  // Check for session storage flags
  if (sessionStorage.getItem('__tg_hash_fixed')) {
    info.push('Hash was fixed')
  }
  
  return info.length > 0 ? info.join(', ') : 'Not in Telegram'
})

function handleError() {
  if (props.error?.statusCode === 404) {
    // Navigate to home
    navigateTo('/')
  } else {
    // Try to reload the current page
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }
}

function clearAndReload() {
  if (typeof window !== 'undefined') {
    // Clear all storage
    try {
      sessionStorage.clear()
      localStorage.clear()
    } catch (e) {
      console.warn('Failed to clear storage:', e)
    }
    
    // Clear hash fix flag specifically
    try {
      sessionStorage.removeItem('__tg_hash_fixed')
    } catch (e) {
      console.warn('Failed to clear hash fix flag:', e)
    }
    
    // Reload without hash if there are problematic parameters
    const hash = window.location.hash
    if (hash && hash.includes('tgWebApp')) {
      // Try to reload without the problematic hash
      window.location.href = window.location.pathname + window.location.search
    } else {
      window.location.reload()
    }
  }
}

// Set page title
useHead({
  title: computed(() => 
    props.error?.statusCode === 404 
      ? 'Page Not Found' 
      : 'Error - Telegram Mini App'
  )
})
</script>

<style scoped>
/* Use Telegram theme colors */
.tg-bg {
  background-color: var(--tg-theme-bg-color, #ffffff);
}

.tg-text {
  color: var(--tg-theme-text-color, #000000);
}

.tg-hint {
  color: var(--tg-theme-hint-color, #999999);
}

.tg-button {
  background-color: var(--tg-theme-button-color, #2481cc);
}

.tg-button-text {
  color: var(--tg-theme-button-text-color, #ffffff);
}

.tg-secondary-bg {
  background-color: var(--tg-theme-secondary-bg-color, #f1f1f1);
}
</style>
