<script setup lang="ts" generic="T">
import Multiselect from '@vueform/multiselect'
import { ref, computed, withDefaults, defineProps, defineEmits } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: any
    optionData?: T[]
    settings?: Omit<Multiselect['$props'], 'modelValue' | 'value' | 'options'>
    wrapperClass?: string
  }>(),
  {
    modelValue: undefined,
    optionData: () => [],
    settings: () => ({}),
    wrapperClass: '',
  },
)

const emits = defineEmits<{
  'update:modelValue': [value: any]
  localValueChange: [value: any]
  change: [{ value: any; instance: Multiselect }]
  select: [{ value: any; option: T; instance: Multiselect }]
  deselect: [{ value: any; option: T; instance: Multiselect }]
  searchChange: [{ query: string; instance: Multiselect }]
  paste: [{ e: Event; instance: Multiselect }]
  keydown: [{ e: Event; instance: Multiselect }]
  keyup: [{ e: Event; instance: Multiselect }]
  open: [{ instance: Multiselect }]
  close: [{ instance: Multiselect }]
  clear: [{ instance: Multiselect }]
  max: [{ instance: Multiselect }]
}>()

const isControlled = computed(() => props.modelValue !== undefined)
const localValue = ref(undefined)

const internalValue = computed({
  get: () => (isControlled.value ? props.modelValue : localValue.value),
  set: (value) => {
    isControlled.value ? emits('update:modelValue', value) : (localValue.value = value)
    emits('localValueChange', value)
  },
})
</script>

<template>
  <div class="select__wrapper" :class="wrapperClass">
    <Multiselect
      v-model="internalValue"
      :options="optionData"
      v-bind="props.settings"
      @change="(value, select$) => emits('change', { value, instance: select$ })"
      @select="(value, option, select$) => emits('select', { value, option, instance: select$ })"
      @deselect="
        (value, option, select$) => emits('deselect', { value, option, instance: select$ })
      "
      @search-change="(query, select$) => emits('searchChange', { query, instance: select$ })"
      @paste="(e, select$) => emits('paste', { e, instance: select$ })"
      @keydown="(e, select$) => emits('keydown', { e, instance: select$ })"
      @keyup="(e, select$) => emits('keyup', { e, instance: select$ })"
      @open="(select$) => emits('open', { instance: select$ })"
      @close="(select$) => emits('close', { instance: select$ })"
      @clear="(select$) => emits('clear', { instance: select$ })"
      @max="(select$) => emits('max', { instance: select$ })"
    >
      <template #placeholder>
        <slot name="placeholder" />
      </template>
      <template #afterlist="{ options }: { options: T[] }">
        <slot name="afterlist" v-bind="options" />
      </template>
      <template #beforelist="{ options }: { options: T[] }">
        <slot name="beforelist" v-bind="options" />
      </template>
      <template #multiplelabel="{ values }">
        <slot name="multiplelabel" v-bind="values" />
      </template>
      <template #singlelabel="{ value }">
        <slot name="singlelabel" v-bind="{ value }" />
      </template>
      <template
        #option="{
          option,
          isPointed,
          isSelected,
          search,
        }: {
          option: T
          isSelected: (option: T) => boolean
          isPointed: (option: T) => boolean
          search: null | string
        }"
      >
        <slot name="option" v-bind="{ option, isPointed, isSelected, search }" />
      </template>
      <template
        #grouplabel="{
          group,
          isSelected,
          isPointed,
        }: {
          group: any
          isSelected: (option: T) => boolean
          isPointed: (option: T) => boolean
        }"
      >
        <slot
          name="grouplabel"
          v-bind="{
            group,
            isSelected,
            isPointed,
          }"
        />
      </template>
      <template
        #tag="{
          option,
          handleTagRemove,
          disabled,
        }: {
          option: T
          handleTagRemove: (option: T, e: Event) => void
          disabled: boolean
        }"
      >
        <slot
          name="tag"
          v-bind="{
            option,
            handleTagRemove,
            disabled,
          }"
        />
      </template>
      <template #infinite>
        <slot name="infinite" />
      </template>
      <template #nooptions>
        <slot name="nooptions" />
      </template>
      <template #noresults>
        <slot name="noresults" />
      </template>
      <template
        #caret="{ handleCaretClick, isOpen }: { handleCaretClick: () => void; isOpen: boolean }"
      >
        <slot name="caret" v-bind="{ handleCaretClick, isOpen }" />
      </template>
      <template #clear="{ clear }: { clear: () => void }">
        <slot name="clear" v-bind="clear" />
      </template>
      <template #spinner>
        <slot name="spinner" />
      </template>
    </Multiselect>
  </div>
</template>

<style>
@import '@vueform/multiselect/themes/default.css';
</style>
