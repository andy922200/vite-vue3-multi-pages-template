<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, withDefaults } from 'vue'

import dayjs from '@/plugins/dayjs'

const props = withDefaults(
  defineProps<{
    lineColor?: string
    textColor?: string
    timeSlotInterval?: number
    minLabelSpacing?: number
    targetDate: string
    usedTimeIntervals?: { date: string; start: string; end: string }[]
    disabledTimeIntervals?: { date: string; start: string; end: string }[] // 傳入不可使用的時間區間
  }>(),
  {
    lineColor: '#cdcdcd',
    textColor: '#000000',
    timeSlotInterval: 15,
    minLabelSpacing: 30,
    usedTimeIntervals: () => [
      { date: '2024-09-11', start: '00:00', end: '02:00' },
      { date: '2024-09-11', start: '16:17', end: '18:38' },
    ],
    disabledTimeIntervals: () => [
      { date: '2024-09-11', start: '08:00', end: '09:00' },
      { date: '2024-09-11', start: '20:00', end: '21:00' },
    ],
  },
)

const visibleLabels = ref<number[]>([])
const timeSlots = computed(() => generateTimeSlots())

const updateVisibleLabels = () => {
  const container = document.querySelector('.time-slot')
  const timeCells = document.querySelectorAll('.time-cell')

  if (container && timeCells.length > 0) {
    const containerWidth = container.clientWidth
    const maxVisibleLabels = Math.floor(containerWidth / props.minLabelSpacing)

    const newVisibleLabels: number[] = []
    for (let i = 0; i < 24; i++) {
      if (i % Math.ceil(24 / maxVisibleLabels) === 0) {
        newVisibleLabels.push(i)
      }
    }
    visibleLabels.value = newVisibleLabels
  }
}

const shouldShowLabel = (index: number) => {
  const timeSlotsPerHour = 60 / props.timeSlotInterval
  const hour = Math.floor(index / timeSlotsPerHour)
  const minutes = (index % timeSlotsPerHour) * props.timeSlotInterval
  return minutes === 0 && visibleLabels.value.includes(hour)
}

const checkTimeSlotStatus = (slotStart: dayjs.Dayjs, slotEnd: dayjs.Dayjs) => {
  let isUsed = false
  let isDisabled = false

  const combinedIntervals = [
    ...props.usedTimeIntervals.map((interval) => ({ ...interval, type: 'used' })),
    ...props.disabledTimeIntervals.map((interval) => ({ ...interval, type: 'disabled' })),
  ]

  combinedIntervals.forEach((interval) => {
    if (interval.date !== props.targetDate) return

    const intervalStart = dayjs(`${interval.date} ${interval.start}`, 'YYYY-MM-DD HH:mm')
    const intervalEnd = dayjs(`${interval.date} ${interval.end}`, 'YYYY-MM-DD HH:mm')

    if (slotEnd.isAfter(intervalStart, 'minute') && slotStart.isBefore(intervalEnd, 'minute')) {
      if (interval.type === 'used') isUsed = true
      if (interval.type === 'disabled') isDisabled = true
    }
  })

  return { isUsed, isDisabled }
}

const generateTimeSlots = () => {
  const slots = []
  const startOfDay = dayjs(props.targetDate).startOf('day')
  const slotInterval = props.timeSlotInterval
  const totalMinutesInDay = 24 * 60
  const currentTime = dayjs()

  for (let minute = 0; minute < totalMinutesInDay; minute += slotInterval) {
    const slotStart = startOfDay.add(minute, 'minute')
    const slotEnd = slotStart.add(slotInterval, 'minute')
    const time = slotStart.format('HH:mm')
    const { isUsed, isDisabled } = checkTimeSlotStatus(slotStart, slotEnd)
    const isPast = slotEnd.isBefore(currentTime, 'minute')

    slots.push({ time, isUsed, isPast, isDisabled })
  }

  return slots
}

onMounted(() => {
  window.addEventListener('resize', updateVisibleLabels)
  updateVisibleLabels()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateVisibleLabels)
})
</script>

<template>
  <div class="time-slot mb-6 mt-2 w-full px-4">
    <div class="flex w-full items-center rounded shadow">
      <div
        v-for="(slot, index) in timeSlots"
        :key="index"
        :data-text="shouldShowLabel(index) ? slot.time.split(':')[0] : ''"
        :class="[
          'time-cell relative h-6 flex-1 border-y',
          slot.isDisabled ? 'cursor-not-allowed bg-gray-400' : '',
          slot.isUsed ? 'border-y-[#fdeadb] bg-[#fdeadb]' : 'bg-gray-100',
          slot.isPast ? 'opacity-50' : '',
          index === 0 ? 'no-shadow rounded-l border-l' : '',
          index === timeSlots.length - 1 ? 'no-shadow rounded-r border-r' : '',
        ]"
        :style="{
          '--time-slot__line-color': props.lineColor,
          '--time-slot__text-color': props.textColor,
        }"
      >
        <span v-if="slot.time.endsWith(':00') && index !== 0" class="after-line top-1.5 h-3" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.time-cell {
  &:before {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 110%;
    scale: 0.75;
    transform: translateX(-75%);
    color: var(--time-slot__text-color);
  }

  &:last-child {
    &:after {
      content: '24';
      position: absolute;
      right: 0;
      top: 110%;
      scale: 0.75;
      text-align: right;
      transform: translateX(60%);
      color: var(--time-slot__text-color);
    }
  }
}

.after-line {
  position: absolute;
  content: '';
  width: 1px;
  background-color: var(--time-slot__line-color);
  left: 0;
}
</style>
