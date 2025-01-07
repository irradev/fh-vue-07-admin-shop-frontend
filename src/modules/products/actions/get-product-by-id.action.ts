import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interface';
import { getProductImageHelper } from '../helpers';

export const getProductByIdAction = async (productId: string): Promise<Product> => {
  if (productId === 'create') {
    return {
      id: '',
      title: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      gender: '' as any,
      images: [],
      sizes: [],
      tags: [],
      user: {} as any,
    };
  }

  try {
    const { data } = await tesloApi.get<Product>(`/products/${productId}`);

    return {
      ...data,
      images: data.images.map(getProductImageHelper),
    };
  } catch (error) {
    console.log(error);
    throw new Error(`Error obteniendo el producto ${productId}`);
  }
};
