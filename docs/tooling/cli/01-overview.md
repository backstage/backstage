---
id: overview
title: Overview
description: Overview of the Backstage CLI
---

## Introduction

A goal of Backstage is to provide a delightful developer experience in and
around the project. Creating new [apps](../../references/glossary.md#app) and
[plugins](../../references/glossary.md#plugin) should be simple, iteration
speed should be fast, and the overhead of maintaining custom tooling should be
minimal. As a part of accomplishing this goal, Backstage provides its own build
system and tooling, delivered primarily through the
[`@backstage/cli`](https://www.npmjs.com/package/@backstage/cli) [package](../../references/glossary.md#package). When
creating an app using
[`@backstage/create-app`](https://www.npmjs.com/package/@backstage/create-app),
you receive a project that's already prepared with a typical setup and package
scripts for executing the most common commands.

Under the hood the CLI uses [Webpack](https://webpack.js.org/) for bundling,
[Rollup](https://rollupjs.org/) for building packages,
[Jest](https://jestjs.io/) for testing, and [eslint](https://eslint.org/) for
linting. It also includes tooling for working within Backstage apps, for example
for keeping the app up to date and verifying static configuration. For a more
in-depth look into the tooling, see the [build system](./02-build-system.md)
page, and for a list of commands, see the [commands](./03-commands.md) page.

While the Backstage tooling is opinionated in how it works, it is also possible
to use your own tooling either partially or fully. For example, the CLI provides
a command for building a plugin package for publishing, but the output is a
quite standard combination of transpiled JavaScript and TypeScript type
declarations. The usage of the command from the CLI can therefore be augmented
or replaced with other tools if necessary.

The Backstage CLI intentionally does not provide many hooks for overriding or
customizing the build process. This is to allow for evolution of the CLI without
having to take a wide API surface into account. This allows us to iterate and
improve the tooling, as well as to more easily keep the system up to date.

## Modular Architecture

The CLI is built from a set of independent **CLI modules**, each providing a
group of related commands. The default set of modules is provided by the
[`@backstage/cli-defaults`](https://www.npmjs.com/package/@backstage/cli-defaults)
package, which includes the following 12 modules:

- **Auth** (`@backstage/cli-module-auth`) — Authentication with Backstage instances
- **Actions** (`@backstage/cli-module-actions`) — Discovering and executing Backstage actions
- **Build** (`@backstage/cli-module-build`) — Building, starting, and packaging
- **Config** (`@backstage/cli-module-config`) — Configuration inspection
- **GitHub** (`@backstage/cli-module-github`) — GitHub App creation
- **Info** (`@backstage/cli-module-info`) — Environment and dependency information
- **Lint** (`@backstage/cli-module-lint`) — Linting
- **Maintenance** (`@backstage/cli-module-maintenance`) — Repository maintenance and deprecation tracking
- **Migrate** (`@backstage/cli-module-migrate`) — Migration and version management
- **New** (`@backstage/cli-module-new`) — Scaffolding new plugins and packages
- **Test** (`@backstage/cli-module-test-jest`) — Jest-based testing
- **Translations** (`@backstage/cli-module-translations`) — Translation message management

You can customize the CLI by adding, removing, or replacing modules. The CLI
automatically discovers modules from your project's dependencies based on the
`backstage.role` field in each package's `package.json`. You can also build your
own modules to extend the CLI with custom commands for your organization.

For more details, see the [CLI Modules](./05-modules.md) page and the
[Building Custom CLI Modules](./building-cli-modules.md) guide.
