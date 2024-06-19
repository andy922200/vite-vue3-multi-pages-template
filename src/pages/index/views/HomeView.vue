<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from '../stores/counter'

const counterStore = useCounterStore()
const { count, doubleCount } = storeToRefs(counterStore)
</script>

<template>
  <main>
    <button
      class="rounded border border-gray-800 p-4 hover:bg-red-300 hover:text-white"
      @click="counterStore.increment"
    >
      Increment +
    </button>
    <p class="text-gray-500">Count: {{ count }}</p>
    <p class="text-green-500">DoubleCount: {{ doubleCount }}</p>
  </main>
</template>
