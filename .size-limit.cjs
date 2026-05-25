// Bundle-size budgets.
//
// Why .cjs? size-limit reads its config synchronously and CJS keeps this
// simple. The numbers below are gzipped sizes for the production build.
// Bump them deliberately — every bump should appear in a PR with a reason.
//
// To check locally: `bun run build && bunx size-limit`.

module.exports = [
  {
    name: "Client JS — shared framework + first-load",
    path: ".next/static/chunks/**/*.js",
    limit: "350 KB",
    gzip: true,
  },
  {
    name: "Per-page bundles (app router)",
    path: ".next/static/chunks/app/**/*.js",
    limit: "120 KB",
    gzip: true,
  },
  {
    name: "Total CSS",
    path: ".next/static/css/**/*.css",
    limit: "60 KB",
    gzip: true,
  },
]
