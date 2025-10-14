import { readonly, ref } from 'vue'

import { fixedDomOverflow } from '@/helpers'

export const useBackdrop = () => {
  const isShowBackdrop = ref(false)
  const showBackdrop = () => {
    isShowBackdrop.value = true
    fixedDomOverflow(document.querySelector('body'), true)
  }

  const closeBackdrop = () => {
    isShowBackdrop.value = false
    fixedDomOverflow(document.querySelector('body'), false)
  }

  return {
    isShowBackdrop: readonly(isShowBackdrop),
    showBackdrop,
    closeBackdrop,
  }
}
