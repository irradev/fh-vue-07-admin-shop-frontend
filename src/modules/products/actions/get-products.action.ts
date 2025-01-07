import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interface';
import { getProductImageHelper } from '../helpers';

export const getProductsAction = async (page: number = 1, limit: number = 10) => {
  try {
    const { data } = await tesloApi.get<Product[]>(
      `/products?limit=${limit}&offset=${(page - 1) * limit}`,
    );

    return data.map((product) => ({
      ...product,
      images: product.images.map(getProductImageHelper),
    }));
  } catch (error) {
    console.log(error);
    throw new Error('Error getting products');
  }
};
