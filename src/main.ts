import "./assets/main.css";

import {
  QueryClient,
  type QueryFunctionContext,
  VueQueryPlugin,
} from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createApp } from "vue";

import axios from "@/services/axios";
import { i18n } from "@/services/i18n";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async <T>({ queryKey }: QueryFunctionContext): Promise<T> => {
        const url = queryKey[0];
        if (typeof url !== "string") {
          throw new Error("queryKey[0] must be a string URL");
        }

        const response = await axios.get<T>(url);
        return response.data;
      },
    },
  },
});

app.use(createPinia());
app.use(i18n);
app.use(VueQueryPlugin, { queryClient });
app.use(router);

app.mount("#app");
