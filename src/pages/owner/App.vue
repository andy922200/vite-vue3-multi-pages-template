<script setup lang="ts">
import { getCurrentInstance, watch } from 'vue'

import { saveLocale } from '@/plugins/i18n/entry'

import { useInitApp } from './composables/useInitApp'
import TimeSlot from './TimeSlot.vue'

const { initApp, currentLocale } = useInitApp()
const i18NInstance = getCurrentInstance()?.appContext?.config?.globalProperties?.$i18n

initApp()

watch(currentLocale, (newVal) => {
  saveLocale(newVal, i18NInstance, 'locale')
})
</script>

<template>
  <div>
    <h1>Owner</h1>
    <p class="text-gray-700">{{ $t('owner') }}</p>
    <TimeSlot class="w-full" target-date="2024-09-11" />
  </div>
</template>
