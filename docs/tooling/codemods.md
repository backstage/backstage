---
id: codemods
title: Codemods
description: Apply Backstage Codemod Registry recipes during upgrades and larger migrations.
---

Audience: Developers and Admins

After you bump packages and review create-app / Upgrade Helper diffs, run
_recipes_ from the [Backstage codemods](https://github.com/backstage/codemods)
repository. A recipe is an ordered set of source transforms on the
[Codemod Registry](https://go.codemod.com/backstage). You run it with the
[Codemod CLI](https://docs.codemod.com/cli).

This is not the old `@backstage/codemods` npm package. That package is gone from
this repository.

There are two kinds of recipes:

1. _Versioned migration recipes_ fix mechanical breakage for a specific
   Backstage release (renames, API changes that shipped in that release, and
   similar).
2. _Misc recipes_ cover bigger migrations you schedule on your own timeline
   (for example Material-UI to Backstage UI).

## Versioned migration recipes

Include the versioned recipe for your target release in the upgrade. For
release `<major>.<minor>.0`, the package name is
`@backstage/v<major>-<minor>-0-migration-recipe`. Dry-run first, then apply:

```shell
# Example: upgrading toward Backstage 1.52.0
yarn dlx codemod run @backstage/v1-52-0-migration-recipe \
  --target . \
  --dry-run

yarn dlx codemod run @backstage/v1-52-0-migration-recipe \
  --target .
```

Skip this step if no recipe exists for your target version. Published recipes
are listed in the [codemods README](https://github.com/backstage/codemods).

## After a recipe runs

Search the repo for `TODO(backstage-codemod)` and resolve each marker. Read that
recipe's README for anything left out of scope that you still need to change by
hand.

## Misc recipes

Misc recipes are for migrations that do not belong to a single release. Skip
them on a routine bump unless you intend that migration.

### Material-UI 4 to Backstage UI

Read the
[mui4-to-bui-migration-recipe README](https://github.com/backstage/codemods/tree/main/codemods/misc/mui4-to-bui-migration-recipe)
first, then use the [`mui-to-bui-migration` skill](../ai/skills.md) for leftovers
the recipe cannot finish safely.

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
