---
id: commands
title: Commands
description: Descriptions of all commands available in the CLI.
---

## Summary

```text
app:build [options]              Build an app for a production release
app:diff [options]               Diff an existing app with the creation template
app:serve [options]              Serve an app for local development

backend:build                    Build a backend plugin
backend:build-image [options]    Bundles the package into a docker image. All extra args are forwarded to `docker image build`.
backend:dev [options]            Start local development server with HMR for the backend

plugin:build                     Build a plugin
plugin:diff [options]            Diff an existing plugin with the creation template
plugin:serve [options]           Serves the dev/ folder of a plugin

build [options]                  Build a package for publishing
build-workspace <workspace-dir>  Builds a temporary dist workspace from the provided packages
lint [options]                   Lint a package
test                             Run tests, forwarding args to Jest, defaulting to watch mode
clean                            Delete cache directories

create-plugin [options]          Creates a new plugin in the current repository
remove-plugin                    Removes plugin in the current repository

config:print [options]           Print the app configuration for the current package
config:check [options]           Validate that the given configuration loads and matches schema

versions:bump                    Bump Backstage packages to the latest versions
versions:check [options]         Check Backstage package versioning

prepack                          Prepares a package for packaging before publishing
postpack                         Restores the changes made by the prepack command

help [command]                   display help for command
```

## app:build

Creates a bundle of static content from the app, which can then be served via
and static web server such as `nginx`, or via the `app-backend` plugin directly
from a Backstage backend instance.

The command also reads and injects static configuration into the bundle. It is
important to note that when deploying with your own static content hosting
solution, this will be the final configuration used in the frontend, unless you
for example hook in configuration loading from the backend. When using the
`nginx` image in this repo along with its included run script, `APP_CONFIG_`
environment variables will be injected into the frontend, and when serving using
the `app-backend` plugin, the configuration is completely injected from the
backend and the configuration at the time of calling this command will not be
used.

Note that even when injecting configuration at runtime, it is not possible to
change the base path of the app. For example, if you at build time have
`app.baseUrl` set to `http://dev-app.com/my-app`, you're can change that to
`https://prod-app.com/my-app`, but not to `https://prod-app.com`, as that would
change the path.

During the build, the following variables are set:

```java
process.env.NODE_ENV = 'production';
process.env.BUILD_INFO = {
  cliVersion: '0.4.0', // The version of the CLI package
  gitVersion: 'v0.4.0-86-ge54815618', // output of `git describe --always`
  packageVersion: '1.0.5', // The version of the app package itself
  timestamp: 1678900000000, // Date.now() when the build started
  commit: 'e548156182a973ed4b459e18533afc22c85ffff8', // output of `git rev-parse HEAD`
};
```

Some CI environments do not properly report correct resource limits, potentially
leading to errors such as `ENOMEM` during compilation. If you run into this you
can manually limit the parallelization of the build process by setting the
environment variable `BACKSTAGE_CLI_BUILD_PARALLEL` to for example `2`.

```text
Usage: backstage-cli app:build [options]

Options:
  --stats          Write bundle stats to output directory
  --config <path>  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## app:diff

Diff an existing app with the template used in `@backstage/create-app`. This
will verify that your app package has not diverged from the template, and can be
useful to run after updating the version of `@backstage/cli` in your app.

This command is experimental and may be removed in the future. Compared to the
`plugin:diff` command this one is less valuable, as we have found fewer useful
checks to carry out.

```text
Usage: backstage-cli app:diff [options]

Options:
  --check     Fail if changes are required
  --yes       Apply all changes
  -h, --help  display help for command
```

## app:serve

Serve an app for local development. This starts up a local development server,
using a bundling config that is quite similar to the `app:build` command, but
with development features such as React Hot Module Replacement, faster
sourcemaps, no minification, etc.

The serve configuration is controlled through the static configuration, by
default in `app-config.yaml`. The schema in the `app.baseUrl` determines whether
HTTP or HTTPS is used, and the listening host and port port is also determined
from the URL. It is possible to explicitly override the listening host and port
if needed by setting `app.listen.host` and `app.listen.port`.

The static configuration is injected into the frontend as well, but there it
does not support watching, meaning that changes in for example `app-config.yaml`
are not reflected until the serve process is restarted.

During the build, the following variables are set:

```java
process.env.NODE_ENV = 'development';
process.env.BUILD_INFO = { /* See app:build */ };
```

By default the

```text
Usage: backstage-cli app:serve [options]

Options:
  --check          Enable type checking and linting
  --config <path>  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## backend:build

This builds a backend package for publish and use in production. The build
output is written to `dist/`. Be sure to list any additional file that the
package depends on at runtime in the `"files"` field inside `package.json`, a
common example being the `migrations/` directory.

```text
Usage: backstage-cli backend:build [options]

Options:
  -h, --help  display help for command
```

## backend:build-image

Builds a Docker image of the backend package and forwards all unknown options to
`docker image build`. For example:

```bash
yarn backstage-cli backend:build-image --build --tag my-backend-image
```

The image is built with the backend package along with all of its local package
dependencies. This uses a `Dockerfile` that is expected to exist at the root of
the backend package. The `Dockerfile` will end up being executed from the root
of the monorepo, rather than the backend package itself.

The Dockerfile is **NOT** executed within the package or repo itself. Because
the packages in the repo itself are configured for development instead of
production use, the final Docker build happens in a separate temporary
directory, to which the backend package and dependencies have been copied over.
Only files listed within the `"files"` field within each package's
`package.json` are copied over, along with the root `package.json`, `yarn.lock`,
and any `app-config.*.yaml` files.

During the build a `skeleton.tar` file is created and put at the repo root. This
file contains the `package.json` of each included package, which together with
the root `package.json` and `yarn.lock` can be used to run a cached
`yarn install` before the full production builds of all the packages are copied
over, providing a significant speedup if Docker build layer caching available.

This command is experimental and we hope to be able to replace it with one that
is less integrated directly with Docker, and also supports multi-stage Docker
builds. It is possible to replicate most of what this command does by manually
building each package, then use the `build-workspace` to create the temporary
workspace, and finally copy over any additional files to the workspace and
execute the Docker build within it.

```text
Usage: backstage-cli backend:build-image [options]

Options:
  --build                 Build packages before packing them into the image
  --backstage-cli-help    display help for command
```

## backend:dev

Starts a backend package in development mode, with watch mode enabled for all
local packages.

```text
Usage: backstage-cli backend:dev [options]

Options:
  --check          Enable type checking and linting
  --inspect        Enable debugger
  --config <path>  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## create-plugin

Creates a new plugin within the repository. This command is typically wrapped up
in the root `package.json` to be executed with `yarn create-plugin`, using
options that are appropriate for the organization that owns the app repo. A
recommended scope for internal packages is `@internal`.

```text
Usage: backstage-cli create-plugin [options]

Options:
  --backend             Create plugin with the backend dependencies as default
  --scope <scope>       npm scope
  --npm-registry <URL>  npm registry URL
  --no-private          Public npm package
  -h, --help            display help for command
```

## remove-plugin

A utility to remove a plugin from a repo, essentially undoing everything that
was done by `create-plugin`.

This is primarily intended as a utility for manual tests and end to end testing
scripts.

```text
Usage: backstage-cli remove-plugin [options]

Options:
  -h, --help  display help for command
```

## plugin:build

Build a frontend plugin for publishing to a package registry. There is no need
to run this command during development or even in CI unless the package is being
published. The `app:bundle` command does not use the output for this command
when bundling local package dependencies.

The output is written to a `dist/` folder. It also outputs type declarations for
the plugin, and therefore requires `yarn tsc` to have been run first. The input
type declarations are expected to be found within `dist-types` at the root of
the monorepo.

```text
Usage: backstage-cli plugin:build [options]

Options:
  -h, --help  display help for command
```

## plugin:serve

Serves a frontend plugin by itself for isolated development. The serve task
itself is essentially identical to `app:serve`, but the entrypoint is instead
set to the `dev/` folder within the plugin.

The `dev/` folder typically contains a small wrapper script that hooks up any
necessary mock APIs or other things that are needed for the plugin to function.
The `@backstage/dev-utils` package provides utilities to that end.

```text
Usage: backstage-cli plugin:serve [options]

Options:
  --check          Enable type checking and linting
  --config <path>  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## plugin:diff

Compares a frontend plugin to the `create-plugin` template, making sure that it
hasn't diverged from the template and recommending updates when it has. A good
practice is to run this command after updating the version of the CLI in a
project.

```text
Usage: backstage-cli plugin:diff [options]

Options:
  --check     Fail if changes are required
  --yes       Apply all changes
  -h, --help  display help for command
```

## build

Build a single package for publishing, just like the `plugin:build` and
`backend:build` commands. This command is intended for standalone packages that
aren't plugins, and for example support building of isomorphic packages for
usage in both the frontend and backend.

For frontend packages you'll want to include `esm` output, and for backend
packages `cjs`. Whether to include `types` depends on if you need type
declarations for the package, and also requires `yarn tsc` to have been run
first.

```text
Usage: backstage-cli build [options]

Options:
  --outputs <formats>  List of formats to output [types,cjs,esm]
  -h, --help           display help for command
```

## lint

Lint a package. In addition to the default `eslint` behavior, this command will
include TypeScript files, treat warnings as errors, and default to linting the
entire directory of no specific files are listed.

```text
Usage: backstage-cli lint [options]

Options:
  --format <format>  Lint report output format (default: "eslint-formatter-friendly")
  --fix              Attempt to automatically fix violations
  -h, --help         display help for command
```

## test

Run tests, forwarding all unknown options to Jest, and defaulting to watch mode.

```text
Usage: backstage-cli test [options]

Options:
  --backstage-cli-help    display help for command
```

## config:print

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
  --frontend         Print only the frontend configuration
  --with-secrets     Include secrets in the printed configuration
  --format <format>  Format to print the configuration in, either json or yaml [yaml]
  --config <path>    Config files to load instead of app-config.yaml (default: [])
  -h, --help         display help for command
```

## config:check

Validate that static configuration loads and matches schema, defaulting to
reading `app-config.yaml` in the repo root and using schema collected from all
local packages in the repo.

```text
Usage: backstage-cli config:check [options]

Options:
  --package <name>  Only load config schema that applies to the given package
  --config <path>   Config files to load instead of app-config.yaml (default: [])
  -h, --help        display help for command
```

## versions:bump

Bump all `@backstage` packages to the latest versions. This check for updates in
the package registry, and will update entries both in `yarn.lock` and
`package.json` files when necessary.

```text
Usage: backstage-cli versions:bump [options]

Options:
  -h, --help  display help for command
```

## versions:check

Validate `@backstage` dependencies within the repo, making sure that there are
no duplicates of packages that might lead to breakages. For example,
`@backstage/core` must not be loaded in twice, so having two different versions
of it installed will cause this command to exit with an error.

By supplying the `--fix` flag the command will attempt to fix any conflict that
can be resolved by editing `yarn.lock`, but will not attempt to search for
remote updates or modify any `package.json` files.

```text
Usage: backstage-cli versions:check [options]

Options:
  --fix       Fix any auto-fixable versioning problems
  -h, --help  display help for command
```

## prepack

This command should be added as `scripts.prepack` in all packages. It enables
packaging- and publish-time overrides for fields inside `packages.json`.

The checked in version of all packages in a Backstage monorepo are tailored for
local development, and as such `main` and similar fields inside `package.json`
point to development source, i.e. `src/index.ts`. Using this when publishing
would lead to a broken package, since `src/` is not included in the published
package and we instead need to point to files in the `dist/` directory. This
command allows for those fields to be rewritten when needed, and does so by
copying all fields within `publishConfig` to the top-level of each
`package.json`, skipping `access`, `registry`, and `tag`.

The need for this command may be removed in the future, as this exact method of
overriding fields for publishing is already supported by some package managers.

```text
Usage: backstage-cli prepack [options]

Options:
  -h, --help  display help for command
```

## postpack

This should be added as `scripts.postpack` in all packages.return. It restores
`package.json` to what it looked like before calling the `prepack` command.

```text
Usage: backstage-cli postpack [options]

Options:
  -h, --help  display help for command
```

## clean

Remove cache and output directories.

```text
Usage: backstage-cli clean [options]

Options:
  -h, --help  display help for command
```

## build-workspace

Builds a mirror of the workspace using the packaged production version of each
package. This essentially calls `yarn pack` in each included package and unpacks
the resulting archive in the target `workspace-dir`.

```text
Usage: backstage-cli build-workspace [options] <workspace-dir>

Options:
```
