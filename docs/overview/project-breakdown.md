---
id: project-overview
title: Project Overview
description:
---

## Project Breakdown

The Backstage platform tackles a wide array of problems and domains. In this
section we provide a breakdown of Backstage into smaller project areas. Each one
of these areas have their own responsibilities and aim to solve a subset of the
problems that Backstage as a whole aims to solve.

The breakdown serves multiple purposes. It makes it easier to get an overview of
the project and as a contributor it allows you to focus in on one or a few
areas. It simplifies communication by grouping a multitude of packages into just
a handful of areas. The breakdown also serves as a base for the division of work
around the project, with one or more areas typically being the focus of a
specific group. And lastly it is also the basis for Backstage's versioning
policy and release process.

This breakdown is a living document and will receive changes over time, see the
[changelog](#changelog) section for the full history of changes that have been
made.

## Platform Areas

This section lists the areas that are part of the core Backstage platform.

### Core Framework

The core frontend framework of Backstage is the glue that brings together a
collection of plugins into a full application. It is responsible for setting up
the boundary between plugins and the app, as well as providing a set of core
utilities that plugins and applications can build upon.

#### Frontend Core Packages

The frontend core packages form the base of any Backstage web application. They
provide a set of tools that allow you to create, test and develop Backstage
frontend applications and plugins, while providing a set of systems that handles
concerns such as dependency injection, routing, and structuring the app.

- [@backstage/core-app-api](https://github.com/backstage/backstage/tree/master/packages/core-app-api)
- [@backstage/core-plugin-api](https://github.com/backstage/backstage/tree/master/packages/core-plugin-api)
- [@backstage/test-utils](https://github.com/backstage/backstage/tree/master/packages/test-utils)
- [@backstage/dev-utils](https://github.com/backstage/backstage/tree/master/packages/dev-utils)
- [@backstage/app-defaults](https://github.com/backstage/backstage/tree/master/packages/app-defaults)
- [@backstage/version-bridge](https://github.com/backstage/backstage/tree/master/packages/version-bridge)

#### Common Core Packages

Common core packages are as the name suggests shared among both the frontend and
backend packages. These are fundamental packages that provide common types

- [@backstage/config](https://github.com/backstage/backstage/tree/master/packages/config)
- [@backstage/config-loader](https://github.com/backstage/backstage/tree/master/packages/config-loader)
- [@backstage/errors](https://github.com/backstage/backstage/tree/master/packages/errors)
- [@backstage/types](https://github.com/backstage/backstage/tree/master/packages/types)

#### Core Tooling Packages

- [@backstage/cli](https://github.com/backstage/backstage/tree/master/packages/cli)
- [@backstage/cli-common](https://github.com/backstage/backstage/tree/master/packages/cli-common)
- [@backstage/codemods](https://github.com/backstage/backstage/tree/master/packages/codemods)
- [@backstage/create-app](https://github.com/backstage/backstage/tree/master/packages/create-app)

#### Backend Core Packages

The core packages contains commonly used utilities when constructing backend
plugins. For example utilities for URL reading, loading config and managing
databases.

- [@backstage/backend-common](https://github.com/backstage/backstage/tree/master/packages/backend-common)
- [@backstage/backend-tasks](https://github.com/backstage/backstage/tree/master/packages/backend-tasks)
- [@backstage/backend-test-utils](https://github.com/backstage/backstage/tree/master/packages/backend-test-utils)

### Catalog Model

The catalog model is contains the data structures that the software catalog use
to keep inventory of important items in the software ecosystem. We call these
items Entities which form Components, Systems, APIs and much more. These data
structures are then ingested and enriched by the software catalog. Catalog model
is also responsible for providing tooling to use when working with entities
inside the rest of Backstage.

#### Packages

- [@backstage/catalog-model](https://github.com/backstage/backstage/tree/master/packages/catalog-model)

### Design Language System

The design language systems covers the solutions for visual design and user
experience that are provided by the Backstage platform. It includes the
component library and theming, as well as design primitives in the community
Figma project.

The responsibility of the design language system is to make it simple for
developers to build UIs within Backstage, with it being effortless to make them
easy to use, visually pleasing, and accessible.

#### Packages

- [@backstage/core-components](https://github.com/backstage/backstage/tree/master/packages/core-components)
- [@backstage/theme](https://github.com/backstage/backstage/tree/master/packages/theme)

### Main Repository Tooling, Utils, Misc

#### Packages

- [@backstage/app-defaults](https://github.com/backstage/backstage/tree/master/packages/app-defaults)

### Integrations

Auth, permissions, SCM integrations...

## Core Feature Areas

This section lists the areas that make out the core features of Backstage.

### Catalog

The Backstage Software Catalog is a centralized system that keeps track of
ownership and metadata for all the software in your ecosystem (services,
websites, libraries, data pipelines, etc). The catalog is built around the
concept of metadata YAML files stored together with the code, which are then
harvested and visualized in Backstage.

- [@backstage/catalog-client](https://github.com/backstage/backstage/tree/master/packages/catalog-client)
- [@backstage/catalog-react](https://github.com/backstage/backstage/tree/master/plugins/catalog-react)
- [@backstage/catalog-backend](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend)
- [@backstage/catalog-common](https://github.com/backstage/backstage/tree/master/plugins/catalog-common)
- [@backstage/catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)

### Scaffolder

The Software Templates part of Backstage is a tool that can help you create
Components inside Backstage. By default, it has the ability to load skeletons of
code, template in some variables, and then publish the template to some
locations like GitHub or GitLab.

### Search

Backstage Search lets you find the right information you are looking for in the
Backstage ecosystem. It provides a standardized search API that can plug into
multiple search providers and the ability to index custom data from other
plugins.

### TechDocs

TechDocs is used to render markdown documentation that resides with the
components source code inside Backstage by automatically building and rendering
as the user merges to the main branch.

### Discoverability

Related plugins explore home org search

## ???

Community Plugins

## Changelog

Template:

```md
### 2000-12-31

- The `@backstage/theme` package was moved to the DLS area.
```
