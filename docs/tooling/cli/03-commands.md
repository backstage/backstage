---
id: commands
title: Commands
description: Descriptions of all commands available in the CLI.
---

This page lists all commands provided by the Backstage CLI, what they're for,
and where to use them.

## help

This command displays a help summary or detailed help screens for each command.
Below is a cleaned up output of `yarn backstage-cli --help`:

```text
new [options]                                  Open up an interactive guide to creating new things in
                                                your app
config:docs [options]                          Browse the configuration reference documentation
config:print [options]                         Print the app configuration for the current package
config:check [options]                         Validate that the given configuration loads and matches
                                                schema
config:schema [options]                        Print configuration schema
repo [command]                                 Command that run across an entire Backstage project
package [command]                              Lifecycle scripts for individual packages
migrate [command]                              Migration utilities
versions:bump [options]                        Bump Backstage packages to the latest versions
clean                                          Delete cache directories [DEPRECATED]
build-workspace <workspace-dir> [packages...]  Builds a temporary dist workspace from the provided
                                                packages
create-github-app <github-org>                 Create new GitHub App in your organization.
info                                           Show helpful information for debugging and reporting bugs
help [command]                                 display help for command
```

The `package` command category, `yarn backstage-cli package --help`:

```text
start [options]                  Start a package for local development
build [options]                  Build a package for production deployment or publishing
lint [options] [directories...]  Lint a package
test                             Run tests, forwarding args to Jest, defaulting to watch mode
clean                            Delete cache directories
prepack                          Prepares a package for packaging before publishing
postpack                         Restores the changes made by the prepack command
help [command]                   display help for command
```

The `repo` command category, `yarn backstage-cli repo --help`:

```text
build [options]              Build packages in the project, excluding bundled app and backend packages.
lint [options]               Lint all packages in the project
clean                        Delete cache and output directories
list-deprecations [options]  List deprecations
test [options]               Run tests, forwarding args to Jest, defaulting to watch mode
help [command]               display help for command
```

The `migrate` command category, `yarn backstage-cli migrate --help`:

```text
package-roles         Add package role field to packages that don't have it
package-scripts       Set package scripts according to each package role
package-exports       Synchronize package subpath export definitions
package-lint-configs  Migrates all packages to use @backstage/cli/config/eslint-factory
react-router-deps     Migrates the react-router dependencies for all packages to be peer dependencies
help [command]        display help for command
```

## repo build

Builds all packages in the project, excluding bundled packages by default, i.e. ones
with the role `'frontend'` or `'backend'`.

```text
Usage: backstage-cli repo build [options]

Build packages in the project, excluding bundled app and backend packages.

Options:
  --all          Build all packages, including bundled app and backend packages.
  --since <ref>  Only build packages and their dev dependents that changed since the specified ref
```

## repo lint

Lint all packages in the project.

```text
Usage: backstage-cli repo lint [options]

Lint all packages in the project

Options:
  --format <format>         Lint report output format (default: "eslint-formatter-friendly")
  --since <ref>             Only lint packages that changed since the specified ref
  --successCache            Enable success caching, which skips running tests for unchanged packages that were successful in the previous run
  --successCacheDir <path>  Set the success cache location, (default: node_modules/.cache/backstage-cli)
  --fix                     Attempt to automatically fix violations
```

## repo test

Test packages in the project. It is recommended to have this command be used as the `test` script in the root `package.json` in your project:

```json title="package.json in the root of your project"
{
  ...
  "scripts": {
    ...
    "test": "backstage-cli repo test"
  }
}
```

If run without any arguments it will default to running changed tests in watch mode, unless the `CI` environment flag is set, in which case it will run all tests without watching:

```sh title="Run changes tests from repo root"
yarn test
```

If arguments are provided, they will be forwarded to Jest and used to filter test to execute. If full paths to tests are provided, only those tests will be included, for example:

```sh title="Run specific tests from repo root"
yarn test packages/app/src/App.test.tsx
```

If you want to avoid re-running tests that have not changed since the last successful run in CI, you can use the `--successCache` flag. By default this cache is stored in `node_modules/.cache/backstage-cli`, but you can choose a different directory with the `--successCacheDir <path>`.

```text
Usage: backstage-cli repo test [options]

Run tests, forwarding args to Jest, defaulting to watch mode

Options:
  --since <ref>             Only test packages that changed since the specified ref
  --successCache            Enable success caching, which skips running tests for unchanged packages that were successful in the previous run
  --successCacheDir <path>  Set the success cache location, (default: node_modules/.cache/backstage-cli)
  --jest-help               Show help for Jest CLI options, which are passed through
  -h, --help                display help for command
```

## package start

Starts the package for local development. See the frontend and backend development parts in the build system [bundling](./02-build-system.md#bundling) section for more details.

```text
Usage: backstage-cli package start [options]

Start a package for local development

Options:
  --config <path>  Config files to load instead of app-config.yaml (default: [])
  --role <name>    Run the command with an explicit package role
  --check          Enable type checking and linting if available
  --inspect        Enable debugger in Node.js environments
  --inspect-brk    Enable debugger in Node.js environments, breaking before code starts
```

## package build

Build an individual package based on its role. See the build system [building](./02-build-system.md#building) and [bundling](./02-build-system.md#bundling) sections for more details.

```text
Usage: backstage-cli package build [options]

Build a package for production deployment or publishing

Options:
  --role <name>              Run the command with an explicit package role
  --minify                   Minify the generated code. Does not apply to app package (app is minified by default).
  --skip-build-dependencies  Skip the automatic building of local dependencies. Applies to backend packages only.
  --stats                    If bundle stats are available, write them to the output directory. Applies to app packages only.
  --config <path>            Config files to load instead of app-config.yaml. Applies to app packages only. (default: [])
```

## package lint

Lint a package. In addition to the default `eslint` behavior, this command will
include TypeScript files, treat warnings as errors, and default to linting the
entire directory if no specific files are listed. For more information, see the
build system [linting](./02-build-system.md#linting) section.

```text
Usage: backstage-cli package lint [options]

Lint a package

Options:
  --format <format>        Lint report output format (default: "eslint-formatter-friendly")
  --fix                    Attempt to automatically fix violations
  --max-warnings <number>  Fail if more than this number of warnings. -1 allows warnings. (default: -1)
```

## package test

Run tests, forwarding all unknown options to Jest, and defaulting to watch mode.
When executing the tests, `process.env.NODE_ENV` will be set to `"test"`.

This command uses a default Jest configuration that is included in the CLI,
which is set up with similar goals for speed, scale, and working within a
monorepo. The configuration sets the `src` as the root directory, enforces the
`.test.` infix for tests, and uses `src/setupTests.ts` as the test setup
location. The included configuration also supports test execution at the root of
a yarn workspaces monorepo by automatically creating one grouped configuration
that includes all packages that have `backstage-cli test` in their package
`test` script.

For more information about configuration overrides and editor support, see the [Jest Configuration section](./02-build-system.md#jest-configuration) in the build system documentation.

```text
Usage: backstage-cli package test [options]

Run tests, forwarding args to Jest, defaulting to watch mode

Options:
  --backstage-cli-help    display help for command
```

## package clean

Remove cache and output directories.

```text
Usage: backstage-cli package clean [options]

Delete cache directories
```

## package prepack

This command should be added as `scripts.prepack` in all packages. It enables
packaging- and publish-time overrides for fields inside `packages.json`.
For more details, see the build system [publishing](./02-build-system.md#publishing) section.

```text
Usage: backstage-cli package prepack [options]

Prepares a package for packaging before publishing
```

## package postpack

This should be added as `scripts.postpack` in all packages. It restores
`package.json` to what it looked like before calling the `prepack` command.

```text
Usage: backstage-cli package postpack [options]

Restores the changes made by the prepack command
```

## new

The `new` command opens up an interactive guide for you to create new things
in your app. If you do not pass in any options it is completely interactive, but
it is possible to pre-select what you want to create using the `--select` flag,
and provide options using `--option`, for example:

```bash
backstage-cli new --select plugin --option pluginId=foo
```

This command is typically added as script in the root `package.json` to be
executed with `yarn new`. For example you may have it set up like this:

```json
{
  "scripts": {
    "new": "backstage-cli new"
  }
}
```

The `new` command comes with a default collection of plugins/packages, however,
you can customize this list and even create your own CLI templates. For more
information see [CLI Templates](./04-templates.md).

```text
Usage: backstage-cli new

Options:
  -h, --help               display help for command
```

## config\:docs

This commands opens up the reference documentation of your apps local
configuration schema in the browser. This is useful to get an overview of what
configuration values are available to use, a description of what they do and
their format, and where they get sent.

```text
Usage: backstage-cli config:docs [options]

Browse the configuration reference documentation

Options:
  --package <name>  Only include the schema that applies to the given package
  -h, --help        display help for command
```

## config\:print

Print the static configuration, defaulting to reading `app-config.yaml` in the
repo root, using schema collected from all local packages in the repo.

For example, to validate that a given configuration value is visible in the
frontend when building the `my-app` package, you can use the following:

```bash
yarn backstage-cli config:print --frontend --package my-app
```

```text
Usage: backstage-cli config:print [options]

Options:
  --package <name>   Only load config schema that applies to the given package
  --lax              Do not require environment variables to be set
  --frontend         Print only the frontend configuration
  --with-secrets     Include secrets in the printed configuration
  --format <format>  Format to print the configuration in, either json or yaml [yaml]
  --config <path>    Config files to load instead of app-config.yaml (default: [])
  -h, --help         display help for command
```

## config\:check

Validate that static configuration loads and matches schema, defaulting to
reading `app-config.yaml` in the repo root and using schema collected from all
local packages in the repo.

```text
Usage: backstage-cli config:check [options]

Options:
  --package <name>  Only load config schema that applies to the given package
  --lax             Do not require environment variables to be set
  --frontend        Only validate the frontend configuration
  --deprecated      Output deprecated configuration settings
  --strict          Ensure that the provided config(s) has no errors and does not contain keys not in the schema.
  --config <path>   Config files to load instead of app-config.yaml (default: [])
  -h, --help        display help for command
```

## config\:schema

Dump the configuration schema that was collected from all local packages in the
repo.

Note: when run by `yarn`, supply the yarn option `--silent` if you are using the
output in a command line pipe to avoid non schema output in the pipeline.

```text
Usage: backstage-cli config:schema [options]

Print configuration schema

Options:
  --package <name>   Only output config schema that applies to the given package
  --format <format>  Format to print the schema in, either json or yaml [yaml]
  -h, --help         display help for command
```

## versions\:bump

Bump all `@backstage` packages to the latest versions. This checks for updates
in the package registry, and will update entries `package.json` files when necessary. See more how this command can be configured and used [for keeping Backstage updated](../../getting-started/keeping-backstage-updated.md).

```text
Usage: backstage-cli versions:bump [options]

Options:
  -h, --help        display help for command
  --pattern <glob>  Override glob for matching packages to upgrade
  --release <version|next|main> Bump to a specific Backstage release line or version (default: "main")
```

## build-workspace

Builds a mirror of the workspace using the packaged production version of each
package. This essentially calls `yarn pack` in each included package and unpacks
the resulting archive in the target `workspace-dir`.

```text
Usage: backstage-cli build-workspace [options] <workspace-dir>
```

## create-github-app

Creates a GitHub App in your GitHub organization. This is an alternative to
token-based [GitHub integration](../../integrations/github/locations.md). See
[GitHub Apps for Backstage Authentication](../../integrations/github/github-apps.md).

Launches a browser to create the App through GitHub and saves the result as a
YAML file that can be referenced in the GitHub integration configuration.

```text
Usage: backstage-cli create-github-app <github-org>
```

## info

Outputs debug information which is useful when opening an issue. Outputs system
information, node.js and npm versions, CLI version and type (inside backstage
repo or a created app), all `@backstage/*` package dependency versions.

```text
Usage: backstage-cli info
```
