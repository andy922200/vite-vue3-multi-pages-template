<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  x: number
  y: number
  visible: boolean
}>()
</script>

<!-- Tooltip.vue -->
<template>
  <div
    v-if="visible"
    :style="{ left: `${props.x}px`, top: `${props.y}px` }"
    class="full-calendar__tooltip absolute z-[1000] rounded bg-[#333] p-2 text-xs text-white"
  >
    <slot />
  </div>
</template>
