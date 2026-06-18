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

## Install CLI command modules

The `@backstage/cli` package is the CLI host and does not include commands. A
repository must install its command modules as direct dependencies in the root
`package.json`. The `@backstage/create-app` templates install
`@backstage/cli-defaults`, which is the convenience aggregate containing the
standard Backstage commands:

```json title="package.json"
{
  "devDependencies": {
    "@backstage/cli": "backstage:^",
    "@backstage/cli-defaults": "backstage:^"
  }
}
```

To select commands individually, omit `@backstage/cli-defaults` and install the
relevant `@backstage/cli-module-*` packages instead:

```json title="package.json"
{
  "devDependencies": {
    "@backstage/cli": "backstage:^",
    "@backstage/cli-module-build": "backstage:^",
    "@backstage/cli-module-lint": "backstage:^",
    "@backstage/cli-module-test-jest": "backstage:^"
  }
}
```

You can also install an individual module alongside `@backstage/cli-defaults`
to replace commands from the aggregate. Overrides apply to exact command paths,
so the aggregate continues to provide its unrelated commands. The CLI reports
conflicts between individually installed modules instead of selecting one based
on dependency order.

When upgrading an existing repository, add either `@backstage/cli-defaults` or
the selected individual modules before updating `@backstage/cli`. The CLI no
longer falls back to modules from its own dependency tree.

### Legacy configuration forwarding paths

Compatibility paths such as `@backstage/cli/config/jest` and
`@backstage/cli/config/webpack-public-path` continue to forward to their owning
modules. If your repository uses one of these paths directly, install the owner
as a direct root dependency: `@backstage/cli-module-test-jest` for Jest paths or
`@backstage/cli-module-build` for the Webpack public path. The forwarding shim
resolves the owner from the target repository and reports an error when it is
missing.
