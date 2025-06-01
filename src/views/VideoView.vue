<script setup lang="ts">
import Comment from "@/components/Comment.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import axios from "@/services/axios";
import { useAuthStore } from "@/stores/auth";
import type { Video } from "@/types/data";
import { Icon } from "@iconify/vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const auth = useAuthStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();

const slug = route.params.slug;
const url = `${import.meta.env.VITE_API_BASE_URL}/uploads/${slug}/video.mp4`;

const {
  data: video,
  isLoading,
  isError,
  refetch,
} = useQuery<Video, Error>({
  queryKey: [`/videos/${slug}`],
  enabled: computed(() => auth.isLoggedIn),
});

const canDelete = computed(() => {
  return video.value && auth.user && video.value.author.id === auth.user.id;
});

const deleteMutation = useMutation({
  mutationFn: async () => {
    await axios.delete(`/videos/${slug}`);
  },
  onSuccess: () => {
    queryClient.invalidateQueries();
    router.push({ name: "home" });
  },
});

const newComment = ref("");
const isCommentLoading = ref(false);

const submitCommentMutation = useMutation({
  mutationFn: async () => {
    const formData = new FormData();
    formData.append("content", newComment.value);

    await axios.post(`/videos/${slug}/comments`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  onSuccess: () => {
    newComment.value = "";

    //! Bug: increment views
    queryClient.invalidateQueries({ queryKey: [`/videos/${slug}`] });
  },
  onSettled: () => {
    isCommentLoading.value = false;
  },
});

async function submitComment() {
  if (!newComment.value.trim()) return;

  isCommentLoading.value = true;
  await submitCommentMutation.mutateAsync();
}
</script>

<template>
  <MainLayout>
    <div class="max-w-5xl mx-auto py-8 px-4">
      <div v-if="isLoading" class="flex flex-col items-center py-12 text-gray-500 dark:text-gray-400">
        <Icon icon="mdi:loading" class="animate-spin h-8 w-8 mb-4 text-blue-500" />
        <span>{{ t('video.loading') }}</span>
      </div>
      <div v-else-if="isError" class="flex flex-col items-center py-12 text-red-500 dark:text-red-400">
        <Icon icon="mdi:alert-circle-outline" class="h-8 w-8 mb-4" />
        <span>{{ t('video.errorLoading') }}</span>
        <button @click="refetch()" class="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
          {{ t('video.retry') }}
        </button>
      </div>
      <div v-else-if="video" class="flex flex-col gap-8">
        <div class="flex flex-col">
          <video
            :src="url"
            controls
            class="w-full rounded-xl bg-black aspect-video"
          />
          <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white break-words">
            {{ video.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-4 mt-2 text-gray-600 dark:text-gray-300">
            <span>{{ video.views }} {{ t('video.views') }}</span>
            <span>•</span>
            <span>{{ new Date(video.uploadedAt).toLocaleDateString() }}</span>
          </div>
          <!-- Title/Author -->
          <div class="flex items-center gap-3 mt-4 mb-4">
            <div>
              <div class="font-semibold text-gray-900 dark:text-white">{{ video.author.username }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('video.subscribers', { count: video.author.followers?.length ?? 0 }) }}</div>
            </div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-700 dark:text-gray-200 whitespace-pre-line mb-8 break-words">
            {{ video.description || t('video.noDescription') }}
          </div>
          <!-- Title/Author -->
          <button
            v-if="canDelete"
            @click="deleteMutation.mutate()"
            :disabled="deleteMutation.isPending.value"
            class="mt-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60 cursor-pointer"
          >
            {{ t('video.delete') }}
          </button>
          <div v-if="deleteMutation.isError.value" class="text-red-500 mt-2 flex items-center gap-1">
            <Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
            {{ t('video.deleteError') }}
          </div>
        </div>
        <!-- Comments -->
        <div class="mt-10">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:comment-multiple-outline" class="w-5 h-5 text-blue-600" />
            {{ t('video.comments') }}
          </h2>
          <form @submit.prevent="submitComment" class="flex gap-2 mb-6">
            <input
              v-model="newComment"
              :placeholder="t('video.addCommentPlaceholder')"
              class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
              maxlength="300"
              required
            />
            <button
              type="submit"
              :disabled="isCommentLoading || !newComment.trim()"
              class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-default cursor-pointer"
            >
              {{ t('video.addComment') }}
            </button>
          </form>
          <div v-if="video.comments?.length === 0" class="text-gray-500 dark:text-gray-400">
            {{ t('video.noComments') }}
          </div>
          <div v-else class="space-y-4">
            <Comment v-for="comment in video.comments" :key="comment.id" :comment="comment" />
          </div>
        </div>
        <!-- Comments -->
      </div>
    </div>
  </MainLayout>
</template>
