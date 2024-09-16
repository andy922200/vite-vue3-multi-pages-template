<script setup lang="ts">
import {
  CalendarApi,
  CalendarOptions,
  DateSelectArg,
  DatesSetArg,
  EventApi,
  EventClickArg,
  EventInput,
  EventMountArg,
  PluginDef,
} from '@fullcalendar/core'
import allLocales from '@fullcalendar/core/locales-all'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import { computed, onMounted, ref, watchEffect } from 'vue'

import FullCalendarTooltip from './FullCalendarTooltip.vue'

const fullCalendarDom = ref<HTMLElement | null>(null)
const hideTooltipTimeout = ref<number | undefined>(undefined)
const tooltipVisible = ref(false)
const tooltipContent = ref('')
const tooltipPosition = ref({ x: 0, y: 0 })

type FullCalendarPluginType = 'interaction' | 'daygrid' | 'timegrid'

const props = withDefaults(
  defineProps<{
    activePlugins?: FullCalendarPluginType[]
    currentEvents?: EventInput[] | undefined
    options?: Omit<CalendarOptions, 'plugins' | 'initialEvents' | 'headerToolbar' | 'validRange'>
    defaultLocale?: string
    headerToolbar?: CalendarOptions['headerToolbar']
    contentAfterHeader?: string
    validRange?: CalendarOptions['validRange']
  }>(),
  {
    activePlugins: () => ['daygrid', 'timegrid', 'interaction'],
    currentEvents: undefined,
    defaultLocale: 'en',
    headerToolbar: () => ({
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    }),
    options: () => ({
      initialView: 'dayGridMonth',
      selectable: true,
      dayMaxEvents: true,
      weekends: true,
    }),
    contentAfterHeader: '',
    validRange: undefined,
  },
)

const emits = defineEmits<{
  'update:currentEvents': [value: EventInput[] | undefined]
  'update:handleEventClick': [value: EventClickArg]
  'update:handleDateSelect': [value: { original: DateSelectArg; calendarApi: CalendarApi }]
  'update:handleDatesSet': [value: { info: DatesSetArg; calendarApi: CalendarApi }]
}>()

const calendarLang = computed(() => props.defaultLocale)
const isControlled = computed(() => props.currentEvents !== undefined)
const localValue = ref<EventInput[] | undefined>([])

const internalValue = computed({
  get: () => (isControlled.value ? props.currentEvents : localValue.value),
  set: (value) => {
    isControlled.value ? emits('update:currentEvents', value) : (localValue.value = value)
  },
})

const handleDateSelect = (selectInfo: DateSelectArg) => {
  const calendarApi = selectInfo.view.calendar
  emits('update:handleDateSelect', { original: selectInfo, calendarApi })
  calendarApi.unselect() // clear date select after trigger
}

const handleEventClick = (clickInfo: EventClickArg) => {
  emits('update:handleEventClick', clickInfo)
}

const handleEventDidMount = (info: EventMountArg) => {
  addHoverTooltip({
    referenceEl: info.el,
    content: info.event.title || '無描述',
    viewMode: info.view.type,
  })
}

const handleDatesSetTrigger = (info: DatesSetArg) => {
  const calendarApi = info.view.calendar
  emits('update:handleDatesSet', { info, calendarApi })
}

const isFullCalendarPopoverOpen = () => {
  return document.querySelector('.fc-popover') !== null
}

const addHoverTooltip = ({
  referenceEl,
  content,
  viewMode,
}: {
  referenceEl: HTMLElement
  content: string
  viewMode: string
}) => {
  if (viewMode !== 'dayGridMonth' || isFullCalendarPopoverOpen()) return

  const showTooltip = () => {
    const rect = referenceEl.getBoundingClientRect()
    tooltipContent.value = content
    tooltipPosition.value = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 30,
    }
    tooltipVisible.value = true
  }

  const hideTooltip = () => {
    hideTooltipTimeout.value = window.setTimeout(() => {
      tooltipVisible.value = false
    }, 500)
  }

  referenceEl.addEventListener('mouseenter', showTooltip)
  referenceEl.addEventListener('mouseleave', hideTooltip)
}

const handleEvents = (events: EventApi[]) => {
  internalValue.value = events.map((event) => event.toPlainObject())
}

const injectContentAfterHeader = () => {
  const calendarEl = document.querySelector('.fc-toolbar')
  const customContent = document.createElement('div')

  customContent.className = 'w-full mb-2 md:my-2'
  customContent.innerHTML = props.contentAfterHeader

  if (calendarEl) {
    calendarEl.insertAdjacentElement('afterend', customContent)
  }
}

const getPlugins = (plugins: FullCalendarPluginType[]): PluginDef[] => {
  const pluginMap: Record<FullCalendarPluginType, PluginDef> = {
    interaction: interactionPlugin,
    daygrid: dayGridPlugin,
    timegrid: timeGridPlugin,
  }

  return plugins.map((plugin) => pluginMap[plugin]).filter(Boolean)
}

const calendarOptions = ref<CalendarOptions>({
  plugins: getPlugins(props.activePlugins),
  locales: allLocales,
  locale: calendarLang.value,
  height: 'calc(100% - 0.5rem)',
  ...props.options,
  headerToolbar: props.headerToolbar,
  initialEvents: internalValue.value,
  validRange: props.validRange,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  eventDidMount: handleEventDidMount,
  datesSet: handleDatesSetTrigger,
})

watchEffect(() => {
  calendarOptions.value.locale = calendarLang.value
})

onMounted(() => {
  injectContentAfterHeader()
})
</script>

<template>
  <div class="full-calendar flex size-full items-center px-2 text-sm">
    <FullCalendar ref="fullCalendarDom" :options="calendarOptions">
      <template #eventContent="arg">
        <div class="flex w-full items-center px-1">
          <span
            class="custom-dot inline-block size-2 min-w-2 rounded-full"
            :style="{ backgroundColor: arg.backgroundColor }"
          />
          <p class="grow truncate px-1">{{ arg.event.title }}</p>
        </div>
      </template>
    </FullCalendar>

    <FullCalendarTooltip :x="tooltipPosition.x" :y="tooltipPosition.y" :visible="tooltipVisible">
      {{ tooltipContent }}
    </FullCalendarTooltip>
  </div>
</template>

<style lang="scss" scoped>
/* full-calendar root */
.fc {
  width: 100%;

  :deep(.fc-header-toolbar):nth-child(1) {
    margin-bottom: 0;
    flex-wrap: wrap;

    @media screen and (min-width: 768px) {
      flex-wrap: nowrap;
    }
  }

  :deep(.fc-toolbar-chunk):nth-child(1) {
    width: 50%;
    order: 1;

    @media screen and (min-width: 768px) {
      width: auto;
      order: initial;
    }
  }

  :deep(.fc-toolbar-chunk):nth-child(2) {
    width: 100%;
    order: 3;
    margin: 0.5rem 0;
    text-align: center;

    @media screen and (min-width: 768px) {
      width: auto;
      order: initial;
      margin: 0;
      text-align: left;
    }
  }

  :deep(.fc-toolbar-chunk):nth-child(3) {
    width: 50%;
    order: 2;
    display: flex;
    justify-content: flex-end;

    @media screen and (min-width: 768px) {
      width: auto;
      order: initial;
    }
  }
}
</style>
