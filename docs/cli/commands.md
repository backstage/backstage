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

Build an app for a production release

```text
Usage: backstage-cli app:build [options]

Options:
  --stats          Write bundle stats to output directory
  --config <path>  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## app:diff

Diff an existing app with the creation template

```text
Usage: backstage-cli app:diff [options]

Options:
  --check     Fail if changes are required
  --yes       Apply all changes
  -h, --help  display help for command
```

## app:serve

Serve an app for local development

```text
Usage: backstage-cli app:serve [options]

Options:
  --check          Enable type checking and linting
  --config <path>  Config files to load instead of app-config.yaml (default: [])
  -h, --help       display help for command
```

## backend:build

Build a backend plugin

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
