// Conventional Commits — see https://www.conventionalcommits.org
//
// Format: <type>(<optional scope>): <subject>
// Examples:
//   feat(auth): add OTP rate limit
//   fix(dashboard): handle empty operator list
//   chore(deps): bump react 19.2.4 -> 19.3.0
//
// Enforced by the commit-msg Husky hook. Bypass only in emergencies with
// `git commit --no-verify` (and explain why in the PR).

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Subjects can be slightly longer than the default 72 chars — we
    // sometimes need them for tight scope+context.
    "header-max-length": [2, "always", 100],
    "body-max-line-length": [1, "always", 100],
    // Keep the recognized type set tight. Mirrors what's in CONTRIBUTING.md.
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "chore",
        "docs",
        "test",
        "perf",
        "build",
        "ci",
        "style",
        "revert",
      ],
    ],
  },
}
