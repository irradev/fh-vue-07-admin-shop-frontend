import { ref } from 'vue';
import { createRouter, createWebHistory, useRouter } from 'vue-router';

import { shallowMount } from '@vue/test-utils';
import type { Mock } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { useMutation, useQuery } from '@tanstack/vue-query';

import { tesloApi } from '@/api/tesloApi';
import ProductView from '@/modules/admin/views/ProductView.vue';
import { fakeProducts } from '../../../_mockData/fakeProducts';
import type { Product } from '@/modules/products/interfaces/product.interface';

const tesloApiMock = new MockAdapter(tesloApi);

tesloApiMock.onGet('/products/1').reply(200, {});

vi.mock('@tanstack/vue-query');

vi.mock('vue-router', async (original) => {
  const originalImpl = await original();

  return {
    ...(originalImpl as any),
    useRouter: vi.fn(),
  };
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: ProductView,
    },
  ],
});

describe('<ProductView />', () => {
  const fakeProduct = fakeProducts.at(0);
  const mutateSpy = vi.fn();
  const replaceSpy = vi.fn();

  (useMutation as Mock).mockReturnValue({
    isPending: ref(false),
    isSuccess: ref(false),
    isError: ref(false),
    mutate: mutateSpy,
    data: ref(fakeProduct),
  });

  (useRouter as Mock).mockReturnValue({
    replace: replaceSpy,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should redirect to produts if id not found', async () => {
    (useQuery as Mock).mockReturnValue({
      data: ref({}),
      isLoading: ref(false),
      isError: ref(true),
      refetch: vi.fn(),
    });

    shallowMount(ProductView, {
      global: {
        stubs: ['router-view'],
        plugins: [router],
      },
      props: {
        productId: 'xx',
      },
    });

    expect(replaceSpy).toHaveBeenCalledWith({ name: 'admin-products' });
  });

  test('should render page with a product', async () => {
    (useQuery as Mock).mockReturnValue({
      data: ref(fakeProduct),
      isLoading: ref(false),
      isError: ref(false),
      refetch: vi.fn(),
    });

    const wrapper = shallowMount(ProductView, {
      global: {
        stubs: ['router-view'],
        plugins: [router],
      },
      props: {
        productId: 'ABC123',
      },
    });

    expect(wrapper.exists()).toBeTruthy();

    const customInputs = wrapper.findAllComponents({ name: 'CustomInput' });
    const customTextAreas = wrapper.findAllComponents({ name: 'CustomTextArea' });
    const sizeButtons = wrapper.findAll('button.flex-1');

    expect(customInputs.length).toBe(4);
    expect(customTextAreas.length).toBe(1);
    expect(sizeButtons.length).toBe(6); // all sizes

    const productValues = Object.values(fakeProduct as Product);

    customInputs.forEach((input) => {
      const modelValue = input.props().modelValue;
      expect(productValues).toContain(modelValue);
    });

    customTextAreas.forEach((textarea) => {
      const modelValue = textarea.props().modelValue;
      expect(productValues).toContain(modelValue);
    });

    sizeButtons.forEach((button) => {
      const productSizes = Object.values(fakeProduct?.sizes as string[]);
      if (productSizes.includes(button.text())) {
        expect(button.classes()).toContain('bg-blue-500');
      } else {
        expect(button.classes()).not.toContain('bg-blue-500');
      }
    });
  });

  test('should submit a form if data is valid', async () => {
    (useQuery as Mock).mockReturnValue({
      data: ref(fakeProduct),
      isLoading: ref(false),
      isError: ref(false),
      refetch: vi.fn(),
    });

    const wrapper = shallowMount(ProductView, {
      global: {
        stubs: ['router-view'],
        plugins: [router],
      },
      props: {
        productId: 'ABC123',
      },
    });

    const form = wrapper.find('form');
    await form.trigger('submit');

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mutateSpy).toHaveBeenCalled();
    expect(mutateSpy).toHaveBeenCalledWith(fakeProduct);
  });

  test('should not called submit form if data is not valid', async () => {
    (useQuery as Mock).mockReturnValue({
      data: ref(fakeProduct),
      isLoading: ref(false),
      isError: ref(false),
      refetch: vi.fn(),
    });

    const wrapper = shallowMount(ProductView, {
      global: {
        stubs: ['router-view'],
        plugins: [router],
      },
      props: {
        productId: 'ABC123',
      },
    });

    const titleInput = wrapper.findComponent({ name: 'CustomInput' });
    // await titleInput.setValue('');
    await titleInput.vm.$emit('update:modelValue', '');

    const form = wrapper.find('form');
    await form.trigger('submit');

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mutateSpy).not.toHaveBeenCalled();
  });
});
