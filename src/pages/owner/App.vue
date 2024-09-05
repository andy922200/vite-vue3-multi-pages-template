<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import BaseTabs from '@/components/BaseTabs/index.vue'
import { saveLocale } from '@/plugins/i18n/entry'

import { useInitApp } from './composables/useInitApp'

const { initApp, currentLocale } = useInitApp()
const i18NInstance = getCurrentInstance()?.appContext?.config?.globalProperties?.$i18n

initApp()

watch(currentLocale, (newVal) => {
  saveLocale(newVal, i18NInstance, 'locale')
})

const tabsData = [
  { id: '1', label: 'Tab 1' },
  { id: '2', label: 'Tab 2' },
  { id: '3', label: 'Tab 3' },
]
const activeTab = ref('1')
</script>

<template>
  <div class="p-1">
    <h1>Owner</h1>
    <p class="text-gray-700">{{ $t('owner') }}</p>

    <div class="w-1/2">
      <BaseTabs
        v-model:activeTabId="activeTab"
        :tabs="tabsData"
        header-class="border-[orange]"
        active-tab-css="bg-white text-[orange] border-[orange]"
        in-active-tab-css="text-white hover:text-white bg-[orange]"
        tab-content-class="border border-[orange] rounded-r rounded-bl"
      >
        <template #tab-1>
          <p>這是 Tab 1 的自訂內容</p>
        </template>
        <template #tab-2>
          <p>這是 Tab 2 的自訂內容</p>
        </template>
        <template #tab-3>
          <p>這是 Tab 3 的自訂內容</p>
        </template>
      </BaseTabs>
    </div>
  </div>
</template>
