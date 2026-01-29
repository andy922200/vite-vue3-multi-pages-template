import { ref, watchEffect } from 'vue'

import i18n, { LocaleType } from '@/plugins/i18n'

const currentLanguage = ref<LocaleType>(i18n.global.locale.value as LocaleType)

export function useLanguage() {
  watchEffect(() => {
    currentLanguage.value = i18n.global.locale.value as LocaleType
  })

  const setLanguage = (lang: LocaleType) => {
    i18n.global.locale.value = lang
    localStorage.setItem('saved-lang', lang)
  }

  return {
    currentLanguage,
    setLanguage,
  }
}
