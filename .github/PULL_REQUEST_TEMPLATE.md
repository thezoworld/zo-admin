## What

<!-- One sentence describing the change. -->

## Why

<!-- Link the issue / context. What problem are we solving? -->

## How

<!-- Brief description of the approach + anything reviewers should pay
     particular attention to. -->

## Automated gates

These run for you via Husky + CI. Confirm they passed:

- [ ] `pre-commit` ran clean (Prettier + ESLint on staged files).
- [ ] `pre-push` ran clean (`typecheck` + `test` + `check:hooks`).
- [ ] CI green: lint, typecheck, unit tests, build, Playwright E2E.

## Self-review (humans only — lint can't catch these)

- [ ] Reviewed [`ARCHITECTURE.md`](../ARCHITECTURE.md) — change respects
      the layering and naming rules.
- [ ] No business logic in UI files. `services/` owns transforms /
      payload-building / parsing.
- [ ] No inline arrows in JSX event handlers.
- [ ] **Hooks stay small.** New / changed hooks:
  - One sentence describes what each does.
  - Named after the verb / noun, not a page (`useBookings`, not
    `useDashboard`).
  - Return ≤ ~8 keys.
  - Body ≤ ~100 LOC (standard) or ≤ ~150 LOC (documented orchestrator).
  - `bun run check:hooks` shows nothing over budget for new code.
- [ ] Global state lives in a Zustand store under
      `features/<feature>/store/`, not in a hook.
- [ ] Added/updated tests under the relevant `services/` (and hooks
      where state is non-trivial).
- [ ] No new top-level folder without an RFC.
- [ ] Updated `.env.example` if I added a new env var.
- [ ] Updated `CONTRIBUTING.md` / `ARCHITECTURE.md` if conventions
      changed.

## Screenshots / recordings

<!-- For UI changes. -->
