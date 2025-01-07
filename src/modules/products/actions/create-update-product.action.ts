import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interface';

export const createUpdateProductAction = async (product: Partial<Product>) => {
  const productId = product.id || '';
  const newImages = await uploadProductImages(product.images || []);
  product.images = newImages;

  product = cleanProductForCreateUpdate(product);

  // Actualizar producto
  if (productId && productId !== '') {
    return await updateProduct(productId, product);
  }

  // Crear producto
  return await createProduct(product);
};

const updateProduct = async (productId: string, product: Partial<Product>) => {
  try {
    const { data } = await tesloApi.patch<Product>(`/products/${productId}`, product);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('No se pudo actualizar el producto');
  }
};

const createProduct = async (product: Partial<Product>) => {
  try {
    const { data } = await tesloApi.post<Product>(`/products`, product);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('No se pudo crear el producto');
  }
};

const cleanProductForCreateUpdate = (product: Partial<Product>) => {
  const images: string[] =
    product.images?.map((image) => {
      if (image.startsWith('https')) {
        const imageName = image.split('/').pop() || '';
        return imageName;
      }

      return image;
    }) || [];

  delete product.id;
  delete product.user;
  product.images = images;

  return product;
};

const uploadProductImages = async (images: (string | File)[]) => {
  const filesToUpload = images.filter((image) => image instanceof File) as File[];
  const currentImages = images.filter((image) => typeof image === 'string') as string[];

  const uploadPromises = filesToUpload.map(async (file) => uploadFile(file));
  const uploadedImages = await Promise.all(uploadPromises);

  return [...currentImages, ...uploadedImages];
};

const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await tesloApi.post<{ secureUrl: string }>('/files/product', formData);

    return data.secureUrl;
  } catch (error) {
    console.log(error);
    throw new Error('Error uploading images');
  }
};
