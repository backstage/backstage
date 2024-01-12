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

In order to address the problem outlined above, we introduced the concept of route references. A `RouteRef` is an abstract path in a Backstage app, and these paths can be configured both at plugin level (by plugin developers) and at the app level (by integrators).

Plugin developers create a `RouteRef` to expose a path in Backstage's routing system. You will see below how routes are defined programmatically, but before diving into code, let us explain how to configure them at app level. In spite of the fact that plugin developers choose a default route path for the routes their plugin provides, paths are configurable, so app integrators can set a custom path to a route whenever they like to (more information in the following sections).

There are 3 types of route references: regular route, sub route, and external route, and we will cover both the concept and code definition for each. Keep reading 🙂!

### Creating a Route Reference

Route references, also known as "absolute" or "regular" routes, are created as follows:

```tsx
// plugins/catalog/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const indexRouteRef = createRouteRef();
```

Note that you often want to create the route references themselves in a different file than the one that creates the plugin instance, for example a top-level routes.ts. This is to avoid circular imports when you use the route references from other parts of the same plugin.

### Providing Route References to Plugins

Route refs do not have any behavior themselves. They are an opaque value that represents route targets in an app, which are bound to specific paths at runtime. Their role is to provide a level of indirection to help link together different pages that otherwise wouldn't know how to route to each other.

The previous section code snippet does not indicate which plugin the route belongs to. To do so, you have to use it in the creation of any kind of routable extension, such as a page extension. When this extension is installed in the app it will become associated with the newly created `RouteRef`, making it possible to use the route ref to navigate the extension. Here's what we need to do:

```tsx
// plugins/catalog/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const indexRouteRef = createRouteRef(); // [1]

// plugins/catalog/src/plugin.tsx
import React from 'react';
import {
  createPlugin,
  createPageExtension,
} from '@backstage/frontend-plugin-api';
import { indexRouteRef } from './routes';

// The `name` option is omitted since this is the index page
const catalogIndexPage = createPageExtension({
  // [2]
  defaultPath: '/entities',
  routeRef: indexRouteRef,
  // Promise.resolve is a replacement for `import(...)`
  loader: () => Promise.resolve(<div>Index Page</div>),
});

export default createPlugin({
  // [3]
  id: 'catalog',
  routes: {
    index: indexRouteRef,
  },
  extensions: [catalogIndexPage],
});

// plugins/catalog/src/index.ts
export { default } from './plugin';
```

We have completed our journey of creating a plugin page route. This is what the code does:

- [1] The line 1 creates a route reference, which is not yet associated with any plugin page;
- [2] We associate our route reference with our page by providing it as an option during creation of the page extension.
- [3] Finally, our plugin provides both routes and extensions.

It may be unclear why we need to pass the route to the plugin when it has already been passed to the extension. We do that to make it possible for other plugins to route to our page, which is explained in detail in the (Binding External Route References)[#building-external-route-references] section.

### Route Path Parameters

Route references optionally accept a `params` option, which will require the listed parameter names to be present in the route path. Here is how you create a reference for a route that requires a `kind`, `namespace` and `name` parameters, like in this path `/entities/:kind/:namespace/:name`:

```tsx
// plugins/catalog/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const detailsRouteRef = createRouteRef({
  // The parameters that must be included in the path of this route reference
  params: ['kind', 'namespace', 'name'],
});
```

### Using a Route Reference

Route references can be used to link to page in the same plugin, or to pages in a different plugins. In this section we will cover the first scenario, if you are interested in link to a page of a different plugin, please go to the [external routes](#external-router-references) section below.

Let's presume that we have a plugin that renders two different pages, and these pages link to each other.

First lets create the routes references:

```tsx
// plugins/catalog/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const indexRouteRef = createRouteRef();

export const detailsRouteRef = createRouteRef({
  // The parameters that must be included in the path of this route reference
  params: ['kind', 'namespace', 'name'],
});
```

Now we are ready to provide these routes via plugin extensions and link between pages:

```tsx
// plugins/catalog/src/plugin.tsx
import React from 'react';
import { useParams } from 'react-router';
import {
  createPlugin,
  createPageExtension,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef, detailsRouteRef } from './routes';

const catalogIndexPage = createPageExtension({
  defaultPath: '/entities',
  routeRef: indexRouteRef,
  loader: () => {
    const Component = () => {
      const detailsLink = useRouteRef(detailsRouteRef);
      const detailsPath = detailsLink({
        kind: 'component',
        namespace: 'default',
        name: 'foo',
      });

      return (
        <div>
          <h1>Index Page</h1>
          <a href={detailsPath}>See details</a>
        </div>
      );
    };

    return Promise.resolve(<Component />);
  },
});

const catalogDetailsPage = createPageExtension({
  name: 'details',
  // It is important to mention here if an integrator configures a different path for this page via config file
  // It will be their responsibility to make sure that it contains the same parameters, although they don't necessarily need to be in the same order.
  defaultPath: '/entities/:namespace/:kind/:name',
  routeRef: detailsRouteRef,
  loader: () => {
    const Component = () => {
      // Getting the parameters from the URL
      const params = useParams();
      return (
        <div>
          <h1>Details Page</h1>
          <ul>
            <li>Kind: {params.kind}</li>
            <li>Namespace: {params.namespace}</li>
            <li>Name: {params.name}</li>
          </ul>
        </div>
      );
    };

    return Promise.resolve(<Component />);
  },
});

export default createPlugin({
  id: 'catalog',
  routes: {
    index: indexRouteRef,
    details: detailsRouteRef,
  },
  extensions: [catalogIndexPage, catalogDetailsPage],
});

// plugins/catalog/src/index.ts
export { default } from './plugin';
```

During runtime, in the index page, we used a hook `useRouteRef` to get the path to the details page. Because we are linking to pages of the same plugin, we are currently accessing the reference directly, but in the following sections, you will see how to link to pages of different plugins.

## External Router References

Now let's assume that we want to link from the Catalog entities list page to the Scaffolder create component page. We don't want to reference the Scaffolder plugin directly, since that would create an unnecessary dependency. It would also provided little flexibility in allowing the app to tie plugins together, with the links instead being dictated by the plugins themselves. To solve this, we use an `ExternalRouteRef`. Much like regular route references, they can be passed to `useRouteRef` to create concrete URLs, but they can not be used in page extensions and instead have to be associated with a target route using route bindings in the app.

We create a new `RouteRef` inside the Scaffolder plugin, using a neutral name that describes its role in the plugin rather than a specific plugin page that it might be linking to, allowing the app to decide the final target. If the Catalog entity list page for example wants to link the Scaffolder create component page in the header, it might declare an `ExternalRouteRef` similar to this:

_Catalog Plugin_

```tsx
// plugins/catalog/src/routes.ts
import {
  createRouteRef,
  createExternalRouteRef,
} from '@backstage/frontend-plugin-api';

export const indexRouteRef = createRouteRef();
export const detailsRouteRef = createRouteRef({
  // The parameters that must be included in the path of this route reference
  params: ['kind', 'namespace', 'name'],
});
export const createComponentRouteRef = createExternalRouteRef();

// plugins/catalog/src/plugin.tsx
import React from 'react';
import {
  createPlugin,
  createPageExtension,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import {
  indexRouteRef,
  detailsRouteRef,
  createComponentRouteRef,
} from './routes';

const catalogIndexPage = createPageExtension({
  defaultPath: '/entities',
  routeRef: indexRouteRef,
  loader: () => {
    const Component = () => {
      const createComponentLink = useRouteRef(createComponentRouteRef);

      return (
        <div>
          <h1>Index Page</h1>
          {/* Linking to a create component page without direct reference */}
          <a href={createComponentLink()}>Create Component</a>
        </div>
      );
    };

    return Promise.resolve(<Component />);
  },
});

const catalogDetailsPage = createPageExtension({
  name: 'details',
  defaultPath: '/entities/:namespace/:kind/:name',
  routeRef: detailsRouteRef,
  loader: () => {
    const Component = () => {
      // Getting the parameters from the URL
      const params = useParams();
      return (
        <div>
          <h1>Details Page</h1>
          <ul>
            <li>Kind: {params.kind}</li>
            <li>Namespace: {params.namespace}</li>
            <li>Name: {params.name}</li>
          </ul>
        </div>
      );
    };

    return Promise.resolve(<Component />);
  },
});

export default createPlugin({
  id: 'catalog',
  routes: {
    index: indexRouteRef,
    details: detailsRouteRef,
  },
  externalRoutes: {
    createComponent: createComponentRouteRef,
  },
  extensions: [catalogIndexPage, catalogDetailsPage],
});

// plugins/catalog/src/index.ts
export { default } from './plugin';
```

_Scaffolder Plugin_

```tsx
// plugins/scaffolder/src/routes.ts
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const indexRouteRef = createRouteRef();

// plugins/scaffolder/src/plugin.tsx
import React from 'react';
import {
  createPlugin,
  createPageExtension,
} from '@backstage/frontend-plugin-api';
import { indexRouteRef } from './routes';

const scaffolderIndexPage = createPageExtension({
  defaultPath: '/create',
  routeRef: indexRouteRef,
  loader: () =>
    Promise.resolve(
      <div>
        <h1>Create Component</h1>
      </div>,
    ),
});

export default createPlugin({
  id: 'scaffolder',
  routes: {
    index: indexRouteRef,
  },
  extensions: [scaffolderIndexPage],
});

// plugins/scaffolder/src/index.ts
export { default } from './plugin';
```

The Scaffolder plugin can also expose an external route that redirects to the Catalog entity details page whenever a new component is created, such as:

```ts
// plugins/scaffolder/src/routes.ts
import {
  createRouteRef,
  createExternalRouteRef,
} from '@backstage/frontend-plugin-api';

export const indexRouteRef = createRouteRef();
export const componentDetailsExternalRouteRef = createExternalRouteRef({
  // The parameters that must be included in the path of this route reference
  params: ['kind', 'namespace', 'name'],
});

// plugins/scaffolder/src/plugin.tsx
import React from 'react';
import {
  createPlugin,
  createPageExtension,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { indexRouteRef, componentDetailsExternalRouteRef } from './routes';

const scaffolderIndexPage = createPageExtension({
  defaultPath: '/create',
  routeRef: indexRouteRef,
  loader: () => {
    const Component = () => {
      const componentDetailsLink = useRouteRef(
        componentDetailsExternalRouteRef,
      );

      return (
        <div>
          <h1>Create Component</h1>
          <a
            href={componentDetailsLink({
              kind: 'component',
              namespace: 'default',
              name: 'foo',
            })}
          >
            See component details
          </a>
        </div>
      );
    };

    return Promise.resolve(<Component />);
  },
});

export default createPlugin({
  id: 'scaffolder',
  routes: {
    index: indexRouteRef,
  },
  externalRoutes: {
    componentDetails: componentDetailsExternalRouteRef,
  },
  extensions: [scaffolderIndexPage],
});

// plugins/scaffolder/src/index.ts
export { default } from './plugin';
```

Note that external routes can also have path parameters!
Now let's move on and configure the app to resolve these external routes, so that the Scaffolder links to the Catalog entity page, and the Catalog links to the Scaffolder page.

### Binding External Route References

The association of external routes is controlled by the app. Each `ExternalRouteRef` of a plugin should be bound to an actual `RouteRef`, usually from another plugin. The binding process happens once at app startup, and is then used through the lifetime of the app to help resolve concrete route paths.

Using the above example of the Catalog entities list page to the Scaffolder create component page, we might do something like this in the app configuration file:

```yaml
# app-config.yaml
app:
  routes:
    bindings:
      # point to the Scaffolder create component page when the Catalog create component ref is used
      plugin.catalog.externalRoutes.createComponent: plugin.scaffolder.routes.index
      # point to the Catalog details page when the Scaffolder component details ref is used
      plugin.scaffolder.externalRoutes.componentDetails: plugin.catalog.routes.details
```

We also have the ability to express this in code as an option to `createApp`, but you of course only need to use one of these two methods:

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
    bind(scaffolder.externalRoutes, {
      componentDetails: catalog.routes.details,
    });
  },
});

export default app.createRoot();
```

Given the above binding, using `useRouteRef(createComponentRouteRef)` within the Catalog plugin will let us create a link to whatever path the Scaffolder create component page is mounted at.

Note that we are not importing and using the `RouteRef`s directly in the app, and instead rely on the plugin instance to access routes of the plugins. This provides better namespacing and discoverability of routes, as well as reduce the number of separate exports from each plugin package.

Another thing to note is that this indirection in the routing is particularly useful for open source plugins that need to leave flexibility in how they are integrated. For plugins that you build internally for your own Backstage application, you can choose to go the route of direct imports or even use concrete routes directly. Although there can be some benefits to using the full routing system even in internal plugins. It can help you structure your routes, and as you will see further down it also helps you manage route parameters.

### Optional External Route References

It is possible to define an `ExternalRouteRef` as optional, so it is not required to bind it in the app. When calling `useRouteRef` with an optional external route, its return signature is changed to `RouteFunc | undefined`, and the returned value can be used to decide whether a certain link should be displayed or if an action should be taken:

```tsx
// plugins/catalog/src/routes.ts
import {
  createRouteRef,
  createExternalRouteRef,
} from '@backstage/frontend-plugin-api';

export const indexRouteRef = createRouteRef();
export const createComponentRouteRef = createExternalRouteRef({
  optional: true,
});

// plugins/catalog/src/plugin.tsx
import React from 'react';
import {
  createPlugin,
  createPageExtension,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { indexRouteRef, createComponentRouteRef } from './routes';

const catalogIndexPage = createPageExtension({
  defaultPath: '/entities',
  routeRef: indexRouteRef,
  loader: () => {
    const Component = () => {
      const createComponentLink = useRouteRef(createComponentRouteRef);

      return (
        <div>
          <h1>Index Page</h1>
          {/* Since the route is optional, rendering the link only if the href is defined */}
          {link && <a href={createComponentLink()}>Create Component</a>}
        </div>
      );
    };

    return Promise.resolve(<Component />);
  },
});

export default createPlugin({
  id: 'catalog',
  routes: {
    index: indexRouteRef,
  },
  externalRoutes: {
    createComponent: createComponentRouteRef,
  },
  extensions: [catalogIndexPage],
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
  createSubRouteRef,
} from '@backstage/frontend-plugin-api';

export const indexRouteRef = createRouteRef();
export const detailsSubRouteRef = createSubRouteRef({
  parent: indexRouteRef,
  path: '/details',
});

// plugins/catalog/src/plugin.ts
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import {
  createPlugin,
  createPageExtension,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { indexRouteRef, detailsSubRouteRef } from './routes.ts';

const DetailsPage = () => (
  <div>
    <h1>Details Sub Page</h1>
  </div>
);

const catalogIndexPage = createPageExtension({
  defaultPath: '/entities',
  routeRef: indexRouteRef,
  loader: () => {
    const Component = () => {
      const { pathname } = useLocation();
      const indexLink = useRouteRef(indexRouteRef);
      const detailsLink = useRouteRef(detailsSubRouteRef);

      return (
        <div>
          <h1>Index Page</h1>
          {/* Linking to the index route */}
          {pathname === detailsLink() && <a href={indexLink()}>Hide details</a>}
          {/* Linking to the details sub route */}
          {pathname === indexLink() && <a href={detailsLink()}>Show details</a>}
          {/* Registering the details sub route */}
          <Routes>
            <Route path={detailsSubRouteRef.path} element={<DetailsPage />} />
          </Routes>
        </div>
      );
    };

    return Promise.resolve(<Component />);
  },
});

export default createPlugin({
  id: 'catalog',
  routes: {
    index: indexRouteRef,
    details: detailsSubRouteRef,
  },
  extensions: [catalogIndexPage],
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

export const indexRouteRef = createRouteRef();
export const detailsSubRouteRef = createSubRouteRef({
  parent: indexRouteRef,
  path: '/:name/:namespace/:kind',
});

// plugins/catalog/src/plugin.ts
import React from 'react';
import { Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import {
  createPlugin,
  createPageExtension,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { indexRouteRef, detailsSubRouteRef } from './routes.ts';

const DetailsPage = () => {
  // Getting the parameters from the URL
  const params = useParams();
  return (
    <div>
      <h1>Details Sub Page</h1>
      <ul>
        <li>Kind: {params.kind}</li>
        <li>Namespace: {params.namespace}</li>
        <li>Name: {params.name}</li>
      </ul>
    </div>
  );
};

const catalogIndexPage = createPageExtension({
  defaultPath: '/entities',
  routeRef: indexRouteRef,
  loader: () => {
    const Component = () => {
      const { pathname } = useLocation();
      const indexLink = useRouteRef(indexRouteRef)();
      const detailsLink = useRouteRef(detailsSubRouteRef);

      const indexPath = indexLink();
      const detailsPath = detailsLink({
        // Setting the details subroute params
        kind: 'component',
        namespace: 'default',
        name: 'foo',
      });

      return (
        <div>
          <h1>Index Page</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Foo</td>
                <td>
                  {/* Linking to the index route */}
                  {pathname === detailsPath && (
                    <a href={indexPath}>Hide details</a>
                  )}
                  {/* Linking to the details sub route */}
                  {pathname === indexPath && (
                    <a href={detailsPath}>Show details</a>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {/* Registering the details subroute */}
          <Routes>
            <Route path={detailsSubRouteRef.path} element={<DetailsPage />} />
          </Routes>
        </div>
      );
    };

    return Promise.resolve(<Component />);
  },
});

export default createPlugin({
  id: 'catalog',
  routes: {
    index: indexRouteRef,
    details: detailsSubRouteRef,
  },
  extensions: [catalogIndexPage],
});

// plugins/catalog/src/index.ts
export { default } from './plugin';
```
