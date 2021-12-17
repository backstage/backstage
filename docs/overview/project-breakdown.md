---
id: project-overview
title: Project Overview
description:
---

## Project Breakdown

The Backstage platform tackles a wide array of problems and domains. To make
getting into the project more manageable and easier, we have split the project
into different focus groups. These groups have their own responsibilities in
solving a subset of the problems that Backstage as a whole aims to solve.

One of the primary purposes of the groups is to manage, work and contributions
to the Backstage. As a contributor it allows you to focus in on parts of the
project that you are particularly interested in, rather than having to tackle
the entire project at once.

## Platform Domains

### Backend System

### Catalog Model

The catalog model is contains the data structures that the software catalog use
to keep inventory of important items in the software ecosystem. We call these
items Entities which form Components, Systems, APIs and much more. These data
structures are then ingested and enriched by the software catalog. Catalog model
is also responsible for providing tooling to use when working with entities
inside the rest of Backstage.

#### Packages

- [@backstage/catalog-model](https://github.com/backstage/backstage/tree/master/packages/catalog-model)

### Core Framework

The core frontend framework of Backstage is the glue that brings together a
collection of plugins into a full application. It is responsible for setting up
the boundary between plugins and the app, as well as providing a set of core
utilities that plugins and applications can build upon.

#### Frontend Core Packages

- [@backstage/core-app-api](https://github.com/backstage/backstage/tree/master/packages/core-app-api)
- [@backstage/core-plugin-api](https://github.com/backstage/backstage/tree/master/packages/core-plugin-api)
- [@backstage/test-utils](https://github.com/backstage/backstage/tree/master/packages/test-utils)
- [@backstage/dev-utils](https://github.com/backstage/backstage/tree/master/packages/dev-utils)
- [@backstage/version-bridge](https://github.com/backstage/backstage/tree/master/packages/version-bridge)

#### Common Core Packages

- [@backstage/cli](https://github.com/backstage/backstage/tree/master/packages/cli)
- [@backstage/config](https://github.com/backstage/backstage/tree/master/packages/config)
- [@backstage/config-loader](https://github.com/backstage/backstage/tree/master/packages/config-loader)
- [@backstage/errors](https://github.com/backstage/backstage/tree/master/packages/errors)
- [@backstage/types](https://github.com/backstage/backstage/tree/master/packages/types)

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

## Core Feature Domains

### Catalog

### Scaffolder

### Search

### TechDocs

### Discoverability

explore home org

## ???

Community Plugins
