import { ref, onMounted } from 'vue'
import { setCssVar } from '@/helpers/css-variable'
import { getSavedLocale } from '@/plugins/i18n/entry'

export function useInitApp() {
  const isReady = ref(false)
  const currentLocale = ref(getSavedLocale())

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
    currentLocale,
  }
}
