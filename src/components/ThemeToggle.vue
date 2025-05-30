<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const theme = ref(
  localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"),
);

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  document.documentElement.classList.toggle("dark", theme.value === "dark");
  localStorage.setItem("theme", theme.value);
}
</script>

<template>
  <button
    @click="toggleTheme"
    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-200 cursor-pointer"
  >
    <Icon :icon="theme === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="w-5 h-5" />
    <span class="hidden sm:inline">{{ theme === 'dark' ? t('navbar.light') : t('navbar.dark') }}</span>
  </button>
</template>