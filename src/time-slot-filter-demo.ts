import {
  checkOverlaps,
  generateTimeSlots,
  getEndTimeOptions,
  getStartTimeOptions,
} from '@/helpers/time-slot-filter'

const selectedDate = '2024/09/09'
const selectedStartTime = 'Now'
const maxUsageHours = 24
const minUsageHours = 0.5 // 「 minUsageHours === 0 a.k.a. 忽略最短時租 」
const timeSector = 30
const generateCrossDay = true
const isNowActive = true

// 已使用的時間段
const usedTimeSlots = [
  { startTime: '01:05', endTime: '02:15', date: '2024/09/08' },
  { startTime: '17:30', endTime: '18:00', date: '2024/09/08' },
  { startTime: '19:00', endTime: '19:50', date: '2024/09/08' },
  { startTime: '21:31', endTime: '22:40', date: '2024/09/08' },
  { startTime: '23:05', endTime: '23:10', date: '2024/09/08' },
  { startTime: '10:20', endTime: '11:04', date: '2024/09/09' },
  { startTime: '09:00', endTime: '09:30', date: '2024/09/09' },
  { startTime: '13:09', endTime: '13:30', date: '2024/09/09' },
  { startTime: '16:09', endTime: '17:30', date: '2024/09/09' },
]

const timeSlots = generateTimeSlots({ targetDate: selectedDate, timeSector })
checkOverlaps({
  timeSlots,
  usedTimeSlots,
  targetDate: selectedDate,
})

const startTimeOptions = getStartTimeOptions({
  allTimeSlots: timeSlots,
  targetDate: selectedDate,
  usedTimeSlots,
  isNowActive,
  timeSector,
  nowLabelStr: '即刻',
})

const endTimeOptions = getEndTimeOptions({
  startTime: selectedStartTime,
  allTimeSlots: timeSlots,
  targetDate: selectedDate,
  usedTimeSlots,
  maxUsageHours,
  minUsageHours,
  timeSector,
  generateCrossDay,
  nextDayHintStr: '隔日',
})

console.log('可用的 startTime 選項:', startTimeOptions)
console.log(`可選的 endTime 選項（在 ${selectedStartTime} 之後）:`, endTimeOptions)
