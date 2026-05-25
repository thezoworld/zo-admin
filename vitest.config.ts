import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "tests/e2e/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "lcov"],
      reportsDirectory: "./coverage",
      include: ["features/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "hooks/**/*.ts"],
      exclude: [
        "**/*.{test,spec}.{ts,tsx}",
        "**/index.ts",
        "**/types/**",
        "**/schemas/**",
        "features/**/ui/**", // UI tested via Playwright
        "features/**/api/**", // declarative factories, no logic
        "features/**/store/**", // Zustand stores tested indirectly via hooks/UI
        "features/**/providers/**",
      ],
      // Services are the unit-test surface. They must stay well-covered.
      thresholds: {
        // Global floor — keeps the codebase honest as it grows.
        lines: 60,
        functions: 60,
        statements: 60,
        branches: 50,
        // Services are the unit-test surface. Higher bar.
        "features/**/services/**": {
          lines: 85,
          functions: 85,
          statements: 85,
          branches: 75,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
