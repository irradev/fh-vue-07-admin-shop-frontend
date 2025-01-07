import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { AuthStatus, type User } from '../interfaces';
import { checkAuthAction, loginAction } from '../actions';
import { registerAction, type RegisterSuccess } from '../actions/register.action';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<User | undefined>();
  const token = ref(useLocalStorage('token', ''));

  const login = async (email: string, password: string) => {
    try {
      const loginResponse = await loginAction(email, password);

      if (!loginResponse.ok) {
        return logout();
      }

      user.value = loginResponse.user;
      token.value = loginResponse.token;
      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch (error) {
      return logout();
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<{
    ok: boolean;
    message: string;
  }> => {
    try {
      const registerResponse = await registerAction(fullName, email, password);

      if (!registerResponse.ok) {
        return {
          ok: false,
          message: registerResponse.message[0],
        };
      }

      user.value = (registerResponse as RegisterSuccess).user;
      token.value = (registerResponse as RegisterSuccess).token;
      authStatus.value = AuthStatus.Authenticated;

      return {
        ok: true,
        message: 'Cuenta creada exitosamente',
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: 'No se pudo crear la cuenta',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    authStatus.value = AuthStatus.NotAuthenticated;
    user.value = undefined;
    token.value = '';

    return false;
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResponse = await checkAuthAction();

      if (!statusResponse.ok) {
        logout();
        return false;
      }

      user.value = statusResponse.user;
      token.value = statusResponse.token;
      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch (error) {
      console.log(error);
      logout();
      return false;
    }
  };

  return {
    user,
    token,
    authStatus,

    // Getters
    isCheckingAuth: computed(() => authStatus.value === AuthStatus.Checking),
    isAuth: computed(() => authStatus.value === AuthStatus.Authenticated),
    isNotAuth: computed(() => authStatus.value === AuthStatus.NotAuthenticated),
    isAdmin: computed(() => user.value?.roles.includes('admin') || false),

    username: computed(() => user.value?.fullName),

    // Actions
    login,
    register,
    checkAuthStatus,
    logout,
  };
});
