<template>
  <div class="flex justify-center gap-2 py-10 bg-gray-100">
    <button
      :disabled="page === 1"
      @click="$router.push({ query: { page: page - 1 } })"
      class="button"
    >
      <ArrowLeftIcon />
      <span>Anteriores</span>
    </button>

    <button
      :disabled="isNoMoreData"
      @click="$router.push({ query: { page: page + 1 } })"
      class="button"
    >
      <span>Siguientes</span>
      <ArrowRightIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
  import ArrowLeftIcon from '@/icons/ArrowLeftIcon.vue';
  import ArrowRightIcon from '@/icons/ArrowRightIcon.vue';

  interface Props {
    page: number;
    isNoMoreData: boolean;
  }

  defineProps<Props>();
</script>

<style scoped>
  button {
    @apply flex items-center space-x-1.5 rounded-lg px-4 py-1.5 hover:bg-blue-700 text-white bg-blue-500 disabled:bg-gray-300  disabled:cursor-not-allowed transition-colors;
  }
</style>
