---
id: commands
title: Commands
description: Index of all commands available in the Backstage CLI.
---

This page lists all commands provided by the Backstage CLI. Each command belongs
to a [CLI module](./05-modules.md) — follow the links below for detailed
documentation including options and examples.

## help

This command displays a help summary or detailed help screens for each command.
Below is a cleaned up output of `yarn backstage-cli --help`:

```text
new [options]                                  Open up an interactive guide to creating new things in
                                                your app
auth [command]                                 Authentication commands
actions [command]                              Backstage action commands
config:docs [options]                          Browse the configuration reference documentation
config:print [options]                         Print the app configuration for the current package
config:check [options]                         Validate that the given configuration loads and matches
                                                schema
config:schema [options]                        Print configuration schema
repo [command]                                 Commands that run across an entire Backstage project
package [command]                              Lifecycle scripts for individual packages
migrate [command]                              Migration utilities
versions:bump [options]                        Bump Backstage packages to the latest versions
versions:migrate [options]                     Migrate plugins to the @backstage-community namespace
translations [command]                         Translation message management
build-workspace <workspace-dir> [packages...]  Builds a temporary dist workspace from the provided
                                                packages
create-github-app <github-org>                 Create new GitHub App in your organization.
info                                           Show helpful information for debugging and reporting bugs
help [command]                                 display help for command
```

## Commands by Module

### [Auth Module](./module-auth.md)

| Command            | Description                               |
| ------------------ | ----------------------------------------- |
| `auth login`       | Log in the CLI to a Backstage instance    |
| `auth logout`      | Log out and clear stored credentials      |
| `auth show`        | Show details of an authenticated instance |
| `auth list`        | List authenticated instances              |
| `auth print-token` | Print an access token to stdout           |
| `auth select`      | Select the default instance               |

### [Actions Module](./module-actions.md)

| Command                  | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| `actions list`           | List available actions from configured plugin sources |
| `actions execute`        | Execute an action                                     |
| `actions sources add`    | Add a plugin source for action discovery              |
| `actions sources list`   | List configured plugin sources                        |
| `actions sources remove` | Remove a plugin source                                |

### [Build Module](./module-build.md)

| Command            | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `repo start`       | Start packages for local development                    |
| `repo build`       | Build packages in the project                           |
| `repo clean`       | Delete cache and output directories across the project  |
| `package start`    | Start a package for local development                   |
| `package build`    | Build a package for production deployment or publishing |
| `package bundle`   | Bundle a plugin for dynamic loading (experimental)      |
| `package clean`    | Delete cache directories                                |
| `package prepack`  | Prepare a package for packaging before publishing       |
| `package postpack` | Restore changes made by prepack                         |
| `build-workspace`  | Build a temporary dist workspace from provided packages |

### [Config Module](./module-config.md)

| Command         | Description                                          |
| --------------- | ---------------------------------------------------- |
| `config:docs`   | Browse the configuration reference documentation     |
| `config:print`  | Print the app configuration                          |
| `config:check`  | Validate that configuration loads and matches schema |
| `config:schema` | Print the configuration schema                       |

### [GitHub Module](./module-github.md)

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `create-github-app` | Create a new GitHub App in your organization |

### [Info Module](./module-info.md)

| Command | Description                                               |
| ------- | --------------------------------------------------------- |
| `info`  | Show helpful information for debugging and reporting bugs |

### [Lint Module](./module-lint.md)

| Command        | Description                      |
| -------------- | -------------------------------- |
| `package lint` | Lint a package                   |
| `repo lint`    | Lint all packages in the project |

### [Maintenance Module](./module-maintenance.md)

| Command                  | Description                               |
| ------------------------ | ----------------------------------------- |
| `repo fix`               | Automatically fix packages in the project |
| `repo list-deprecations` | List deprecations                         |

### [Migrate Module](./module-migrate.md)

| Command                        | Description                                            |
| ------------------------------ | ------------------------------------------------------ |
| `versions:bump`                | Bump Backstage packages to the latest versions         |
| `versions:migrate`             | Migrate plugins to the @backstage-community namespace  |
| `migrate package-roles`        | Add package role field to packages                     |
| `migrate package-scripts`      | Set package scripts according to each package role     |
| `migrate package-exports`      | Synchronize package subpath export definitions         |
| `migrate package-lint-configs` | Migrate to @backstage/cli/config/eslint-factory        |
| `migrate react-router-deps`    | Migrate react-router dependencies to peer dependencies |

### [New Module](./module-new.md)

| Command | Description                                                  |
| ------- | ------------------------------------------------------------ |
| `new`   | Open an interactive guide to creating new things in your app |

### [Test Module](./module-test.md)

| Command        | Description                    |
| -------------- | ------------------------------ |
| `repo test`    | Run tests across the project   |
| `package test` | Run tests for a single package |

### [Translations Module](./module-translations.md)

| Command               | Description                               |
| --------------------- | ----------------------------------------- |
| `translations export` | Export translation messages to JSON files |
| `translations import` | Generate translation resource wiring code |
