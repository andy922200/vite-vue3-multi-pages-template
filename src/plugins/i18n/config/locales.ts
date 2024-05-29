import { Locales } from '@/types'

interface I18nLanguage {
  param: string
  title: string
}

export const LayoutLanguages: I18nLanguage[] = [
  {
    param: Locales.enUs,
    title: 'English',
  },
  {
    param: Locales.zhTw,
    title: '繁體中文',
  },
  {
    param: Locales.zhCn,
    title: '简体中文',
  },
]
