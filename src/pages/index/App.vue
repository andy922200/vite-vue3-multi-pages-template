<script setup lang="ts">
import { watch, getCurrentInstance } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useInitApp } from '@/composables/useInitApp'
import { LayoutLanguages } from '@/plugins/i18n/config/locales'
import { saveLocale } from '@/plugins/i18n/entry'

const { initApp, currentLocale } = useInitApp()
const i18NInstance = getCurrentInstance()?.appContext?.config?.globalProperties?.$i18n

initApp()

watch(currentLocale, (newVal) => {
  saveLocale(newVal, i18NInstance, 'locale')
})
</script>

<template>
  <header class="line-height[1.5] justify-center max-h-screen lg:flex lg:items-center">
    <img
      alt="Vue logo"
      class="block mx-auto mb-8 lg:mx-0 lg:mb-0 lg:mr-8 w-32 h-32"
      src="@/assets/logo.svg"
    />

    <div class="wrapper lg:flex lg:items-start lg:flex-wrap">
      <nav
        class="w-full text-center mt-8 text-sm lg:text-left lg:-ml-4 lg:text-base lg:py-4 lg:mt-4"
      >
        <RouterLink
          class="inline-block px-4 border-l border-[var(--color-border)] first-of-type:border-0"
          to="/"
        >
          Home
        </RouterLink>
        <RouterLink
          class="inline-block px-4 border-l border-[var(--color-border)] first-of-type:border-0"
          to="/about"
        >
          About
        </RouterLink>
        <a
          class="inline-block px-4 border-l border-[var(--color-border)] first-of-type:border-0"
          href="./owner"
          >Owner Page</a
        >
      </nav>
    </div>

    <select v-model="currentLocale">
      <option v-for="item in LayoutLanguages" :key="item.param" :value="item.param">
        {{ item.title }}
      </option>
    </select>
  </header>

  <RouterView />
</template>
