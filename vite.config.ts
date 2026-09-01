import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  tanstackStart: {
    server: { entry: "server" },
    nitro: {
      preset: "netlify",
    },
  },
});
