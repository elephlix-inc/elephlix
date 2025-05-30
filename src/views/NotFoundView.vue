<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="flex flex-col items-center gap-4 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <span class="text-7xl text-red-500">
        <Icon icon="mdi:alert-octagon-outline" class="w-20 h-20" />
      </span>
      <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white">404</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">{{ t('notfound.message') }}</p>
      <router-link :to="{ name: 'home' }" class="mt-4 flowbite-btn bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
        <Icon icon="mdi:arrow-left" class="w-5 h-5" />
        {{ t('notfound.backHome') }}
      </router-link>
    </div>
  </div>
</template>
