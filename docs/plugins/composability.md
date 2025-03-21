---
id: composability
title: Composability System
# prettier-ignore
description: Documentation for the Backstage plugin composability APIs.
---

## Summary

This page describes the composability system that helps bring together content
from a multitude of plugins into one Backstage application.

The core principle of the composability system is that plugins should have clear
boundaries and connections. It should isolate crashes within a plugin, but allow
navigation between them. It should allow for plugins to be loaded only when
needed, and enable plugins to provide extension points for other plugins to
build upon. The composability system is also built with an app-first mindset,
prioritizing simplicity and clarity in the app over that in the plugins and core
APIs.

The composability system isn't a single API surface. It is a collection of
patterns, primitives, and APIs. At the core is the concept of **extensions**,
which are exported by plugins for use in the app. There is also a primitive
called component data, which helps keep the structure of the app more
declarative. There are also `RouteRef`s that help route between pages in a
flexible way, which is especially important when bringing together different
open source plugins.

## Concepts

This section is a brief look into all the concepts that help support the
composability system.

### Component Data

Component data is a composability primitive that is introduced as a way to
provide a new data dimension for React components. Data is attached to React
components using a key, and is then readable from any JSX elements created with
those components, using the same key, as illustrated by the following example:

```tsx
const MyComponent = () => <h1>This is my component</h1>;
attachComponentData(MyComponent, 'my.data', 5);

const element = <MyComponent />;
const myData = getComponentData(element, 'my.data');
// myData === 5
```

The purpose of component data is to provide a method for embedding data that can
be inspected before rendering elements. Element inspection is a pattern that is
quite common among React libraries, and used for example by `react-router` and
`material-ui` to discover properties of the child elements before rendering.
Although in those libraries only the element type and props are typically
inspected, while our component data adds more structured access and simplifies
evolution by allowing for multiple different versions of a piece of data to be
used and interpreted at once.

One of the use-cases for component data is to support route and plugin discovery
through elements in the app. Through this we allow for the React element tree in
the app to be the source of truth, both for which plugins are used, as well as
all top-level plugin routes in the app. The use of component data is not limited
to these use-cases though, as it can be used as a primitive to create new
abstractions as well.

### Extensions

Extensions are what plugins export for use in an app. Most typically they are
React components, but in practice they can be any kind of JavaScript value. They
are created using `create*Extension` functions, and wrapped with
`plugin.provide()` in order to create the actual exported extension.

The extension type is a simple one:

```ts
export type Extension<T> = {
  expose(plugin: BackstagePlugin): T;
};
```

The power of extensions comes from the ability of various actors to hook into
their usage. The creation and plugin wrapping is controlled by whoever owns the
creation function, the Backstage core is able to hook into the process of
exposing the extension outside the plugin, and in the end the app controls the
usage of the extension.

The Backstage core API currently provides two different types of extension
creators, `createComponentExtension`, and `createRoutableExtension`. Component
extensions are plain React component with no particular requirements, for
example a card for an entity overview page. The component will be exported more
or less as is, but is wrapped to provide things like an error boundary, lazy
loading, and a plugin context.

Routable extensions build on top of component extensions and are used for any
component that should be rendered at a specific route path, such as top-level
pages or entity page tab content. When creating a routable extension you need to
supply a `RouteRef` as `mountPoint`. The mount point will be the handle of the
component for the outside world, and is used by other components and plugins
that wish to link to the routable component.

As of now there are only two extension creation functions in the core library,
but more may be added in the future. There are also some plugins that provide
ways to extend functionality through their own extensions, like
`createScaffolderFieldExtension` from `@backstage/plugin-scaffolder`. Extensions
are also not tied to React, and can both be used to model generic JavaScript
concepts, as well as potentially bridge to rendering libraries and web
frameworks other than React.

### Extensions from a Plugin's Point of View

Extensions are one of the primary methods to traverse the plugin boundary, and
the way that plugins provide concrete content for use within an app. They
replace existing component export concepts such as `Router` or `*Card`s for
display on entity overview pages.

It is recommended to create the exported extensions either in the top-level
`plugin.ts` file, or in a dedicated `extensions.ts` (or `.tsx`) file. That file
should not contain the bulk of the implementation though, and in fact, if the
extension is a React component it is recommended to lazy-load the actual
component. Component extensions support lazy loading out of the box using the
`lazy` component declaration, for example:

```ts
export const EntityFooCard = plugin.provide(
  createComponentExtension({
    component: {
      lazy: () => import('./components/FooCard').then(m => m.FooCard),
    },
  }),
);
```

Routable extensions even enforce lazy loading, as it is the only way to provide
a component:

```ts
export const FooPage = plugin.provide(
  createRoutableExtension({
    name: 'FooPage',
    component: () => import('./components/FooPage').then(m => m.FooPage),
    mountPoint: fooPageRouteRef,
  }),
);
```

### Using Extensions in an App

Right now all extensions are modelled as React components. The usage of these
extension is like regular usage of any React components, with one important
difference. Extensions must all be part of a single React element tree spanning
from the root `AppProvider`.

For example, the following app code does **NOT** work:

```tsx
const AppRoutes = () => (
  <Routes>
    <Route path="/foo" element={<FooPage />} />
    <Route path="/bar" element={<BarPage />} />
  </Routes>
);

const App = () => (
  <AppProvider>
    <AppRouter>
      <Root>
        <AppRoutes />
      </Root>
    </AppRouter>
  </AppProvider>
);
```

But in this case it is simple to fix! Simply be sure to not create any
intermediate components in the app, for example like this:

```tsx
const appRoutes = (
  <Routes>
    <Route path="/foo" element={<FooPage />} />
    <Route path="/bar" element={<BarPage />} />
  </Routes>
);

const App = () => (
  <AppProvider>
    <AppRouter>
      <Root>{appRoutes}</Root>
    </AppRouter>
  </AppProvider>
);
```

### Naming Patterns

There are a couple of naming patterns to adhere to as you build plugins, which
helps clarify the intent and usage of the exports.

| Description           | Pattern          | Examples                                             |
| --------------------- | ---------------- | ---------------------------------------------------- |
| Top-level Pages       | `*Page`          | `CatalogIndexPage`, `SettingsPage`, `LighthousePage` |
| Entity Tab Content    | `Entity*Content` | `EntityJenkinsContent`, `EntityKubernetesContent`    |
| Entity Overview Card  | `Entity*Card`    | `EntitySentryCard`, `EntityPagerDutyCard`            |
| Entity Conditional    | `is*Available`   | `isPagerDutyAvailable`, `isJenkinsAvailable`         |
| Plugin Instance       | `*Plugin`        | `jenkinsPlugin`, `catalogPlugin`                     |
| Utility API Reference | `*ApiRef`        | `configApiRef`, `catalogApiRef`                      |

### Routing System

The routing system of Backstage relies heavily on the composability system. It
uses `RouteRef`s to represent routing targets in the app, which at runtime will
be bound to a concrete `path`, but provides a level of indirection to help mix
together different plugins that otherwise wouldn't know how to route to each
other.

The concrete `path` for each `RouteRef` is discovered based on the element tree
in the app. Let's consider the following example:

```tsx
const appRoutes = (
  <Routes>
    <Route path="/foo" element={<FooPage />} />
    <Route path="/bar" element={<BarPage />} />
  </Routes>
);
```

We'll assume that `FooPage` and `BarPage` are routable extensions, exported by
the `fooPlugin` and `barPlugin` respectively. Since the `FooPage` is a routable
extension it has a `RouteRef` assigned as its mount point, which we'll refer to
as `fooPageRouteRef`.

Given the above example, the `fooPageRouteRef` will be associated with the
`'/foo'` route. If we want to route to the `FooPage`, we can use the
`useRouteRef` hook to create a concrete link to the page. The `useRouteRef` hook
takes a single `RouteRef` as its only parameter, and returns a function that is
called to create the URL. For example like this:

```tsx
const MyComponent = () => {
  const fooRoute = useRouteRef(fooPageRouteRef);
  return <a href={fooRoute()}>Link to Foo</a>;
};
```

Now let's assume that we want to link from the `BarPage` to the `FooPage`. We
don't want to reference the `fooPageRouteRef` directly from our `barPlugin`,
since that would create an unnecessary dependency on the `fooPlugin`. It would
also provided little flexibility in allowing the app to tie plugins together,
with the links instead being dictated by the plugins themselves. To solve this,
we use `ExternalRouteRef`s. Much like regular route references, they can be
passed to `useRouteRef` to create concrete URLs, but they can not be used as
mount points in routable component and instead have to be associated with a
target route using route bindings in the app.

We create a new `ExternalRouteRef` inside the `barPlugin`, using a neutral name
that describes its role in the plugin rather than a specific plugin page that it
might be linking to, allowing the app to decide the final target. If the
`BarPage` for example wants to link to an external page in the header, it might
declare an `ExternalRouteRef` similar to this:

```ts
const headerLinkRouteRef = createExternalRouteRef({ id: 'header-link' });
```

### Binding External Routes in the App

The association of external routes is controlled by the app. Each
`ExternalRouteRef` of a plugin should be bound to an actual `RouteRef`, usually
from another plugin. The binding process happens once at app startup, and is
then used through the lifetime of the app to help resolve concrete route paths.

Using the above example of the `BarPage` linking to the `FooPage`, we might do
something like this in the app:

```ts
createApp({
  bindRoutes({ bind }) {
    bind(barPlugin.externalRoutes, {
      headerLink: fooPlugin.routes.root,
    });
  },
});
```

Given the above binding, using `useRouteRef(headerLinkRouteRef)` within the
`barPlugin` will let us create a link to whatever path the `FooPage` is mounted
at.

Note that we are not importing and using the `RouteRef`s directly in the app,
and instead rely on the plugin instance to access routes of the plugins. This is
a new convention that was introduced to provide better namespacing and
discoverability of routes, as well as reduce the number of separate exports from
each plugin package. The route references would be supplied to `createPlugin`
like this:

```ts
// In foo-plugin
export const fooPlugin = createPlugin({
  routes: {
    root: fooPageRouteRef,
  },
  ...
})

// In bar-plugin
export const barPlugin = createPlugin({
  externalRoutes: {
    headerLink: headerLinkRouteRef,
  },
  ...
})
```

Also note that you almost always want to create the route references themselves
in a different file than the one that creates the plugin instance, for example a
top-level `routes.ts`. This is to avoid circular imports when you use the route
references from other parts of the same plugin.

Another thing to note is that this indirection in the routing is particularly
useful for open source plugins that need to leave flexibility in how they are
integrated. For plugins that you build internally for your own Backstage
application, you can choose to go the route of direct imports or even use
concrete routes directly. Although there can be some benefits to using the full
routing system even in internal plugins. It can help you structure your routes,
and as you will see further down it also helps you manage route parameters.

You can also use static configuration to bind routes, removing the need to make
changes to the app code. It does however mean that you won't get type safety
when binding routes and compile-time validation of the bindings. Static
configuration of route bindings is done under the `app.routes.bindings` key in
`app-config.yaml`. It works the same way as [route bindings in the new frontend system](../frontend-system/architecture/36-routes.md#binding-external-route-references),
for example:

```yaml
app:
  routes:
    bindings:
      bar.headerLink: foo.root
```

### Default Targets for External Route References

Following the `1.28` release of Backstage you can now define default targets for
external route references. They work the same way as [default targets in the new frontend system](../frontend-system/architecture/36-routes.md#default-targets-for-external-route-references),
for example:

```ts
export const createComponentExternalRouteRef = createExternalRouteRef({
  // highlight-next-line
  defaultTarget: 'scaffolder.createComponent',
});
```

### Optional External Routes

When creating an `ExternalRouteRef` it is possible to mark it as optional:

```ts
const headerLinkRouteRef = createExternalRouteRef({
  id: 'header-link',
  optional: true,
});
```

An external route that is marked as optional is not required to be bound in the
app, allowing it to be used as a switch for whether a particular link should be
displayed or action should be taken.

When calling `useRouteRef` with an optional external route, its return signature
is changed to `RouteFunc | undefined`, allowing for logic like this:

```tsx
const MyComponent = () => {
  const headerLink = useRouteRef(headerLinkRouteRef);

  return (
    <header>
      My Header
      {headerLink && <a href={headerLink()}>External Link</a>}
    </header>
  );
};
```

### Parameterized Routes

A feature of `RouteRef`s is the possibility of adding named and typed
parameters. Parameters are declared at creation, and will enforce presence of
the parameters in the path in the app, and require them as a parameter when
using `useRouteRef`.

The following is an example of creation and usage of a parameterized route:

```tsx
// Creation of a parameterized route
const myRouteRef = createRouteRef({
  id: 'myroute',
  params: ['name']
})

// In the app, where MyPage is a routable extension with myRouteRef set as mountPoint
<Route path='/my-page/:name' element={<MyPage />}/>

// Usage within a component
const myRoute = useRouteRef(myRouteRef)
return (
  <div>
    <a href={myRoute({name: 'a'})}>A</a>
    <a href={myRoute({name: 'b'})}>B</a>
  </div>
)
```

It is currently not possible to have parameterized `ExternalRouteRef`s, or to
bind an external route to a parameterized route, although this may be added in
the future if needed.

### Subroutes

The last kind of route refs that can be created are `SubRouteRef`s, which can be
used to create a route ref with a fixed path relative to an absolute `RouteRef`.
They are useful if you have a page that internally is mounted at a sub route of
a routable extension component, and you want other plugins to be able to route
to that page.

For example:

```tsx
// routes.ts
const rootRouteRef = createRouteRef({ id: 'root' });
const detailsRouteRef = createSubRouteRef({
  id: 'root-sub',
  parent: rootRouteRef,
  path: '/details',
});

// plugin.ts
export const myPlugin = createPlugin({
  routes: {
    root: rootRouteRef,
    details: detailsRouteRef,
  },
});

export const MyPage = myPlugin.provide(
  createRoutableExtension({
    name: 'MyPage',
    component: () => import('./components/MyPage').then(m => m.MyPage),
    mountPoint: rootRouteRef,
  }),
);

// components/MyPage.tsx
const MyPage = () => (
  <Routes>
    {/* myPlugin.routes.root will take the user to this page */}
    <Route path="/" element={<IndexPage />} />

    {/* myPlugin.routes.details will take the user to this page */}
    <Route path="/details" element={<DetailsPage />} />
  </Routes>
);
```

### Catalog Components

To help structure the catalog entity pages in your app and choose what content
to render in different scenarios, the `@backstage/catalog` plugin provides an
`EntitySwitch` component. It works by selecting at most one element to render
using a list of `EntitySwitch.Case` children.

For example, if you want all entities of kind `"Template"` to be rendered with a
`MyTemplate` component, and all other entities to be rendered with a `MyOther`
component, you would do the following:

```tsx
<EntitySwitch>
  <EntitySwitch.Case if={isKind('template')}>
    <MyTemplate />
  </EntitySwitch.Case>

  <EntitySwitch.Case>
    <MyOther />
  </EntitySwitch.Case>
</EntitySwitch>

// Shorter form if desired:
<EntitySwitch>
  <EntitySwitch.Case if={isKind('template')} children={<MyTemplate />}/>
  <EntitySwitch.Case children={<MyOther />}/>
</EntitySwitch>
```

The `EntitySwitch` component will render the children of the first
`EntitySwitch.Case` that returns `true` when the selected entity is passed to
the function of the `if` prop. If none of the cases match, no children will be
rendered, and if a case doesn't specify an `if` filter function, it will always
match. The `if` property is simply a function of the type
`(entity: Entity) => boolean`, for example, `isKind` can be implemented like
this:

```ts
function isKind(kind: string) {
  return (entity: Entity) => entity.kind.toLowerCase() === kind.toLowerCase();
}
```

The `@backstage/catalog` plugin provides a couple of built-in conditions,
`isKind`, `isComponentType`, `isResourceType`, `isEntityWith`, and `isNamespace`.

In addition to the `EntitySwitch` component, the catalog plugin also exports a
new `EntityLayout` component. It is a tweaked version and replacement for the
`EntityPageLayout` component, and is introduced more in depth in the app
migration section below.

**NOTE**: The rest of this documentation covers how to migrate older
applications to the new composability system described above.

## Porting Existing Plugins

There are a couple of high-level steps to porting an existing plugin to the new
composability system:

- Remove usage of `router.addRoute` or `router.registerRoute` within
  `createPlugin`, and export the page components as routable extensions instead.
- Switch any `Router` export to instead be a routable extension.
- Change any plain component exports, such as catalog overview cards, to be
  component extensions.
- Stop exporting `RouteRef`s and instead pass them to `createPlugin`.
- Stop accepting `RouteRef`s as props or importing them from other plugins,
  instead create an `ExternalRouteRef` as a replacement, and pass it to
  `createPlugin.`
- Rename any other exported symbols according to the naming pattern table below.

Note that removing the existing exports and configuration is a breaking change
in any plugin. If backwards compatibility is needed the existing code be
deprecated while making the new additions, to then be removed at a later point.

### Naming Patterns

Many export naming patterns have been changed to avoid import aliases and to
clarify intent. Refer to the following table to formulate the new name:

| Description          | Existing Pattern             | New Pattern       | Examples                                             |
| -------------------- | ---------------------------- | ----------------- | ---------------------------------------------------- |
| Top-level Pages      | `Router`                     | `\*Page`          | `CatalogIndexPage`, `SettingsPage`, `LighthousePage` |
| Entity Tab Content   | `Router`                     | `Entity\*Content` | `EntityJenkinsContent`, `EntityKubernetesContent`    |
| Entity Overview Card | `\*Card`                     | `Entity\*Card`    | `EntitySentryCard`, `EntityPagerDutyCard`            |
| Entity Conditional   | `isPluginApplicableToEntity` | `is\*Available`   | `isPagerDutyAvailable`, `isJenkinsAvailable`         |
| Plugin Instance      | `plugin`                     | `\*Plugin`        | `jenkinsPlugin`, `catalogPlugin`                     |
