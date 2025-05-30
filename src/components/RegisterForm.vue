<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";

const auth = useAuthStore();
const { t } = useI18n();
const registerForm = ref({ email: "", password: "", username: "" });
const loading = computed(() => auth.registerStatus === "pending");

const emailValid = computed(() => /.+@.+\..+/.test(registerForm.value.email));
const passwordValid = computed(() => registerForm.value.password.length >= 6);
const usernameValid = computed(() => registerForm.value.username.length >= 3);
const canSubmit = computed(
  () => emailValid.value && passwordValid.value && usernameValid.value,
);
const emailError = computed(
  () => registerForm.value.email && !emailValid.value,
);
const passwordError = computed(
  () => registerForm.value.password && !passwordValid.value,
);
const usernameError = computed(
  () => registerForm.value.username && !usernameValid.value,
);

function handleRegister() {
  auth.register({
    email: registerForm.value.email,
    password: registerForm.value.password,
    username: registerForm.value.username,
  });
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
    <h2 class="text-2xl font-extrabold flex items-center gap-3 mb-2">
      <Icon icon="mdi:account-plus-outline" class="text-green-600 w-7 h-7" />
      {{ t('register.title') }}
    </h2>
    <div class="relative">
      <label for="register-email" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('register.email') }}</label>
      <div :class="[
        'flex items-center border rounded-lg bg-gray-50 dark:bg-gray-900 focus-within:ring-2',
        emailValid ? 'border-green-500 focus-within:ring-green-400' : registerForm.email ? 'border-red-500 focus-within:ring-red-400' : 'border-gray-300 dark:border-gray-700'
      ]">
        <span class="pl-3"><Icon icon="mdi:email-outline" class="text-gray-400 w-5 h-5" /></span>
        <input id="register-email" v-model="registerForm.email" type="email" :placeholder="t('register.emailPlaceholder')" class="form-input flex-1 bg-transparent border-0 focus:ring-0 px-2 py-2" required />
      </div>
      <div v-if="emailError" class="text-red-500 text-xs mt-1 flex items-center gap-1">
        <Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
        {{ t('register.emailError') }}
      </div>
    </div>
    <div class="relative">
      <label for="register-password" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('register.password') }}</label>
      <div :class="[
        'flex items-center border rounded-lg bg-gray-50 dark:bg-gray-900 focus-within:ring-2',
        passwordValid ? 'border-green-500 focus-within:ring-green-400' : registerForm.password ? 'border-red-500 focus-within:ring-red-400' : 'border-gray-300 dark:border-gray-700'
      ]">
        <span class="pl-3"><Icon icon="mdi:lock-outline" class="text-gray-400 w-5 h-5" /></span>
        <input id="register-password" v-model="registerForm.password" type="password" :placeholder="t('register.passwordPlaceholder')" class="form-input flex-1 bg-transparent border-0 focus:ring-0 px-2 py-2" required />
      </div>
      <div v-if="passwordError" class="text-red-500 text-xs mt-1 flex items-center gap-1">
        <Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
        {{ t('register.passwordError') }}
      </div>
    </div>
    <div class="relative">
      <label for="register-username" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('register.username') }}</label>
      <div :class="[
        'flex items-center border rounded-lg bg-gray-50 dark:bg-gray-900 focus-within:ring-2',
        usernameValid ? 'border-green-500 focus-within:ring-green-400' : registerForm.username ? 'border-red-500 focus-within:ring-red-400' : 'border-gray-300 dark:border-gray-700'
      ]">
        <span class="pl-3"><Icon icon="mdi:account-outline" class="text-gray-400 w-5 h-5" /></span>
        <input id="register-username" v-model="registerForm.username" type="text" :placeholder="t('register.usernamePlaceholder')" class="form-input flex-1 bg-transparent border-0 focus:ring-0 px-2 py-2" required />
      </div>
      <div v-if="usernameError" class="text-red-500 text-xs mt-1 flex items-center gap-1">
        <Icon icon="mdi:alert-circle-outline" class="w-4 h-4" />
        {{ t('register.usernameError') }}
      </div>
    </div>
    <button type="submit" :disabled="loading || !canSubmit" class="w-full text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-lg text-base px-5 py-2.5 flex items-center justify-center gap-2 transition-all duration-150 shadow-md">
      <Icon icon="mdi:account-plus" class="w-5 h-5" />
      {{ t('register.submit') }}
    </button>
    <div v-if="loading" class="text-green-600 flex items-center gap-2 justify-center">
      <Icon icon="mdi:loading" class="animate-spin w-5 h-5" /> {{ t('register.loading') }}
    </div>
    <div v-if="auth.registerStatus === 'error'" class="text-red-600 text-sm flex items-center gap-2 justify-center">
      <Icon icon="mdi:alert-circle-outline" class="w-5 h-5" />
      {{ t('register.error', { message: auth.registerError?.message }) }}
    </div>
    <div class="flex items-center justify-center">
      <span class="text-gray-500 dark:text-gray-400 mr-2">{{ t('register.hasAccount') }}</span>
      <RouterLink :to="{ name: 'login' }" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold transition cursor-default">
        <Icon icon="mdi:login-variant" class="w-5 h-5" /> {{ t('register.loginLink') }}
      </RouterLink>
    </div>
  </form>
</template>
