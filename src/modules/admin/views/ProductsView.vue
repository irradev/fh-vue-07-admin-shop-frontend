<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl text-slate-700">Productos</h1>
    <!-- component -->
    <div class="py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="w-20 text-left py-3 px-4 uppercase font-semibold text-sm">Imagen</th>
              <th class="flex-1 text-left py-3 px-4 uppercase font-semibold text-sm">Título</th>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Precio</th>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Tallas</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(product, index) in products"
              :key="product.id"
              :class="{
                'bg-gray-200': index % 2 === 0,
              }"
            >
              <td class="text-left py-3 px-4">
                <img
                  :src="product.images[0]"
                  :alt="`photo of ${product.title}`"
                  class="w-10 h-10 object-cover"
                />
              </td>
              <td class="text-left py-3 px-4">
                <RouterLink
                  :to="`products/${product.id}`"
                  class="hover:text-blue-500 hover:underline"
                >
                  {{ product.title }}
                </RouterLink>
              </td>
              <td class="text-left py-3 px-4">
                <span
                  class="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs whitespace-nowrap"
                >
                  $ {{ product.price }}
                </span>
              </td>
              <td class="text-left py-3 px-4">
                {{ product.sizes.join(', ') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <BottomPagination :is-no-more-data="!!products && products.length < 10" :page="page" />
</template>

<script setup lang="ts">
  import { watchEffect } from 'vue';
  import { useQuery, useQueryClient } from '@tanstack/vue-query';
  import { getProductsAction } from '@/modules/products/actions';
  import BottomPagination from '@/modules/common/components/ButtonPagination.vue';
  import { usePagination } from '@/modules/common/composables/usePagination';

  const queryClient = useQueryClient();
  const { page } = usePagination();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', { page: page }],
    queryFn: () => getProductsAction(page.value),
    staleTime: 60 * 1000,
  });

  watchEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['products', { page: page.value + 1 }],
      queryFn: () => getProductsAction(page.value + 1),
    });
  });
</script>
