<template>
  <div>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :id="id"
      @input="
        $emit(
          'update:modelValue',
          type === 'number'
            ? +($event.target as HTMLInputElement).value || 0
            : ($event.target as HTMLInputElement).value || '',
        )
      "
      @blur="$emit('blur')"
      :class="[
        'form-control',
        {
          'border-red-500': error,
        },
      ]"
    />
    <span class="text-sm text-red-500" v-show="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    id?: string;
    modelValue?: string | number;
    error?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    placeholder?: string;
  }

  withDefaults(defineProps<Props>(), {
    type: 'text',
  });

  defineEmits(['update:modelValue', 'blur']);
</script>

<style scoped>
  .form-control {
    @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
  }
</style>
