<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import { useAuthStore } from "@/stores/auth";
import type { Video } from "@/types/data";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const auth = useAuthStore();
const { t } = useI18n();
const route = useRoute();

const slug = route.params.slug;
const url = `${import.meta.env.VITE_API_BASE_URL}/uploads/videos/${slug}/video.mp4`;
const errorMessage = ref<string | null>(null);

const {
  data: video,
  isLoading,
  isError,
  refetch,
} = useQuery<Video, Error>({
  queryKey: [`/videos/${slug}`],
  enabled: computed(() => auth.isLoggedIn),
});
</script>

<template>
  <MainLayout>
    <div class="min-h-screen">
      <div class="max-w-5xl mx-auto py-8 px-4">
        <div v-if="isLoading" class="flex flex-col items-center py-12 text-gray-500 dark:text-gray-400">
          <svg class="animate-spin h-8 w-8 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span>{{ t('video.loading') }}</span>
        </div>
        <div v-else-if="isError" class="flex flex-col items-center py-12 text-red-500 dark:text-red-400">
          <svg class="h-8 w-8 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage || t('video.errorLoading') }}</span>
          <button @click="() => refetch()" class="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
            {{ t('video.retry') }}
          </button>
        </div>
        <div v-else-if="video" class="flex flex-col md:flex-row gap-8">
          <!-- Video player -->
          <div class="flex-1">
            <video
              :src="url"
              controls
              class="w-full rounded-xl bg-black aspect-video"
            />
            <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{{ video.title }}</h1>
            <div class="flex flex-wrap items-center gap-4 mt-2 text-gray-600 dark:text-gray-300">
              <span>{{ video.views }} {{ t('video.views') }}</span>
              <span>•</span>
              <span>{{ new Date(video.uploadedAt).toLocaleDateString() }}</span>
            </div>
          </div>
          <!-- Video details -->
          <div class="w-full md:w-80 flex-shrink-0">
            <div class="flex items-center gap-3 mb-4">
              <div>
                <div class="font-semibold text-gray-900 dark:text-white">{{ video.author.username }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('video.subscribers', { count: video.author.followers?.length ?? 0 }) }}</div>
              </div>
            </div>
            <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-700 dark:text-gray-200 whitespace-pre-line">
              {{ video.description || t('video.noDescription') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>