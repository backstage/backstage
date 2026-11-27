# Run Codemod Recipes

## When to run them

After the package bump and the create-app template changes, run the _versioned_
codemod recipe for each release the upgrade crosses. Recipes are ordered sets of
source transforms published from the
[Backstage codemods repository](https://github.com/backstage/codemods) to the
[Codemod Registry](https://go.codemod.com/backstage), run with the
[Codemod CLI](https://docs.codemod.com/cli). They fix the mechanical breakage of
a specific release: renames, API changes that shipped in that release, and
similar.

This is not the old `@backstage/codemods` npm package, which no longer exists.

## Versioned recipes

For a target release `<major>.<minor>.0`, the recipe package is
`@backstage/v<major>-<minor>-0-migration-recipe`. For example, upgrading toward
Backstage 1.52.0:

```bash
yarn dlx codemod run @backstage/v1-52-0-migration-recipe --target . --dry-run
yarn dlx codemod run @backstage/v1-52-0-migration-recipe --target .
```

When the upgrade crosses several releases, run the recipe for each crossed
release that has one — a recipe fixes the breakage of its own release, and the
newest release may not have a recipe yet. Dry-run first, review the output, then
apply. Skip releases without a recipe; published recipes are listed in the
[codemods README](https://github.com/backstage/codemods). The CLI asks for
confirmations on a terminal, so pass `--no-interactive` when there is none, and
it refuses to run on a dirty tree, so commit or stash the bump first.

## After a recipe runs

Search the repository for `TODO(backstage-codemod)` markers and resolve each
one, then read that recipe's README for anything left out of scope that still
needs a manual change:

```bash
git grep 'TODO(backstage-codemod)'
```

## Misc recipes

Misc recipes cover larger migrations that don't belong to a single release,
such as Material UI to Backstage UI. Don't run them as part of a routine bump.
The `mui-to-bui-migration` skill owns that migration, including running its
recipe and finishing what it leaves behind.
