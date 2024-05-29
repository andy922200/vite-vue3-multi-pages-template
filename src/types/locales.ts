enum BaseLocales {
  en = 'en',
  zhTw = 'zh_tw',
  zhCn = 'zh_cn',
}

export enum DayjsLocales {
  en = BaseLocales.en,
  zhTw = BaseLocales.zhTw,
  zhCn = BaseLocales.zhCn,
}

export enum Locales {
  enUs = 'en_us',
  zhTw = BaseLocales.zhTw,
  zhCn = BaseLocales.zhCn,
}

export enum NumericLocales {
  default = 0,
  zhTw = 1,
  en = 2,
}

export function mapNumericLocaleToLocale(numericLocale: NumericLocales): Locales {
  switch (numericLocale) {
    case NumericLocales.zhTw:
      return Locales.zhTw
    case NumericLocales.en:
      return Locales.enUs
    default:
      return Locales.zhTw // default to zh-tw
  }
}
