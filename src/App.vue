<template>
  <FullScreenLoader v-if="authStore.authStatus === AuthStatus.Checking" />
  <router-view></router-view>
  <VueQueryDevtools />
</template>

<script setup lang="ts">
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
  import { useAuthStore } from './modules/auth/stores/auth.store';
  import { AuthStatus } from './modules/auth/interfaces';
  import { useRoute, useRouter } from 'vue-router';
  import FullScreenLoader from './modules/common/components/FullScreenLoader.vue';

  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  // authStore.$subscribe((mutations, state) => {
  authStore.$subscribe(
    (_, state) => {
      if (state.authStatus === AuthStatus.Checking) {
        // Timeout solo para ver el loader
        setTimeout(() => {
          authStore.checkAuthStatus();
        }, 1000);
        return;
      }

      if (route.path.includes('/auth') && state.authStatus === AuthStatus.Authenticated) {
        router.replace({ name: 'home' });

        return;
      }
    },
    {
      immediate: true,
    },
  );
</script>
