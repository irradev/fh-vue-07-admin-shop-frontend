import { tesloApi } from '@/api/tesloApi';
import MockAdapter from 'axios-mock-adapter';
import { getProductsAction } from '@/modules/products/actions';
import { fakeProducts } from '../../../_mockData/fakeProducts';

const testloApiMock = new MockAdapter(tesloApi);

testloApiMock.onGet('/products?limit=10&offset=0').reply(200, fakeProducts);

describe('getProductsAction', async () => {
  const products = await getProductsAction(1, 10);

  test('should return expected', async () => {
    expect(products.length).toBe(10);
    expect(products.at(0)).toEqual(
      expect.objectContaining({
        ...fakeProducts.at(0),
        images: expect.any(Array),
      }),
    );
  });

  test('products should have a full image url', async () => {
    products.forEach((product) => {
      product.images.forEach((image) => {
        expect(image).toContain(`${import.meta.env.VITE_TESLO_API_URL}/files/product/`);
      });
    });
  });
});
