# @backstage/cli-module-vitest

A CLI module for the [Backstage CLI](https://backstage.io) that provides
Vitest-based test commands as an alternative to the default Jest-based test
runner.

## Installation

Add this package as a dependency to your project root to use Vitest for testing:

```bash
yarn add --dev @backstage/cli-module-vitest vitest
```

When `@backstage/cli-module-vitest` is present in the root `package.json`, the
Backstage CLI will automatically discover it and use the Vitest-based
`repo test` and `package test` commands, overriding the default Jest-based
commands from `@backstage/cli-defaults`.

## Commands

### `backstage-cli repo test`

Run tests across all packages in the workspace using Vitest.

Supports the following Backstage-specific flags:

- `--since <ref>` — Only include test packages changed since the specified ref
- `--success-cache` — Cache and skip tests for unchanged packages
- `--success-cache-dir <dir>` — Directory for the success cache

All other flags are forwarded directly to Vitest.

### `backstage-cli package test`

Run tests for a single package using Vitest. Defaults to watch mode outside of
CI environments.
