<script setup lang="ts">
import axios from "@/services/axios";
import { Icon } from "@iconify/vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["uploaded"]);

const { t } = useI18n();
const queryClient = useQueryClient();

const uploadForm = ref({
  title: "",
  description: "",
  file: null as File | null,
  thumbnail: null as File | null,
});

const MAX_VIDEO_SIZE = 250 * 1024 * 1024; // 250 Mo
const MAX_THUMBNAIL_SIZE = 4 * 1024 * 1024; // 4 Mo

const titleValid = computed(() => uploadForm.value.title.trim().length >= 6);
const descriptionValid = computed(
  () => uploadForm.value.description.trim().length >= 10,
);
const fileValid = computed(
  () =>
    !!uploadForm.value.file &&
    uploadForm.value.file.type === "video/mp4" &&
    uploadForm.value.file.size <= MAX_VIDEO_SIZE,
);
const thumbnailValid = computed(
  () =>
    !!uploadForm.value.thumbnail &&
    typeof uploadForm.value.thumbnail.type === "string" &&
    ["image/webp", "image/jpeg", "image/png"].includes(
      uploadForm.value.thumbnail.type,
    ) &&
    uploadForm.value.thumbnail.size <= MAX_THUMBNAIL_SIZE,
);
const canSubmit = computed(
  () =>
    titleValid.value &&
    descriptionValid.value &&
    fileValid.value &&
    thumbnailValid.value,
);
const titleError = computed(() => uploadForm.value.title && !titleValid.value);
const descriptionError = computed(() => {
  return uploadForm.value.description && !descriptionValid.value;
});
const fileError = computed(() => {
  return uploadForm.value.file && !fileValid.value;
});
const thumbnailError = computed(() => {
  return uploadForm.value.thumbnail && !thumbnailValid.value;
});

const uploadMutation = useMutation({
  mutationFn: async () => {
    const formData = new FormData();
    formData.append("title", uploadForm.value.title);
    formData.append("description", uploadForm.value.description);
    formData.append("file", uploadForm.value.file as File);
    if (uploadForm.value.thumbnail) {
      formData.append("thumbnail", uploadForm.value.thumbnail);
    }

    await axios.post("/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  onSuccess: () => {
    uploadForm.value = {
      title: "",
      description: "",
      file: null,
      thumbnail: null,
    };

    //! Not the most optimized
    queryClient.invalidateQueries();
    emit("uploaded");
  },
});

function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    uploadForm.value.file = files[0];
    return;
  }

  uploadForm.value.file = null;
}

function handleThumbnailChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    uploadForm.value.thumbnail = files[0];
    return;
  }

  uploadForm.value.thumbnail = null;
}

const submitUpload = () => uploadMutation.mutate();
</script>

<template>
  <div class="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
    <form @submit.prevent="submitUpload" class="space-y-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
        <Icon icon="mdi:video-plus" class="w-7 h-7 text-blue-600" />
        {{ t('profile.upload') }}
      </h2>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('profile.title') }}</label>
        <input v-model="uploadForm.title" type="text" required maxlength="100" :placeholder="t('profile.titlePlaceholder')"
          :class="[
            'form-input flex-1 bg-gray-50 dark:bg-gray-900 border rounded-lg px-3 py-2 dark:text-white focus:ring-2 w-full transition',
            titleValid ? 'border-green-500 focus:ring-green-400' : uploadForm.title ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-700'
          ]"
        />
        <div v-if="titleError" class="text-xs text-red-500 mt-1 flex items-center gap-1">
          <Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
          {{ t("profile.titleError") }}
        </div>
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('profile.description') }}</label>
        <textarea v-model="uploadForm.description" rows="3" maxlength="500" :placeholder="t('profile.descriptionPlaceholder')"
          :class="[
            'form-textarea flex-1 bg-gray-50 dark:bg-gray-900 border rounded-lg px-3 py-2 dark:text-white focus:ring-2 w-full transition',
            descriptionValid ? 'border-green-500 focus:ring-green-400' : uploadForm.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-700'
          ]"
        ></textarea>
        <div v-if="descriptionError" class="text-xs text-red-500 mt-1 flex items-center gap-1">
          <Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
          {{ t("profile.descriptionError") }}
        </div>
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('profile.file') }}</label>
        <div class="relative flex items-center">
          <input
            type="file"
            accept="video/mp4"
            @change="handleFileChange"
            required
            class="peer block w-full text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 transition file:cursor-pointer file:opacity-0 file:absolute file:w-full file:h-full"
            style="z-index:2; opacity:0; position:absolute; left:0; top:0; height:100%; width:100%;"
          />
          <div class="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-dashed border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 cursor-pointer transition peer-focus:ring-2 peer-focus:ring-blue-400">
            <Icon icon="mdi:file-video-outline" class="w-5 h-5 text-blue-600" />
            <span class="truncate text-gray-700 dark:text-gray-200 text-sm">
              {{ uploadForm.file ? uploadForm.file.name : t('profile.filePlaceholder') }}
            </span>
          </div>
        </div>
        <div v-if="fileError" class="text-xs text-red-500 mt-1 flex items-center gap-1">
          <Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
          {{ t("profile.fileError") }}
        </div>
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('profile.thumbnail') }}</label>
        <div class="relative flex items-center">
          <input
            type="file"
            accept="image/webp,image/jpeg,image/png"
            @change="handleThumbnailChange"
            class="peer block w-full text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 transition file:cursor-pointer file:opacity-0 file:absolute file:w-full file:h-full"
            style="z-index:2; opacity:0; position:absolute; left:0; top:0; height:100%; width:100%;"
          />
          <div class="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-dashed border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 cursor-pointer transition peer-focus:ring-2 peer-focus:ring-blue-400">
            <Icon icon="mdi:image-outline" class="w-5 h-5 text-blue-600" />
            <span class="truncate text-gray-700 dark:text-gray-200 text-sm">
              {{ uploadForm.thumbnail ? uploadForm.thumbnail.name : t('profile.thumbnailPlaceholder') }}
            </span>
          </div>
        </div>
        <div v-if="thumbnailError" class="text-xs text-red-500 mt-1 flex items-center gap-1">
          <Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
          {{ t("profile.thumbnailError") }}
        </div>
      </div>
      <button
        type="submit"
        :disabled="uploadMutation.isPending.value || !canSubmit"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold transition-all duration-150 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Icon icon="mdi:upload" class="w-5 h-5" />
        <span>{{ uploadMutation.isPending.value ? t('profile.uploading') : t('profile.submit') }}</span>
      </button>
      <div v-if="uploadMutation.isError.value" class="text-red-600 text-sm flex items-center gap-2">
        <Icon icon="mdi:alert-circle-outline" class="w-5 h-5" />
        {{ t('profile.uploadError') }}
      </div>
      <div v-if="uploadMutation.isSuccess.value" class="text-green-600 text-sm flex items-center gap-2">
        <Icon icon="mdi:check-circle-outline" class="w-5 h-5" />
        {{ t('profile.uploadSuccess') }}
      </div>
    </form>
  </div>
</template>