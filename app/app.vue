<template>
  <div class="min-h-screen tg-bg">
    <NuxtRouteAnnouncer />
    <ErrorBoundary 
      fallback-message="The main application encountered an error. This might be related to Telegram integration."
      :show-details="isDev"
    >
      <NuxtPage />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Check if we're in development mode for showing error details
const isDev = computed(() => {
  return process.dev || (typeof window !== 'undefined' && window.location.hostname === 'localhost')
})

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Global] Unhandled promise rejection:', event.reason)
    
    // Check if it's a Telegram-related error
    const reason = String(event.reason?.message || event.reason || '')
    if (reason.includes('tgWebApp') || reason.includes('Telegram') || reason.includes('hash')) {
      console.warn('[Global] Telegram-related error detected, attempting recovery')
      
      // Try to clear problematic hash and reload
      try {
        if (sessionStorage.getItem('__tg_hash_fixed')) {
          sessionStorage.removeItem('__tg_hash_fixed')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      } catch (e) {
        console.error('[Global] Recovery attempt failed:', e)
      }
    }
  })

  // Global error handler for JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('[Global] JavaScript error:', event.error)
    
    // Check if it's a Telegram-related error
    const message = String(event.error?.message || event.message || '')
    if (message.includes('tgWebApp') || message.includes('Telegram') || message.includes('hash')) {
      console.warn('[Global] Telegram-related JavaScript error detected')
    }
  })
}
</script>
