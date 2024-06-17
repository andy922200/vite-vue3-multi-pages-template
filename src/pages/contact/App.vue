<script setup lang="ts">
import { useInitApp } from './composables/useInitApp'

const { initApp } = useInitApp()

initApp()
</script>

<template>
  <div>
    <h1>Contact</h1>
    <p>Send us a message!</p>
  </div>
</template>
