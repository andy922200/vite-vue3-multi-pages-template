<script setup lang="ts">
import { watch } from 'vue'

import { useLanguage } from '@/composables/useLanguage'

import { useInitApp } from './composables/useInitApp'

const { initApp } = useInitApp()
const { currentLanguage, setLanguage } = useLanguage()

initApp()

watch(currentLanguage, (newVal) => {
  setLanguage(newVal)
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
