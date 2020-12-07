---
id: stability-index
title: Stability Index
description:
  An overview of the commitment to stability for different parts of the
  Backstage codebase.
---

## Overview

The purpose of the Backstage Stability Index is to communicate the stability of
various parts of the project. It is tracked using a scoring system where a
higher score indicates a higher level of stability and is a commitment to
smoother transitions between breaking changes. Importantly, the Stability Index
does not supersede [semver](https://semver.org/), meaning we will still adhere
to semver and only do breaking changes in minor releases as long as we are on
`0.x`.

Each package or section is assigned a stability score between 0 and 3, with each
point building on top of the previous one:

- **0** - Breaking changes are noted in the changelog, and documentation is
  updated.
- **1** - The changelog entry includes a clearly documented upgrade path,
  providing guidance for how to migrate previous usage patterns to the new
  version.
- **2** - Breaking changes always include a deprecation phase where both the old
  and the new APIs can be used in parallel. This deprecation must have been
  released for at least two weeks before the deprecated API is removed in a
  minor version bump.
- **3** - The time limit for the deprecation is 3 months instead of two weeks.

TL;DR:

- **0** - There's a changelog entry.
- **1** - There's a migration guide.
- **2** - 2 weeks of deprecation.
- **3** - 3 months of deprecation.

## Packages

### [`example-app`](https://github.com/backstage/backstage/tree/master/packages/app/)

This is the `packages/app` package, and it serves as an example as well as
utility for local development in the main Backstage repo.

Stability: `N/A`

### [`example-backend`](https://github.com/backstage/backstage/tree/master/packages/backend/)

This is the `packages/backend` package, and it serves as an example as well as
utility for local development in the main Backstage repo.

Stability: `N/A`

### [`backend-common`](https://github.com/backstage/backstage/tree/master/packages/backend-common/)

A collection of common helpers to be used by both backend plugins, and for
constructing backend packages.

Stability: `1`

### [`catalog-client`](https://github.com/backstage/backstage/tree/master/packages/catalog-client/)

An HTTP client for interacting with the catalog backend. Usable both in frontend
and Backend.

Stability: `0`. This is a very new addition and we have some immediate changes
planned.

### [`catalog-model`](https://github.com/backstage/backstage/tree/master/packages/catalog-model/)

Contains the core catalog model, and utilities for working with entities. Usable
both in frontend and Backend.

Stability: `2`. The catalog model is evolving, but because of the broad usage we

want to ensure some stability.

### [`cli`](https://github.com/backstage/backstage/tree/master/packages/cli/)

The main toolchain used for Backstage development. The various CLI commands and
options passed to those commands, as well as the environment variables read by
the CLI, are considered to be the interface that the stability index refers to.
The build output may change over time and is not considered a breaking change
unless it is likely to affect external tooling.

Stability: `2`

### [`cli-common`](https://github.com/backstage/backstage/tree/master/packages/cli-common/)

Lightweight utilities used by the various Backstage CLIs, not intended for
external use.

Stability: `N/A`

### [`config`](https://github.com/backstage/backstage/tree/master/packages/config/)

Provides the logic and interfaces for reading static configuration.

Stability: `2`

### [`config-loader`](https://github.com/backstage/backstage/tree/master/packages/config-loader/)

Used to load in static configuration, mainly for use by the CLI and
@backstage/backend-common.

Stability: `1`. Mainly intended for internal use.

### [`core`](https://github.com/backstage/backstage/tree/master/packages/core/)

#### Section: React Components

All of the React components exported from `src/components/` and `src/layout/`

Stability: `1`. These components have not received a proper review of the API,
but we also want to ensure stability.

#### Section: Plugin API

The parts of the core API that are used by plugins, and the way plugins expose
functionality to apps and other plugins. Includes for example `createPlugin`,
`createRouteRef`, `createApiRef`.

Stability: `2`. There are planned breaking changes around the way that plugins
expose features and do routing. We still commit to keeping a short deprecation
period so that plugins outside of the main repo have time to migrate.

#### Section: App API

The APIs used exclusively in the app, such as `createApp` and the system icons.

Stability: `2`

#### Section: Utility API Definitions

The type declarations of the core Utility APIs.

Stability: `2`. Changes to the Utility API type declarations need time to
propagate.

#### Section: Utility API Implementations

The interfaces and default implementations for various Utility APIs, such as
ErrorApi, IdentityApi, the auth APIs, etc.

Stability: `1`. Most changes to the core utility APIs will not lead to
widespread breaking changes since most apps rely on the default implementations.

### [`core-api`](https://github.com/backstage/backstage/tree/master/packages/core-api/)

The non-visual parts of @backstage/core. Everything in this packages is
re-exported from @backstage/core, and this package should not be used directly.

Stability: See @backstage/core

### [`create-app`](https://github.com/backstage/backstage/tree/master/packages/create-app/)

The CLI used to scaffold new Backstage projects.

Stability: `2`

### [`dev-utils`](https://github.com/backstage/backstage/tree/master/packages/dev-utils/)

Provides utilities for developing plugins in isolation.

Stability: `0`. This package is largely broken and needs updates.

### [`docgen`](https://github.com/backstage/backstage/tree/master/packages/docgen/)

Internal CLI utility for generating API Documentation.

Stability: `N/A`

### [`e2e-test`](https://github.com/backstage/backstage/tree/master/packages/e2e-test/)

Internal CLI utility for running e2e tests.

Stability: `N/A`

### [`storybook`](https://github.com/backstage/backstage/tree/master/packages/storybook/)

Internal storybook build for publishing stories to
https://backstage.io/storybook

Stability: `N/A`

### [`test-utils`](https://github.com/backstage/backstage/tree/master/packages/test-utils/)

Utilities for writing tests for Backstage plugins and apps.

Stability: `2`

### [`test-utils-core`](https://github.com/backstage/backstage/tree/master/packages/test-utils-core/)

Internal testing utilities that are separated out for usage in
@backstage/core-api. All exports are re-exported by @backstage/test-utils. This
package should not be depended on directly.

Stability: See @backstage/test-utils

### [`theme`](https://github.com/backstage/backstage/tree/master/packages/theme/)

The core Backstage MUI theme along with customization utilities.

#### Section: TypeScript

This is the TypeScript API exported by the theme package.

Stability: `2`

#### Section: Visual Theme

The visual theme exported by the theme packages, where for example changing a
color could be considered a breaking change.

Stability: `1`

## Plugins

Plugins are rarely marked as stable as the `@backstage/core` plugin API is under
heavy development.

Many backend plugins are split into "REST API" and "TypeScript Interface"
sections. The "TypeScript Interface" refers to the API used to integrate the
plugin into the backend.

Any plugin that is not listed below is untracked and can generally be considered
unstable with a score of `0`. Open a Pull Request if you want your plugin to be
added!

### [`api-docs`](https://github.com/backstage/backstage/tree/master/plugins/api-docs/)

Components to discover and display API entities as an extension to the catalog
plugin.

Stability: `0`

### [`app-backend`](https://github.com/backstage/backstage/tree/master/plugins/app-backend/)

A backend plugin that can be used to serve the frontend app and inject
configuration.

Stability: `2`

### [`auth-backend`](https://github.com/backstage/backstage/tree/master/plugins/auth-backend/)

A backend plugin that implements the backend portion of the various
authentication flows used in Backstage.

#### Section: REST API

Stability: `2`

#### Section: TypeScript Interface

Stability: `1`

### [`catalog`](https://github.com/backstage/backstage/tree/master/plugins/catalog/)

The frontend plugin for the catalog, with the table and building blocks for the
entity pages.

Stability: `1`. We're planning some work to overhaul how entity pages are
constructed.

### [`catalog-backend`](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend/)

The backend API for the catalog, also exposes the processing subsystem for
customization of the catalog. Powers the @backstage/plugin-catalog frontend
plugin.

#### Section: REST API

Stability: `1`. There are plans to remove and rework some endpoints.

#### Section: TypeScript Interface

Stability: `1`. There are plans to rework parts of the Processor interface.

### [`catalog-graphql`](https://github.com/backstage/backstage/tree/master/plugins/catalog-graphql/)

Provides the catalog schema and resolvers for the graphql backend.

Stability: `0`. Under heavy development and subject to change.

### [`explore`](https://github.com/backstage/backstage/tree/master/plugins/explore/)

A frontend plugin that introduces the concept of exploring internal and external
tooling in an organization.

Stability: `0`. Only an example at the moment and not customizable.

### [`graphiql`](https://github.com/backstage/backstage/tree/master/plugins/graphiql/)

Integrates GraphiQL as a tool to browse GraphQL API endpoints inside Backstage.

Stability: `1`

### [`graphql`](https://github.com/backstage/backstage/tree/master/plugins/graphql/)

A backend plugin that provides

Stability: `0`. Under heavy development and subject to change.

### [`kubernetes`](https://github.com/backstage/backstage/tree/master/plugins/kubernetes/)

The frontend component of the Kubernetes plugin, used to browse and visualize
Kubernetes resources.

Stability: `1`.

### [`kubernetes-backend`](https://github.com/backstage/backstage/tree/master/plugins/kubernetes-backend/)

The backend component of the Kubernetes plugin, used to fetch Kubernetes
resources from clusters and associate them with entities in the Catalog.

Stability: `1`.

### [`proxy-backend`](https://github.com/backstage/backstage/tree/master/plugins/proxy-backend/)

A backend plugin used to set up proxying to other endpoints based on static
configuration.

Stability: `1`

### [`register-component`](https://github.com/backstage/backstage/tree/master/plugins/register-component/)

A frontend plugin that allows the user to register entity locations in the
catalog.

Stability: `0`. This plugin is likely to be replaced by a generic entity import
plugin instead.

### [`scaffolder`](https://github.com/backstage/backstage/tree/master/plugins/scaffolder/)

The frontend scaffolder plugin where one can browse templates and initiate
scaffolding jobs.

Stability: `1`

### [`scaffolder-backend`](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend/)

The backend scaffolder plugin that provides an implementation for templates in
the catalog.

Stability: `1`. There is planned work to rework the scaffolder in
https://github.com/backstage/backstage/issues/2771.

### [`tech-radar`](https://github.com/backstage/backstage/tree/master/plugins/tech-radar/)

Visualize the your company's official guidelines of different areas of software
development.

Stability: `0`

### [`techdocs`](https://github.com/backstage/backstage/tree/master/plugins/techdocs/)

The frontend component of the TechDocs plugin, used to browse technical
documentation of entities.

Stability: `1`

### [`techdocs-backend`](https://github.com/backstage/backstage/tree/master/plugins/techdocs-backend/)

The backend component of the TechDocs plugin, used to transform and serve
TechDocs.

Stability: `0`

### [`user-settings`](https://github.com/backstage/backstage/tree/master/plugins/user-settings/)

A frontend plugin that provides a page where the user can tweak various
settings.

Stability: `1`

### [`welcome`](https://github.com/backstage/backstage/tree/master/plugins/welcome/)

A plugin that can be used to welcome the user to Backstage.

Stability: `0`. This used to be the start page for the example app, but has been
replaced by the catalog plugin. It is still viewable at `/welcome` but may be
removed.
