#!/usr/bin/env bash
# Enforces kebab-case for all .ts/.tsx files under app/, features/, lib/,
# hooks/, components/, scripts/, tests/.
#
# Allowed file basenames (without extension):
#   - kebab-case: foo-bar, login-form, use-login-flow
#   - Next.js / React conventions (allowlisted): page, layout, loading,
#     error, not-found, route, middleware, instrumentation, default,
#     template, head, sitemap, robots, opengraph-image, twitter-image,
#     icon, apple-icon, manifest
#
# Run via `bun run check:naming`. Fails the script on any violation.

set -u

dirs=(app features lib hooks components scripts tests)

allowed_special=(
  page layout loading error not-found route middleware instrumentation
  default template head sitemap robots opengraph-image twitter-image
  icon apple-icon manifest
  next-env
)

is_special() {
  local base="$1"
  for s in "${allowed_special[@]}"; do
    if [ "$base" = "$s" ]; then return 0; fi
  done
  return 1
}

is_kebab() {
  # kebab-case = lowercase letters/digits separated by single hyphens,
  # may include extra extensions before .ts/.tsx (e.g. login.schema, foo.service.test).
  [[ "$1" =~ ^[a-z0-9]+(\.[a-z0-9]+)*(-[a-z0-9]+(\.[a-z0-9]+)*)*$ ]]
}

violations=0

# Build the file list, excluding node_modules / .next.
files=$(find "${dirs[@]}" -type f \( -name "*.ts" -o -name "*.tsx" \) \
  ! -path "*/node_modules/*" ! -path "*/.next/*" 2>/dev/null | sort)

for file in $files; do
  base=$(basename "$file")
  # Strip all extensions starting from the rightmost .ts or .tsx.
  stem="${base%.tsx}"
  stem="${stem%.ts}"

  if is_special "$stem"; then continue; fi
  if is_kebab "$stem"; then continue; fi

  echo "✗ Non-kebab-case filename: $file"
  violations=$((violations + 1))
done

if [ "$violations" -gt 0 ]; then
  echo ""
  echo "$violations file(s) violate the kebab-case rule."
  echo "See ARCHITECTURE.md §Naming."
  exit 1
fi

echo "✓ All filenames are kebab-case."
exit 0
