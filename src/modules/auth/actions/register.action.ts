import { tesloApi } from '@/api/tesloApi';
import type { AuthResponse } from '../interfaces';
import { isAxiosError } from 'axios';

export interface RegisterSuccess {
  ok: true;
  user: AuthResponse['user'];
  token: AuthResponse['token'];
}

interface RegisterError {
  ok: boolean;
  message: string[];
  error: string;
  statusCode: number;
}

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
): Promise<RegisterSuccess | RegisterError> => {
  try {
    const { data } = await tesloApi.post<AuthResponse>('/auth/register', {
      fullName,
      email,
      password,
    });

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return {
        ok: false,
        message: error.response.data.message,
        error: error.response.data.error,
        statusCode: error.response.status,
      };
    }
    console.log(error);
    throw new Error('No se pudo realizar la petición');
  }
};
