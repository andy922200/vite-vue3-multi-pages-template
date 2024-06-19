import { Locales } from '@/types'
import enUs from '../en_us.json'
import zhCn from '../zh_cn.json'
import zhTw from '../zh_tw.json'

type Messages = typeof enUs

export const messages: Record<string, Messages> = {
  [Locales.enUs]: enUs,
  [Locales.zhTw]: zhTw,
  [Locales.zhCn]: zhCn,
}
