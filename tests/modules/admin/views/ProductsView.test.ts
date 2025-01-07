import { shallowMount } from '@vue/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { tesloApi } from '@/api/tesloApi';
import ProductsView from '@/modules/admin/views/ProductsView.vue';
import { fakeProducts } from '../../../_mockData/fakeProducts';
import type { Mock } from 'vitest';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { createRouter, createWebHistory } from 'vue-router';

const tesloApiMock = new MockAdapter(tesloApi);

tesloApiMock.onGet('/products?limit=10&offset=0').reply(200, []);
tesloApiMock.onGet('/products?limit=10&offset=10').reply(200, []);

vi.mock('@tanstack/vue-query', () => {
  return {
    useQueryClient: vi.fn().mockReturnValue({ prefetchQuery: vi.fn() }),
    useQuery: vi.fn(),
  };
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: ProductsView,
    },
  ],
});

describe('<ProductsView />', () => {
  (useQuery as Mock).mockReturnValue({
    data: fakeProducts,
    isLoading: false,
    isError: false,
  });

  window.scrollTo = vi.fn();

  const wrapper = shallowMount(ProductsView, {
    global: {
      plugins: [router],
    },
  });

  test('should render with default values', async () => {
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('should prefetch query on mounted', async () => {
    await router.replace('/?page=2');

    expect(window.scrollTo).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: 0,
    });

    expect(useQueryClient().prefetchQuery).toHaveBeenCalledWith({
      queryKey: ['products', { page: 2 }],
      queryFn: expect.any(Function),
    });
  });
});
