import { tesloApi } from '@/api/tesloApi';
import type { AuthResponse } from '../interfaces';
import { isAxiosError } from 'axios';

interface CheckStatusError {
  ok: false;
}

interface CheckStatusSuccess {
  ok: true;
  user: AuthResponse['user'];
  token: AuthResponse['token'];
}

export const checkAuthAction = async (): Promise<CheckStatusError | CheckStatusSuccess> => {
  try {
    const localToken = localStorage.getItem('token');

    if (!localToken || (localToken && localToken.length < 10)) {
      return {
        ok: false,
      };
    }

    const { data } = await tesloApi.get<AuthResponse>('/auth/check-status');

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.log(error);

    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
      };
    }

    throw new Error('No se pudo verificar la sesión');
  }
};
