---
id: module-migrate
title: Migrate Module
description: CLI commands for version management and package migrations.
---

The migrate module (`@backstage/cli-module-migrate`) bumps Backstage package
versions, migrates moved packages, and runs package migration utilities.

## versions\:bump

Bump all `@backstage` packages to the latest versions. This checks for updates
in the package registry and updates `package.json` files when necessary. See
more about how this command can be configured and used
[for keeping Backstage updated](../../getting-started/keeping-backstage-updated.md).

```text
Usage: backstage-cli versions:bump [options]

Options:
  -h, --help        display help for command
  --pattern <glob>  Override glob for matching packages to upgrade
  --release <version|next|main> Bump to a specific Backstage release line or version (default: "main")
```

## versions\:migrate

Migrate any plugins that have been moved to the `@backstage-community`
namespace. This command scans all packages in the project for dependencies that
have a `backstage.moved` field in their `package.json`, updates the dependency
names in `package.json` files, and optionally rewrites import paths in source
files.

After making changes the command runs `yarn install` to update the lockfile.

```text
Usage: backstage-cli versions:migrate [options]

Options:
  --pattern <glob>       Override glob for matching packages to upgrade
  --skip-code-changes    Skip code changes and only update package.json files
  -h, --help             display help for command
```

## migrate package-roles

Add the `backstage.role` field to packages that do not already have it. This
field identifies the purpose of each package and is used by other CLI commands
to determine the correct build and lint behavior.

```text
Usage: backstage-cli migrate package-roles

Add package role field to packages that don't have it
```

## migrate package-scripts

Set package scripts according to each package's role. This ensures that all
packages have the correct `build`, `test`, `lint`, `prepack`, and `postpack`
scripts for their role.

```text
Usage: backstage-cli migrate package-scripts

Set package scripts according to each package role
```

## migrate package-exports

Synchronize package subpath export definitions. This updates the `exports` field
in `package.json` to match the expected structure for each package role.

```text
Usage: backstage-cli migrate package-exports

Synchronize package subpath export definitions
```

## migrate package-lint-configs

Migrate all packages to use the ESLint configuration factory provided by the
CLI. This replaces custom ESLint configurations with
`@backstage/cli/config/eslint-factory`.

```text
Usage: backstage-cli migrate package-lint-configs

Migrates all packages to use @backstage/cli/config/eslint-factory
```

## migrate react-router-deps

Migrate the `react-router` dependencies for all packages to be peer
dependencies. This is part of the migration to support newer versions of React
Router.

```text
Usage: backstage-cli migrate react-router-deps

Migrates the react-router dependencies for all packages to be peer dependencies
```
