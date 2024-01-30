---
id: routes
title: Frontend Routes
sidebar_label: Routes
# prettier-ignore
description: Frontend routes
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Introduction

Each Backstage plugin is an isolated piece of functionality that doesn't typically communicate directly with other plugins. In order to achieve this, there are many parts of the frontend system that provide a layer of indirection for cross-plugin communication, and the routing system is one of them.

The Backstage routing system makes it possible to implement navigation across plugin boundaries, without each individual plugin knowing the concrete path or location of other plugins in the routing hierarchy, or even its own. This is achieved through the concept of route references, which are opaque reference values that can be shared and used to create concrete links to different parts of an app. The route ref paths can be configured both at plugin level (by plugin developers) and at the app level (by integrators). It is up to plugin developers to create route references for any page content in their plugin that they want it to be possible to link to or from.

## Route References

Plugin developers create a `RouteRef` to expose a path in Backstage's routing system. You will see below how routes are defined programmatically, but before diving into code, let us explain how to configure them at the app level. In spite of the fact that plugin developers choose a default route path for the routes their plugin provides, paths are configurable, so app integrators can set a custom path to a route whenever they like to (more information in the following sections).

There are three types of route references: regular route, sub route, and external route, and we will cover both the concept and code definition for each.

### Creating a Route Reference

Route references, also known as "absolute" or "regular" routes, are created as follows:

```tsx title="plugins/catalog/src/routes.ts"
import { createRouteRef } from '@backstage/frontend-plugin-api';

// Creates a route reference, which is not yet associated with any plugin page
export const indexRouteRef = createRouteRef();
```

Note that you often want to create the route references themselves in a different file than the one that creates the plugin instance, for example a top-level `routes.ts`. This is to avoid circular imports when you use the route references from other parts of the same plugin.

Route refs do not have any behavior themselves. They are an opaque value that represents route targets in an app, which are bound to specific paths at runtime. Their role is to provide a level of indirection to help link together different pages that otherwise wouldn't know how to route to each other.

### Providing Route References to Plugins

The code snippet in the previous section does not indicate which plugin the route belongs to. To do so, you have to use it in the creation of any kind of routable extension, such as a page extension:

```tsx title="plugins/catalog/src/plugin.tsx"
import React from 'react';
import {
  createPlugin,
  createPageExtension,
} from '@backstage/frontend-plugin-api';
import { indexRouteRef } from './routes';

const catalogIndexPage = createPageExtension({
  // The `name` option is omitted because this is an index page
  defaultPath: '/entities',
  // highlight-next-line
  routeRef: indexRouteRef,
  loader: () => import('./components').then(m => <m.IndexPage />),
});

export default createPlugin({
  id: 'catalog',
  // highlight-start
  routes: {
    index: indexRouteRef,
  },
  // highlight-end
  extensions: [catalogIndexPage],
});
```

In the example above we associated the `indexRouteRef` with the `catalogIndexPage` extension and provided both the route ref and page via the Catalog plugin. So, when this plugin is installed in the app, the index page will become associated with the newly created `RouteRef`, making it possible to use the route ref to navigate the page extension.

It may seem unclear why we configure the `routes` option when creating a plugin as the route has already been passed to the extension. We do that to make it possible for other plugins to route to our page, which is explained in detail in the [binding routes](#binding-external-route-references) section.

### Defining References with Path Parameters

Route references optionally accept a `params` option, which will require the listed parameter names to be present in the route path. Here is how you create a reference for a route that requires a `kind`, `namespace` and `name` parameters, like in this path `/entities/:kind/:namespace/:name`:

```tsx title="plugins/catalog/src/routes.ts"
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const detailsRouteRef = createRouteRef({
  // The parameters that must be included in the path of this route reference
  // highlight-next-line
  params: ['kind', 'namespace', 'name'],
});
```

### Using a Route Reference

Route references can be used to link to page in the same plugin, or to pages in different plugins. In this section we will cover the first scenario. If you are interested in linking to a page of a different plugin, please go to the [external routes](#external-route-references) section below.

Suppose we are creating a plugin that renders a Catalog index page with a link to a "Foo" component details page. Here is the code for the index page:

```tsx title="plugins/catalog/src/components/IndexPage.tsx"
import React from 'react';
import { useRouteRef } from '@backstage/frontend-plugin-api';
import { detailsRouteRef } from '../routes';

export const IndexPage = () => {
  // highlight-next-line
  const getDetailsPath = useRouteRef(detailsRouteRef);
  return (
    <div>
      <h1>Index Page</h1>
      <a
        {/* highlight-start */}
        href={getDetailsPath({
          kind: 'component',
          namespace: 'default',
          name: 'foo',
        })}
        {/* highlight-end */}
      >
        See "Foo" details
      </a>
    </div>
  );
};
```

We use the `useRouteRef` hook to create a link generator function that returns the details page path. We then call the link generator, passing it an object with the kind, namespace, and name. These parameters are used to construct a concrete path to the "Foo" details page.

Let's see how the details page can get the parameters from the URL:

```tsx title="plugins/catalog/src/components/DetailsPage.tsx"
import React from 'react';
import { useRouteRefParams } from '@backstage/frontend-plugin-api';
import { detailsRouteRef } from '../routes';

export const DetailsPage = () => {
  // highlight-next-line
  const params = useRouteRefParams(detailsRouteRef);
  return (
    <div>
      <h1>Details Page</h1>
      <ul>
        {/* highlight-start */}
        <li>Kind: {params.kind}</li>
        <li>Namespace: {params.namespace}</li>
        <li>Name: {params.name}</li>
        {/* highlight-end */}
      </ul>
    </div>
  );
};
```

In the code above, we are using the `useRouteRefParams` hook to retrieve the entity-composed id from the URL. The parameter object contains three values: kind, namespace, and name. We can display these values or call an API using them.

Since we are linking to pages of the same package, we are using a route ref directly. However, in the following sections, you will see how to link to pages of different plugins.

## External Route References

External routes are made for linking to a page of an external plugin.
For this section example, let's assume that we want to link from the Catalog entities list page to the Scaffolder create component page.

We don't want to reference the Scaffolder plugin directly, since that would create an unnecessary dependency. It would also provide little flexibility in allowing the app to tie plugins together, with the links instead being dictated by the plugins themselves. To solve this, we use an `ExternalRouteRef`. Much like regular route references, they can be passed to `useRouteRef` to create concrete URLs, but they can not be used in page extensions and instead have to be associated with a target route using route bindings in the app.

We create a new `RouteRef` inside the Scaffolder plugin, using a neutral name that describes its role in the plugin rather than a specific plugin page that it might be linking to, allowing the app to decide the final target. If the Catalog entity list page for example wants to link the Scaffolder create component page in the header, it might declare an `ExternalRouteRef` similar to this:

```tsx title="plugins/catalog/src/routes.ts"
import { createExternalRouteRef } from '@backstage/frontend-plugin-api';

export const createComponentExternalRouteRef = createExternalRouteRef();
```

External routes are also used in a similar way as regular routes:

```tsx title="plugins/catalog/src/components/IndexPage.tsx"
import React from 'react';
import { useRouteRef } from '@backstage/frontend-plugin-api';
import { createComponentExternalRouteRef } from '../routes';

export const IndexPage = () => {
  // highlight-next-line
  const getCreateComponentPath = useRouteRef(createComponentExternalRouteRef);
  return (
    <div>
      <h1>Index Page</h1>
      {/* highlight-next-line */}
      <a href={getCreateComponentPath()}>Create Component</a>
    </div>
  );
};
```

Given the above binding, using `useRouteRef(createComponentExternalRouteRef)` within the Catalog plugin will let us create a link to whatever path the Scaffolder create component page is mounted at. Note that there is no direct dependency between the Catalog plugin and Scaffolder, that is, we are not importing the `createComponentExternalRouteRef` from the Scaffolder package.

Now the only thing left is to provide the page and external route via a plugin:

```tsx title="plugins/catalog/src/plugin.tsx"
import React from 'react';
import {
  createPlugin,
  createPageExtension,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { indexRouteRef, createComponentExternalRouteRef } from './routes';

const catalogIndexPage = createPageExtension({
  defaultPath: '/entities',
  routeRef: indexRouteRef,
  loader: () => import('./components').then(m => <m.IndexPage />),
});

export default createPlugin({
  id: 'catalog',
  routes: {
    index: indexRouteRef,
  },
  // highlight-start
  externalRoutes: {
    createComponent: createComponentExternalRouteRef,
  },
  extensions: [catalogIndexPage],
  // highlight-end
});
```

External routes can also have parameters. For example, if you want to link to an entity's details page from Scaffolder, you'll need to create an external route that receives the same parameters the Catalog details page expects:

```tsx title="plugins/scaffolder/src/routes.ts"
import { createExternalRouteRef } from '@backstage/frontend-plugin-api';

export const entityDetailsExternalRouteRef = createExternalRouteRef({
  // highlight-next-line
  params: ['kind', 'namespace', 'name'],
});
```

Now let's move on and configure the app to resolve these external routes, so that the Scaffolder links to the Catalog entity page, and the Catalog links to the Scaffolder page.

### Binding External Route References

The association of external routes is controlled by the app. Each `ExternalRouteRef` of a plugin should be bound to an actual `RouteRef`, usually from another plugin. The binding process happens once at app startup, and is then used through the lifetime of the app to help resolve concrete route paths.

Using the above example of the Catalog entities list page to the Scaffolder create component page, we might do something like this in the app configuration file:

```yaml title="app-config.yaml"
app:
  routes:
    bindings:
      # point to the Scaffolder create component page when the Catalog create component ref is used
      # highlight-next-line
      catalog.createComponent: scaffolder.index
      # point to the Catalog details page when the Scaffolder component details ref is used
      # highlight-next-line
      scaffolder.componentDetails: catalog.details
```

We also have the ability to express this in code as an option to `createApp`, but you of course only need to use one of these two methods:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-app-api';
import catalog from '@backstage/plugin-catalog';
import scaffolder from '@backstage/plugin-scaffolder';

const app = createApp({
  // highlight-start
  bindRoutes({ bind }) {
    bind(catalog.externalRoutes, {
      createComponent: scaffolder.routes.createComponent,
    });
    bind(scaffolder.externalRoutes, {
      componentDetails: catalog.routes.details,
    });
  },
  // highlight-end
});

export default app.createRoot();
```

Note that we are not importing and using the `RouteRef`s directly in the app, and instead rely on the plugin instance to access routes of the plugins. This provides better namespacing and discoverability of routes, as well as reduce the number of separate exports from each plugin package.

Another thing to note is that this indirection in the routing is particularly useful for open source plugins that need to provide flexibility in how they are integrated. For plugins that you build internally for your own Backstage application, you can choose to use direct imports or even concrete route path strings directly. Although there can be some benefits to using the full routing system even in internal plugins: it can help you structure your routes, and as you will see further down it also helps you manage route parameters.

### Optional External Route References

It is possible to define an `ExternalRouteRef` as optional, so it is not required to bind it in the app.

```tsx title="plugins/catalog/src/routes.ts"
import { createExternalRouteRef } from '@backstage/frontend-plugin-api';

export const createComponentExternalRouteRef = createExternalRouteRef({
  // highlight-next-line
  optional: true,
});
```

When calling `useRouteRef` with an optional external route, its return signature is changed to `RouteFunc | undefined`, and the returned value can be used to decide whether a certain link should be displayed or if an action should be taken:

```tsx title="plugins/catalog/src/components/IndexPage.tsx"
import React from 'react';
import { useRouteRef } from '@backstage/frontend-plugin-api';
import { createComponentExternalRouteRef } from '../routes';

export const IndexPage = () => {
  const getCreateComponentPath = useRouteRef(createComponentExternalRouteRef);
  return (
    <div>
      <h1>Index Page</h1>
      {/* Rendering the link only if the getCreateComponentPath is defined */}
      {/* highlight-start */}
      {getCreateComponentPath && (
        <a href={getCreateComponentPath()}>Create Component</a>
      )}
      {/* highlight-end */}
    </div>
  );
};
```

## Sub Route References

The last kind of route ref that can be created is a `SubRouteRef`, which can be used to create a route ref with a fixed path relative to an absolute `RouteRef`. They are useful if you have a page that internally is mounted at a sub route of a page extension component, and you want other plugins to be able to route to that page. And they can be a useful utility to handle routing within a plugin itself as well.

For example:

```tsx title ="plugins/catalog/src/routes.ts"
import {
  createRouteRef,
  createSubRouteRef,
} from '@backstage/frontend-plugin-api';

export const indexRouteRef = createRouteRef();
// highlight-start
export const detailsSubRouteRef = createSubRouteRef({
  parent: indexRouteRef,
  path: '/details',
});
// highlight-end
```

There are substantial differences between creating subroutes and regular or external routes because subroutes are associated with regular routes, and the sub route path must be specified. The path string must include the parameters if this sub route has them:

```tsx title ="plugins/catalog/src/routes.ts"
// Omitting rest of the previous example file
export const detailsSubRouteRef = createSubRouteRef({
  parent: indexRouteRef,
  // highlight-next-line
  path: '/:name/:namespace/:kind',
});
```

Using subroutes in a page extension is as simple as this:

```tsx title="plugins/catalog/src/components/IndexPage.ts"
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useRouteRef } from '@backstage/frontend-plugin-api';
import { indexRouteRef, detailsSubRouteRef } from '../routes';
import { DetailsPage } from './DetailsPage';

export const IndexPage = () => {
  const { pathname } = useLocation();
  const getIndexPath = useRouteRef(indexRouteRef);
  const getDetailsPath = useRouteRef(detailsSubRouteRef);
  return (
    <div>
      <h1>Index Page</h1>
      {/* Linking to the details sub route */}
      {pathname === getIndexPath() ? (
        // highlight-start
        <a
          {/* Setting the details sub route params */}
          href={getDetailsPath({
            kind: 'component',
            namespace: 'default',
            name: 'foo',
          })}
        >
          Show details
        </a>
        // highlight-end
      ) : (
        // highlight-next-line
        <a href={getIndexPath()}>Hide details</a>
      )}
      {/* Registering the details sub route */}
      <Routes>
        <Route path={detailsSubRouteRef.path} element={<DetailsPage />} />
      </Routes>
    </div>
  );
};
```

This is how you can get the parameters of a sub route URL:

```tsx title="plugins/catalog/src/components/DetailsPage.ts"
import React from 'react';
import { useParams } from 'react-router-dom';

export const DetailsPage = () => {
  // highlight-next-line
  const params = useParams();
  return (
    <div>
      <h1>Details Sub Page</h1>
      <ul>
        {/* highlight-start */}
        <li>Kind: {params.kind}</li>
        <li>Namespace: {params.namespace}</li>
        <li>Name: {params.name}</li>
        {/* highlight-end */}
      </ul>
    </div>
  );
};
```

Finally, see how a plugin can provide subroutes:

```tsx title="plugins/catalog/src/plugin.ts"
import React from 'react';
import {
  createPlugin,
  createPageExtension,
} from '@backstage/frontend-plugin-api';
import { indexRouteRef, detailsSubRouteRef } from './routes';

const catalogIndexPage = createPageExtension({
  defaultPath: '/entities',
  routeRef: indexRouteRef,
  loader: () => import('./components').then(m => <m.IndexPage />),
});

export default createPlugin({
  id: 'catalog',
  routes: {
    index: indexRouteRef,
    // highlight-next-line
    details: detailsSubRouteRef,
  },
  extensions: [catalogIndexPage],
});
```
