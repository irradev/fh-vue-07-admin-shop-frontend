<template>
  <div>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :id="id"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value ?? '')"
      @blur="$emit('blur')"
      :class="[
        'form-control',
        {
          'border-red-500': error,
        },
        className,
      ]"
    ></textarea>
    <span class="text-sm text-red-500" v-show="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    modelValue?: string;
    placeholder?: string;
    id: string;
    error?: string;
    className?: string;
  }

  defineProps<Props>();
</script>

<style scoped>
  .form-control {
    @apply shadow h-32 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
  }
</style>
