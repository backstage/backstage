---
id: module-test
title: Test Module
description: CLI commands for running tests with Jest.
---

The test module (`@backstage/cli-module-test`) provides `repo test`, which runs
the tests of every package in the repository. The Jest module
(`@backstage/cli-module-test-jest`) provides `package test`, which runs the
tests of a single package using Jest with a default configuration included in
the CLI, and `repo jest`, which runs Jest across the whole repository in a
single run.

For more information about configuration overrides and editor support, see the
[Jest Configuration section](./02-build-system.md#jest-configuration) in the
build system documentation.

## repo test

Run the tests of each package in the repository. The command runs
`package test` in a separate process for each package, so the test tool can be
chosen per package by whichever CLI module provides `package test` for it. Only
packages that have `backstage-cli package test` in their `test` script are
included, and any further arguments in that script are passed on.

The output of each package is printed once it has finished, followed by a
summary of the packages that failed. The command exits with a non-zero code if
any package failed.

```sh title="Run the tests of all packages"
yarn backstage-cli repo test
```

Unknown options and positional arguments are forwarded to `package test` for
each package. Tests are run once by default; use `--watch` to keep running.

```text
Usage: backstage-cli repo test [options]

Options:
  --since <ref>            Only run packages that changed since the specified ref
  --include-dependents     Also run packages that depend on the selected packages (default: true, use --no-include-dependents to disable)
  --watch                  Re-run packages when their files change
  -h, --help               display help for command
```

The `repo test` command includes dependents by default, which `--include-dependents`
and `--no-include-dependents` override.

With `--since`, only changed packages and, unless `--no-include-dependents` is
set, their local dependents are run. If nothing has changed the command prints
`No packages changed since <ref>` and exits successfully.

With `--watch`, the command runs all selected packages once, then watches their
files and re-runs the affected packages, plus their dependents when
`--include-dependents` is enabled. Changes made while a run is in progress are
queued for the next run.

## repo jest

Test packages in the project in a single Jest run. This is the command to use
for the `test` script in the root `package.json` in your project, and it
supports success caching and coverage reporting across all packages:

```json title="package.json in the root of your project"
{
  "scripts": {
    "test": "backstage-cli repo jest"
  }
}
```

If run without any arguments it defaults to running changed tests in watch
mode, unless the `CI` environment flag is set, in which case it runs all tests
without watching:

```sh title="Run changed tests from repo root"
yarn test
```

If arguments are provided, they are forwarded to Jest and used to filter tests
to execute. If full paths to tests are provided, only those tests are included,
for example:

```sh title="Run specific tests from repo root"
yarn test packages/app/src/App.test.tsx
```

If you want to avoid re-running tests that have not changed since the last
successful run in CI, you can use the `--success-cache` flag. By default this
cache is stored in `node_modules/.cache/backstage-cli`, but you can choose a
different directory with the `--success-cache-dir <path>`.

```text
Usage: backstage-cli repo jest [options]

Run tests across the repo in a single Jest run, defaulting to watch mode

Options:
  --since <ref>               Only test packages that changed since the specified ref
  --success-cache             Enable success caching, which skips running tests for unchanged packages that were successful in the previous run
  --success-cache-dir <path>  Set the success cache location, (default: node_modules/.cache/backstage-cli)
  --jest-help                 Show help for Jest CLI options, which are passed through
  -h, --help                  display help for command
```

:::note
Previous versions of the CLI provided the Jest-based command as `repo test`.
Update scripts that rely on watch mode, success caching or merged coverage to use
`repo jest`.
:::

## package test

Run tests, forwarding all unknown options to Jest, and defaulting to watch mode.
When executing the tests, `process.env.NODE_ENV` is set to `"test"`.

This command uses a default Jest configuration that is included in the CLI,
which is set up with similar goals for speed, scale, and working within a
monorepo. The configuration sets the `src` as the root directory, enforces the
`.test.` infix for tests, and uses `src/setupTests.ts` as the test setup
location. The included configuration also supports test execution at the root of
a Yarn workspaces monorepo by automatically creating one grouped configuration
that includes all packages that have `backstage-cli test` or
`backstage-cli package test` in their package `test` script.

```text
Usage: backstage-cli package test [options]

Run tests, forwarding args to Jest, defaulting to watch mode

Options:
  --backstage-cli-help    display help for command
```
