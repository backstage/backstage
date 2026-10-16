---
id: module-test
title: Test Module
description: CLI commands for running tests with Jest.
---

The test module (`@backstage/cli-module-test-jest`) provides commands for
running tests in individual packages and across the entire repository. Tests are
run using Jest with a default configuration included in the CLI.

For more information about configuration overrides and editor support, see the
[Jest Configuration section](./02-build-system.md#jest-configuration) in the
build system documentation.

## repo test

Test packages in the project. It is recommended to have this command be used as
the `test` script in the root `package.json` in your project:

```json title="package.json in the root of your project"
{
  "scripts": {
    "test": "backstage-cli repo test"
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
Usage: backstage-cli repo test [options]

Run tests, forwarding args to Jest, defaulting to watch mode

Options:
  --since <ref>               Only test packages that changed since the specified ref
  --success-cache             Enable success caching, which skips running tests for unchanged packages that were successful in the previous run
  --success-cache-dir <path>  Set the success cache location, (default: node_modules/.cache/backstage-cli)
  --jest-help                 Show help for Jest CLI options, which are passed through
  -h, --help                  display help for command
```

## repo run test

Run the tests of each package in the repository, one at a time per package. The
command runs `package test` in a separate process for each package, and is a
target of `repo run`. Only packages that have `backstage-cli package test` in
their `test` script are included, and any further arguments in that script are
passed on.

At most 8 packages run at the same time, which you can change with
`--concurrency`. In a terminal the command shows a live view with the number of
passed, failed, running and queued packages, and the packages that are running.
Failed packages are listed as they finish. Without a terminal, such as in CI, it
prints one line for each finished package. The logs of the packages are hidden
by default. At the end, the command lists the failed packages and suggests
re-running with `--verbose`, which turns off the live view and streams the output
of each package with a `[package-name]` prefix. If the command is interrupted
with Ctrl+C, running packages are stopped and shown as interrupted. The command
exits with a non-zero code if any package failed.

```sh title="Run the tests of all packages"
yarn backstage-cli repo run test
```

```sh title="Run matching tests in two packages"
yarn backstage-cli repo run test cli-node plugin-catalog* -- -t "parse"
```

To run only some packages, pass package selectors as positional arguments or
with `-p, --package`, which can be repeated. A selector is a package name, a
glob on the name with or without its scope such as `plugin-catalog*`, or a
package directory relative to the current directory. Selected packages do not
include their dependents unless you pass `--include-dependents`, and combined
with `--since` only packages that match both are run. A selector that matches no
package is an error.

Selectors are never forwarded. To pass options to `package test` for each
package, put them after `--`. An unknown option before `--` is an error, so that
it is not mistaken for a selector. Tests run once by default, use `--watch` to
keep running.

```text
Usage: backstage-cli repo run test [options]

Options:
  -p, --package <selector> Only run the matching packages, can be repeated
  --since <ref>            Only run packages that changed since the specified ref
  --include-dependents     Also run packages that depend on the selected packages (default: true, use --no-include-dependents to disable)
  --watch                  Re-run packages when their files change
  --concurrency <n>        Maximum number of packages to run at the same time (default: 8)
  --verbose                Stream the output of each package instead of a progress view
  -h, --help               display help for command
```

With `--since`, only changed packages and their local dependents are run. If
nothing has changed, the command prints `No packages changed since <ref>` and
exits successfully. Use `--no-include-dependents` to skip the dependents.

With `--watch`, the command runs all selected packages once, then watches their
files and re-runs the affected packages and their dependents. Changes made while
a run is in progress are queued for the next run.

The `--verbose` flag is handled by `repo run` and is not forwarded to
`package test`, pass it after `--` if the package command needs it. Run `backstage-cli repo run --help` to list all available targets.

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
