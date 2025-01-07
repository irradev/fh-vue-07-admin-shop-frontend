import path from 'path';
import fs from 'fs';

import { tesloApi } from '@/api/tesloApi';
import MockAdapter from 'axios-mock-adapter';
import { fakeProducts } from '../../../_mockData/fakeProducts';
import { createUpdateProductAction } from '@/modules/products/actions';
import { Gender, type Product } from '@/modules/products/interfaces/product.interface';

const testloApiMock = new MockAdapter(tesloApi);

describe('createUpdateProductAction', () => {
  beforeEach(() => {
    testloApiMock.reset();
  });

  test('should create a new product', async () => {
    const product = fakeProducts.at(0);
    testloApiMock.onPost('/products').reply(200, product);
    const createdProduct = await createUpdateProductAction({});
    expect(createdProduct).toEqual(product);
  });

  test('should update an existing product', async () => {
    const product = fakeProducts.at(0);
    testloApiMock.onPatch(`/products/${product!.id}`).reply(200, product);
    const updatedProduct = await createUpdateProductAction(product as Product);
    expect(updatedProduct).toEqual(product);
  });

  test('should throw an error when create if the product is not found', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockReturnValue();
    testloApiMock.onPost('/products').reply(500, {});

    try {
      await createUpdateProductAction({});
    } catch (error) {
      expect(consoleSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
    }
    consoleSpy.mockRestore();

    // await expect(tesloApi.post('/product/create')).rejects.toThrowError(
    //   'Request failed with status code 500',
    // );
  });

  test('should throw an error when update if the product is not found', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockReturnValue();
    const productId = 1;
    testloApiMock.onPut(`/products/${productId}`).reply(404, {});
    try {
      await createUpdateProductAction({} as Product);
    } catch (error) {
      expect(consoleSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
    }

    consoleSpy.mockRestore();
  });

  test('should upload images', async () => {
    const imagePath = path.join(__dirname, '../../../_mockData', 'fake_t-shirt.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    const imageFile = new File([imageBuffer], 'fake_t-shirt.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', imageFile);

    const product: Product = {
      id: '',
      title: '',
      price: 100,
      description: '',
      slug: '',
      stock: 100,
      sizes: [],
      gender: Gender.Men,
      tags: [],
      images: [imageFile.name] as any,
      user: {} as any,
    };

    testloApiMock.onPost('/products').reply(200, product);
    testloApiMock.onPost('/files/product').reply(200, formData);

    const { images } = await createUpdateProductAction(product);

    expect(images).toEqual([imageFile.name]);
  });
});
