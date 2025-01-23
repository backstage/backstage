---
id: build-system
title: Build System
description: A deep dive into the Backstage build system
---

The Backstage build system is a collection of build and development tools that
help you lint, test, develop and finally release your Backstage projects. The
purpose of the build system is to provide an out-of-the-box solution that works
well with Backstage and lets you focus on building an app rather than having to
spend time setting up your own tooling.

The build system setup is part of the
[@backstage/cli](https://www.npmjs.com/package/@backstage/cli), and already
included in any project that you create using
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

In addition, there are a number of hard and soft requirements:

- Monorepos - The build system should support multi-package workspaces
- Publishing - It should be possible to build and publish individual packages
- Scale - It should scale to hundreds of large packages without excessive wait
  times
- Reloads - The development flow should support quick on-save hot reloads
- Simple - Usage should be simple and configuration should be kept minimal
- Universal - Development towards both web applications, isomorphic packages,
  and Node.js
- Modern - The build system targets modern environments
- Editors - Type checking and linting should be available within most editors

During the design of the build system this collection of requirements was not
something that was supported by existing tools like for example `react-scripts`.
The requirements of scaling in combination of monorepo, publishing, and editor
support led us to adopting our own specialized setup.

## Structure

We can divide the development flow within Backstage into a couple of different
steps:

- **Formatting** - Applies a consistent formatting to your source code
- **Linting** - Analyzes your source code for potential problems
- **Type Checking** - Verifies that TypeScript types are valid
- **Testing** - Runs different levels of test suites towards your project
- **Building** - Compiles the source code in an individual package
- **Bundling** - Combines a package and all of its dependencies into a
  production-ready bundle

These steps are generally kept isolated from each other, with each step focusing
on its specific task. For example, we do not do linting or type checking
together with the building or bundling. This is so that we can provide more
flexibility and avoid duplicate work, improving performance. It is strongly
recommended that as a part of developing within Backstage you use a code editor
or IDE that has support for formatting, linting, and type checking.

Let's dive into a detailed look at each of these steps and how they are
implemented in a typical Backstage app.

## Package Roles

> Package roles were introduced in March 2022. To migrate existing projects, see the [migration guide](../../tutorials/package-role-migration.md).

The Backstage build system uses the concept of package roles in order to help keep
configuration lean, provide utility and tooling, and enable optimizations. A package
role is a single string that identifies what the purpose of a package is, and it's
defined in the `package.json` of each package like this:

```json
{
  "name": "my-package",
  "backstage": {
    "role": "<role>"
  },
  ...
}
```

These are the available roles that are currently supported by the Backstage build system:

| Role                   | Description                                  | Example                                      |
| ---------------------- | -------------------------------------------- | -------------------------------------------- |
| frontend               | Bundled frontend application                 | `packages/app`                               |
| backend                | Bundled backend application                  | `packages/backend`                           |
| cli                    | Package used as a command-line interface     | `@backstage/cli`, `@backstage/codemods`      |
| web-library            | Web library for use by other packages        | `@backstage/plugin-catalog-react`            |
| node-library           | Node.js library for use by other packages    | `@backstage/plugin-techdocs-node`            |
| common-library         | Isomorphic library for use by other packages | `@backstage/plugin-permission-common`        |
| frontend-plugin        | Backstage frontend plugin                    | `@backstage/plugin-scaffolder`               |
| frontend-plugin-module | Backstage frontend plugin module             | `@backstage/plugin-analytics-module-ga`      |
| backend-plugin         | Backstage backend plugin                     | `@backstage/plugin-auth-backend`             |
| backend-plugin-module  | Backstage backend plugin module              | `@backstage/plugin-search-backend-module-pg` |

Most of the steps that we cover below have an accompanying command that is intended to be used as a package script. The commands are all available under the `backstage-cli package` category, and many of the commands will behave differently depending on the role of the package. The commands are intended to be used like this:

```json
{
  "scripts": {
    "start": "backstage-cli package start",
    "build": "backstage-cli package build",
    "lint": "backstage-cli package lint",
    ...
  }
}
```

## Formatting

The formatting setup lives completely within each Backstage application and is
not part of the CLI. In an app created with `@backstage/create-app` the
formatting is handled by [prettier](https://prettier.io/), but each application
can choose their own formatting rules and switch to a different formatter if
desired.

## Linting

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
configuration, along with a root configuration that applies to the entire
project. The configuration in each package starts out as a standard configuration
that is determined based on the package role, but it can be customized to fit the needs of each package.

A minimal `.eslintrc.js` configuration now looks like this:

```js
module.exports = require('@backstage/cli/config/eslint-factory')(__dirname);
```

But you can provide custom overrides for each package using the optional second argument:

```js
module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  ignorePatterns: ['templates/'],
  rules: {
    'jest/expect-expect': 'off',
  },
});
```

The configuration factory also provides utilities for extending the configuration in ways that are otherwise very cumbersome to do with plain ESLint, particularly for rules like `no-restricted-syntax`. These are the extra keys that are available:

| Key                        | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `tsRules`                  | Additional rules to apply to TypeScript files                      |
| `testRules`                | Additional rules to apply to tests files                           |
| `restrictedImports`        | Additional paths to add to `no-restricted-imports`                 |
| `restrictedImportPatterns` | Additional patterns to add to `no-restricted-imports`              |
| `restrictedSrcImports`     | Additional paths to add to `no-restricted-imports` in src files    |
| `restrictedTestImports`    | Additional paths to add to `no-restricted-imports` in test files   |
| `restrictedSyntax`         | Additional patterns to add to `no-restricted-syntax`               |
| `restrictedSrcSyntax`      | Additional patterns to add to `no-restricted-syntax` in src files  |
| `restrictedTestSyntax`     | Additional patterns to add to `no-restricted-syntax` in test files |

## Type Checking

Just like formatting, the Backstage CLI does not have its own command for type
checking. It does however have a base configuration with both recommended
defaults as well as some required settings for the build system to work.

Perhaps the most notable part about the TypeScript setup in Backstage projects
is that the entire project is one big compilation unit. This is due to
performance optimization as well as ease of use, since breaking projects down
into smaller pieces has proven to both lead to a more complicated setup, as well
as type checking of the entire project being an order of magnitude slower. In
order to make this setup work, the entrypoint of each package needs to point to
the TypeScript source files, which in turn causes some complications during
publishing that we'll talk about in [that section](#publishing).

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
completely omitted, it's simply unlikely to catch issues that are introduced
during local development. What we opt for instead is to include the check in CI
through the `tsc:full` script, which will run a full type check, including
`node_modules`.

For the two reasons mentioned above, it is **highly** recommended to use the
`tsc:full` script to run type checking in CI.

## Testing

As mentioned above, the Backstage CLI uses [Jest](https://jestjs.io/), which is
a JavaScript test framework that covers both test execution and assertions. Jest
executes all tests in Node.js, including frontend browser code. The trick it
uses is to execute the tests in a Node.js VM using various predefined
environments, such as one based on [`jsdom`](https://github.com/jsdom/jsdom)
that helps mimic browser APIs and behavior.

The Backstage CLI has its own command that helps execute tests,
`backstage-cli test`, as well as its own configuration at
`@backstage/cli/config/jest.js`. The command is a relatively thin wrapper around
running `jest` directly. Its main responsibility is to make sure the included
configuration is used, as well setting the `NODE_ENV` and `TZ` environment
variables, and provided some sane default flags like `--watch` if executed
within a Git repository.

The by far biggest amount of work is done by the Jest configuration included
with the Backstage CLI. It both takes care of providing a default Jest
configuration, as well as allowing for configuration overrides to be defined in
each `package.json`. How this can be done in practice is discussed in the
[Jest configuration](#jest-configuration) section.

## Building

The primary purpose of the build process is to prepare packages for publishing,
but it's also used as part of the backend bundling process. Since it's only used
in these two cases, any Backstage app that does not use the Backend parts of the
project may not need to interact with the build process at all. It can
nevertheless be useful to know how it works, since all of the published
Backstage packages are built using this process.

The build is currently using [Rollup](https://rollupjs.org/) and executes in
isolation for each individual package. The build is invoked using the `package build`
command, and applies to all packages roles except the bundled ones, `frontend` and `backend`.

There are three different possible outputs of the build process: JavaScript in
CommonJS module format, JavaScript in ECMAScript module format, and type
declarations. Each invocation of a build command will write one or more of these
outputs to the `dist` folder in the package, and in addition copy any asset
files like stylesheets or images. For more details on what syntax and file
formats are supported by the build process, see the [loaders section](#loaders).

When building CommonJS or ESM output, the build commands will always use
`src/index.ts` as the entrypoint. All non-relative modules imports are considered
external, meaning the Rollup build will only compile the source code of the package
itself. All import statements of external dependencies, even within the same
[monorepo](../../references/glossary.md#monorepo), will stay intact.

The build of the type definitions works quite differently. The entrypoint of the
type definition build is the relative location of the package within the
`dist-types` folder in the project root. This means that it is important to run
type checking before building any packages with type definitions, and that
emitting type declarations must be enabled in the TypeScript configuration. The
reason for the type definition build step is to strip out all types but the ones
that are exported from the package, leaving a much cleaner type definition file
and making sure that the type definitions are in sync with the generated
JavaScript.

## Bundling

The goal of the bundling process is to combine multiple packages together into a
single runtime unit. The way this is done varies between frontend and backend,
as well as local development versus production deployment. Because of that we
cover each combination of these cases separately.

### Frontend Development

The frontend development setup is used for all packages with a frontend role, and
is invoked using the `package start` command.
The only difference between the different roles is that packages with the `'frontend'`
role use `src/index` as the entrypoint, while other roles instead use `dev/index`.
When running the start command, a development server
will be set up that listens to the protocol, host and port set by `app.baseUrl`
in the configuration. If needed it is also possible to override the listening
options through the `app.listen` configuration.

The frontend development bundling is currently based on
[Webpack](https://webpack.js.org/) and
[Webpack Dev Server](https://webpack.js.org/configuration/dev-server/). The
Webpack configuration itself varies very little between the frontend development
and production bundling, so we'll dive more into the configuration in the
production section below. The main differences are that `process.env.NODE_ENV`
is set to `'development'`, minification is disabled, cheap source maps are used,
and [React Refresh](https://github.com/pmmmwh/react-refresh-webpack-plugin#readme)
is enabled.

If you prefer to run type checking and linting as part of the Webpack process,
you can enable usage of the
[`ForkTsCheckerWebpackPlugin`](https://www.npmjs.com/package/fork-ts-checker-webpack-plugin)
by passing the `--check` flag. Although as mentioned above, the recommended way
to handle these checks during development is to use an editor that has built-in
support for them instead.

### Frontend Production

The frontend production bundling creates your typical web content
[bundle](../../references/glossary.md#bundle), all contained within a single
folder, ready for static serving. It is used when building packages with the
`'frontend'` role, and unlike the development bundling there is no way to
build a production bundle of an individual plugin.
The output of the bundling process is written to the `dist` folder in the package.

Just like the development bundling, the production bundling is based on
[Webpack](https://webpack.js.org/). It uses the
[`HtmlWebpackPlugin`](https://webpack.js.org/plugins/html-webpack-plugin/) to
generate the `index.html` entry point, and includes a default template that's
included with the CLI. You can replace the bundled template by adding
`public/index.html` to your app package. The template has access to two global
constants, `publicPath` which is the public base path that the bundle is
intended to be served at, as well as `config` which is your regular frontend
scoped configuration from `@backstage/config`.

The Webpack configuration also includes a custom plugin for resolving packages
correctly from linked in packages, the `ModuleScopePlugin` from
[`react-dev-utils`](https://www.npmjs.com/package/react-dev-utils) which makes
sure that imports don't reach outside the package, a few fallbacks for some
Node.js modules like `'buffer'` and `'events'`, a plugin that writes the
frontend configuration to the bundle as `process.env.APP_CONFIG`, and lastly minification handled by
[esbuild](https://esbuild.github.io/) using the
[`esbuild-loader`](https://npm.im/esbuild-loader). There are of course also a
set of loaders configured, which you can read more about in the
[loaders](#loaders) and [transpilation](#transpilation) sections.

During the build, the following constants are also set:

```java
process.env.NODE_ENV = 'production';
process.env.BUILD_INFO = {
  cliVersion: '0.4.0', // The version of the CLI package
  gitVersion: 'v0.4.0-86-ge54815618', // output of `git describe --always`
  packageVersion: '1.0.5', // The version of the app package itself
  timestamp: 1678900000000, // Date.now() when the build started
  commit: 'e548156182a973ed4b459e18533afc22c85ffff8', // output of `git rev-parse HEAD`
};
```

The output of the bundling process is split into two categories of files with
separate caching strategies. The first is a set of generic assets with plain
names in the root of the `dist/` folder. You will want to serve these with
short-lived caching or no caching at all. The second is a set of hashed static
assets in the `dist/static/` folder, which you can configure to be cached for a
much longer time.

The configuration of static assets is optimized for frequent changes and serving
over HTTP 2.0. The assets are aggressively split into small chunks, which means
the browser has to make a lot of small requests to load them. The upside is that
changes to individual plugins and packages will invalidate a smaller number of
files, thereby allowing for rapid development without much impact on the page
load performance.

### Backend Development

The backend development setup does not use any bundling process. It runs a
Node.js process directly, with on-the-fly transpilation from TypeScript to
JavaScript. The transpilation is done with a custom transform based on
[SWC](https://swc.rs/).

During development the backend Node.js process will restart whenever there is a
change to the source code. This means that any in-memory data will be lost. In
order to store data between restarts, the backend process has an IPC channel
available to store and restore data from the parent CLI process. The primary
purpose of this, which is already built-in, is to restore the contents of
databases when using SQLite for development. You can also use it for your own
purposes, with the `DevDataStore` utility exported from the
`@backstage/backend-dev-utils` package.

If you want to inspect the running Node.js process, the `--inspect` and
`--inspect-brk` flags can be used, as they will be passed through as options to
`node` execution.

### Backend Production

The backend production bundling uses a completely different setup than the other
bundling options. Rather than using Webpack, the backend production bundling
instead collects the backend packages and all of their local dependencies into a
deployment archive. The archive is written to `dist/bundle.tar.gz`, and contains
the packaged version of each of these packages. The layout of the packages in
the archive is the same as the directory layout in the monorepo, and the bundle
also contains the root `package.json` and `yarn.lock` files.

Note that before creating a production bundle you must first build all of the
backend packages. This can be done automatically when executing the
`backend:bundle` command by passing the `--build-dependencies` flag. It is an
optional flag since it is quite common that the packages are already built
earlier on in your build process, and building them again would result in
duplicate work.

In order to use the bundle, you extract it into a directory, run
`yarn install --production`, and then start the backend using your backend
package as the Node.js entry point, for example `node packages/backend`.

The `dist/bundle.tar.gz` is accompanied by a `dist/skeleton.tar.gz`, which has
the same layout, but only contains `package.json` files. This skeleton archive
can be used to run a `yarn install` in environments that will benefit from the
caching that this enables, such as Docker image builds. To use the skeleton
archive you copy it over to the target directory along with the root
`package.json` and `yarn.lock`, extract the archive, and then run
`yarn install --production`. Your target directory will then have all
dependencies installed, and as soon as you copy over and extract the contents of
the `bundle.tar.gz` archive on top of it, the backend will be ready to run.

The following is an example of a `Dockerfile` that can be used to package the
output of building a package with role `'backend'` into an image:

```Dockerfile
FROM node:20-bookworm-slim
WORKDIR /app

COPY yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

# install sqlite3 dependencies
RUN apt-get update && \
    apt-get install -y libsqlite3-dev python3 cmake g++ && \
    rm -rf /var/lib/apt/lists/* && \
    yarn config set python /usr/bin/python3

RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

COPY packages/backend/dist/bundle.tar.gz app-config.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

CMD ["node", "packages/backend"]
```

## Transpilation

The transpilers used by the Backstage CLI have been chosen according to the same
design considerations that were mentioned above. A few specific requirements are
of course support for TypeScript and JSX, but also React hot reloads or refresh,
and hoisting of Jest mocks. The Backstage CLI also only targets up to date and
modern browsers, so we actually want to keep the transpilation process as
lightweight as possible, and leave most syntax intact.

Apart from these requirements, the deciding factor for which transpiler to use
is their speed. The build process keeps the integration with the transpilers
lightweight, without additional plugins or such. This enables us to switch out
transpilers as new options and optimizations become available, and keep on using
the best options that are available.

Our current selection of transpilers are [esbuild](https://esbuild.github.io/)
and [Sucrase](https://github.com/alangpierce/sucrase). The reason we choose to
use two transpilers is that esbuild is faster than Sucrase and produces slightly
nicer output, but it does not have the same set of features, for example it does
not support React hot reloading.

The benchmarking of the various options was done in
[ts-build-bench](https://github.com/Rugvip/ts-build-bench). This benchmarking
project allows for setups of different shapes and sizes of monorepos, but the
setup we consider the most important in our case is a large monorepo with lots
of medium to large packages that are being bundled with Webpack. Some rough
findings have been that esbuild is the fastest option right now, with Sucrase
following closely after and then [SWC](https://swc.rs/) closely after that.
After those there's a pretty big gap up to the TypeScript compiler run in
transpilation only mode, and lastly another jump up to Babel, being by far the
slowest out of the transpilers we tested.

Something to note about these benchmarks is that they take the full Webpack
bundling time into account. This means that even though some transpilation
options may be orders of magnitude faster than others, the total time is not
impacted in the same way as there are lots of other things that go into the
bundling process. Still, switching from for example Babel to Sucrase is able to
make the bundling anywhere from two to five times faster.

## Loaders

The Backstage CLI is configured to support a set of loaders throughout all parts
of the build system, including the bundling, tests, builds, and type checking.
Loaders are always selected based on the file extension. The following is a list
of all supported file extensions:

| Extension | Exports       | Purpose                      |
| --------- | ------------- | ---------------------------- |
| `.ts`     | Script Module | TypeScript                   |
| `.tsx`    | Script Module | TypeScript and XML           |
| `.mts`    | Script Module | ECMAScript Module TypeScript |
| `.cts`    | Script Module | CommonJS TypeScript          |
| `.js`     | Script Module | JavaScript                   |
| `.jsx`    | Script Module | JavaScript and XML           |
| `.mjs`    | Script Module | ECMAScript Module            |
| `.cjs`    | Script Module | CommonJS Module              |
| `.json`   | JSON Data     | JSON Data                    |
| `.yml`    | JSON Data     | YAML Data                    |
| `.yaml`   | JSON Data     | YAML Data                    |
| `.css`    | classes       | Style sheet                  |
| `.eot`    | URL Path      | Font                         |
| `.ttf`    | URL Path      | Font                         |
| `.woff2`  | URL Path      | Font                         |
| `.woff`   | URL Path      | Font                         |
| `.bmp`    | URL Path      | Image                        |
| `.gif`    | URL Path      | Image                        |
| `.jpeg`   | URL Path      | Image                        |
| `.jpg`    | URL Path      | Image                        |
| `.png`    | URL Path      | Image                        |
| `.svg`    | URL Path      | Image                        |
| `.md`     | URL Path      | Markdown File                |

## ECMAScript Modules

The Backstage tooling supports [ECMAScript modules (ESM)](https://nodejs.org/docs/latest-v22.x/api/esm.html) in Node.js packages. This includes support for all the script module file extensions listed above during local development, in built packages, in tests, and during type checking. [Dynamic imports](https://nodejs.org/docs/latest-v22.x/api/esm.html#import-expressions) can be used to load ESM-only packages from CommonJS and vice versa. There are however a couple of limitations to be aware of:

- To enable support for native ESM in tests, you need to run the tests with the `--experimental-vm-modules` flag enabled, typically via `NODE_OPTIONS='--experimental-vm-modules'`.
- Declaring a package as `"type": "module"` in `package.json` is supported, but in tests it will cause all local transitive dependencies to also be treated as ESM, regardless of whether they declare `"type": "module"` or not.
- When running tests with coverage enabled the default `babel` coverage provider can mess with the hoisting of named exports. This can be worked around by using the `v8` provider instead by setting `"coverageProvider": "v8"` in the Jest configuration, although note that the `v8` provider is a fair bit slower than the `babel` one.
- Node.js has an [ESM interoperability layer with CommonJS](https://nodejs.org/docs/latest-v22.x/api/esm.html#interoperability-with-commonjs) that allows for imports from ESM to identify named exports in CommonJS packages. This interoperability layer is **only** enabled when importing packages with a `.cts` or `.cjs` extension. This is because the interoperability layer is not fully compatible with the NPM ecosystem, and would break package if it was enabled for `.js` files.
- Dynamic imports of CommonJS packages will vary in shape depending on the runtime, i.e. test vs local development, etc. It is therefore recommended to avoid dynamic imports of CommonJS packages and instead use `require`, or to use the explicit CommonJS extensions as mentioned above. If you do need to dynamically import CommonJS packages, avoid using `default` exports, as the shape of them vary across different environments and you would otherwise need to manually unwrap the import based on the shape of the module object.

## Jest Configuration

The Backstage CLI bundles its own Jest configuration file, which is used
automatically when running `backstage-cli test`. It's available at
`@backstage/cli/config/jest.js` and can be inspected
[here](https://github.com/backstage/backstage/blob/master/packages/cli/config/jest.js).
Usage of this configuration can be overridden either by passing a
`--config <path>` flag to `backstage-cli test`, or placing a `jest.config.js` or
`jest.config.ts` file in your package.

The built-in configuration brings a couple of benefits and features. The most
important one being a baseline transformer and module configuration that enables
support for the listed [loaders](#loaders) within tests. It will also
automatically detect and use `src/setupTests.ts` if it exists, and provides a
coverage configuration that works well with our selected transpilers. The configuration
will also detect the appropriate Jest environment for each package role, running
`web-libraries` with the `"jsdom"` environment, `node-libraries` with `"node"`, and so on.

The configuration also takes a project-wide approach, with the expectation most
if not all packages within a monorepo will use the same base configuration. This
allows for optimizations such as sharing the Jest transform cache across all
packages in a monorepo, avoiding unnecessary transpilation. It also makes it
possible to load in all Jest configurations at once, and with that run
`yarn test <pattern>` from the root of a monorepo without having to set the
working directory to the package that the test is in.

Where small customizations are needed, such as setting coverage thresholds or
support for specific transforms, it is possible to override the Jest
configuration through the `"jest"` field in `package.json`. For a full list of
options, see the [Jest documentation](https://jestjs.io/docs/en/configuration).
These overrides will be loaded in from all `package.json` files in the directory ancestry, meaning
that you can place common configuration in the `package.json` at the root of a
monorepo. If multiple overrides are found, they will be merged together with
configuration further down in the directory tree taking precedence.

The overrides in a single `package.json` may for example look like this:

```json
  "jest": {
    "coverageThreshold": {
      "global": {
        "functions": 100,
        "lines": 100,
        "statements": 100
      }
    }
  },
```

### Additional Configuration Options

When using the built-in `@backstage/cli/config/jest` configuration the following options are available in addition to the standard Jest options.

#### `rejectFrontendNetworkRequests` **[boolean]**

Default: `false`

If set to `true`, any attempt to make a network request in frontend package tests will result in an error. This option can only be set in the root `package.json` and will apply to all frontend packages in the monorepo.

```json title="Example - in your root package.json"
  "jest": {
    "rejectFrontendNetworkRequests": true
  },
```

## Caching

Caching is used sparingly throughout the Backstage build system. It is always used as a way to squeeze out a little bit of extra performance, rather than requirement to keep things fast. The following is a list of places where optional caching is available:

- **TypeScript** - The default `tsconfig.json` used by Backstage projects has `incremental` set to `true`, which enables local caching of type checking results. It is however generally not recommended in CI, where `yarn tsc:full` is preferred, which sets `--incremental false`.
- **Testing** - The `backstage-cli repo test` command has a `--successCache` flag that enables caching of successful test results. This is done at the package level, meaning that if a package has not been changed since the last test run and it was successful, the testing will be skipped. This is recommended to be used in CI, but not during local development.
- **Linting** - The `backstage-cli repo lint` command has a `--successCache` flag that enables caching of successful linting results. This is done at the package level, meaning that if a package has not been changed since the last lint run and it was successful, the linting will be skipped. This is recommended to be used in CI, but not during local development.
- **Webpack** - It is possible to enable experimental caching of frontend package builds using the `BACKSTAGE_CLI_EXPERIMENTAL_BUILD_CACHE` environment variable. This will enable the Webpack filesystem cache.

### Debugging Jest Tests

For your productivity working with unit tests it's quite essential to have your debugging configured in IDE. It will help you to identify the root cause of the issue faster.

#### IntelliJ IDEA

1. Update Jest configuration template by:

- Click on "Edit Configurations" on top panel
- In the modal dialog click on link "Edit configuration templates..." located in the bottom left corner.
- In "Jest package" you have to point to relative path of jest module (it will be suggested by IntelliJ), i.e. `~/proj/backstage/node_modules/jest`
- In "Jest config" point to your jest configuration file, use absolute path for that, i.e. `--config /Users/user/proj/backstage/packages/cli/config/jest.js --runInBand`

2. Now you can run any tests by clicking on green arrow located on `describe` or `it`.

#### VS Code

```jsonc
{
  "jest.jestCommandLine": "node_modules/.bin/jest --config node_modules/@backstage/cli/config/jest.js",
  // In a large repo like the Backstage main repo you likely want to disable
  // watch mode and the initial test run too, leaving just manual and perhaps
  // on-save test runs in place.
  "jest.autoRun": {
    "watch": false,
    "onSave": "test-src-file"
  }
}
```

A complete launch configuration for VS Code debugging may look like this:

```jsonc
{
  "type": "node",
  "name": "vscode-jest-tests.v2",
  "request": "launch",
  "args": [
    "repo",
    "test",
    "--runInBand",
    "--watchAll=false",
    "--testNamePattern",
    "${jest.testNamePattern}",
    "--runTestsByPath",
    "${jest.testFile}"
  ],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen",
  "disableOptimisticBPs": true,
  "program": "${workspaceFolder}/node_modules/.bin/backstage-cli"
}
```

## Publishing

Package publishing is an optional part of the Backstage build system and not
something you will need to worry about unless you are publishing packages to a
registry. In addition to the documentation in the section, be sure to also read
the section on [metadata for published packages](../package-metadata.md#metadata-for-published-packages).

In order to publish a package, you first need to build it, which will
populate the `dist` folder. Because the Backstage build system is optimized for
local development along with our particular TypeScript and bundling setup, it is
not possible to publish the package immediately at this point. This is because
the entry points of the package will still be pointing to `src/index.ts`, but we
want them to point to `dist/` in the published package.

In order to work around this, the Backstage CLI provides `prepack` and
`postpack` commands that help prepare the package for publishing. These scripts
are automatically run by Yarn before publishing a package.

The `prepack` command will take entry point fields in `"publishConfig"`, such as
`"main"` and `"module"`, and move them to the top level of the `package.json`.
This lets you point at the desired files in the `dist` folder during publishing.
The `postpack` command will simply revert this change in order to leave your
project clean.

The following is an excerpt of a typical setup of an isomorphic library package:

```json
  "main": "src/index.ts",
  "types": "src/index.ts",
  "publishConfig": {
    "access": "public",
    "main": "dist/index.cjs.js",
    "module": "dist/index.esm.js",
    "types": "dist/index.d.ts"
  },
  "scripts": {
    "build": "backstage-cli package build",
    "lint": "backstage-cli package lint",
    "test": "backstage-cli package test",
    "clean": "backstage-cli package clean",
    "prepack": "backstage-cli package prepack",
    "postpack": "backstage-cli package postpack"
  },
  "files": ["dist"],
```

## Subpath Exports

The Backstage CLI supports implementation of subpath exports through the `"exports"` field in `package.json`. It might for example look like this:

```json
  "name": "@backstage/plugin-foo",
  "exports": {
    ".": "./src/index.ts",
    "./components": "./src/components.ts",
  },
```

This in turn would allow you to import anything exported in `src/index.ts` via `@backstage/plugins-foo`, and `src/components.ts` via `@backstage/plugins-foo/components`. Note that patterns are not supported, meaning the exports may not contain `*` wildcards.

As with the rest of the Backstage CLI build system, the setup is optimized for local development, which is why the `"exports"` targets point directly to source files. The `package build` command will detect the `"exports"` field and automatically generate the corresponding `dist` files, and the `prepublish` command will rewrite the `"exports"` field to point to the `dist` files, as well as generating folder-based entry points for backwards compatibility.

TypeScript support is currently handled though the `typesVersions` field, as there is not yet a module resolution mode that works well with `"exports"`. You can craft the `typesVersions` yourself, but it will also be automatically generated by the `migrate package-exports` command.

To add subpath exports to an existing package, simply add the desired `"exports"` fields and then run the following command:

```bash
yarn backstage-cli migrate package-exports
```
