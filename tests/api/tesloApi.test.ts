import { tesloApi } from '@/api/tesloApi';
import MockAdapter from 'axios-mock-adapter';

const mockTesloApi = new MockAdapter(tesloApi);

mockTesloApi.onGet('/test').reply(200, {
  msg: 'ok',
});

describe('tesloApi axios instance', () => {
  test('should have baseURL set to VITE_TESLO_APU_URL', () => {
    expect(tesloApi.defaults.baseURL).toBe(import.meta.env.VITE_TESLO_API_URL);
  });

  test('should set Authorization header with token from localhost', async () => {
    const token = 'myToken';
    localStorage.setItem('token', token);

    const resp = await tesloApi.get('/test');
    // console.log(resp.data);

    expect(resp.config.headers.Authorization).toBe(`Bearer ${token}`);
  });

  test('should not set Authorization header if token is not in LocalStorage', async () => {
    localStorage.removeItem('token');
    // localStorage.setItem('token', 'token123');

    const resp = await tesloApi.get('/test');

    expect(resp.config.headers.Authorization).toBeUndefined();
  });
});
