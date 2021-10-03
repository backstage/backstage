---
id: builds-system
title: Build System
description: A deep dive into the Backstage build system
---

## What is the Backstage build system?

The Backstage build system is a collection of build and development tools that
help you lint, test, develop and finally release your Backstage projects. The
purpose of it is to provide an out-of-the-box solution lets you focus on
development rather than setting up your own build system. The tooling is shipped
with the [@backstage/cli](https://www.npmjs.com/package/@backstage/cli), and
already included in any project that you create using
[@backstage/create-app](https://www.npmjs.com/package/@backstage/create-app). It
is similar to for example
[react-scripts](https://www.npmjs.com/package/react-scripts), which is the
tooling you get with
[create-react-app](https://github.com/facebook/create-react-app). The Backstage
build system relies heavily on existing open source tools from the JavaScript
and TypeScript ecosystem, such as [Webpack](https://webpack.js.org/),
[Rollup](https://rollupjs.org/), [Jest](https://jestjs.io/), and
[ESLint](https://eslint.org/).

## Design Considerations

There are a couple of core beliefs and constraints that guided the design of the
Backstage build system. The first and most important is that we put the
development experience first. If we need to cut corners or add complexity we do
so in other areas, but the experience of firing up an editor and iterating on
some code should always be as smooth as possible.

In addition, there are a number of hard and soft requirements that we want to
support:

- Monorepos - The build system should support multi-package setups.
- Publishing - It should be possible to build and publish individual packages.
- Scale - It should scale to hundreds of large packages without excessive wait
  times.
- Reloads - The development flow should support quick on-save hot reloads.
- Simple - Usage should simple, just a single command if possible.
- Universal - Development towards both web applications, isomorphic packages,
  and Node.js.
- Editors - Things like linting and type checking should work when browsing the
  source code.

During the design of the build system this collection of requirements was not
something that was supported by existing tools like for example `react-scripts`.
Especially the combination of monorepo, publishing and editor support has led to
some specialized setups, as well as the scaling requirements.

## Architecture

We can divide the development flow within Backstage into a couple of different
steps:

- **Formatting** - Applies a consistent formatting to your source code.
- **Linting** - Makes sure your code is free from problems that can be detected
  automatically.
- **Type Checking** - Validates your TypeScript type annotations.
- **Testing** - Runs test suites towards your code to catch issues early.
- **Building** (optional) - Compiles the source code in an NPM package to make
  it ready for publishing.
- **Bundling** - Compiles and bundles a package and all of its dependencies into
  a release bundle.

These steps are generally kept isolated form each other, with each step focusing
on its specific task. For example, we do not do linting or type checking
together with the building or bundling. This is so that we can provide more
flexibility and avoid duplicate work, improving performance. It is strongly
recommended that as a part of developing withing Backstage you use a code editor
or IDE that has built-in support for formatting, linting, and type checking.
