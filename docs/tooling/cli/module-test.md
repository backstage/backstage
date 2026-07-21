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
