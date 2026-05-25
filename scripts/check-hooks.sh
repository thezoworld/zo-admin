#!/usr/bin/env bash
# Reports custom-hook file sizes against the ARCHITECTURE.md budgets.
#
# Budgets:
#   - Standard hook:        ≤ 100 LOC body (~150 LOC file)
#   - Orchestrator hook:    ≤ 150 LOC body (~250 LOC file)
#
# This script is INFORMATIONAL — it prints a report but exits 0 unless a
# hook crosses the hard ceiling (300 LOC file). The hard rule is enforced
# by code review, with the file-size signal here as the prompt.
#
# Run via `bun run check:hooks`. Also runs as part of `pre-push` (warning).

set -u

STANDARD_BUDGET=150   # file LOC
ORCHESTRATOR_BUDGET=250
HARD_CEILING=300

# Hooks that are documented orchestrators (allowed up to ORCHESTRATOR_BUDGET).
ORCHESTRATORS=(
  "features/auth/hooks/use-login-flow.ts"
)

is_orchestrator() {
  local file="$1"
  for o in "${ORCHESTRATORS[@]}"; do
    if [ "$file" = "$o" ]; then
      return 0
    fi
  done
  return 1
}

violations=0
warnings=0

# All custom hooks: files in `hooks/` directories named use-*.ts.
files=$(find features hooks -type f -name "use-*.ts" 2>/dev/null | sort)

if [ -z "$files" ]; then
  echo "No hook files found."
  exit 0
fi

printf "%-58s %6s   %s\n" "file" "lines" "budget"
printf -- "------------------------------------------------------------------------------\n"

while IFS= read -r file; do
  lines=$(wc -l < "$file" | tr -d ' ')

  if is_orchestrator "$file"; then
    budget=$ORCHESTRATOR_BUDGET
    label="orchestrator"
  else
    budget=$STANDARD_BUDGET
    label="standard"
  fi

  if [ "$lines" -gt "$HARD_CEILING" ]; then
    status="✗ HARD CEILING ($HARD_CEILING)"
    violations=$((violations + 1))
  elif [ "$lines" -gt "$budget" ]; then
    status="⚠ over $label budget ($budget)"
    warnings=$((warnings + 1))
  else
    status="ok"
  fi

  printf "%-58s %6s   %s\n" "$file" "$lines" "$status"
done <<< "$files"

echo ""
if [ "$violations" -gt 0 ]; then
  echo "✗ $violations hook(s) past the hard ceiling. See ARCHITECTURE.md §Hooks."
  exit 1
fi

if [ "$warnings" -gt 0 ]; then
  echo "⚠ $warnings hook(s) over budget. Consider splitting; see ARCHITECTURE.md §Hooks."
  echo "  (This is a soft warning — pushes are not blocked.)"
fi

exit 0
