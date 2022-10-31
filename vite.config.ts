/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["./lib/__fixtures__/**/*"],
      provider: "istanbul",
      reporter: ["text", "lcov"],
    },
  },
});
