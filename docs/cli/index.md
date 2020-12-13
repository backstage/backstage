---
id: index
title: Overview
description: Overview of the Backstage CLI
---

## Summary

Backstage provides an opinionated set of tooling for both frontend and backend
development. It is delivered through the `@backstage/cli` package and executed
either directly through `yarn backstage-cli <command>` or within yarn scripts.
When creating an app using `@backstage/create-app` it contains package scripts
for executing the most common commands.

Under the hood the CLI uses [webpack](https://webpack.js.org/) for bundling,
[rollup](https://rollupjs.org/) for building packages,
[jest](https://jestjs.io/) for testing, and [eslint](https://eslint.org/) for
linting. It also includes custom tooling for working within Backstage apps, for
example for keeping the app up to date and verifying static configuration.

## Introduction

A goal of Backstage is to provide a delightful developer experience in and
around the project. Creating new apps and plugins should be simple, iteration
speed should be fast, and the overhead of maintaining custom tooling should be
minimal. As a part of accomplishing this goal, Backstage provides its own set of
opinionated tooling, delivered primarily through the `@backstage/cli` package.

The `@backstage/cli` package provides a single `bin` script, `backstage-cli`,
which you can execute directly with `yarn` or within a script in `package.json`.
If you have a Backstage app set up, you can try out the following command to
print the top-level help page of the CLI:

```bash
yarn backstage-cli --help
```

If you are familiar with `create-react-app` you may recognize this pattern, as
it uses a package called `react-scripts` to bring most of the functionality into
the created project. The Backstage equivalent of `create-react-app` is
`@backstage/create-app`, and the equivalent of `react-scripts` is
`@backstage/cli`. There are however a couple of key differences between the two.
Most notably, Backstage apps are monorepos and the CLI is tailored for that
environment. It provides tooling both for bundling and developing full end-user
apps, but also for developing, building and publishing individual packages
within the monorepo.

## Opinionated

The Backstage CLI is highly opinionated in what tools to use and how they are
configured. It is tailored for development in large TypeScript monorepos with
hundreds of separate plugins, but with the ability to have edits anywhere in the
codebase reflected within a few seconds. The build output is also optimized for
this setup, and aims for an excellent user experience with fast page load times
in modern browsers, rather than a wide range of support.

While the Backstage tooling is opinionated in how to develop and build packages,
it is also possible to use your own tooling either partially or fully. For
example, the CLI provides a command for building a plugin package for
publishing, but the output is a pretty regular `types+js` output that you see in
many packages, which can easily be achieved with many other sets of tooling.

Just like `react-scripts`, the Backstage CLI does not provide many hooks for
overriding or customizing the build process. This is to allow for evolution of
the CLI without having to take a wide API surface into account. Allowing us to
more quickly iterate and improve the tooling, as well more easily keeping
dependencies up to date.

## Opinions

In no particular order, this is a list of opinions and goals that guide the
design and development of the Backstage CLI:

- All you need for development is `yarn start`, there should be no need to
  manually build packages or run other tasks on the side.
- Development experience comes first. The toolchain is optimized for keeping
  development smooth, rather than making it easy to for example build and
  publish packages.
- TypeChecking and linting is left for editors and CI. Most code editors provide
  tooling for these checks, and running them again during compilation would slow
  down iteration speed and consume more resources.
- Backstage is run in modern browsers. We keep transpilation lightweight and
  rely on modern technology such as HTTP/2 to optimize frontend speed.

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
