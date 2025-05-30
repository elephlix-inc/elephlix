<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-700">
    <Navbar />
    <main class="max-w-7xl mx-auto py-8 px-4">
      <slot />
    </main>
  </div>
</template>
