<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { LayoutLanguages } from '@/plugins/i18n/config/locales'
import { saveLocale } from '@/plugins/i18n/entry'
import { useInitApp } from './composables/useInitApp'

const { initApp, currentLocale } = useInitApp()
const i18NInstance = getCurrentInstance()?.appContext?.config?.globalProperties?.$i18n

initApp()
</script>

<template>
  <header class="line-height[1.5] max-h-screen justify-center lg:flex lg:items-center">
    <img
      alt="Vue logo"
      class="mx-auto mb-8 block size-32 lg:mx-0 lg:mb-0 lg:mr-8"
      src="@/assets/logo.svg?url"
    />

    <div class="wrapper lg:flex lg:flex-wrap lg:items-start">
      <nav
        class="mt-8 w-full text-center text-sm lg:-ml-4 lg:mt-4 lg:py-4 lg:text-left lg:text-base"
      >
        <RouterLink
          class="inline-block border-l border-[var(--color-border)] px-4 first-of-type:border-0"
          to="/"
        >
          Home
        </RouterLink>
        <RouterLink
          class="inline-block border-l border-[var(--color-border)] px-4 first-of-type:border-0"
          to="/about"
        >
          About
        </RouterLink>
        <a
          class="inline-block border-l border-[var(--color-border)] px-4 first-of-type:border-0"
          href="./owner"
          >Owner Page</a
        >
      </nav>
    </div>

    <select v-model="currentLocale" @change="saveLocale(currentLocale, i18NInstance, 'locale')">
      <option v-for="item in LayoutLanguages" :key="item.param" :value="item.param">
        {{ item.title }}
      </option>
    </select>
  </header>

  <RouterView />
</template>
