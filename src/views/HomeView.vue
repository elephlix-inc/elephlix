<script setup lang="ts">
import VideoCard from "@/components/VideoCard.vue";
import VideoSkeleton from "@/components/VideoSkeleton.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { useAuthStore } from "@/stores/auth";
import type { Video } from "@/types/data";
import { Icon } from "@iconify/vue";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const auth = useAuthStore();
const { t } = useI18n();

const errorMessage = ref<string | null>(null);

const {
  data: videos,
  isLoading,
  isError,
  refetch,
} = useQuery<Video[], Error>({
  queryKey: ["/videos"],
  enabled: computed(() => auth.isLoggedIn),
});
</script>

<template>
  <MainLayout>
    <div>
      <div class="max-w-7xl mx-auto py-8 px-4">
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <VideoSkeleton v-for="n in 6" :key="n" />
        </div>
        <div v-else-if="isError" class="flex flex-col items-center py-12 text-red-500">
          <Icon icon="mdi:alert-circle-outline" class="h-8 w-8 mb-4" />
          <span>{{ errorMessage || t('home.errorLoading') }}</span>
          <button @click="refetch()" class="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
            {{ t('home.retry') }}
          </button>
        </div>
        <div v-else-if="videos && videos.length === 0" class="text-center text-gray-500 py-12">
          {{ t('home.noVideos') }}
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <VideoCard v-for="video in videos" :key="video.id" :video="video" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>