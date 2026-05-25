import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import pluginQuery from "@tanstack/eslint-plugin-query"
import pluginReact from "eslint-plugin-react"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...pluginQuery.configs["flat/recommended"],

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
  ]),

  // Project-wide rules. The architecture doc is the long-form rationale;
  // this file makes the rules enforceable.
  {
    plugins: { react: pluginReact },
    rules: {
      // Don't ship console.log. console.warn/error stay so we can surface
      // real problems.
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Strict TS — no escape hatch.
      "@typescript-eslint/no-explicit-any": "error",

      // type-only imports stay separated from value imports.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // Unused vars are errors, except _-prefixed args (escape hatch for
      // intentional discards).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Soft warning for inline arrow handlers in JSX. Catches the common
      // case; legitimate exceptions (RHF Controller render, Array map
      // callbacks) won't be flagged because they're not in JSX prop
      // position. When this fires, pull the handler out and name it.
      "react/jsx-no-bind": [
        "warn",
        {
          allowArrowFunctions: false,
          allowBind: false,
          allowFunctions: false,
          ignoreDOMComponents: true,
          ignoreRefs: true,
        },
      ],
    },
  },

  // ---------------------------------------------------------------------
  // Architectural rules: layering + barrels + state-management discipline.
  // ARCHITECTURE.md is the long-form explanation.
  // ---------------------------------------------------------------------

  // Pages compose features through their barrel only — never reach inside.
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*"],
              message:
                "Pages must import from the feature's barrel (@/features/<name>), not its internals.",
            },
          ],
        },
      ],
    },
  },

  // UI layer renders. It never imports axios, the api factory, or the
  // raw mutation/query hooks — those belong in a feature hook.
  {
    files: ["features/*/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message:
                "UI files must not import axios. Move the call into a feature hook.",
            },
          ],
          patterns: [
            {
              group: [
                "@/lib/api/client",
                "@/lib/api/factory",
                "@/hooks/use-mutation-api",
                "@/hooks/use-query-api",
              ],
              message:
                "UI files don't call the network directly. Consume a feature hook (e.g. useBookings) instead.",
            },
          ],
        },
      ],
    },
  },

  // Services are React-free, network-free, store-free. Pure functions in,
  // pure values out. Tests live next to them.
  {
    files: ["features/*/services/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              message:
                "Services are React-free. Move React-touching code to a hook.",
            },
            {
              name: "react-dom",
              message: "Services are React-free.",
            },
            {
              name: "axios",
              message:
                "Services don't make network calls. Build payloads / parse responses; hooks call the network.",
            },
            {
              name: "@tanstack/react-query",
              message:
                "Services don't call useQuery/useMutation. That goes in a hook.",
            },
            {
              name: "zustand",
              message:
                "Services don't touch global state. Read/write via a hook.",
            },
          ],
          patterns: [
            {
              group: ["@/lib/api/client", "@/hooks/use-mutation-api", "@/hooks/use-query-api"],
              message:
                "Services don't call the network. Move this into a hook.",
            },
          ],
        },
      ],
    },
  },

  // API layer is the lowest. It must not depend on services / hooks / ui.
  {
    files: ["features/*/api/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*/services/*",
                "@/features/*/hooks/*",
                "@/features/*/store/*",
                "@/features/*/ui/*",
              ],
              message:
                "The api/ layer is at the bottom of the dependency graph. It must not import services, hooks, store, or ui.",
            },
          ],
        },
      ],
    },
  },

  // Global app state is Zustand, not Context. The handful of legitimate
  // tree-bound providers live under components/providers/ and are allowed.
  {
    files: [
      "features/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
      "app/**/*.{ts,tsx}",
      "hooks/**/*.{ts,tsx}",
    ],
    ignores: ["components/providers/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.name='createContext'], CallExpression[callee.property.name='createContext']",
          message:
            "App state lives in a Zustand store under features/<feature>/store/. Context is reserved for tree-bound providers in components/providers/ (QueryClient, Theme, Tooltip).",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------
  // Tailwind class hygiene — NOT WIRED YET.
  //
  // We tried `eslint-plugin-tailwindcss` (both stable 3.18 and beta 4.0
  // alpha) on 2026-05-24. Both fail to resolve Tailwind v4's CSS-first
  // config from the plugin's worker thread ("Could not resolve tailwindcss").
  // Re-evaluate when the plugin ships a non-alpha v4 release.
  //
  // What we have today:
  //  - Class ORDER is canonicalised by `prettier-plugin-tailwindcss` on save.
  //  - Class contradictions (`p-2 p-4`) are caught by review or runtime
  //    visual inspection (the wrong padding will be visible).
  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------
  // Carve-outs: test files, scripts, Sentry / instrumentation.
  // ---------------------------------------------------------------------

  // Tests can use whatever console / any they need.
  {
    files: [
      "**/*.{test,spec}.{ts,tsx}",
      "vitest.setup.ts",
      "tests/e2e/**/*.{ts,tsx}",
    ],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-restricted-imports": "off",
      "no-restricted-syntax": "off",
    },
  },

  // Sentry / Next.js instrumentation files load at module init and may
  // legitimately use console.
  {
    files: ["sentry.*.config.ts", "instrumentation.ts"],
    rules: {
      "no-console": "off",
    },
  },
])

export default eslintConfig
