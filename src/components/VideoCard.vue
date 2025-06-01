<script setup lang="ts">
import type { Video } from "@/types/data";
import { Icon } from "@iconify/vue";

interface Props {
  video: Video;
}

const props = defineProps<Props>();

const thumbnail = `${import.meta.env.VITE_API_BASE_URL}/uploads/${props.video.slug}/thumbnail.jpg`;
</script>

<template>
  <RouterLink :to="{ name: 'video', params: { slug: video.slug } }">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
      <img :src="thumbnail" :alt="video.title" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h2 class="text-lg font-bold mb-1 truncate dark:text-white">{{ video.title }}</h2>
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
          <Icon icon="mdi:account-circle" class="w-5 h-5" />
          {{ video.author.username }}
        </div>
        <div class="flex items-center gap-4 text-xs text-gray-400">
          <span><Icon icon="mdi:eye-outline" class="w-4 h-4 inline" /> {{ video.views.toLocaleString() }} vues</span>
          <span><Icon icon="mdi:clock-outline" class="w-4 h-4 inline" /> {{ new Date(video.uploadedAt).toLocaleDateString() }}</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
