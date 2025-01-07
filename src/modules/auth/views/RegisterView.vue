<template>
  <h1 class="text-2xl font-semibold mb-4 text-blue-500">Nueva cuenta</h1>
  <form @submit.prevent="onRegister">
    <!-- Username Input -->
    <div class="mb-4">
      <label for="name" class="block text-gray-600">Nombre</label>
      <input
        v-model="myForm.name"
        ref="nameInputRef"
        type="text"
        id="name"
        name="name"
        class="w-full border text-slate-700 border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>

    <!-- Email Input -->
    <div class="mb-4">
      <label for="email" class="block text-gray-600">Correo</label>
      <input
        v-model="myForm.email"
        ref="emailInputRef"
        type="email"
        id="email"
        name="email"
        class="w-full border text-slate-700 border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Password Input -->
    <div class="mb-4">
      <label for="password" class="block text-gray-600">Contraseña</label>
      <input
        v-model="myForm.password"
        ref="passwordInputRef"
        type="password"
        id="password"
        name="password"
        class="w-full border text-slate-700 border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>

    <!-- Forgot Password Link -->
    <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">¿Olvidó la contraseña?</a>
    </div>
    <!-- Login Button -->
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
    >
      Crear cuenta
    </button>
  </form>
  <!-- Sign up  Link -->
  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'login' }" class="hover:underline">Ingresar por aquí</RouterLink>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useAuthStore } from '../stores/auth.store';
  import { useToast } from 'vue-toastification';

  const authStore = useAuthStore();
  const toast = useToast();

  const emailInputRef = ref<HTMLElement | null>(null);
  const passwordInputRef = ref<HTMLElement | null>(null);
  const nameInputRef = ref<HTMLElement | null>(null);

  const myForm = reactive({
    email: '',
    password: '',
    name: '',
  });

  const onRegister = async () => {
    if (!myForm.name || myForm.name.length < 2) {
      return nameInputRef.value?.focus();
    }

    if (!myForm.email) {
      return emailInputRef.value?.focus();
    }

    if (!myForm.password) {
      return passwordInputRef.value?.focus();
    }

    console.log(myForm);
    const { ok, message } = await authStore.register(myForm.name, myForm.email, myForm.password);

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success('Cuenta creada exitosamente');

    resetForm();
  };

  const resetForm = () => {
    myForm.email = '';
    myForm.password = '';
    myForm.name = '';
  };
</script>
