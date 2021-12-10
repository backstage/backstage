---
id: cli-build-system
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

- Monorepos - The build system should support multi-package setups
- Publishing - It should be possible to build and publish individual packages
- Scale - It should scale to hundreds of large packages without excessive wait
  times
- Reloads - The development flow should support quick on-save hot reloads
- Simple - Usage should simple, just a single command if possible
- Universal - Development towards both web applications, isomorphic packages,
  and Node.js
- Editors - Things like linting and type checking should work when browsing the
  source code

During the design of the build system this collection of requirements was not
something that was supported by existing tools like for example `react-scripts`.
Especially the combination of monorepo, publishing and editor support has led to
some specialized setups, as well as the scaling requirements.

## Architecture

We can divide the development flow within Backstage into a couple of different
steps:

- **Formatting** - Applies a consistent formatting to your source code
- **Linting** - Makes sure your code is free from problems that can be detected
  automatically
- **Type Checking** - Verifies that TypeScript types are valid
- **Testing** - Runs test suites towards your code to catch issues early
- **Building** - Compiles the source code in an individual package
- **Bundling** - Combines a package and all of its dependencies into a
  production-ready bundle

These steps are generally kept isolated form each other, with each step focusing
on its specific task. For example, we do not do linting or type checking
together with the building or bundling. This is so that we can provide more
flexibility and avoid duplicate work, improving performance. It is strongly
recommended that as a part of developing withing Backstage you use a code editor
or IDE that has support for formatting, linting, and type checking.

Let's dive into a detailed look at each of these steps and how they are
implemented in a typical Backstage app.

### Formatting

The formatting setup lives completely within each Backstage application. In an
app created with `@backstage/create-app` the formatting is handled by
[prettier](https://prettier.io/), but each application can those their own
formatting rules and switch to a different formatter if desired.

### Linting

The Backstage CLI includes a `lint` command, which is a thin wrapper around
`eslint`. It adds a few options that can't be set through configuration, such as
including the `.ts` and `.tsx` extensions in the set of linted files. The `lint`
command simply provides a sane default and is not intended to be customizable.
If you want to supply more advanced options you can invoke `eslint` directly
instead.

In addition to the `lint` command, the Backstage CLI also includes a set of base
ESLint configurations, one for frontend and one for backend packages. These lint
configurations in turn build on top of the lint rules from
[@spotify/web-scripts](https://github.com/spotify/web-scripts).

In a standard Backstage setup, each individual package has its own lint
configuration, along with that there's also a root configuration that applies to
the entire project. Each configuration is initially one that simply extends a
configuration provided by the Backstage CLI, but can be customized to fit the
needs of each package.

### Type Checking

Just like formatting, the Backstage CLI does not have its own command for type
checking. It does however have a base configuration with both recommended
defaults as well as some required settings for the build system to work.

Perhaps the most notable part about the TypeScript setup in Backstage projects
is that the entire project is one big compilation unit. This is due to
performance optimization as well as easy of use, since breaking projects down
into smaller pieces has proven to both lead to a more complicated setup, as well
as type checking of the entire project being an order of magnitude slower. In
order to make this setup work, the entrypoint of each package needs to point to
the TypeScript source files, which in turn cases some complications during
publishing that we'll talk about below.

The type checking is generally configured to be incremental for local
development, with the output stored in the `dist-types` folder in the repo root.
This provides a significant speedup when running `tsc` multiple times locally,
but it does make the initial run a little bit slower. Because of the slower
initial run we disable incremental type checking in the `tcs:full` Yarn script
that is included by default in any Backstage app and is intended for use in CI.

Another optimization that is used by default is to skip the checking of library
types, this means that TypeScript will not verify that types within
`node_modules` are sound. Disabling this check significantly speeds up type
checking, but in the end it is still an important check that should not be
completely omitted, it's just very unlikely to catch issues that are introduced
during local development. What we opt for instead is to include the check in CI
through the `tsc:full` script, which will run a full type check, including
`node_modules`.

For the two reasons mentioned above, it is **highly** recommended to use the
`tsc:full` script to run type checking in CI.

### Testing

As mentioned above, the Backstage CLI uses [Jest](https://jestjs.io/), which is
a JavaScript test framework that covers both test execution and assertions. Jest
executes all tests in Node.js, including frontend browser code. The trick it
uses is to execute the tests in a Node.js VM using various predefined
environments, such as one based on [`jsdom`](https://github.com/jsdom/jsdom)
that helps mimic browser APIs and behavior.

The Backstage CLI has its own command that helps execute tests,
`backstage-cli test`, as well as it's own configuration at
`@backstage/cli/config/jest.js`. The command is a relatively thin wrapper around
running `jest` directly. Its main responsibility is to make sure the included
configuration is used, as well setting the `NODE_ENV` and `TZ` environment
variables, and provided some sane default flags like `--watch` if executed
within a Git repository.

The by far biggest amount of work is done by the Jest configuration included
with the Backstage CLI. It both takes care of providing a default configuration
