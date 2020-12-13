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

Bundles the package into a docker image. All extra args are forwarded to
`docker image build`.

```text
Usage: backstage-cli backend:build-image [options]

Options:
  --build                 Build packages before packing them into the image
  --backstage-cli-help    display help for command
```

## backend:dev

Start local development server with HMR for the backend

```text
Usage: backstage-cli backend:dev [options]

Options:
  --check          Enable type checking and linting
  --inspect        Enable debugger
  --config <path>  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## create-plugin

Creates a new plugin in the current repository

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

Removes plugin in the current repository

```text
Usage: backstage-cli remove-plugin [options]

Options:
  -h, --help  display help for command
```

## plugin:build

Build a plugin

```text
Usage: backstage-cli plugin:build [options]

Options:
  -h, --help  display help for command
```

## plugin:serve

Serves the dev/ folder of a plugin

```text
Usage: backstage-cli plugin:serve [options]

Options:
  --check          Enable type checking and linting
  --config <path>  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## plugin:diff

Diff an existing plugin with the creation template

```text
Usage: backstage-cli plugin:diff [options]

Options:
  --check     Fail if changes are required
  --yes       Apply all changes
  -h, --help  display help for command
```

## build

Build a package for publishing

```text
Usage: backstage-cli build [options]

Options:
  --outputs <formats>  List of formats to output [types,cjs,esm]
  -h, --help           display help for command
```

## lint

Lint a package

```text
Usage: backstage-cli lint [options]

Options:
  --format <format>  Lint report output format (default: "eslint-formatter-friendly")
  --fix              Attempt to automatically fix violations
  -h, --help         display help for command
```

## test

Run tests, forwarding args to Jest, defaulting to watch mode

```text
Usage: backstage-cli test [options]

Options:
  --backstage-cli-help    display help for command
```

## config:print

Print the app configuration for the current package

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

Validate that the given configuration loads and matches schema

```text
Usage: backstage-cli config:check [options]

Options:
  --package <name>  Only load config schema that applies to the given package
  --config <path>   Config files to load instead of app-config.yaml (default: [])
  -h, --help        display help for command
```

## versions:bump

Bump Backstage packages to the latest versions

```text
Usage: backstage-cli versions:bump [options]

Options:
  -h, --help  display help for command
```

## versions:check

Check Backstage package versioning

```text
Usage: backstage-cli versions:check [options]

Options:
  --fix       Fix any auto-fixable versioning problems
  -h, --help  display help for command
```

## prepack

Prepares a package for packaging before publishing

```text
Usage: backstage-cli prepack [options]

Options:
  -h, --help  display help for command
```

## postpack

Restores the changes made by the prepack command

```text
Usage: backstage-cli postpack [options]

Options:
  -h, --help  display help for command
```

## clean

Delete cache directories

```text
Usage: backstage-cli clean [options]

Options:
  -h, --help  display help for command
```

## build-workspace

Builds a temporary dist workspace from the provided packages

```text
Usage: backstage-cli build-workspace [options] <workspace-dir>

Options:
```
