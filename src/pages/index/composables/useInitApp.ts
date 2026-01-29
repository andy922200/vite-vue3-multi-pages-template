import { onMounted, ref } from 'vue'

import { setCssVar } from '@/helpers/css-variable'

export function useInitApp() {
  const isReady = ref(false)

  async function initApp() {
    try {
      onMounted(() => {
        // Set the CSS variables
        setCssVar({ textColor: '#3944BC' })
      })
    } catch (error) {
      console.error(error)
    } finally {
      isReady.value = true
    }
  }

  return {
    isReady,
    initApp,
  }
}
