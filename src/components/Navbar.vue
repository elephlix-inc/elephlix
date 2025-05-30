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
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" class="w-8 h-8">
        <g>
          <path fill="#dc2626" d="M 13.957031 3.296875 C 10.746094 4.144531 8.890625 6.363281 8.714844 9.558594 C 8.605469 11.617188 9.230469 13.328125 10.59375 14.671875 C 12.132812 16.1875 13.921875 16.792969 16.976562 16.824219 L 18.296875 16.835938 L 17.472656 17.121094 C 16.769531 17.375 16.484375 17.40625 15.441406 17.40625 C 14.441406 17.394531 14.066406 17.339844 13.296875 17.089844 C 11.867188 16.625 10.921875 16.089844 10.042969 15.21875 C 9.132812 14.320312 8.449219 13.066406 8.1875 11.8125 C 7.976562 10.800781 7.976562 9.011719 8.1875 8.199219 C 8.285156 7.835938 8.328125 7.527344 8.308594 7.503906 C 8.21875 7.417969 7.011719 8.109375 6.21875 8.703125 C 4.769531 9.792969 3.496094 11.726562 2.976562 13.605469 C 2.570312 15.097656 2.515625 16.265625 2.550781 22.691406 C 2.582031 29.539062 2.550781 29.199219 3.328125 29.671875 C 3.648438 29.867188 3.890625 29.890625 5.890625 29.890625 C 7.484375 29.890625 8.144531 29.855469 8.265625 29.757812 C 8.363281 29.679688 8.59375 29.265625 8.769531 28.824219 C 9.207031 27.757812 9.648438 27.230469 10.351562 26.910156 C 10.878906 26.679688 11.132812 26.660156 12.945312 26.617188 L 14.945312 26.570312 L 14.945312 27.691406 C 14.945312 29.769531 15.121094 29.890625 18.097656 29.890625 C 20.394531 29.890625 20.605469 29.835938 20.902344 29.230469 C 21.078125 28.878906 21.097656 28.363281 21.097656 23.285156 L 21.097656 17.734375 L 21.429688 17.496094 C 21.855469 17.175781 21.988281 17.1875 22.792969 17.605469 C 24.363281 18.449219 25.921875 20.691406 25.933594 22.144531 C 25.933594 23.285156 25.320312 24.175781 24.539062 24.175781 C 23.988281 24.175781 23.757812 23.933594 23.460938 23.042969 C 23.199219 22.230469 22.933594 22.03125 22.636719 22.394531 C 22.363281 22.734375 22.242188 23.769531 22.40625 24.394531 C 22.679688 25.441406 23.484375 26.042969 24.703125 26.132812 C 27.1875 26.308594 28.945312 24.714844 29.515625 21.78125 C 29.757812 20.539062 29.734375 10.097656 29.496094 8.933594 C 29.230469 7.625 28.757812 6.78125 27.746094 5.757812 C 26.066406 4.066406 25.089844 3.734375 21.660156 3.734375 C 19.503906 3.734375 19.351562 3.714844 18.515625 3.441406 C 17.296875 3.042969 15.175781 2.96875 13.957031 3.296875 Z M 25.265625 10.339844 C 26.230469 10.679688 25.890625 11.976562 24.835938 11.976562 C 24.042969 11.976562 23.605469 11.273438 24.023438 10.679688 C 24.320312 10.253906 24.714844 10.152344 25.265625 10.339844 Z M 12.449219 19.835938 C 15.273438 21.496094 15.394531 21.617188 14.757812 22.066406 C 13.96875 22.617188 9.757812 25.164062 9.636719 25.164062 C 9.253906 25.164062 9.230469 24.933594 9.230469 21.703125 C 9.230469 18.394531 9.253906 18.1875 9.679688 18.265625 C 9.78125 18.285156 11.023438 18.988281 12.449219 19.835938 Z M 12.449219 19.835938 "/>
        </g>
      </svg>
      <span class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Elephlix</span>
    </RouterLink>
    <div class="flex items-center gap-4">
      <ThemeToggle />
      <template v-if="auth.isLoggedIn">
        <RouterLink :to="{ name: 'profile' }" class="text-gray-700 dark:text-gray-200 font-semibold flex items-center gap-2">
          <Icon icon="mdi:account-circle" class="w-6 h-6" />
          {{ auth.user?.username || t('navbar.account') }}
        </RouterLink>
        <RouterLink :to="{ name: 'logout' }" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition">
          <Icon icon="mdi:logout" class="w-5 h-5" />
          {{ t('navbar.logout') }}
        </RouterLink>
      </template>
      <template v-else>
        <RouterLink :to="{ name: 'login' }" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
          <Icon icon="mdi:login-variant" class="w-5 h-5" />
          {{ t('navbar.login') }}
        </RouterLink>
        <RouterLink :to="{ name: 'register' }" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition">
          <Icon icon="mdi:account-plus-outline" class="w-5 h-5" />
          {{ t('navbar.register') }}
        </RouterLink>
      </template>
    </div>
  </nav>
</template>
