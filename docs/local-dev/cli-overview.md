---
id: cli-overview
title: CLI Overview
description: Overview of the Backstage CLI
---

## Summary

Backstage provides an opinionated set of tooling for both frontend and backend
development. It is delivered through the
[`@backstage/cli`](https://www.npmjs.com/package/@backstage/cli) package and
executed either directly through `yarn backstage-cli <command>` or within
`package.json` scripts. When creating an app using
[`@backstage/create-app`](https://www.npmjs.com/package/@backstage/create-app)
it contains package scripts for executing the most common commands.

Under the hood the CLI uses [Webpack](https://webpack.js.org/) for bundling,
[Rollup](https://rollupjs.org/) for building packages,
[Jest](https://jestjs.io/) for testing, and [eslint](https://eslint.org/) for
linting. It also includes custom tooling for working within Backstage apps, for
example for keeping the app up to date and verifying static configuration.

For a full list of CLI commands, see the [commands](./cli-commands.md) page.

## Introduction

A goal of Backstage is to provide a delightful developer experience in and
around the project. Creating new apps and plugins should be simple, iteration
speed should be fast, and the overhead of maintaining custom tooling should be
minimal. As a part of accomplishing this goal, Backstage provides its own set of
opinionated tooling, delivered primarily through the
[`@backstage/cli`](https://www.npmjs.com/package/@backstage/cli) package.

The `@backstage/cli` package provides a single executable script,
`backstage-cli`, which you can run directly with `yarn` or within a script in
`package.json`. If you have a Backstage app set up, you can try out the
following command to print the top-level help page of the CLI:

```text
yarn backstage-cli --help
```

If you are familiar with [`create-react-app`](https://create-react-app.dev/) you
may recognize the pattern of bundling tooling up as a CLI, as it uses a package
called [`react-scripts`](https://www.npmjs.com/package/react-scripts) to bring
most of the functionality into the created project. The Backstage equivalent of
`create-react-app` is
[`@backstage/create-app`](https://www.npmjs.com/package/@backstage/create-app),
and the equivalent of `react-scripts` is `@backstage/cli`. There are however a
couple of key differences between the two. Most notably, Backstage apps are
monorepos and the CLI is tailored for that environment. It provides tooling both
for bundling and developing full end-user apps, but also for developing,
building and publishing individual packages within the monorepo, as well as
tooling that is more unique to Backstage, such as commands for working with
static configuration.

## Opinionated Tooling

The Backstage CLI is highly opinionated in what tools are used and how they are
configured. It is tailored for development in large TypeScript monorepos with
hundreds of separate packages, but with the ability to have edits anywhere in
the codebase reflected within a few seconds. The build output is also optimized
for this setup, and aims to provide an excellent user experience with fast page
load times in modern browsers, rather than a wide range of support.

While the Backstage tooling is opinionated in how to develop and build packages,
it is also possible to use your own tooling either partially or fully. For
example, the CLI provides a command for building a plugin package for
publishing, but the output is a quite standard combination of transpiled
JavaScript and TypeScript type declarations. The usage of the command from the
CLI can therefore easily be replaced with other tools if necessary.

Just like `react-scripts`, the Backstage CLI does not provide many hooks for
overriding or customizing the build process. This is to allow for evolution of
the CLI without having to take a wide API surface into account. This allows us
to quickly iterate and improve the tooling, as well as to more easily keep
dependencies up to date.

## Opinions & Goals

In no particular order, this is a list of opinions and goals that guide the
design and development of the Backstage CLI:

- All you need for development is `yarn start`, there should be no need to
  manually build packages or run other separate tasks.
- Development experience comes first. The toolchain is optimized for keeping
  development smooth, rather than making it easy to for example build and
  publish packages.
- Type checking and linting is left for text editors and Continuous Integration.
  Most text editors provide tooling for these checks, and running them a second
  time during compilation slows down iteration speed and consumes more system
  resources.
- Backstage is run in modern browsers. We keep transpilation lightweight and
  rely on modern technologies such as HTTP/2 to optimize frontend speed.

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
