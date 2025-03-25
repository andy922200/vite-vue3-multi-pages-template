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
    <h1>Owner <span>inner</span></h1>
    <p class="text-class">
      {{ $t('owner') }}
    </p>
  </div>
</template>

<style scoped>
/* for using tailwindcss v4*/
@reference "@/assets/base.css";

.text-class {
  @apply text-gray-700;
}
</style>

<style scoped lang="scss">
/* for scss */
h1 {
  span {
    color: red;
  }
}
</style>
