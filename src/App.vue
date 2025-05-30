<script setup lang="ts">
const theme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

// Set initial theme based on user preference or system setting
document.documentElement.classList.toggle("dark", theme === "dark");
</script>

<template>
    <RouterView />
</template>
