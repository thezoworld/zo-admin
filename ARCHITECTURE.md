# Architecture

This document is the single source of truth for how this repository is
organised and how code is written. It exists so a thousand engineers can
contribute without stepping on each other.

If something here disagrees with the code, the document wins — fix the
code or update the document. Don't quietly drift.

## TL;DR

- **Routes (`app/`)** stay thin. They compose features.
- **Features (`features/<name>/`)** are vertical slices. They own their API,
  state, services, schemas, types and UI.
- **Shared (`lib/`)** is cross-cutting only. Never feature-specific.
- **Layering inside a feature is strict:**
  `api → services → hooks → ui`. Lower layers never import from higher ones.
- **Files have one responsibility.** UI files render. Service files
  compute. Hook files orchestrate. API files declare endpoints.
- **Hooks stay small.** Business logic → services. Global state → Zustand.
  Hooks do _only_ the orchestration React requires. No `useDashboard()`
  god-hooks.
- **No inline functions in JSX.** Pull handlers out and name them.

---

## Folder structure

```
app/                       Next.js routes. Thin compositions of features.
  api/                     Route handlers (server). Use sparingly.
  <segment>/
    layout.tsx
    page.tsx
    loading.tsx            Per-segment skeleton.

features/<feature>/
  api/                     Endpoint declarations (defineQuery/defineMutation).
                           NEVER invoked here — these are factories.
  services/                Pure TypeScript. No React. No fetch. No state.
                           Inputs in, outputs out. Easy to unit-test.
  hooks/                   React hooks. Compose api + services + state.
  schemas/                 Zod schemas (form + response validation).
  types/                   Domain TS types and DTOs.
  ui/                      React components. Render props, emit events.
                           No business logic, no API calls.
  providers/               (Optional) React context providers.
  messages/                (Optional) Feature-specific strings.
  index.ts                 Public surface. Other features import from
                           this barrel only.

lib/                       Cross-cutting only. Used by ≥ 2 features.
  api/                     Axios clients, factory, merged endpoint registry.
  auth/                    createAuthStore primitive + shared storage helpers.
  definitions/             Cross-cutting types (User, GeneralObject, …).
  messages/                i18n strings shared by ≥ 2 features.
  validations/             Reusable zod primitives.
  env.ts                   Runtime env validation (single source of truth).
  utils.ts                 Tiny shared helpers (cn, etc.).

components/                Shared UI primitives only (shadcn-style).
                           Anything feature-specific lives under features/.
hooks/                     Generic hooks usable by ≥ 2 features.
```

### Rules of thumb

| Decision                                     | Lives in                        |
| -------------------------------------------- | ------------------------------- |
| Used by exactly one feature                  | `features/<feature>/...`        |
| Used by two or more features                 | `lib/...` (or `components/ui/`) |
| Pure logic with no React or network          | `features/<feature>/services/`  |
| A React Query hook calling a single endpoint | `features/<feature>/hooks/`     |
| An axios call with a path string             | `features/<feature>/api/`       |
| A zod schema validating a form               | `features/<feature>/schemas/`   |
| A page that renders a feature                | `app/.../page.tsx`              |
| A reusable Button, Input, Card primitive     | `components/ui/`                |

---

## The layered model inside a feature

```
api/        ──▶ services/  ──▶ hooks/  ──▶ ui/
            ▲                ▲          ▲
            └── schemas/types are referenced from any layer
```

**Dependency direction is strict.**
`ui/` may import from `hooks/`, `services/`, `schemas/`, `types/`.
`hooks/` may import from `api/`, `services/`, `schemas/`, `types/`.
`services/` may import from `schemas/`, `types/` — **nothing else.**
`api/` may import from `schemas/`, `types/` and `lib/api/factory`.

`services/` files are the **only** place complex business logic lives.
This is the layer you unit-test the most heavily.

### What goes in `services/`

- Building API request payloads from form values.
- Parsing/normalising API responses into domain models.
- Pure computations (role checks, price formatting, date math).
- Strategy / dispatch logic.

### What goes in `hooks/`

- `useQuery`/`useMutation` wrappers around an endpoint.
- Composition of multiple endpoints into a single flow
  (`useLoginFlow` is the canonical example).
- React state owned by the feature.

### What goes in `ui/`

- React components that take props and render markup.
- Event handlers that call into hook return values — never API directly.

### What goes in `api/`

```ts
export const fooApi = {
  FOO_LIST: defineQuery<FooListResponse>({
    server: zoServer,
    path: "/api/v1/foo",
    key: ["foo", "list"],
  }),
  FOO_CREATE: defineMutation<CreateFooRequest, Foo>({
    server: zoServer,
    path: "/api/v1/foo",
  }),
}
```

Each endpoint is a **declaration**, not a call. Hooks call them.

---

## Hooks: keep them small

The single biggest long-term risk in this repo is hook bloat — `useDashboard`,
`useAdmin`, `useBookingsPage` becoming 400-line meta-hooks that hide business
logic, orchestrate seven queries, and own UI filter state at the same time.
The rules below exist to prevent that.

### Hard rules

1. **A hook does one thing.** If you can't describe it in one sentence
   ("orchestrates the phone+OTP login flow"), split it.
2. **Name hooks after a verb or noun phrase — never a route or a page.**
   ✅ `useBookings`, `useLoginFlow`, `useBlockRoom`, `useUnreadCount`,
   `useRecaptcha`.
   ❌ `useDashboard`, `useAdminPage`, `useOverview`, `useReports`.
3. **A hook's job is to wire, not to compute.** Conditional business logic
   (`if (role === "admin") …`, payload shapes, response parsing) belongs
   in a service. The hook calls the service.
4. **Global state never lives in a hook.** Lift it to a Zustand store; the
   hook just reads from the store.
5. **Hook return surface ≤ ~8 keys.** If you're past that, the consumer is
   reading the wrong abstraction — split into narrower hooks.
6. **Hook body ≤ ~100 LOC.** Beyond that, extract services and helpers
   until it fits. `useLoginFlow` is the upper bound we tolerate; anything
   bigger should split.
7. **Pages compose hooks; hooks don't compose pages' worth of concerns.**
   The dashboard overview page calls `useAuthorization()` + `useBookings()`
   independently. It does NOT call a `useOverviewPage()` that bundles both.

### Patterns to use

- **One hook per resource.** `useBookings`, `useCheckins`, `useReports`.
  Each owns a single endpoint family.
- **One hook per orchestrated flow.** `useLoginFlow`, future
  `useBlockRoomFlow`. These coordinate several mutations + transient state
  for a single multi-step interaction.
- **One hook per Zustand slice.** `useAuth`, `useZostelAuth`,
  `useSelectedOperatorStore`. Each returns a narrow projection of one
  store.

### Smells that mean "split this hook now"

- It returns more than ~8 things.
- It calls more than 2 `useQuery`s and isn't an orchestration flow.
- It owns local state for filters AND data fetching AND form state at the
  same time.
- Its name ends in `Page`, `Dashboard`, `Admin`, `Manager`, `Container`.
- It's the only hook a page uses.
- You're tempted to add a parameter to "configure" what it returns.

### Where the work actually belongs

| Type of code                                       | Lives in                     |
| -------------------------------------------------- | ---------------------------- |
| Pure transforms / payload builders / parsers       | `services/`                  |
| Cross-page / cross-feature mutable state           | Zustand store under `store/` |
| Single API call + the React state needed to use it | a focused `useX()` hook      |
| Multi-step user flow                               | a focused `useXFlow()` hook  |
| Composition of multiple hooks for one screen       | the page component itself    |

---

## Naming

### Files

- `kebab-case.ts` / `kebab-case.tsx` always.
- Component files match the default export's PascalCase: `LoginForm` lives in
  `login-form.tsx` and is re-exported by the feature barrel.
- Test files sit beside the unit under test: `foo.service.ts` ↔
  `foo.service.test.ts`.
- One default export per UI file. Named exports for everything else.

### Functions

- **Named functions everywhere.** No anonymous arrow expressions in JSX
  event handlers. Pull them out and name them.

  ```tsx
  // ❌
  ;<Button onClick={() => doStuff(thing)} />

  // ✅
  function handleClick() {
    doStuff(thing)
  }
  ;<Button onClick={handleClick} />
  ```

- Verb-noun for actions (`buildPhonePayload`, `formatExpiry`, `parseUser`).
- `is`/`has`/`should` for boolean predicates (`isExpiryValid`,
  `hasAccess`, `shouldRefresh`).
- `useXxx` for hooks. Always a custom hook for any non-trivial component
  state.

### Types

- `PascalCase` for types and interfaces.
- Prefer `type` aliases unless you need declaration merging.
- Domain types in `features/<feature>/types/`. Shared in `lib/definitions/`.
- Suffix DTOs with their direction: `LoginMobileRequest`, `LoginMobileResponse`.
- Suffix zod-inferred form types with `FormValues`:
  `LoginPhoneFormValues = z.infer<typeof loginPhoneSchema>`.

### Constants

- `SCREAMING_SNAKE_CASE` for module-scope constants
  (`const SESSION_COOKIE = "zo_session"`).
- Group enum-like constants into `as const` objects, not TS `enum`.

---

## Imports

Order, with one blank line between groups:

1. `react`, `next/...`
2. Third-party packages (`axios`, `@tanstack/...`, `zod`, etc.)
3. `@/lib/...` (cross-cutting)
4. `@/components/...` (shared UI primitives)
5. `@/features/...` (other features — through their barrel only)
6. Relative imports `./...`

Inside each group: alphabetical.

Never reach into another feature's internals:

```ts
// ❌
import { dialCodeFor } from "@/features/auth/services/login.service"

// ✅
import { dialCodeFor } from "@/features/auth"
```

---

## State management

- **Server state:** React Query. Always.
- **Auth / session / profile state:** **Zustand** stores under
  `features/<feature>/store/`, persisted via `persist` middleware with
  cross-tab `storage`-event sync. Public read hooks (`useAuth`,
  `useZostelAuth`) wrap the store with a `useShallow` selector.
- **Cross-cutting UI state (selected operator, sidebar, notifications,
  unread counters, chat sockets/messages):** Zustand stores. Always.
- **URL state:** `useSearchParams` from `next/navigation`.
- **Form state:** React Hook Form + Zod.
- **Local UI state:** `useState` / `useReducer` inside the component or
  hook that owns it.
- **React Context:** reserved for tree-bound providers only —
  `QueryClientProvider`, `ThemeProvider`, `TooltipProvider`. Don't create
  new contexts for app state.

### Why Zustand and not Context for app state

- Context re-renders every consumer on any value change; Zustand
  selectors scope re-renders to the actual slice read.
- Zustand stores are accessible from non-React code (axios interceptors,
  websocket factories, services) via `useStore.getState()`.
- `persist` middleware handles localStorage + cross-tab sync.
- Stores are plain objects — trivial to unit-test without a React tree.

When you need a new global store:

1. Create `features/<feature>/store/<name>-store.ts`.
2. Define state + actions; wrap in `persist` if it should survive reload.
3. Expose a narrow read hook with `useShallow` selectors.
4. Add a cross-tab `storage` listener that calls `store.persist.rehydrate()`
   if the data is sensitive to that.

---

## Forms

- **React Hook Form + Zod** through `@hookform/resolvers/zod`.
- The schema lives in `features/<feature>/schemas/`.
- The form's `useForm` call lives in a hook, not the component.
- The UI component receives the form via props and renders inputs.

---

## Error handling

- Network errors are inspected via `errorStatus(err)` and `errorMessage(err)`
  from `@/lib/api`. Never reach into `err.response.data` directly.
- 401/403 is handled globally in the QueryProvider — no per-call logic.
- Validation errors surface through React Hook Form (`setError`) or zod
  schema errors. Never via `throw` from a service.
- Toasts/banners are for unexpected failures only; the form's own error
  display owns expected failures.

---

## Observability

We use **Sentry** for error tracking and request-level error reporting.
It is the **only** observability backend; do not add a parallel one.

### Files

| File                      | Purpose                                                                                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sentry.client.config.ts` | SDK init for the browser bundle.                                                                                                                                                     |
| `sentry.server.config.ts` | SDK init for Node.js runtime (server actions, RSC).                                                                                                                                  |
| `sentry.edge.config.ts`   | SDK init for the Edge runtime (middleware).                                                                                                                                          |
| `instrumentation.ts`      | Next.js entrypoint. `register()` loads the right config per runtime; `onRequestError` aliases Sentry v10's `captureRequestError` so Next.js's instrumentation contract is satisfied. |
| `next.config.mjs`         | Wraps `nextConfig` with `withSentryConfig` only when a DSN is set. Provides source-map upload, sourcemap hiding, and a tunnel route to dodge ad-blockers.                            |

### Gating

Every config file checks `env.NEXT_PUBLIC_SENTRY_DSN` and **no-ops** if
absent. This means:

- Local dev without a DSN: zero Sentry activity, zero noise.
- CI builds without a DSN: zero source-map upload, zero auth-token usage.
- Production with a DSN: full reporting.

`next.config.mjs` also branches on the DSN — `withSentryConfig` only
wraps when a DSN exists. Removing the env var fully disables Sentry
without code changes.

### What's auto-reported

- Unhandled exceptions in the browser, server, and edge runtimes.
- Errors thrown from Next.js route handlers (via `onRequestError`).
- Errors from React Server Components.

### What you do manually

For most code, **nothing**. Sentry catches the unhandled case.

When you want to attach context to a non-thrown event (a logical "this
shouldn't happen but we recovered"), call `Sentry.captureMessage(...)` or
`Sentry.captureException(...)` directly. Keep these rare — every call is
a paid event.

### Sampling

- Errors: 100% in all environments.
- Traces: 10% in production, 0% in dev/test.
- Session replays on error: 10% in production, 0% in dev/test.
- Session replays in general: 0% (only on-error).

Adjust in `sentry.client.config.ts` / `sentry.server.config.ts` if a
specific release needs higher rates; revert when done.

### DSN handling

- `NEXT_PUBLIC_SENTRY_DSN` is the only Sentry env var that ships to the
  browser. It is safe to expose by design — Sentry DSNs are public.
- `SENTRY_AUTH_TOKEN` is server-only (used by `withSentryConfig` during
  build for source-map upload). Never prefix it with `NEXT_PUBLIC_`.

### When to NOT use Sentry

- Form validation failures. Those are normal user behaviour, not errors.
- 401 / 403 responses. The global QueryProvider handler already converts
  them to a logout — they're an auth UX flow, not an error to report.
- Expected business-rule rejections (booking conflicts, double-blocks,
  etc.). Surface them to the user; don't ping ops.

---

## Tests

Two runners, two purposes — never overlap them:

| Runner         | Tests what                                | Lives in          |
| -------------- | ----------------------------------------- | ----------------- |
| **Vitest**     | Units — services, hooks, small components | beside the source |
| **Playwright** | User flows that cross a route boundary    | `tests/e2e/`      |

### Vitest

- JSDOM environment.
- Co-locate `<thing>.test.ts` next to `<thing>.ts`.
- **Heavily test the `services/` layer.** Pure functions, easy wins.
- Test hooks where they own non-trivial state (test the state machine, not
  the hook plumbing).
- Test components sparingly via `@testing-library/react` — page-level
  only. Don't write "button renders" tests.
- `tests/e2e/**` is excluded so Playwright specs don't accidentally run
  under Vitest.

### Playwright

- Chromium only.
- Spec scope is **golden paths**, not exhaustive coverage. Adding a 30th
  spec is a smell — the new flow probably belongs in Vitest as a hook
  test.
- **Always mock the backend** with `page.route()`. Shared mocks live in
  `tests/e2e/fixtures/api-mocks.ts` and stay in sync with
  `features/*/types/`.
- Pre-seed Zustand stores via `context.addInitScript` when the test
  starts in an "already logged in" state — see
  `session-persistence.spec.ts` for the canonical pattern.
- Don't share state between specs. Each spec installs its own routes.

### Rule of thumb

If you can write it as a service test (`<thing>.service.test.ts`), do
that. Playwright is reserved for what crosses a route boundary, touches
real persistence (localStorage hydration, cookie middleware), or
coordinates multiple Zustand stores end-to-end.

---

## Security

- Tokens are stored in `localStorage` today and migration to httpOnly
  cookies is scaffolded under `app/api/auth/session/` + `middleware.ts`.
  Flip `NEXT_PUBLIC_AUTH_COOKIE_FLOW=on` to opt in when the backend supports it.
- Environment access goes through `lib/env.ts` — never read
  `process.env.X` directly outside of that file.
- Secrets never have `NEXT_PUBLIC_` prefix.

---

## Coding style

- Prettier formats everything. Don't argue with it.
- ESLint catches the rest. Don't disable rules without a comment explaining
  why.
- TypeScript strict mode is on. No `any`. Use `unknown` and narrow.
- No comments that restate the code. Comments explain _why_, not _what_.
- Files over ~200 LOC are a code smell — split.

---

## What's automated vs. what's reviewed

Most rules in this document are enforced — `pre-commit` blocks formatting
and lint violations, `pre-push` blocks typecheck/test/architecture breaks,
CI re-runs the whole battery. The table below makes it explicit so
reviewers know what they're responsible for.

| Rule                                                           | Enforced by                                                |
| -------------------------------------------------------------- | ---------------------------------------------------------- |
| Prettier formatting                                            | `pre-commit` (lint-staged → prettier `--write`)            |
| No `console.log`, only `console.warn`/`error`                  | ESLint `no-console`                                        |
| No `any`                                                       | ESLint `@typescript-eslint/no-explicit-any`                |
| Type-only imports stay separated                               | ESLint `@typescript-eslint/consistent-type-imports`        |
| Unused variables                                               | ESLint `@typescript-eslint/no-unused-vars`                 |
| Pages import features through the barrel only                  | ESLint `no-restricted-imports` on `app/**`                 |
| UI files don't import axios or the API factory                 | ESLint `no-restricted-imports` on `features/*/ui/**`       |
| Services are React-free, network-free, store-free              | ESLint `no-restricted-imports` on `features/*/services/**` |
| `api/` doesn't depend on services / hooks / store / ui         | ESLint `no-restricted-imports` on `features/*/api/**`      |
| `React.createContext` only in `components/providers/`          | ESLint `no-restricted-syntax`                              |
| TypeScript compiles cleanly                                    | `pre-push` (`bun run typecheck`)                           |
| Vitest unit tests pass                                         | `pre-push` (`bun run test`)                                |
| Hook file size budget (150 / 250 / 300)                        | `pre-push` (`bun run check:hooks`)                         |
| Kebab-case filenames                                           | `pre-push` (`bun run check:naming`)                        |
| Production build succeeds                                      | CI (`verify` job)                                          |
| Playwright golden-path E2E                                     | CI (`e2e` job)                                             |
| **No inline arrows in JSX event handlers**                     | ESLint `react/jsx-no-bind` (soft warning) + reviewer       |
| **Layering inside a feature** (api → services → hooks → ui)    | Reviewer (the no-restricted-imports rules cover ~80%)      |
| **"Business logic in services, not hooks or UI"**              | Reviewer (the import bans help but judgement is final)     |
| **Hook return surface ≤ ~8 keys**                              | Reviewer                                                   |
| **Hook does one thing, named after verb/noun not page**        | Reviewer                                                   |
| **Domain model is correctly typed (no `GeneralObject` leaks)** | Reviewer                                                   |
| **Test coverage of `services/` is meaningful**                 | Reviewer                                                   |

The asymmetry is on purpose: anything mechanically detectable is
mechanical. Anything that requires reading the code with intent — naming,
abstraction shape, taste — is human.

---

## When you're unsure

The default move is:

1. Write the pure function as a service.
2. Wrap it in a hook.
3. Render with a UI component.
4. If two features need it, lift it to `lib/`.

If you still don't know where it goes, ask in `#frontend-arch` before
inventing a new top-level folder.
