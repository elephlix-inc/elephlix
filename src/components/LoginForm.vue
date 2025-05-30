<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const loginForm = ref({ email: "", password: "" });
const loading = computed(() => auth.loginStatus === "pending");

const emailValid = computed(() => /.+@.+\..+/.test(loginForm.value.email));
const passwordValid = computed(() => loginForm.value.password.length >= 6);
const canSubmit = computed(() => emailValid.value && passwordValid.value);
const emailError = computed(() => loginForm.value.email && !emailValid.value);
const passwordError = computed(
  () => loginForm.value.password && !passwordValid.value,
);

function handleLogin() {
  auth.login({
    email: loginForm.value.email,
    password: loginForm.value.password,
  });
}

watch(
  () => auth.loginStatus,
  (status) => {
    if (status === "success") {
      router.push({ name: "home" });
    }
  },
);
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto space-y-8">
    <form @submit.prevent="handleLogin" class="space-y-6">
      <h2 class="text-2xl dark:text-white font-bold flex items-center gap-3 mb-2">
        <Icon icon="mdi:login" class="text-blue-600 w-7 h-7" />
        {{ t('login.title') }}
      </h2>
      <div class="relative">
        <label for="login-email" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('login.email') }}</label>
        <div :class="[
          'flex items-center border rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white focus-within:ring-2',
          emailValid ? 'border-green-500 focus-within:ring-green-400' : loginForm.email ? 'border-red-500 focus-within:ring-red-400' : 'border-gray-300 dark:border-gray-700'
        ]">
          <span class="pl-3"><Icon icon="mdi:email-outline" class="text-gray-400 w-5 h-5" /></span>
          <input id="login-email" v-model="loginForm.email" type="email" :placeholder="t('login.emailPlaceholder')" class="form-input flex-1 bg-transparent border-0 focus:ring-0 px-2 py-2" required />
        </div>
        <div v-if="emailError" class="text-red-500 text-xs mt-1 flex items-center gap-1">
          <Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
          {{ t('login.emailError') }}
        </div>
      </div>
      <div class="relative">
        <label for="login-password" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('login.password') }}</label>
        <div :class="[
          'flex items-center border rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white focus-within:ring-2',
          passwordValid ? 'border-green-500 focus-within:ring-green-400' : loginForm.password ? 'border-red-500 focus-within:ring-red-400' : 'border-gray-300 dark:border-gray-700'
        ]">
          <span class="pl-3"><Icon icon="mdi:lock-outline" class="text-gray-400 w-5 h-5" /></span>
          <input id="login-password" v-model="loginForm.password" type="password" :placeholder="t('login.passwordPlaceholder')" class="form-input flex-1 bg-transparent border-0 focus:ring-0 px-2 py-2" required />
        </div>
        <div v-if="passwordError" class="text-red-500 text-xs mt-1 flex items-center gap-1">
          <Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
          {{  t('login.passwordError') }}
        </div>
      </div>
      <button type="submit" :disabled="loading || !canSubmit" class="w-full text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-base px-5 py-2.5 flex items-center justify-center gap-2 transition-all duration-150 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
        <Icon icon="mdi:login-variant" class="w-5 h-5" />
        {{ t('login.submit') }}
      </button>
      <div v-if="loading" class="text-blue-600 flex items-center gap-2 justify-center">
        <Icon icon="mdi:loading" class="animate-spin w-5 h-5" /> {{ t('login.loading') }}
      </div>
      <div v-if="auth.loginStatus === 'error'" class="text-red-600 text-sm flex items-center gap-2 justify-center">
        <Icon icon="mdi:alert-circle-outline" class="w-5 h-5" />
        {{ t('login.error', { message: auth.loginError?.message }) }}
      </div>
    </form>
    <div class="flex items-center justify-center">
      <span class="text-gray-500 dark:text-gray-400 mr-2">{{ t('login.noAccount') }}</span>
      <RouterLink :to="{ name: 'register' }" type="button" class="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-semibold transition">
        <Icon icon="mdi:account-plus-outline" class="w-5 h-5" /> {{ t('login.registerLink') }}
      </RouterLink>
    </div>
  </div>
</template>
