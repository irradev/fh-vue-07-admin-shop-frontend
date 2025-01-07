import { defineComponent, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useFieldArray, useForm } from 'vee-validate';
import { useToast } from 'vue-toastification';
import * as yup from 'yup';

import { createUpdateProductAction, getProductByIdAction } from '@/modules/products/actions';

import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';
import LoadingOval from '@/modules/common/components/LoadingOval.vue';

const validationSchema = yup.object({
  title: yup.string().required().min(3),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().min(1).required(),
  gender: yup.string().required().oneOf(['men', 'women', 'kid', 'unisex']),
});

export default defineComponent<Record<string, any>>({
  components: {
    CustomInput,
    CustomTextArea,
    LoadingOval,
  },
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();

    const {
      data: product,
      isError,
      isLoading,
      refetch: refetchGetProduct,
    } = useQuery({
      queryKey: ['product', props.productId],
      queryFn: () => getProductByIdAction(props.productId),
      retry: false,
    });

    const {
      isPending: isCreateUpdateProductPending,
      isError: isCreateUpdateProductError,
      isSuccess: isCreateUpdateProductSuccess,
      data: createUpdateProductData,
      mutate,
    } = useMutation({
      mutationFn: createUpdateProductAction,
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema,
      // initialValues: {}
    });

    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');

    const { fields: images } = useFieldArray<string>('images');
    const { fields: sizes, remove: removeSize, push: addSize } = useFieldArray<string>('sizes');

    const imageFiles = ref<File[]>([]);

    const toggleSize = (size: string) => {
      const currentSizes = sizes.value.map((s) => s.value);
      const hasSize = currentSizes.includes(size);

      if (hasSize) {
        removeSize(currentSizes.indexOf(size));
      } else {
        addSize(size);
      }
    };

    const onSubmit = handleSubmit(async (values) => {
      // await createUpdateProductAction(value);
      const formValues = {
        ...values,
        images: [...values.images, ...imageFiles.value],
      };
      mutate(formValues);
    });

    const onFileChanged = (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      const fileList = fileInput.files as FileList;

      if (!fileList) return;
      if (fileList.length === 0) return;

      imageFiles.value = Array.from(fileList);
    };

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace({ name: 'admin-products' });
      }
    });

    watch(
      product,
      () => {
        if (!product) return;

        resetForm({
          values: product.value,
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );

    watch(isCreateUpdateProductSuccess, (isSuccess) => {
      if (!isSuccess) return;

      toast.success('Producto actualizado exitosamente');
      router.replace(`/admin/products/${createUpdateProductData.value!.id}`);

      resetForm({
        values: createUpdateProductData.value,
      });

      imageFiles.value = [];
    });

    watch(
      () => props.productId,
      () => {
        refetchGetProduct();
      },
    );

    return {
      // Properties
      values,
      product,
      errors,
      meta,
      isCreateUpdateProductPending,
      imageFiles,

      // Form Fields
      title,
      titleAttrs,
      slug,
      slugAttrs,
      description,
      descriptionAttrs,
      price,
      priceAttrs,
      stock,
      stockAttrs,
      gender,
      genderAttrs,
      images,
      sizes,

      // Getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

      // Actions
      onSubmit,
      toggleSize,
      onFileChanged,

      hasSize: (size: string) => {
        const currentSizes = sizes.value.map((s) => s.value);

        return currentSizes.includes(size);
      },
      temporalImageUrl: (imageFile: File) => {
        return URL.createObjectURL(imageFile);
      },
    };
  },
});
