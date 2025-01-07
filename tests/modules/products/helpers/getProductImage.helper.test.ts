import { getProductImageHelper } from '@/modules/products/helpers';

describe('getProductImageHelper', () => {
  test('should return proper image URL', () => {
    const imageName = 'test.jpg';
    const imageUrl = getProductImageHelper(imageName);
    expect(imageUrl).toBe(`${import.meta.env.VITE_TESLO_API_URL}/files/product/${imageName}`);
  });
});
