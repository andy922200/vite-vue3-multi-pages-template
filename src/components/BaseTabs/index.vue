<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({
  name: 'BaseTabs',
})

const props = withDefaults(
  defineProps<{
    tabs: { id: string; label: string }[]
    activeTabId?: string
    activeTabCss?: string
    inActiveTabCss?: string
    headerClass?: string
    tabContentClass?: string
  }>(),
  {
    tabs: () => [],
    activeTabId: undefined,
    activeTabCss: 'border-blue-600 text-blue-600',
    inActiveTabCss: 'text-gray-600',
    headerClass: '',
    tabContentClass: '',
  },
)

const emits = defineEmits<{
  'update:activeTabId': [value: string | undefined]
}>()

const isControlled = computed(() => props.activeTabId !== undefined)
const localValue = ref(props.activeTabId)

const internalTabId = computed({
  get: () => (isControlled.value ? props.activeTabId : localValue.value),
  set: (value) => {
    isControlled.value ? emits('update:activeTabId', value) : (localValue.value = value)
    emits('update:activeTabId', value)
  },
})

const setActiveTabId = (index: string) => {
  internalTabId.value = index
}
</script>

<template>
  <div class="base-tab__wrapper w-full">
    <!-- Tabs Header -->
    <div class="flex w-fit rounded-t border" :class="props.headerClass">
      <button
        v-for="tab in props.tabs"
        :key="tab.id"
        :class="[
          'px-4 py-2 focus:outline-none',
          internalTabId === tab.id
            ? ['-mb-px', 'border-b-1', 'clip-path-rounded-top', props.activeTabCss]
            : ['border-b-0', props.inActiveTabCss],
        ]"
        @click="setActiveTabId(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tabs Content -->
    <div class="p-4" :class="props.tabContentClass">
      <slot :name="`tab-${internalTabId}`"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.clip-path-rounded-top {
  clip-path: inset(0px 0px -5px 0px round 0.5rem 0.5rem 0 0);
}
</style>
