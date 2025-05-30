<script setup lang="ts">
import VideoCard from "@/components/VideoCard.vue";
import VideoSkeleton from "@/components/VideoSkeleton.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { useAuthStore } from "@/stores/auth";
import type { Video } from "@/types/data";
import { useQuery } from "@tanstack/vue-query";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const errorMessage = ref<string | null>(null);

const auth = useAuthStore();

onMounted(() => {
  auth.ensureAuthReady();
});

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
          <svg class="h-8 w-8 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage || t('home.errorLoading') }}</span>
          <button @click="() => refetch()" class="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
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