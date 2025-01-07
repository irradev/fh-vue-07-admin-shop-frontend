import { shallowMount } from '@vue/test-utils';
import ShopLayout from '@/modules/shop/layouts/ShopLayout.vue';

describe('<ShopLayout />', () => {
  test('render top menu, router view and footer', () => {
    const wrapper = shallowMount(ShopLayout, {
      global: {
        stubs: ['router-view'],
      },
    });

    expect(wrapper.exists()).toBeTruthy();

    const topMenu = wrapper.findComponent({ name: 'TopMenu' });
    expect(topMenu.exists()).toBeTruthy();

    const routerView = wrapper.findComponent({ name: 'RouterView' });
    expect(routerView.exists()).toBeTruthy();

    const customFooter = wrapper.findComponent({ name: 'CustomFooter' });
    expect(customFooter.exists()).toBeTruthy();
  });
});
