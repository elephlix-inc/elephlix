<script setup lang="ts">
import SideBar from "@/components/SideBar.vue";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <SidebarProvider>
    <SideBar />
    <main>
      <NavBar />
      <RouterView />
    </main>
  </SidebarProvider>
</template>
