/// <reference types="vitest/config" />

import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // XXX
  // 型エラーが発生するので一時的な対処
  plugins: [react(), tailwindcss() as PluginOption[]],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["./src/test/*.test.ts(x)?"],
  },
});
