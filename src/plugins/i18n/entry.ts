import { createI18n, VueI18n, ExportedGlobalComposer } from 'vue-i18n'
import { Locales } from '@/types'
import { messages } from './config/index'

export const getSavedLocale = (localStorageKey?: string) => {
  const locale = localStorage.getItem(localStorageKey || 'locale')

  return locale || Locales.enUs
}

export const saveLocale = (
  locale: string,
  i18NInstance?: VueI18n | ExportedGlobalComposer,
  localStorageKey?: string,
) => {
  localStorage.setItem(localStorageKey || 'locale', locale)

  if (i18NInstance) {
    i18NInstance.locale = locale
  }
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  messages,
  locale: getSavedLocale(),
  fallbackLocale: getSavedLocale(),
})

export default i18n
