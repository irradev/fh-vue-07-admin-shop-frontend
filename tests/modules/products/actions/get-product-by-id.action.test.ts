import { tesloApi } from '@/api/tesloApi';
import MockAdapter from 'axios-mock-adapter';
import { getProductByIdAction } from '@/modules/products/actions';
import { fakeProducts } from '../../../_mockData/fakeProducts';

const testloApiMock = new MockAdapter(tesloApi);
const productId = 1;

testloApiMock.onGet('/product/create').reply(200, null);
testloApiMock.onGet(`/products/${productId}`).reply(200, fakeProducts.at(0));

testloApiMock.onGet(`/products/${productId + 1}`).reply(404, {});

describe('getProductByIdAction', () => {
  test('should return empty product on create argument', async () => {
    const product = await getProductByIdAction('create');
    expect(product).toEqual({
      id: '',
      title: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      gender: '',
      images: [],
      sizes: [],
      tags: [],
      user: {},
    });
  });

  test('should return product if ID is found', async () => {
    const product = await getProductByIdAction(productId.toString());
    expect(product).toEqual(
      expect.objectContaining({
        ...fakeProducts.at(0),
        images: expect.any(Array),
      }),
    );
  });

  test('should throw error if ID is not found', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockReturnValue();
    try {
      await getProductByIdAction((productId + 1).toString());
    } catch (error) {
      expect(consoleSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
    }

    vi.clearAllMocks();
  });
});
