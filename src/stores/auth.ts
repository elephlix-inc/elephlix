import axios from "@/services/axios";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/auth";
import type { User } from "@/types/data";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const queryClient = useQueryClient();

  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axios.post<AuthResponse>(
        "/auth/login",
        credentials,
      );

      return data;
    },
    onSuccess: (data: AuthResponse) => {
      user.value = data.user;
      token.value = data.token;

      localStorage.setItem("token", data.token);
    },
  });

  const registerMutation = useMutation<
    AuthResponse,
    Error,
    RegisterCredentials
  >({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await axios.post<AuthResponse>(
        "/auth/register",
        credentials,
      );

      return data;
    },
    onSuccess: (data: AuthResponse) => {
      user.value = data.user;
      token.value = data.token;

      localStorage.setItem("token", data.token);
    },
  });

  function logout(): void {
    user.value = null;
    token.value = null;

    localStorage.removeItem("token");
    queryClient.clear();
  }

  async function refresh(): Promise<void> {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      user.value = null;
      token.value = null;

      return;
    }

    token.value = savedToken;

    try {
      const res = await axios.get<User>("/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      user.value = res.data;
    } catch {
      user.value = null;
      token.value = null;

      localStorage.removeItem("token");
    }
  }

  async function ensureAuthReady() {
    if (user.value && token.value) return;

    refresh();
  }

  watch(
    token,
    (newToken) => {
      if (newToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        return;
      }

      axios.defaults.headers.common.Authorization = undefined;
    },
    { immediate: true },
  );

  return {
    user,
    token,
    isLoggedIn: computed(() => !!user.value && !!token.value),
    login: loginMutation.mutate,
    loginStatus: loginMutation.status,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerStatus: registerMutation.status,
    registerError: registerMutation.error,
    logout,
    refresh,
    ensureAuthReady,
  };
});
