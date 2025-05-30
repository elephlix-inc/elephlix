import {
  SUPPORT_LOCALES,
  i18n,
  loadLocaleMessages,
  setI18nLanguage,
} from "@/services/i18n";
import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/:locale",
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "video/:slug",
          name: "video",
          component: () => import("@/views/VideoView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("@/views/ProfileView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "login",
          name: "login",
          component: () => import("@/views/LoginView.vue"),
        },
        {
          path: "register",
          name: "register",
          component: () => import("@/views/RegisterView.vue"),
        },
        {
          path: "logout",
          name: "logout",
          redirect: () => {
            const auth = useAuthStore();
            auth.logout();

            return { name: "login" };
          },
        },
        {
          path: ":pathMatch(.*)*",
          name: "not-found",
          component: () => import("@/views/NotFoundView.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const token = localStorage.getItem("token");
  const paramsLocale = to.params.locale as string;

  if (!SUPPORT_LOCALES.includes(paramsLocale)) {
    const navigatorLocale = navigator.language.split("-")[0];

    if (SUPPORT_LOCALES.includes(navigatorLocale)) {
      return next(`/${navigatorLocale}`);
    }

    return next(`/${i18n.global.fallbackLocale.value}`);
  }

  if (!i18n.global.availableLocales.includes(paramsLocale)) {
    await loadLocaleMessages(i18n, paramsLocale);
  }

  setI18nLanguage(i18n, paramsLocale);

  if (to.meta.requiresAuth && !token) {
    return next({ name: "login", params: { locale: paramsLocale } });
  }

  next();
});

export default router;
