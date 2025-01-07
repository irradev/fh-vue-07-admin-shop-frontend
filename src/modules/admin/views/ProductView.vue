<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="flex items-baseline gap-2 text-3xl text-slate-700">
      Producto: <small class="text-blue-500">{{ title }}</small>
    </h1>
    <hr class="my-4" />
  </div>

  <form @submit="onSubmit" class="grid grid-cols-1 sm:grid-cols-2 bg-white px-5 gap-5">
    <div class="first-col">
      <!-- Primera parte del formulario -->
      <div class="mb-4">
        <label for="title" class="form-label">Título</label>
        <CustomInput id="title" v-model="title" v-bind="titleAttrs" :error="errors.title" />
        <!-- <input
          v-model="title"
          v-bind="titleAttrs"
          type="text"
          id="title"
          :class="[
            'form-control',
            {
              'border-red-500': errors.title,
            },
          ]"
        />
        <span class="text-sm text-red-500" v-show="errors.title">{{ errors.title }}</span> -->
      </div>

      <div class="mb-4">
        <label for="slug" class="form-label">Slug</label>
        <CustomInput id="slug" v-model="slug" v-bind="slugAttrs" :error="errors.slug" />
      </div>

      <div class="mb-4">
        <label for="description" class="form-label">Descripción</label>
        <CustomTextArea
          id="description"
          v-model="description"
          v-bind="descriptionAttrs"
          :error="errors.description"
        />
      </div>

      <div class="flex flex-row gap-3">
        <div class="mb-4 flex-1">
          <label for="price" class="form-label">Precio</label>
          <CustomInput
            id="price"
            type="number"
            v-model="price"
            v-bind="priceAttrs"
            :error="errors.price"
          />
        </div>

        <div class="mb-4 flex-1">
          <label for="stock" class="form-label">Inventario</label>
          <CustomInput
            id="stock"
            v-model.number="stock"
            v-bind="stockAttrs"
            :error="errors.stock"
          />
        </div>
      </div>

      <div class="mb-4">
        <label for="sizes" class="form-label">Tallas</label>
        <div class="flex">
          <button
            v-for="size of allSizes"
            :key="size"
            type="button"
            @click="toggleSize(size)"
            :class="[
              'flex-1 transition-colors p-2 rounded w-14 mr-2 hover:underline underline-offset-4',
              {
                'bg-blue-500 hover:bg-blue-800  text-white': hasSize(size),
                'bg-blue-100 hover:bg-blue-400 text-slate-700 hover:text-white': !hasSize(size),
              },
            ]"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <!-- Segunda columna -->
    <div class="first-col">
      <label for="stock" class="form-label">Imágenes</label>
      <!-- Row with scrollable horizontal -->
      <div class="flex p-2 overflow-x-auto space-x-8 w-full h-[265px] bg-gray-200 rounded">
        <div v-for="image of images" :key="image.value" class="flex-shrink-0">
          <img :src="image.value" :alt="title" class="w-[250px] h-[250px] rounded" />
        </div>

        <div v-for="imageFile of imageFiles" :key="imageFile.name" class="flex-shrink-0">
          <img
            :src="temporalImageUrl(imageFile)"
            :alt="imageFile.name"
            class="w-[250px] h-[250px] rounded"
          />
        </div>
      </div>
      <!-- Upload image -->
      <div class="col-span-2 my-2">
        <label for="image" class="form-label">Subir imagen</label>

        <input
          multiple
          type="file"
          id="image"
          class="form-control"
          accept="image/*"
          @change="onFileChanged"
        />
      </div>

      <div class="mb-4">
        <label for="stock" class="form-label">Género</label>
        <select v-model="gender" v-bind="genderAttrs" class="form-control">
          <option value="">Seleccione</option>
          <option value="kid">Niño</option>
          <option value="women">Mujer</option>
          <option value="men">Hombre</option>
        </select>
        <span class="text-sm text-red-500" v-show="errors.gender">{{ errors.gender }}</span>
      </div>

      <!-- Botón para guardar -->
      <div class="my-4 text-right">
        <button
          :disabled="isCreateUpdateProductPending"
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <template v-if="isCreateUpdateProductPending">
            <LoadingOval class="w-14 h-6" />
            <span class="sr-only">Loading...</span>
          </template>
          <template v-else>Guardar</template>
        </button>
      </div>
    </div>
  </form>

  <!-- <div class="grid grid-cols-2 text-slate-700">
    <div class="col-span-1 bg-blue-200 p-2 overflow-auto">
      <pre>
        {{ JSON.stringify(values, null, 2) }}
      </pre>
    </div>

    <div class="col-span-1 bg-red-200 p-2 overflow-auto">
      <pre>
        {{ JSON.stringify(errors, null, 2) }}
      </pre>
    </div>
    <div class="col-span-2 bg-green-200 p-2 overflow-auto">
      <pre>
        {{ JSON.stringify(meta, null, 2) }}
      </pre>
    </div>
  </div> -->
</template>

<script src="./ProductView.ts" lang="ts"></script>

<style scoped>
  .form-label {
    @apply block text-gray-700 text-sm font-bold mb-2;
  }

  .form-control {
    @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
  }
</style>
