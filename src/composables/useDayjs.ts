import dayjs, { DayjsLocales } from '@/plugins/dayjs'

const changeToLocaleTime = function ({
  time,
  lang,
  timezoneOffset,
  format,
}: {
  time: string | number | Date
  lang: DayjsLocales
  timezoneOffset: number
  format: string
}): string {
  return dayjs(time).add(timezoneOffset, 'minute').locale(`${lang}`).format(`${format}`)
}

export function useDayjs() {
  return {
    dayjs,
    changeToLocaleTime,
  }
}
