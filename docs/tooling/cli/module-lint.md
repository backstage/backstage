---
id: module-lint
title: Lint Module
description: CLI commands for linting Backstage packages.
---

The lint module (`@backstage/cli-module-lint`) runs linting on individual
packages or across the entire repository. For more on the linting setup, see
the build system [linting](./02-build-system.md#linting) section.

## package lint

Lint a package. In addition to the default `eslint` behavior, this command will
include TypeScript files, treat warnings as errors, and default to linting the
entire directory if no specific files are listed.

```text
Usage: backstage-cli package lint [options]

Lint a package

Options:
  --format <format>        Lint report output format (default: "eslint-formatter-friendly")
  --fix                    Attempt to automatically fix violations
  --max-warnings <number>  Fail if more than this number of warnings. -1 allows warnings. (default: -1)
```

## repo lint

Lint all packages in the project.

```text
Usage: backstage-cli repo lint [options]

Lint all packages in the project

Options:
  --format <format>           Lint report output format (default: "eslint-formatter-friendly")
  --since <ref>               Only lint packages that changed since the specified ref
  --success-cache             Enable success caching, which skips running lint for unchanged packages that were successful in the previous run
  --success-cache-dir <path>  Set the success cache location, (default: node_modules/.cache/backstage-cli)
  --fix                       Attempt to automatically fix violations
```
