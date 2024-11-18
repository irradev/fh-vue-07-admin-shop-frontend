<template>
  <!-- component -->
  <!-- Create By Joker Banny -->

  <!-- Header Navbar -->
  <top-menu />

  <router-view />

  <!-- Footer -->
  <custom-footer />
</template>

<script setup lang="ts">
  import TopMenu from '../components/TopMenu.vue';
  import CustomFooter from '../components/CustomFooter.vue';
</script>
