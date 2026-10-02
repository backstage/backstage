---
name: mui-to-bui-migration
description: |
  Migrate Material-UI (MUI) to Backstage UI (BUI) with a codemod or standalone
  guidance. Use when migrating MUI components and styles, running
  @backstage/mui4-to-bui-migration-recipe, or resolving TODO(backstage-codemod)
  after a BUI migration.
---

# MUI to BUI migration

Support two paths through the migration: run the published _recipe_
(`@backstage/mui4-to-bui-migration-recipe`) and finish its leftovers, or migrate
directly using the standalone guidance. Both paths include verification.

## Workflow

### 1. Choose the path and target

Honor a path the user already specified. Otherwise, ask in plain language:

> Would you like to run the codemod and then finish its leftovers, or migrate
> directly with the standalone guidance? I recommend the codemod because it
> handles mechanical changes deterministically and can reduce agent token usage.

Use ordinary conversation so the choice works across agents. Wait for the answer
before migration edits or recipe commands; a recommendation is not a selection.
For an unattended run, require the request to specify the path.

Identify the app or package path to migrate (for example `.` for an app root,
or a plugin directory). If the recipe has already run, continue with its
leftovers in step 4 without repeating it.

Done when: the path and target are clear from the request or the user's answer.

### 2. Baseline

Prefer a clean git tree so recipe edits are easy to review.

Done when: `git status` is clean, or dirty files are listed and accepted as
pre-existing.

### 3. Migrate using the selected path

#### Codemod path

Use the published registry recipe. Maintainers testing an unpublished recipe:
follow local-run instructions in the
[codemods repository](https://github.com/backstage/codemods) instead of the
commands below.

Replace `<path-to-app-or-package>` with the agreed target. Dry-run first:

```shell
yarn dlx codemod run @backstage/mui4-to-bui-migration-recipe \
  --target <path-to-app-or-package> \
  --dry-run
```

Always dry-run the target before apply. The summary surfaces scope and metrics
(for example Button `outlined` → `secondary`).

After a successful dry-run, note the expected changes and TODOs. If the user
requested only a dry-run, report its results and stop before applying. If no
files match, continue to step 4. Otherwise, apply:

```shell
yarn dlx codemod run @backstage/mui4-to-bui-migration-recipe \
  --target <path-to-app-or-package>
```

Run only the full recipe so bootstrap → transforms → `remove-mui-dependencies`
stay in order (cleanup last).

Ordered package list and heuristics:
[mui4-to-bui-migration-recipe README](https://github.com/backstage/codemods/tree/main/codemods/misc/mui4-to-bui-migration-recipe).

If either command fails, report the failure and inspect any partial changes
before retrying. Keep the selected path unless the user chooses to switch.

Done when: dry-run and apply finished for the agreed target with no recipe CLI
failure, or the dry-run confirmed no matching files.

#### Standalone path

Read [standalone migration](references/standalone-migration.md) only when the
user selects this path. Follow its dependency setup, component examples, styling
guidance, and cleanup checklist to edit the target directly. This path requires
no codemod installation, dry-run, or apply command.

Done when: the standalone checklist is complete for the agreed target, with
remaining MUI usage recorded for step 4.

### 4. Resolve remaining migration work

1. Search the target for `TODO(backstage-codemod)`. Resolve each marker, or defer with an
   explicit reason.
1. Search for remaining `@material-ui/` and `@mui/` imports and styling usage.
1. Read [migration limits](references/out-of-scope.md) when a component or pattern
   has no equivalent that preserves its behavior.
1. After a codemod run, read [leftover cleanup](references/leftover-cleanup.md)
   when finishing tokens, icons, or ambiguous layout. Load this reference only
   for recipe output.

Use the recipe README to interpret recipe output. For direct edits in either
path, check the target's installed BUI APIs and preserve existing behavior.

Done when: every migration marker and remaining MUI use in scope is resolved or
documented with a reason for retaining it. Keep dependencies needed by retained
components, styles, or icons.

### 5. Verify

- Follow the target repository's setup instructions before checks. In a Backstage
  monorepo, run `yarn install` and `yarn tsc` from the root.
- Run targeted tests and lint checks using the repository's prescribed commands.
- Spot-check UI in light and dark mode where styles changed.

Done when: the required checks pass and changed UI behavior and appearance have
been checked. Report any unavailable or failing check as incomplete verification.

## Success criteria

Migration is complete when the selected path is finished for the agreed target,
remaining work is accounted for in step 4, and verification passes. Summarize the
selected path, changed files, retained MUI usage and reasons, and check results.
