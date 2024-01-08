---
id: routes
title: Frontend Routes
sidebar_label: Routes
# prettier-ignore
description: Frontend routes
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

See [routing system docs](../../plugins/composability.md#routing-system)

## Introduction

<!--

Routing system of backstage - what's the prupose

Explain the indirection needed to route between plugins. For example what do we do if plugin A want to link to plugin B, but plugin B is not installed? How can we support this in an app?

How can we let an integrator decice whether plugin A should link to plugin B or plugin C? (with some good real-work examples, e.g. catalog -> scaffolder create page / catalog-import plugin)

 -->

## Route References

<!--

Explain what a route reference is - then explain how it solves the problem outlined above.

Explain that we use route references to represent a path in an app. Each referenced path is unique for each app, but in different apps the same route ref might point to different paths.

 -->

### Creating a Route Reference

<!--

Example using `createRouteRef` + passing it to a page extension

 -->

### Using a Route Reference

<!--

Example using `useRouteRef` in a component

 -->

### Route Path Parameters

<!--
Example using path parameters, both createRouteRef and useRouteRef
 -->

### Providing Route References to Plugins

<!--
Show how to provide routes through createPlugin({ routes: })
 -->

## External Router References

<!--
Explain the need for external route refs

Explain all of create, use and provide

 -->

### Binding External Route References

<!--
Example using `createApp`

Example using config

 -->

### Optional External Route References

<!--
Talk about how external routes must be bound or app will crash, but you can make them optional too

useRouteRef can return undefined for optional external routes
 -->

## Sub Route References

<!--

Explain the need for external route refs - both as a tool for routing within a plugin, but also allow external routes to point to sub routes

Talk about how sub routes declare an explicit path - can't be decided by the app/integrator. They are hard-coded in the plugin in parallel to the internal routing structure of the plugin itself.

Explain all of create, use and provide
 -->

```ts
/*

Some examples

export const indexPageRouteRef = createRouteRef()

export const catalogPlugin = createPlugin({
  id: 'catalog,
  routes: {
    index: indexPageRouteRef,
  },
})

// in catalog plugin

import {indexPageRouteRef} from '../../routes

const link = useRouteRef(indexPageRouteRef)

// scaffolder

export const catalogIndexPageRouteRef = createExternalRouteRef({
  defaultTarget: 'catalog/index',
})

export const scaffolderPlugin = createPlugin({
  id: 'scaffolder,
  externalRoutes: {
    catalogIndex: catalogIndexPageRouteRef,
  },
})


import {catalogIndexPageRouteRef} from '../../routes

const link = useRouteRef(catalogIndexPageRouteRef)

// app

import {catalogPlugin} from '@backstage/plugin-catalog'

const app = createApp({
  bindRoutes({bind}) {
    bind(scaffolderPlugin, {
      catalogIndex: catalogPlugin.routes.index,
    })
  },
})
*/
```
