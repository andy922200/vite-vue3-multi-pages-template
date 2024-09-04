<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import { INITIAL_EVENTS } from '@/components/event-utils'
import FullCalendar from '@/components/FullCalendar.vue'
import { saveLocale } from '@/plugins/i18n/entry'

import { useInitApp } from './composables/useInitApp'

const { initApp, currentLocale } = useInitApp()
const i18NInstance = getCurrentInstance()?.appContext?.config?.globalProperties?.$i18n

initApp()

watch(currentLocale, (newVal) => {
  saveLocale(newVal, i18NInstance, 'locale')
})

const eventCollection = ref(INITIAL_EVENTS)
const eventType = {
  green: '#27AE60',
  blue: '#2F80ED',
  orange: '#EB6615',
}

const generateContentAfterHeader = () => {
  let strHtml = `<div class="flex justify-end">`

  for (let [key, value] of Object.entries(eventType)) {
    strHtml += `
      <p class="px-1">
        <span class="inline-block rounded size-2" style="background-color: ${value}"></span>
        <span class="mx-1">${key}</span>
      </p>
    `
  }

  strHtml += `</div>`

  return strHtml
}
</script>

<template>
  <div>
    <h1>Owner</h1>
    <p class="text-gray-700">{{ $t('owner') }}</p>
    <div class="h-[60rem] max-w-7xl">
      <FullCalendar
        v-model:current-events="eventCollection"
        default-locale="zh-tw"
        :content-after-header="generateContentAfterHeader()"
      />
    </div>
  </div>
</template>
