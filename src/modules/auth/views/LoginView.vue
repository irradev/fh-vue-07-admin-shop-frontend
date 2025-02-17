<template>
  <h1 class="text-2xl font-semibold mb-4 text-blue-700">Login</h1>
  <form @submit.prevent="onLogin">
    <!-- Email Input -->
    <div class="mb-4">
      <label for="email" class="block text-gray-600">Correo electrónico</label>
      <input
        v-model="myForm.email"
        ref="emailInputRef"
        type="email"
        id="email"
        name="email"
        class="w-full border border-gray-300 text-slate-700 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Password Input -->
    <div class="mb-4">
      <label for="password" class="block text-gray-600">Password</label>
      <input
        v-model="myForm.password"
        ref="passwordInputRef"
        type="password"
        id="password"
        name="password"
        class="w-full border border-gray-300 text-slate-700 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Remember Me Checkbox -->
    <div class="mb-4 flex items-center">
      <input
        v-model="myForm.rememberMe"
        type="checkbox"
        id="remember"
        name="remember"
        class="text-blue-500"
      />
      <label for="remember" class="text-gray-600 ml-2">Remember Me</label>
    </div>
    <!-- Forgot Password Link -->
    <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">Forgot Password?</a>
    </div>
    <!-- Login Button -->
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
    >
      Login
    </button>
  </form>
  <!-- Sign up  Link -->
  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'register' }" class="hover:underline">Sign up Here</RouterLink>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, watchEffect } from 'vue';
  import { useAuthStore } from '../stores/auth.store';
  import { useToast } from 'vue-toastification';

  const authStore = useAuthStore();
  const toast = useToast();

  const emailInputRef = ref<HTMLElement | null>(null);
  const passwordInputRef = ref<HTMLElement | null>(null);

  const myForm = reactive({
    email: '',
    password: '',
    rememberMe: false,
  });

  const onLogin = async () => {
    if (!myForm.email) {
      return emailInputRef.value?.focus();
    }

    if (!myForm.password) {
      return passwordInputRef.value?.focus();
    }

    if (myForm.rememberMe) {
      localStorage.setItem('email', myForm.email);
    } else {
      localStorage.removeItem('email');
    }

    const ok = await authStore.login(myForm.email, myForm.password);

    if (!ok) {
      toast.error('Usuario o contraseña incorrectos');
      return;
    }
  };

  watchEffect(() => {
    const email = localStorage.getItem('email');

    if (email) {
      myForm.email = email;
      myForm.rememberMe = true;
    }
  });
</script>
