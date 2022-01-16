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
with the Backstage CLI. It both takes care of providing a default Jest
configuration, as well as allowing for configuration overrides to be defined in
each `package.json`. How this can be done in practice is discussed in the
configuration section below.

### Building

The primary purpose of the build process is to prepare packages for publishing,
although it is also used as part of the backend bundling process which we will
discuss below. Since it's only used in these two cases, any Backstage app that
does not use the Backend parts of the project may not need to interact with the
build process at all. It can nevertheless be useful to know how it works, since
all of the published Backstage packages are built using this process.

The build is currently using [Rollup](https://rollupjs.org/) and executes in
complete isolation for each individual package. There are currently three
different commands in the Backstage CLI that invokes the build process,
`plugin:build`, `backend:build`, and simply `build`. The two former are
pre-configured commands for frontend and backend plugins, while the `build`
command provides more control over the output. It is likely that the two
specialized commands disappear in the future, leaving just the `build` command.

There are three different possible outputs of the build process: JavaScript in
CommonJS module format, JavaScript in ESM format, and type declarations. Each
invocation of a build command will write one or more of these outputs to the
`dist` folder in the package, and in addition copy any asset files like
stylesheets or images. For more details on what syntax and file formats are
supported by the build process, see the transpilation section below.

When building CommonJS or ESM output, the build commands will always use
`src/index.ts` as the entrypoint. All dependencies of the package will be marked
as external, meaning that in general it is only the contents of the `src` folder
that ends up being compiled and output to `dist`, any imported external
dependencies, even within the monorepo, will stay intact.

The build of the type definitions works quite differently. The entrypoint of the
type definition build is the relative location of the package within the
`dist-types` folder in the project root. This means that it is important to run
type checking before building any packages with type definitions, and that
emitting type declarations must be enable in the TypeScript configuration. The
reason for the type definition build step is to strip out all types but the ones
that are exported from the package, leaving a much cleaner type definition file
and making sure that the type definitions are in sync with the generated
JavaScript.

### Bundling

The goal of the bundling process is to combine multiple packages together into a
single runtime unit. The way this is done varies between frontend and backend,
and local development versus production deployment. Because of that we will be
covering each of these cases individually.

#### Frontend Development Bundling

There are two different commands that starts the frontend development bundling,
`app:serve`, which serves an app and uses `src/index.*` as the entrypoint, and
`plugin:serve`, which serves a plugin and uses `dev/index.*` as the entrypoint.
These are typically invoked via the `yarn start` script, and are intended for
local development only. When running the bundle command, a development server
will be set up that listens to the protocol, host and port set by `app.baseUrl`
in the configuration. If needed it is also possible to override the listening
options through the `app.listen` configuration.

The frontend development bundling is currently based on
[Webpack](https://webpack.js.org/) and
[Webpack Dev Server](https://webpack.js.org/configuration/dev-server/). The
Webpack configuration itself varies very little between the frontend development
and production bundling, so we'll dive more into the configuration in the
production section below. The main differences are that `process.env.NODE_ENV`
is set to `'development'`, minification is disabled, and there is support for
[React Hot Loader](https://github.com/gaearon/react-hot-loader).

If you prefer to run type checking and linting as part of the Webpack process,
you can enable usage of the
[`ForkTsCheckerWebpackPlugin`](https://www.npmjs.com/package/fork-ts-checker-webpack-plugin)
by passing the `--check` flag. However, the recommended way to handle these
checks is to use an editor that has built-in support for them, as well as
running them in CI and the occasional manual run when needed.

#### Frontend Production Bundling

The frontend production bundling creates your typical web content bundle, all
contained within a single folder, ready for static serving. It is invoked using
the `app:build` command, and unlike the development bundling there is no way to
build a production bundle of an individual plugin. The output of the bundling
process is written to the `dist` folder in the package.

Just like the development bundling, the production bundling is based on
[Webpack](https://webpack.js.org/). It uses the
[`HtmlWebpackPlugin`](https://webpack.js.org/plugins/html-webpack-plugin/) to
generate the `index.html` entry point, and includes a default template that's
included with the CLI. You can replace the bundled template by adding
`public/index.html` to your package. The template has access to two global
constants, `publicPath` which is the public base path that the bundle is
intended to be served at, as well as `config` which is your regular frontend
scoped configuration from `@backstage/config`.

The Webpack configuration also includes a custom plugin for resolving packages
correctly from linked in packages, the `ModuleScopePlugin` from
[`react-dev-utils`](https://www.npmjs.com/package/react-dev-utils) which makes
sure that imports don't react outside the package, a few fallbacks for some
Node.js modules like `'buffer'` and `'events'`, a plugin that writes the
frontend configuration to the bundle as `process.env.APP_CONFIG` and build
information as `process.env.BUILD_INFO`, and lastly minification handled by
[esbuild](https://esbuild.github.io/) using the
[`esbuild-loader`](https://npm.im/esbuild-loader). There are of course also a
set of loaders configured, which is covered in the
[transpilation section](#loaders-and-transpilation).

The output of the bundling process is split into two types of files. The first
is a set of generic assets with plain names in the root of the `dist/` folder.
You will want to serve these with short-lived caching or no caching at all. The
second is a set of hashed static assets in the `dist/static/`, which you can
configure to be cached for a much longer time.

The configuration of static assets is optimized for frequent changes and serving
over HTTP 2.0. The assets are aggressively split into small chunks, which means
the browser has to make a lot of small requests to load them. The upside is that
changes to individual plugins and packages will invalidate a smaller number of
files, thereby allowing for rapid development without too much impact on the
page load performance.

#### Backend Development Bundling

The backend development bundling is also based on Webpack, but rather than
starting up a web server, the backend is started up using the
[`RunScriptWebpackPlugin`](https://www.npmjs.com/package/run-script-webpack-plugin).
The reason for using Webpack for development of the backend is both that it is
convenient way to handle transpilation of a large set of packages, as well us
allowing us to use hot module replacement and maintain state while reloading
individual backend modules. This is particularly useful when running the backend
with in-memory SQLite as the database choice.

Except for executing in Node.js rather than a web server, the backend
development bundling configuration is quite similar to the frontend one. It
shares most of the Webpack configuration, including the transpilation setup.
Some differences are that it does not inject any environment variables or node
module fallbacks, and it uses
[`webpack-node-externals`](https://www.npmjs.com/package/webpack-node-externals)
to avoid bundling in dependency modules.

If you want to inspect the running Node.js process, the `--inspect` and
`--inspect-brk` flags can be used, as they will be passed through to the backend
process.

#### Backend Production Bundling

The backend production bundling uses a completely different setup than the other
bundling options. Rather than using Webpack, the backend production bundling
instead collects the backend packages and all of its local dependencies into a
deployment archive. The archive is written to `dist/bundle.tar.gz`, and contains
the packaged version of each of these packages. The layout of the packages in
the archive is the same as the directory layout in the target monorepo, and the
bundle also contains the root `package.json` and `yarn.lock` files.

Note that before building the production bundle, all of the backend packages
have to have been built first, although when executing the `backend:bundle`
command you can pass the `--build-dependencies` to have this done automatically.
The reason for not using the flag is to avoid duplicate work in case you already
build all of your packages earlier in your build process.

To use the bundle, extract it into a directory, run `yarn install --production`,
and then start the backend using your backend package as the Node.js entry
point, for example `node packages/backend`.

The `dist/bundle.tar.gz` is accompanied by a `dist/skeleton.tar.gz`, which has
the same layout, but only contains `package.json` files. This can be used to run
a `yarn install` in environments that will benefit from the caching that this
enables, such as Docker image builds. To use the skeleton archive you copy it
over to the target directory along with the root `package.json` and `yarn.lock`,
extract the archive, and then run `yarn install`. Your target directory now has
all dependencies installed, and as soon as you copy over and extract the
contents of the `bundle.tar.gz` archive, the backend will be ready to run.

The following is an example of a `Dockerfile` that can be used to package the
output of `backstage-cli backend:bundle` into an image:

```Dockerfile
FROM node:14-buster-slim
WORKDIR /app

COPY yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN yarn install --production --frozen-lockfile --network-timeout 300000 && rm -rf "$(yarn cache dir)"

COPY packages/backend/dist/bundle.tar.gz app-config.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

CMD ["node", "packages/backend"]
```

## Loaders and Transpilation
