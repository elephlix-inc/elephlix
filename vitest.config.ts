import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      include: ["tests/**/*.ts"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      passWithNoTests: true,
    },
  }),
);
