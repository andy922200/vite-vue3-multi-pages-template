<script setup lang="ts">
import { getCurrentInstance, watch } from 'vue'

import { saveLocale } from '@/plugins/i18n/entry'

import { useInitApp } from './composables/useInitApp'

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
    <p class="text-gray-700">
      {{ $t('owner') }}
    </p>
  </div>
</template>
