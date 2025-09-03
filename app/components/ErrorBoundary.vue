<template>
  <div v-if="hasError" class="error-boundary p-4 bg-red-50 border border-red-200 rounded-lg">
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-medium text-red-800">
          Component Error
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <p>{{ fallbackMessage || 'Something went wrong with this component.' }}</p>
        </div>
        <div class="mt-3">
          <button
            @click="retry"
            class="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
        <details v-if="showDetails" class="mt-3">
          <summary class="cursor-pointer text-sm text-red-600 hover:text-red-800">
            Technical Details
          </summary>
          <pre class="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">{{ errorDetails }}</pre>
        </details>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, nextTick } from 'vue'

interface Props {
  fallbackMessage?: string
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fallbackMessage: '',
  showDetails: false
})

const hasError = ref(false)
const errorDetails = ref('')
const retryKey = ref(0)

onErrorCaptured((error, instance, info) => {
  console.error('[ErrorBoundary] Caught error:', error)
  console.error('[ErrorBoundary] Component info:', info)
  
  hasError.value = true
  errorDetails.value = `Error: ${error.message}\nInfo: ${info}\nStack: ${error.stack}`
  
  // Prevent the error from propagating further
  return false
})

const retry = async () => {
  hasError.value = false
  errorDetails.value = ''
  retryKey.value++
  
  // Wait for next tick to ensure component re-renders
  await nextTick()
}

// Provide retry key to force re-render of child components
provide('errorBoundaryRetryKey', retryKey)
</script>

<style scoped>
.error-boundary {
  margin: 1rem 0;
}
</style>
