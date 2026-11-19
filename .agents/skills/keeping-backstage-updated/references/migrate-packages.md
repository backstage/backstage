# Migrate Moved Packages

## What moves

Backstage community-maintained packages have been moving from the `@backstage/*`
namespace to `@backstage-community/*`. The old names keep working for a while,
then are removed. `versions:bump` runs `versions:migrate` automatically unless
`--skipMigrate` is set; use this reference when it didn't run, or to check its
work.

## Run the migration

```bash
yarn backstage-cli versions:migrate
```

The command detects `@backstage/*` packages that carry a `backstage.moved`
pointer to their new name, updates `package.json` dependencies to the new
names, and rewrites source imports to match.

| Flag                       | Effect                                                      |
| -------------------------- | ----------------------------------------------------------- |
| `--pattern '@backstage/*'` | Glob pattern of packages to check                           |
| `--skipCodeChanges`        | Update `package.json` only, without touching source imports |

## Other migrate subcommands

The CLI has further migration helpers, useful when the type checker or build
flags package configuration issues:

| Command                        | What it does                                          |
| ------------------------------ | ----------------------------------------------------- |
| `migrate package-roles`        | Add missing `backstage.role` fields                   |
| `migrate package-scripts`      | Align `scripts` with the package role                 |
| `migrate package-exports`      | Synchronize `exports` field definitions               |
| `migrate package-lint-configs` | Switch to `@backstage/cli/config/eslint-factory`      |
| `migrate react-router-deps`    | Move `react-router` dependencies to peer dependencies |

## Check for leftovers

After the migration, search for remaining old-namespace imports:

```bash
git grep '@backstage/plugin-' -- '*.ts' '*.tsx'
```

Cross-reference the hits against the
[community plugins repository](https://github.com/backstage/community-plugins)
to see whether they have moved. Many `@backstage/*` names are still canonical;
only the ones with a published move need updating.
