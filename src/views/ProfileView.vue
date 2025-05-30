<script setup lang="ts">
import VideoCard from "@/components/VideoCard.vue";
import VideoSkeleton from "@/components/VideoSkeleton.vue";
import VideoUploadForm from "@/components/VideoUploadForm.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { useAuthStore } from "@/stores/auth";
import type { Video } from "@/types/data";
import { Icon } from "@iconify/vue";
import { useQuery } from "@tanstack/vue-query";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const auth = useAuthStore();
const { t } = useI18n();

onMounted(() => {
  auth.ensureAuthReady();
});

const showUpload = ref(false);

const {
  data: myVideos,
  isLoading,
  isError,
  refetch,
} = useQuery<Video[], Error>({
  queryKey: computed(() =>
    auth.user?.slug ? [`/users/${auth.user.slug}/videos`] : [null],
  ),
  enabled: computed(() => auth.isLoggedIn),
});
</script>

<template>
  <MainLayout>
    <div class="max-w-4xl mx-auto py-8 px-4">
      <div class="flex items-center gap-4 mb-8">
        <Icon icon="mdi:account-circle" class="w-16 h-16 text-gray-400 dark:text-gray-600" />
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ auth.user?.username }}</h2>
          <p class="text-gray-600 dark:text-gray-300">{{ auth.user?.email }}</p>
        </div>
        <button
          @click="showUpload = !showUpload"
          class="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition cursor-pointer"
        >
          <Icon icon="mdi:video-plus" class="w-5 h-5" />
          {{ t('profile.upload') }}
        </button>
      </div>

      <VideoUploadForm v-if="showUpload" @uploaded="() => refetch()" />

      <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{{ t('profile.myVideos') }}</h3>
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <VideoSkeleton v-for="n in 6" :key="n" />
      </div>
      <div v-else-if="isError" class="text-red-500 dark:text-red-400">{{ t('profile.errorVideos') }}</div>
      <div v-else-if="myVideos && myVideos.length === 0" class="text-gray-500 dark:text-gray-400">{{ t('profile.noVideos') }}</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <VideoCard v-for="video in myVideos" :key="video.id" :video="video" />
      </div>
    </div>
  </MainLayout>
</template>