---
id: codemods
title: Codemods
description: Apply Backstage Codemod Registry recipes during upgrades and larger migrations.
---

Audience: Developers and Admins

After you bump packages and review create-app / Upgrade Helper diffs, use
_recipes_ from the [Backstage codemods](https://github.com/backstage/codemods)
repository for automated source migrations. A recipe is an ordered bundle of
source transforms published to the
[Codemod Registry](https://go.codemod.com/backstage) and run with the
[Codemod CLI](https://docs.codemod.com/cli).

These recipes are separate from the older `@backstage/codemods` npm package,
which has been removed from this repository.

Recipes fall into two groups:

1. _Versioned migration recipes_ for mechanical fixes tied to a specific
   Backstage release (for example renames and breaking API changes that landed
   in that release).
2. _Misc recipes_ for larger, cross-cutting migrations you opt into when you
   are ready (for example Material-UI to Backstage UI).

## Versioned migration recipes

Treat the versioned recipe for your target release as a standard upgrade step.
For a target release `<major>.<minor>.0`, the package name is
`@backstage/v<major>-<minor>-0-migration-recipe`. Dry-run first, then apply:

```shell
# Example: upgrading toward Backstage 1.52.0
yarn dlx codemod run @backstage/v1-52-0-migration-recipe \
  --target . \
  --dry-run

yarn dlx codemod run @backstage/v1-52-0-migration-recipe \
  --target .
```

If no recipe exists for your target version, skip this step. The
[codemods README](https://github.com/backstage/codemods) lists published
recipes.

## After a recipe runs

Search your repository for `TODO(backstage-codemod)` and resolve each marker.
Check that recipe's README for out-of-scope items that still need a manual
change.

## Misc recipes

Misc recipes cover larger migrations that are not tied to a single release.
They are optional during a routine bump.

### Material-UI 4 to Backstage UI

Start with the
[mui4-to-bui-migration-recipe README](https://github.com/backstage/codemods/tree/main/codemods/misc/mui4-to-bui-migration-recipe),
then use the [`mui-to-bui-migration` skill](../ai/skills.md) for leftover
cleanup the recipe cannot finish safely.

```shell
yarn dlx codemod run @backstage/mui4-to-bui-migration-recipe \
  --target . \
  --dry-run

yarn dlx codemod run @backstage/mui4-to-bui-migration-recipe \
  --target .
```

## Next steps

- Recipe index: [github.com/backstage/codemods](https://github.com/backstage/codemods)
- Registry: [go.codemod.com/backstage](https://go.codemod.com/backstage)
- Upgrade process: [Keeping Backstage Updated](../getting-started/keeping-backstage-updated.md)
