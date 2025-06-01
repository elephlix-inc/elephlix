<script setup lang="ts">
import type { Comment } from "@/types/data";

interface Props {
  comment: Comment;
}

defineProps<Props>();
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
    <div class="flex items-center gap-2 mb-1">
      <span class="font-semibold text-gray-900 dark:text-white">{{ comment.author.username }}</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ new Date(comment.createdAt).toLocaleString() }}</span>
    </div>
    <div class="text-gray-800 dark:text-gray-200 break-words">{{ comment.content }}</div>
  </div>
</template>