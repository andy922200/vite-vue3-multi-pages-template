import AirDatepicker from 'air-datepicker'

import dayjs from '@/plugins/dayjs'

export const useAirDatepickerUtils = () => {
  const updateDatePicker = ({
    dateValue,
    instance,
    comparisonDate,
    comparisonFn,
    updateOptions,
  }: {
    dateValue: string
    instance: AirDatepicker<HTMLElement> | null
    comparisonDate: string | null
    comparisonFn: (a: dayjs.Dayjs, b: dayjs.Dayjs) => boolean
    updateOptions: Record<string, any>
  }) => {
    if (!comparisonDate || comparisonFn(dayjs(comparisonDate), dayjs(dateValue))) {
      comparisonDate = dateValue
      instance?.selectDate(dateValue)
    }

    instance?.update(updateOptions)
  }

  const handleStartDateChange = ({
    formattedDate,
    endDate,
    endInst,
  }: {
    formattedDate: string
    endDate: string
    endInst: AirDatepicker<HTMLElement> | null
  }) => {
    // 若結束日期不存在或小於開始日期，則同步更新結束日期
    updateDatePicker({
      dateValue: formattedDate,
      instance: endInst,
      comparisonDate: endDate,
      comparisonFn: (a: dayjs.Dayjs, b: dayjs.Dayjs) => a.isBefore(b),
      updateOptions: { minDate: formattedDate },
    })
  }

  const handleEndDateChange = ({
    formattedDate,
    startDate,
    startInst,
  }: {
    formattedDate: string
    startDate: string
    startInst: AirDatepicker<HTMLElement> | null
  }) => {
    // 同步更新開始日期
    updateDatePicker({
      dateValue: formattedDate,
      instance: startInst,
      comparisonDate: startDate,
      comparisonFn: (a: dayjs.Dayjs, b: dayjs.Dayjs) => a.isAfter(b),
      updateOptions: { maxDate: formattedDate },
    })
  }

  return {
    handleStartDateChange,
    handleEndDateChange,
  }
}
