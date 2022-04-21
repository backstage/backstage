---
id: cli-overview
title: Overview
description: Overview of the Backstage CLI
---

## Introduction

A goal of Backstage is to provide a delightful developer experience in and
around the project. Creating new apps and plugins should be simple, iteration
speed should be fast, and the overhead of maintaining custom tooling should be
minimal. As a part of accomplishing this goal, Backstage provides its own build
system and tooling, delivered primarily through the
[`@backstage/cli`](https://www.npmjs.com/package/@backstage/cli) package. When
creating an app using
[`@backstage/create-app`](https://www.npmjs.com/package/@backstage/create-app),
you receive a project that's already prepared with a typical setup and package
scripts for executing the most common commands.

Under the hood the CLI uses [Webpack](https://webpack.js.org/) for bundling,
[Rollup](https://rollupjs.org/) for building packages,
[Jest](https://jestjs.io/) for testing, and [eslint](https://eslint.org/) for
linting. It also includes tooling for working within Backstage apps, for example
for keeping the app up to date and verifying static configuration. For a more
in-depth look into the tooling, see the [build system](./cli-build-system.md)
page, and for a list of commands, see the [commands](./cli-commands.md) page.

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

## Glossary

- **Package** - A package in the Node.js ecosystem, often published to a package
  registry such as [NPM](https://www.npmjs.com/).
- **Monorepo** - A project layout that consists of multiple packages within a
  single project, where packages are able to have local dependencies on each
  other. Often enabled through tooling such as [lerna](https://lerna.js.org/)
  and [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
- **Local Package** - One of the packages within a monorepo. These package may
  or may not also be published to a package registry.
- **Bundle** - A collection of the deployment artifacts. The output of the
  bundling process, which brings a collection of packages into a single
  collection of deployment artifacts.
- **Package Role** - The declared role of a package, see [package roles](./cli-build-system.md#package-roles).
