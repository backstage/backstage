---
name: mui-to-bui-migration
description: |
  Recipe-first Material-UI → Backstage UI migration via
  @backstage/mui4-to-bui-migration-recipe, then leftover cleanup. Use when
  migrating MUI to BUI, dry-running the mui4-to-bui recipe, or resolving
  TODO(backstage-codemod) after a BUI migration.
---

# MUI to BUI migration

Run the published _recipe_ (`@backstage/mui4-to-bui-migration-recipe`) first,
then finish _leftovers_ the recipe cannot migrate safely. The recipe owns
mechanical transforms; this skill owns dry-run → apply → leftover cleanup →
verify.

## Workflow

### 1. Confirm target

Identify the app or package path to migrate (for example `.` for an app root,
or a plugin directory). Use the published registry recipe.

Done when: the target path is agreed. Maintainers testing an unpublished
recipe: follow local-run instructions in the
[codemods repository](https://github.com/backstage/codemods) instead of the
commands below.

### 2. Baseline

Prefer a clean git tree so recipe edits are easy to review.

Done when: `git status` is clean, or dirty files are listed and accepted as
pre-existing.

### 3. Dry-run the recipe

```shell
yarn dlx codemod run @backstage/mui4-to-bui-migration-recipe \
  --target <path-to-app-or-package> \
  --dry-run
```

Always dry-run the target before apply. The summary surfaces scope and metrics
(for example Button `outlined` → `secondary`).

Done when: dry-run finished for the agreed target; you have noted metrics /
expected TODOs, or confirmed no matching files.

### 4. Apply the recipe

```shell
yarn dlx codemod run @backstage/mui4-to-bui-migration-recipe \
  --target <path-to-app-or-package>
```

Run only the full recipe so bootstrap → transforms → `remove-mui-dependencies`
stay in order (cleanup last).

Ordered package list and heuristics:
[mui4-to-bui-migration-recipe README](https://github.com/backstage/codemods/tree/main/codemods/misc/mui4-to-bui-migration-recipe).

Done when: apply finished for the agreed target with no recipe CLI failure.

### 5. Resolve leftovers

1. Search for `TODO(backstage-codemod)`. Resolve each marker, or defer with an
   explicit reason.
2. Search for remaining `@material-ui/` and `@mui/` imports.
3. Read `references/out-of-scope.md` when a leftover has no safe automated
   mapping.
4. Read `references/leftover-cleanup.md` when finishing tokens, icons, or
   ambiguous layout after the mechanical pass.

Prefer the recipe README over older skill text, blog posts, or cached mapping
tables when they disagree (for example Paper heuristics in the layout step).

Done when: every `TODO(backstage-codemod)` in scope is resolved or deferred
with a reason, and remaining MUI usage is only cases listed in
`references/out-of-scope.md`.

### 6. Verify

- Run the type checker on affected packages (`yarn tsc` from a Backstage
  monorepo root, or the package's usual check).
- Run targeted tests for migrated packages.
- Spot-check UI in light and dark mode where styles changed.

Done when: the type checker and targeted tests are green for the migrated
packages.

## Success criteria

Migration is complete when steps 3 through 6 are done for the agreed target: recipe
dry-run and apply finished, leftovers closed per step 5, and verify green.
