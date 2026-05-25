# Contributing

Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) first. This file covers
day-to-day workflow only.

## Requirements

- Node `>=22` (see [`.nvmrc`](./.nvmrc))
- Bun `>=1.3`

## Setup

```bash
bun install
cp .env.local.example .env.local   # then fill in real values
bun run dev
```

## Scripts

| Script                | What it does                                   |
| --------------------- | ---------------------------------------------- |
| `bun run dev`         | Next.js dev server (Turbopack).                |
| `bun run build`       | Production build. Runs in CI on every PR.      |
| `bun run start`       | Serve the production build locally.            |
| `bun run lint`        | ESLint over the whole tree.                    |
| `bun run typecheck`   | `tsc --noEmit`. Zero errors required to merge. |
| `bun run test`        | Vitest run-once.                               |
| `bun run test:watch`  | Vitest watcher.                                |
| `bun run test:e2e`    | Playwright (golden-path E2E).                  |
| `bun run format`      | Prettier write across the repo.                |
| `bun run check:hooks` | Report custom-hook file sizes vs the budget.   |

## Branch / commit / PR

- Branch off `main`. Name it `<scope>/<short-summary>` —
  `auth/refresh-token`, `dashboard/empty-state`, `chore/bump-next`.
- Conventional Commits for messages (`feat:`, `fix:`, `refactor:`,
  `chore:`, `docs:`, `test:`, `perf:`, `build:`).
- One PR = one logical change. Keep them under ~400 LOC of diff. If
  larger, split it.
- Every PR must pass CI: lint, typecheck, test, build.
- Use the PR template; check every box.

## Verification gates

Every push goes through three checkpoints. Each catches a different class
of mistake; do not skip any.

### 1. On commit — `pre-commit` via Husky

Runs `lint-staged` on the files you staged:

- **Prettier `--write`** — formats `.ts`/`.tsx`/`.md`/`.json`/`.yml`.
- **ESLint `--fix`** — auto-fixes what it can, fails the commit on
  anything left. Including the architectural rules:
  - Pages can only import features through their barrel.
  - UI files can't import axios or the API factory directly.
  - Services can't import React, axios, or react-query.
  - `api/` can't depend on services / hooks / store / ui.
  - `React.createContext` is forbidden outside `components/providers/`.
  - Plus the usual: `no-console`, `no-any`, type-only imports, unused
    vars, React Query plugin rules.

You'll see this happen automatically when you `git commit`. If you need
to bypass it for an emergency (don't), `git commit --no-verify`.

### 2. On push — `pre-push` via Husky

```bash
bun run typecheck    # zero errors required
bun run test         # all Vitest specs pass
bun run check:arch   # hook-size budget + kebab-case filenames
```

A failing typecheck, unit test, hard-ceiling hook size, or non-kebab
filename **blocks the push**. Soft warnings (hook over budget but under
ceiling) print but don't block — they're the prompt for reviewers.

### 3. In CI — `.github/workflows/ci.yml`

- `verify` job: lint, typecheck, unit tests, production build.
- `e2e` job (after verify): Playwright golden-path suite against the
  production build.

If something failed locally on `pre-push` and you pushed `--no-verify`,
CI still catches it. But CI is a feedback loop measured in minutes; the
local hooks are seconds. Use them.

### What's still review-only

A small set of judgement calls can't be lint-enforced and live in the PR
template instead:

- Hook return surface ≤ ~8 keys.
- Hook does one thing, named after a verb/noun, not a page.
- "Business logic belongs in a service, not a hook or component" —
  beyond the import bans the linter already enforces.
- Domain typing — no `GeneralObject` leaking where a real model exists.
- Meaningful test coverage of `services/`.

See [`ARCHITECTURE.md` §What's automated vs. what's reviewed](./ARCHITECTURE.md#whats-automated-vs-whats-reviewed)
for the full responsibility split.

`bun run check:hooks` exists to give the author and reviewer a quick
quantitative signal before that review.

### Manual pre-PR sweep (recommended)

If your change is non-trivial, run everything once locally before opening
the PR:

```bash
bun run format
bun run lint
bun run typecheck
bun run test
bun run check:hooks
bun run test:e2e   # only if you touched a flow the e2e suite covers
```

If you touched the `services/` layer of a feature, add or extend its
tests. The services layer is your unit-test surface.

## Pulling in another feature

You may **only** import from another feature through its `index.ts`
barrel:

```ts
import { useAuth } from "@/features/auth" // ✅
import { dial } from "@/features/auth/services/x" // ❌
```

If something you need isn't exported, add it to the barrel and explain
why in the PR.

## Adding a new feature

1. Create `features/<name>/{api,services,hooks,schemas,types,ui}/`.
2. Declare the endpoints in `api/`.
3. Write pure helpers in `services/` with tests.
4. Compose them into hooks under `hooks/`.
5. Render with components under `ui/`.
6. Expose the public surface from `features/<name>/index.ts`.
7. Wire it into the route at `app/<segment>/page.tsx`.

If you find yourself needing a new top-level folder, propose it in
`#frontend-arch` before merging.

## Adding a dependency

- Justify it in the PR description: why this and not an existing dep,
  bundle cost, maintenance status.
- Lock with `bun add <pkg>` so the lockfile updates.
- Avoid adding dev tools that overlap with what's already configured
  (we already have Prettier, ESLint, Vitest, TypeScript).

## Style

Prettier and ESLint enforce most of it. The conventions that aren't
mechanical:

- No inline arrows in JSX event handlers. Name your functions.
- Files over ~200 LOC: split.
- One default export per UI file. Named exports for everything else.
- **Hooks stay small.** One responsibility, ≤ ~8 return keys, ≤ ~100 LOC.
  No `useDashboard()` / `useAdmin()` god-hooks. Push logic into services
  and global state into Zustand — the hook only wires what React requires.
  See [`ARCHITECTURE.md` §Hooks](./ARCHITECTURE.md#hooks-keep-them-small).
- `services/` is React-free. If you `import * as React` from a service,
  you're in the wrong file.
