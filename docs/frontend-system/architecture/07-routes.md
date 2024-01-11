---
id: routes
title: Frontend Routes
sidebar_label: Routes
# prettier-ignore
description: Frontend routes
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Introduction

This page describes the frontend system that helps bring together content from a multitude of plugins into one Backstage application.

The core principle of the frontend system is that plugins should have clear boundaries and connections. It should isolate crashes within a plugin, but allow navigation between them. It should allow for plugins to be loaded only when needed, and enable plugins to provide extension points for other plugins to build upon. The frontend system is also built with an app-first mindset, prioritizing simplicity and clarity in the app over that in the plugins and core APIs.

The frontend system isn't a single API surface. It is a collection of patterns, primitives, and APIs. At the core is the concept of extensions, which are exported by plugins for use in the app. One of the concepts is `RouteRef` which enables us route between pages in a flexible way, and it is especially important when bringing together different open source plugins.

## Route References

In order to address the problem outlined above, we introduced the concept of route references. A `RouteRef` is an abstract paths in a the Backstage app, and these paths can be configured both at the plugin level (by plugin developers) and at the instance level (by application integrators).

Plugin developers create a `RouteRef` to expose a path in Backstage's routing system. You will see below how routes are defined programmatically, but before diving into code, let us explain how to configure them at the app level. In spite of the fact that plugin developers choose a default route path for the routes their plugin provides, all that path can be changed, so app integrators can set a custom path to a route whenever they like to (more information in the following sessions).

There are 3 types of route references: regular route, sub route, and external route, and we will cover both the concept and code definition for each. Keep reading 🙂!

### Creating a Route Reference

Route references, also known as root plugin pages, are created as follows:

_Catalog Plugin_

```tsx
// plugins/catalog/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const rootRouteRef = createRouteRef();
```

Note that you almost always want to create the route references themselves in a different file than the one that creates the plugin instance, for example a top-level routes.ts. This is to avoid circular imports when you use the route references from other parts of the same plugin.

### Route Path Parameters

The referenced route can also accepts `params`. Here is how you create a reference for a route that requires a kind, namespace and name `params`, like in this path `/entities/:name/:namespace/:kind`:

```tsx
// plugins/catalog/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

type DetailsRouteParams = { namespace: string; name: string; kind: string };

export const detailsRouteRef = createRouteRef<DetailsRouteParams>({
  // A list of parameter names that the path that this route ref is bound to must contain
  params: ['namespace', 'name', 'kind'],
});
```

### Providing Route References to Plugins

Route refs do not have any behavior, in other words, they are an opaque type that represents route targets in an app, which are bound to specific paths at runtime, but they provide a level of indirection to help mix together different plugins that otherwise wouldn't know how to route to each other.

The code snippet of the previous section does not indicate which plugin the route belongs to. To do so, you have to use it in the creation of any kind of routable extension, such as a page extension. When this extension is installed in the app it will become associated with the newly created `RouteRef`, making it possible to use the route ref to navigate the the extension. Here's what we need to do:

```tsx
// plugins/catalog/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const rootRouteRef = createRouteRef(); // [1]

// plugins/catalog/src/plugin.tsx
import { createPlugin, createPageExtension } from '@backstage/frontend-plugin-api';
import { rootRouteRef } from './routes';

const rootPage = createPageExtension({ // [2]
  // The `name` option is omitted since this is the root page
  defaultPath: '/'
  routeRef: rootRouteRef,
  loader: async () => <div>Root Page</div>
});

export default const createPlugin({ // [3]
  id: 'catalog',
  routes: {
    root: rootRouteRef,
  },
  extensions: [rootPage]
});

// plugins/catalog/src/index.ts
export { default } from './plugin'
```

We have completed our journey of creating a plugin page route. This is what the code does:

- [1] The line 1 creates a route reference, which is not yet associated with any plugin page;
- [2] We associate our route reference with our page by providing it as an option during creation of the page extension.
- [3] Finally, our plugin provides both routes and extensions.

It may be unclear why we need to pass the route to the plugin once it has already been passed to the extension. It's a good point, and the explanation can be found in the (Binding External Route References)[#building-external-route-references] section, wait a bit, keep reading and you'll understand why.

### Using a Route Reference

You can link to the routes from other pages in the same plugin or you can also link between different plugins pages. In this section we will cover the first scenario, if you are interested in link to a page of a different plugin, please go to the [external routes](#external-router-references) section below.

Alright, let's presume that we have a plugin that renders two different pages, and these pages link to each other.

First lets create the routes references:

```tsx
// plugins/catalog/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const rootRouteRef = createRouteRef();

type DetailsRouteParams = {
  namespace: string;
  name: string;
  kind: string;
};

export const detailsRouteRef = createRouteRef<DetailsRouteParams>({
  // A list of parameter names that the path that this route ref is bound to must contain
  params: ['namespace', 'name', 'kind'],
});
```

Now we are ready to provide these routes via plugin extensions and link between pages:

```tsx
// plugins/catalog/src/plugin.tsx
import { createPlugin, createPageExtension, useRouteRef } from '@backstage/frontend-plugin-api';
import { rootRouteRef, detailsRouteRef } from './routes';

const rootPage = createPageExtension({
  // Ommiting name since it is the root page
  defaultPath: '/'
  routeRef: rootRouteRef,
  loader: async () => {
    const href = useRouteRef(detailsRouteRef)({
      kind: 'Component',
      namespace: 'Default',
      name: 'foo'
    });

    return (
      <div>
        <h1>Index Page</h1>
        <a href={href}>Entity Foo</a>
      </div>
    );
  }
});

const detailsPage = createPageExtension({
  name: 'details',
  defaultPath: '/entities/:namespace/:kind/:name'
  routeRef: detailsRouteRef,
  loader: async () => (
    <div>
      <h1>Catalog Entities</h1>
    </div>
  )
});

export default const createPlugin({
  id: 'catalog',
  routes: {
    root: rootRouteRef
    details: detailsRouteRef,
  },
  extensions: [rootPage, detailsPage]
});

// plugins/catalog/src/index.ts
export { default } from './plugin'
```

During runtime, we used a hook `useRouteRef` to get the path to the details page. Because we are linking to pages of the same plugin, we are currently accessing the reference directly, but in the following sections, you will see how to link to pages of different plugins.

## External Router References

Now let's assume that we want to link from the Catalog entity list page to the Scaffolder create component page. We don't want to reference the Scaffolder plugin directly, since that would create an unnecessary dependency. It would also provided little flexibility in allowing the app to tie plugins together, with the links instead being dictated by the plugins themselves. To solve this, we use an `ExternalRouteRef`. Much like regular route references, they can be passed to `useRouteRef` to create concrete URLs, but they can not be used in page extensions and instead have to be associated with a target route using route bindings in the app.

We create a new `RouteRef` inside the Scaffolder plugin, using a neutral name that describes its role in the plugin rather than a specific plugin page that it might be linking to, allowing the app to decide the final target. If the Catalog entity list page for example wants to link the Scaffolder create component page in the header, it might declare an `ExternalRouteRef` similar to this:

```tsx
// plugins/catalog/src/routes.ts
import {
  createRouteRef,
  createExternalRouteRef,
} from '@backstage/frontend-plugin-api';

const rootRouteRef = createRouteRef();
const createComponentRouteRef = createExternalRouteRef();

// plugins/catalog/src/plugin.tsx
import { createPlugin, createPageExtension, useRouteRef } from '@backstage/frontend-plugin-api';
import { rootRouteRef, createComponentRouteRef } from './routes';

const rootPage = createPageExtension({
  // Ommiting name since it is the root page
  defaultPath: '/'
  routeRef: rootRouteRef,
  loader: async () => {
    const href = useRouteRef(catalogCreateComponentRouteRef)();

    return (
      <div>
        <h1>Catalog Entities</h1>
        {/* Linking to a create component page without direct reference */}
        <a href={href}>Create Component</a>
      </div>
    );
  }
});

export default const createPlugin({
  id: 'catalog',
  routes: {
    root: rootRouteRef,
  }
  externalRoutes: {
    createComponent: createComponentRouteRef,
  },
  extensions: [rootPage]
});

// plugins/catalog/src/index.ts
export { default } from './plugin';
```

```tsx
// plugins/scaffolder/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

const createComponentRouteRef = createRouteRef();

// plugins/scaffolder/src/plugin.tsx
import { createPlugin, createPageExtension } from '@backstage/frontend-plugin-api';
import { createComponentRouteRef } from './routes';

const createComponentPage = createPageExtension({
  defaultPath: '/'
  routeRef: createComponentRouteRef,
  loader: async () => (
    <div>
      <h1>Create Component</h1>
    </div>
  )
});

export default const createPlugin({
  id: 'scaffolder',
  routes: {
    createComponent: createComponentRouteRef,
  },
  extensions: [createComponentPage]
});

// plugins/scaffolder/src/index.ts
export { default } from './plugin';
```

On important thing to highlight is that it is currently not possible to have parameterized `ExternalRouteRefs`, or to bind an external route to a parameterized route, although this may be added in the future if needed.

Now let's move on and configure the app to point to the Scaffolder create component page when the catalog create component ref be used.

### Binding External Route References

The association of external routes is controlled by the app. Each `ExternalRouteRef` of a plugin should be bound to an actual `RouteRef`, usually from another plugin. The binding process happens once at app startup, and is then used through the lifetime of the app to help resolve concrete route paths.

Using the above example of the Catalog entities list page to the Scaffolder create component page, we might do something like this in the app configuration file:

```yaml
# app-config.yaml
app:
  routes:
    bindings:
      plugin.catalog.externalRoutes.createComponent: plugin.scaffolfer.routes.createComponent
```

Or via code, in the file where the app is created:

```tsx
// packages/app/src/App.tsx
import { createApp } from '@backstage/frontend-app-api';
import catalog from '@backstage/plugin-catalog';
import scaffolder from '@backstage/plugin-scaffolder';

const app = createApp({
  bindRoutes({ bind }) {
    bind(catalog.externalRoutes, {
      createComponent: scaffolder.routes.createComponent,
    });
  },
});

export default app.createRoot();

// packages/app/src/index.ts
import ReactDOM from 'react-dom/client';
import app from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(app);
```

Given the above binding, using `useRouteRef(createComponentRouteRef)` within the Catalog plugin will let us create a link to whatever path the Scaffolder create component page is mounted at.

Note that we are not importing and using the `RouteRef`s directly in the app, and instead rely on the plugin instance to access routes of the plugins. This is a new convention that was introduced to provide better namespacing and discoverability of routes, as well as reduce the number of separate exports from each plugin package.

Another thing to note is that this indirection in the routing is particularly useful for open source plugins that need to leave flexibility in how they are integrated. For plugins that you build internally for your own Backstage application, you can choose to go the route of direct imports or even use concrete routes directly. Although there can be some benefits to using the full routing system even in internal plugins. It can help you structure your routes, and as you will see further down it also helps you manage route parameters.parameters.

### Optional External Route References

It is possible to define an `ExternalRouteRef` as optional, so it is not required to bind it in the app. When calling `useRouteRef` with an optional external route, its return signature is changed to `RouteFunc | undefined`, and the returned value can be used used to decide whether a certain link should be displayed or if an action should be taken:

```tsx
// plugins/catalog/src/routes.ts
import {
  createRouteRef,
  createExternalRouteRef,
} from '@backstage/frontend-plugin-api';

const rootRouteRef = createRouteRef();
const createComponentRouteRef = createExternalRouteRef({
  optional: true,
});

// plugins/catalog/src/plugin.tsx
import { createPlugin, createPageExtension, useRouteRef } from '@backstage/frontend-plugin-api';
import { rootRouteRef, createComponentRouteRef } from './routes';

const catalogEntityListPage = createPageExtension({
  defaultPath: '/'
  routeRef: rootRouteRef,
  loader: async () => {
    const href = useRouteRef(catalogCreateComponentRouteRef);

    return (
      <div>
        <h1>Catalog Entities</h1>
        {/* Since the route is optional, rendering the link only if the href is defined */}
        {href && <a to={href}>Create Component</a>
      </div>
    );
  }
});

export default const createPlugin({
  id: 'catalog',
  routes: {
    entityList: rootRouteRef
  }
  externalRoutes: {
    createComponent: createComponentRouteRef,
  },
  extensions: [catalogEntityListPage]
});

// index.ts
export { default } from './plugin';
```

## Sub Route References

The last kind of route refs that can be created are `SubRouteRef`s, which can be used to create a route ref with a fixed path relative to an absolute `RouteRef`. They are useful if you have a page that internally is mounted at a sub route of a page extension component, and you want other plugins to be able to route to that page. And they can be a useful utility to handle routing within a plugin itself as well.

For example:

```tsx
// plugins/catalog/src/routes.ts
import {
  createRouteRef,
  createSubRouteRef
} from '@backstage/frontend-plugin-api';

const rootRouteRef = createRouteRef();
const detailsRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/details',
});

// plugins/catalog/src/plugin.ts
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { createPlugin, createPageExtension, useRouteRef } from '@backstage/frontend-plugin-api';
import { rootRouteRef, detailsRouteRef } from './routes.ts';

const DetailsPage = () => (
  <div>
    <h1>Entity Details</h1>
  </div>
);

const rootPage = createPageExtension({
  defaultPath: '/',
  routeRef: rootRouteRef,
  loader: async () => {
    const Component = () => {
      const to = useRouteRef(detailsRouteRef)();

      return (
        <div>
          <h1>Index Page</h1>
          {/* Registering the details subroute */}
          <Routes>
            <Route path={detailsRouteRef.path} element={<DetailsPage />} />
          </Routes>
          {/* Linking to the details subroute */}
          <Link to={to}>Details Subpage</Link>
        </div>
      );
    };

    return <Component />;
  },
  }
});

export default createPlugin({
  id: 'catalog',
  routes: {
    root: rootRouteRef,
    details: detailsRouteRef,
  },
  extensions: [rootPage]
});

// plugins/catalog/src/index.ts
export { default } from './plugin';
```

Subroutes can also receive parameters, here is an example:

```tsx
// plugins/catalog/src/routes.ts
import {
  createRouteRef,
  createSubRouteRef,
} from '@backstage/frontend-plugin-api';

const rootRouteRef = createRouteRef();
const detailsRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/details/:name/:namespace/:kind',
});

// plugins/catalog/src/plugin.ts
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  createPlugin,
  createPageExtension,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef, detailsRouteRef } from './routes.ts';

const DetailsPage = () => (
  <div>
    <h1>Entity Details</h1>
    {/* can get the entity ref from URL and load the entity data here */}
  </div>
);

const rootPage = createPageExtension({
  defaultPath: '/subroutes',
  routeRef: rootRouteRef,
  loader: async () => {
    const Component = () => {
      const detailsRoutePath = useRouteRef(detailsRouteRef)({
        // Setting the details subroute params
        name: 'entity1',
        namespace: 'default',
        kind: 'component',
      });

      return (
        <div>
          <h1>Index Page</h1>
          {/* Registering the details subroute */}
          <Routes>
            <Route path={detailsRouteRef.path} element={<DetailsPage />} />
          </Routes>
          {/* Linking to the details subroute */}
          <Link to={detailsRoutePath}>Entity 1 Details Subpage</Link>
        </div>
      );
    };

    return <Component />;
  },
});

export default createPlugin({
  id: 'catalog',
  routes: {
    root: rootRouteRef,
    details: detailsRouteRef,
  },
  extensions: [rootPage],
});

// plugins/catalog/src/index.ts
export { default } from './plugin';
```
