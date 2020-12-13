---
id: index
title: Overview
description: Overview of the Backstage CLI
---

## Summary

Backstage ships its own CLI tooling

Tooling both for bundling deployment artifacts, as well as building individual
packages for publishing.

Under the hook we use [webpack](https://webpack.js.org/) for bundling,
[rollup](https://rollupjs.org/) for building packages,
[jest](https://jestjs.io/) for testing, and [eslint](https://eslint.org/) for
linting.

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
