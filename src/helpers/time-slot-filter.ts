import dayjs from '@/plugins/dayjs'

export interface TimeSlot {
  slotStart: string
  slotEnd: string
  isOverlap?: boolean
  isPast?: boolean
  date: string
}

export interface TimeSlotFromAPI {
  startTime: string
  endTime: string
  date: string
}

export interface StartTimeOption {
  label: string
  value: string
  originalObj: TimeSlot
  isNow: boolean
  fullString: string
}

export interface EndTimeOption {
  label: string
  value: string
  originalObj: TimeSlot
}

// 判斷時間區間是否在指定的區塊內
function isInTimeSlotStrict({
  startTime,
  endTime,
  date,
  slotStart,
  slotEnd,
  slotDate,
}: {
  startTime: string
  endTime: string
  date: string
  slotStart: string
  slotEnd: string
  slotDate: string
}) {
  const start = dayjs(`${date} ${startTime}`, 'YYYY/MM/DD HH:mm')

  // 如果 endTime 是 "00:00"，並且開始時間在 00:00 之前，則認為是隔天的 00:00
  let end = dayjs(`${date} ${endTime}`, 'YYYY/MM/DD HH:mm')
  if (endTime === '00:00' && start.isBefore(end)) {
    end = end.add(1, 'day')
  }

  const slotStartDayjs = dayjs(`${slotDate} ${slotStart}`, 'YYYY/MM/DD HH:mm')
  const slotEndDayjs = dayjs(`${slotDate} ${slotEnd}`, 'YYYY/MM/DD HH:mm')

  return start.isBefore(slotEndDayjs) && end.isAfter(slotStartDayjs)
}

// 檢查每個 timeSlot 是否與時間段重疊
function checkOverlaps({
  timeSlots,
  usedTimeSlots,
  targetDate,
}: {
  timeSlots: TimeSlot[]
  usedTimeSlots: TimeSlotFromAPI[]
  targetDate: string
}) {
  const now = dayjs()
  timeSlots.forEach((slot) => {
    let hasOverlap = false

    usedTimeSlots.forEach(({ startTime, endTime, date }) => {
      if (
        isInTimeSlotStrict({
          startTime,
          endTime,
          date,
          slotStart: slot.slotStart,
          slotEnd: slot.slotEnd,
          slotDate: targetDate,
        })
      ) {
        hasOverlap = true
      }
    })

    slot.isOverlap = hasOverlap

    // 檢查該時間區段是否已經過去
    let slotEndDayjs = dayjs(`${targetDate} ${slot.slotEnd}`, 'YYYY/MM/DD HH:mm')

    if (slot.slotEnd === '00:00') {
      slotEndDayjs = slotEndDayjs.add(1, 'day')
    }

    const isPast = slotEndDayjs.isBefore(now)
    slot.isPast = isPast

    // console.log(
    //   `區塊 ${targetDate} ${slot.slotStart} ~ ${
    //     slot.slotEnd === '00:00' ? '00:00 (隔日)' : slot.slotEnd
    //   } 重疊: ${slot.isOverlap} 是否已過去： ${slot.isPast}`
    // );
  })
}

// 生成一天內的 15,30,60 分鐘區塊，從 00:00 到 24:00
function generateTimeSlots({
  targetDate,
  timeSector,
}: {
  targetDate: string
  timeSector: number
}): TimeSlot[] {
  const slots = []
  let start = dayjs(`${targetDate} 00:00`, 'YYYY/MM/DD HH:mm')
  const end = dayjs(`${targetDate} 24:00`, 'YYYY/MM/DD HH:mm')

  while (start.isBefore(end)) {
    const slotEnd = start.add(timeSector, 'minute')

    slots.push({
      slotStart: start.format('HH:mm'),
      slotEnd: slotEnd.format('HH:mm'),
      isOverlap: false,
      isPast: false,
      date: targetDate,
    })

    start = slotEnd
  }
  return slots
}

// 解析時間字串，並且設定精確度
function parseTimeWithPrecision({
  dateStr,
  timeStr,
  format = 'YYYY/MM/DD HH:mm',
}: {
  dateStr: string
  timeStr: string
  format?: string
}) {
  return dayjs(`${dateStr} ${timeStr}`, format).startOf('second')
}

// 取得可選擇的開始時間選項
function getStartTimeOptions({
  allTimeSlots,
  targetDate,
  usedTimeSlots,
  isNowActive = true,
  timeSector,
  nowLabelStr = 'Now',
}: {
  allTimeSlots: TimeSlot[]
  targetDate: string
  usedTimeSlots: TimeSlotFromAPI[]
  timeSector: number
  isNowActive?: boolean
  nowLabelStr?: string
}): StartTimeOption[] {
  const today = dayjs().format('YYYY/MM/DD')
  const now = dayjs().second(0).startOf('second')

  if (!targetDate || dayjs(targetDate).isBefore(now, 'day')) return []

  const availableTimes = allTimeSlots
    .filter((slot) => {
      // 如果是今天，過濾掉已經過去的時間段
      if (targetDate === today) {
        const slotStartDayjs = dayjs(`${targetDate} ${slot.slotStart}`, 'YYYY/MM/DD HH:mm')
          .second(0)
          .startOf('second')
        return slotStartDayjs.isSameOrAfter(now)
      }
      // 非今天的時間段，直接回傳 true
      return true
    })
    .filter((slot) => !slot.isOverlap)
    .map((slot) => ({
      originalObj: slot,
      label: slot.slotStart,
      value: slot.slotStart,
      isNow: false,
      fullString: `${slot.date}_${slot.slotStart}-${slot.slotEnd}`,
    }))

  // 計算當前時間落在哪個時間區段
  const nowFormatted = now.format('HH:mm')
  const nowMinutes = now.minute()
  const nowSlotEnd = now
    .add(timeSector - (nowMinutes % timeSector), 'minute')
    .second(0)
    .startOf('second')
    .format('HH:mm')

  // 檢查 Now 所在的時間區段是否被佔用
  const isNowOccupied = usedTimeSlots.some(({ startTime, endTime, date }) => {
    if (date === today) {
      return isInTimeSlotStrict({
        startTime,
        endTime,
        date,
        slotStart: nowFormatted,
        slotEnd: nowSlotEnd,
        slotDate: today,
      })
    }
    return false
  })

  // isNow 所代表的時間段是否已存在
  const isNowAlreadyInList = availableTimes.some((time) => time.value === nowFormatted)

  // 用戶選擇開啟 && targetDate 是今天 && 不在重疊區間 && isNow 所代表的時間段不存在，才加入 "Now" 選項
  if (isNowActive && targetDate === today && !isNowOccupied && !isNowAlreadyInList) {
    availableTimes.unshift({
      label: `${nowLabelStr}`,
      value: 'Now',
      originalObj: {
        slotStart: nowFormatted,
        slotEnd: nowSlotEnd,
        date: today,
      },
      isNow: true,
      fullString: `${today}_${nowFormatted}-${nowSlotEnd}`,
    })
  }

  return availableTimes
}

// 取得可選擇的結束時間選項
function getEndTimeOptions({
  startTime,
  allTimeSlots,
  targetDate,
  usedTimeSlots,
  maxUsageHours = 24,
  minUsageHours = 0,
  timeSector,
  generateCrossDay = true,
  nextDayHintStr = '+1',
}: {
  startTime: string
  allTimeSlots: TimeSlot[]
  targetDate: string
  usedTimeSlots: TimeSlotFromAPI[]
  maxUsageHours?: number
  minUsageHours?: number
  timeSector: number
  generateCrossDay?: boolean
  nextDayHintStr?: string
}) {
  const now = dayjs()
  const isNow = startTime === 'Now'

  if (
    !targetDate ||
    !startTime ||
    dayjs(targetDate).isBefore(now, 'day') ||
    (dayjs(targetDate).isAfter(now, 'day') && isNow)
  ) {
    return []
  }

  const parseStartTime = ({
    isNow,
    targetDate,
    timeSector,
  }: {
    isNow: boolean
    targetDate: string
    timeSector: number
  }) => {
    if (isNow) {
      // 處理 "Now" 的選項，並精確到最近的 timeSector
      const minutes = now.minute()
      const diff = minutes % timeSector
      return now.subtract(diff, 'minute').second(0).startOf('second')
    } else {
      // 處理一般選項
      return parseTimeWithPrecision({
        dateStr: targetDate,
        timeStr: startTime,
      })
    }
  }

  const generateSameDayOptions = ({
    allTimeSlots,
    targetDate,
    startTimeDayjs,
  }: {
    allTimeSlots: TimeSlot[]
    targetDate: string
    startTimeDayjs: dayjs.Dayjs
  }) => {
    const endTimeOptions = []
    let sameDayBreak = false // 記錄是否因重疊而停止生成

    for (const slot of allTimeSlots) {
      let slotStartDayjs = parseTimeWithPrecision({
        dateStr: targetDate,
        timeStr: slot.slotStart,
      })

      if (slot.slotEnd === '00:00') {
        slotStartDayjs = slotStartDayjs.add(1, 'day')
      }

      // 只選在 startTime 之後的區段
      if (slotStartDayjs.isSameOrAfter(startTimeDayjs)) {
        if (slot.isOverlap) {
          sameDayBreak = true
          break
        }

        const label = slot.slotEnd === '00:00' ? `00:00 (${nextDayHintStr})` : slot.slotEnd
        endTimeOptions.push({
          originalObj: slot,
          label,
          value: slot.slotEnd,
        })
      }
    }
    return { endTimeOptions, sameDayBreak }
  }

  const generateNextDayOptions = ({
    startTimeDayjs,
    maxUsageHours,
    usedTimeSlots,
    timeSector,
    targetDate,
  }: {
    startTimeDayjs: dayjs.Dayjs
    maxUsageHours: number
    usedTimeSlots: TimeSlotFromAPI[]
    timeSector: number
    targetDate: string
  }) => {
    const endTimeOptions = []
    const nextDay = dayjs(targetDate).add(1, 'day').format('YYYY/MM/DD')
    const nextDayUsedTimeSlots = usedTimeSlots.filter((range) => range.date === nextDay)
    const maxEndTime = startTimeDayjs.add(maxUsageHours, 'hour')

    let nextDayStart = dayjs(`${nextDay} 00:00`, 'YYYY/MM/DD HH:mm')
    const nextDayEndLimit = nextDayUsedTimeSlots.length
      ? nextDayUsedTimeSlots.reduce(
          (earliest, range) => {
            const rangeStartTime = parseTimeWithPrecision({
              dateStr: nextDay,
              timeStr: range.startTime,
            })
            return rangeStartTime.isBefore(earliest) ? rangeStartTime : earliest
          },
          dayjs(`${nextDay} 24:00`, 'YYYY/MM/DD HH:mm'),
        )
      : dayjs(`${nextDay} 24:00`, 'YYYY/MM/DD HH:mm')

    const actualNextDayEndLimit = nextDayEndLimit.isBefore(maxEndTime)
      ? nextDayEndLimit
      : maxEndTime

    while (nextDayStart.isBefore(actualNextDayEndLimit)) {
      const slotEnd = nextDayStart.add(timeSector, 'minute')
      endTimeOptions.push({
        originalObj: {
          slotStart: nextDayStart.format('HH:mm'),
          slotEnd: slotEnd.format('HH:mm'),
          date: nextDay,
        },
        label: `${slotEnd.format('HH:mm')} (${nextDayHintStr})`,
        value: slotEnd.format('HH:mm'),
      })
      nextDayStart = slotEnd
    }

    return endTimeOptions
  }

  const filterEndTimeOptions = ({
    endTimeOptions,
    startTimeDayjs,
    minUsageHours,
    maxUsageHours,
    isNow = false,
  }: {
    endTimeOptions: EndTimeOption[]
    startTimeDayjs: dayjs.Dayjs
    minUsageHours: number
    maxUsageHours: number
    isNow: boolean
    nowDayjs: dayjs.Dayjs
  }) => {
    const filterByDuration = (endTimeDayjs: dayjs.Dayjs, referenceTime: dayjs.Dayjs) => {
      const durationInMinutes = endTimeDayjs.diff(referenceTime, 'minute')
      const durationInHours = durationInMinutes / 60
      return durationInHours >= minUsageHours && durationInHours <= maxUsageHours
    }

    return endTimeOptions.filter((option) => {
      let endTimeDayjs = dayjs(`${option.originalObj.date} ${option.value}`, 'YYYY/MM/DD HH:mm')

      if (option.originalObj.slotEnd === '00:00') {
        endTimeDayjs = endTimeDayjs.add(1, 'day')
      }

      // 根據是否為 "Now" 來決定參照時間
      const referenceTime = isNow ? now : startTimeDayjs

      return filterByDuration(endTimeDayjs, referenceTime)
    })
  }

  const startTimeDayjs = parseStartTime({
    isNow: startTime === 'Now',
    targetDate,
    timeSector,
  })

  const { endTimeOptions, sameDayBreak } = generateSameDayOptions({
    allTimeSlots,
    targetDate,
    startTimeDayjs,
  })

  if (generateCrossDay && !sameDayBreak) {
    const nextDayEndOptions = generateNextDayOptions({
      startTimeDayjs,
      maxUsageHours,
      usedTimeSlots,
      timeSector,
      targetDate,
    })
    endTimeOptions.push(...nextDayEndOptions)
  }

  return filterEndTimeOptions({
    endTimeOptions,
    startTimeDayjs,
    minUsageHours,
    maxUsageHours,
    isNow: startTime === 'Now',
    nowDayjs: now,
  })
}

export {
  checkOverlaps,
  generateTimeSlots,
  getEndTimeOptions,
  getStartTimeOptions,
  isInTimeSlotStrict,
  parseTimeWithPrecision,
}
