<script setup lang="ts">
import ThemeToggle from "@/components/ThemeToggle.vue";
import { useAuthStore } from "@/stores/auth";
import { Icon } from "@iconify/vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";

const auth = useAuthStore();
const { t } = useI18n();
</script>

<template>
  <nav class="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow mb-8 rounded-b-xl sticky top-0 z-30">
    <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 select-none">
      <Icon icon="mdi:youtube" class="text-red-600 w-8 h-8" />
      <span class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Elephlix</span>
    </RouterLink>
    <div class="flex items-center gap-4">
      <ThemeToggle />
      <template v-if="auth.isLoggedIn">
        <span class="text-gray-700 dark:text-gray-200 font-semibold flex items-center gap-2">
          <Icon icon="mdi:account-circle" class="w-6 h-6" />
          {{ auth.user?.username || t('navbar.account') }}
        </span>
        <RouterLink :to="{ name: 'logout' }" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition cursor-default">
          <Icon icon="mdi:logout" class="w-5 h-5" />
          {{ t('navbar.logout') }}
        </RouterLink>
      </template>
      <template v-else>
        <RouterLink :to="{ name: 'login' }" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition cursor-default">
          <Icon icon="mdi:login-variant" class="w-5 h-5" />
          {{ t('navbar.login') }}
        </RouterLink>
        <RouterLink :to="{ name: 'register' }" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition cursor-default">
          <Icon icon="mdi:account-plus-outline" class="w-5 h-5" />
          {{ t('navbar.register') }}
        </RouterLink>
      </template>
    </div>
  </nav>
</template>
