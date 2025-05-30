<template>
  <div class="max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-2">
    <div class="flex flex-col gap-3">
      <!-- Thumbnail skeleton -->
      <div class="h-40 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      <!-- Title skeleton -->
      <div class="h-5 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
      <!-- Channel skeleton -->
      <div class="flex items-center gap-2 mt-2">
        <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div class="h-4 w-1/3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>
      <!-- Views and date skeleton -->
      <div class="flex gap-2 mt-1">
        <div class="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        <div class="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
</template>
