import { createI18n } from 'vue-i18n'

import enUsLocale from '~/lang/en_us.json'
import zhTwLocale from '~/lang/zh_tw.json'

export enum LocaleMap {
  zhTw = 'zh-tw',
  enUs = 'en-us',
}
export type LocaleType = `${LocaleMap}`
export type Messages = typeof zhTwLocale | typeof enUsLocale

export const messages: Record<string, Messages> = {
  [LocaleMap.zhTw]: {
    ...zhTwLocale,
  },
  [LocaleMap.enUs]: {
    ...enUsLocale,
  },
}

interface I18nLanguage {
  param: LocaleType
  title: string
}

export const LayoutLanguages: I18nLanguage[] = [
  {
    param: LocaleMap.enUs,
    title: 'English',
  },
  {
    param: LocaleMap.zhTw,
    title: '繁體中文',
  },
]

export const appLangs = Object.keys(messages)
export type appLangType = keyof typeof messages
export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('gobooking-lang') ?? LocaleMap.zhTw,
  globalInjection: true,
  fallbackLocale: LocaleMap.zhTw,
  messages,
})

export default i18n
