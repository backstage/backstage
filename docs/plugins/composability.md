---
id: composability
title: New Composability System
description:
  Documentation and migration instructions for new composability APIs.
---

## Summary

This page describes the new composability system that was recently introduced in
Backstage. It describes the new system from the perspective of the existing
patterns and APIs. As the new system is solidified and existing code is ported,
this page will removed and replaced with a more direct description of the
composability system.

The core principle of the new composability system is that plugins should have
clear boundaries and connections. It should isolate crashes within a plugin, but
allow navigation between them. It should allow for plugins to be loaded only
when needed, and enable plugins to provide extension point for other plugins to
build upon. The composability system is also built with an app-first mindset,
prioritizing simplicity and clarity in the app over plugins and core APIs.

The new composability system isn't a single new API surface. It is a collection
of patterns, new primitives, new APIs, and old APIs used in new ways. At the
core is the new concept of Extensions, are exported by plugins for use in the
app. There is a new primitive called component data, which is used to connect
plugin and the app, and a new hook that provides a practical use of .

## New Concepts

This section is a brief look into all the new and updated concepts that were put
in place to support the new composability system.

### Component Data

Component data is a new composability primitive that is introduced as a way to
provide a new data dimension for React components. Data is attached to React
components using a key, and is then readable from any JSX elements created with
those components using the same key, as illustrated by the following example:

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
Though in those libraries only the element type and props are typically
inspected, while our component data adds more structured access and simplifies
evolution by allowing for multiple different versions of a piece of data to be
used at once.

The initial use-cases for component data is support route and plugin discovery
through elements in the app. Through this we allow for the React element tree in
the app to be the source of truth, both for which plugins are used and all
top-level plugin routes in the app. The use of component data is not limited to
these use-cases though, as it can be used as a primitive to create new
abstractions as well.

### Extensions

Extensions are what plugins export for use in an app. Most typically they are
React components, but in practice they can be any kind of value. They are
created using `create*Extension` functions, and wrapped with `plugin.provide()`
in order to create the actual exported extension.

The extension type is dead simple:

```ts
export type Extension<T> = {
  expose(plugin: BackstagePlugin<any, any>): T;
};
```

The power of extensions comes from the ability of various actors to hook into
their usage. The creation and plugin wrapping is controlled by whoever owns the
creation function, the Backstage core is able to hook into the process of
exposing the extension outside the plugin, and in the end the app controls the
usage of the extension.

The Backstage core API currently provides two different types of extension
creators, `createComponentExtension`, and `createRoutableExtension`. Component
extensions are plain react component with no particular requirements, such as
cards for entity overview pages. The component will be exported more or less as
is, but is wrapped up to provide things like an error boundary, lazy loading,
and a plugin context.

Routable extensions build on top of component extensions and are used for any
component that should be rendered at a specific route path, such as full pages
or entity page tab content. When creating a routable extension you need to
supply a `RouteRef` as `mountPoint`. The mount point will be the handle of the
component for the outside world, and is used by other components and plugins
that wish to link to the routable component.

As of now there are only two extension creation functions, but it is possible to
add more of them in the future, both in the core library and in plugins that
wish to provide an extension point for other plugins to build upon. Extensions
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

Routable extensions even enforce lazy loading, for example:

```ts
export const FooPage = plugin.provide(
  createRoutableExtension({
    component: () => import('./components/FooPage').then(m => m.FooPage),
    mountPoint: fooRouteRef,
  }),
);
```

### Using Extensions in an App

Right now all extensions are modelled as React components. The usage of these
extension is like regular usage of any React components, with one important
difference. Extensions must be all be part of a single React element tree
spanning from the root `AppProvider`.

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

But it is simple to fix! Simply make sure that you don't create any intermediate
components in the app, for example like this:

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

### New Routing System

A big piece of what is enabled by moving over to this new composability system
is to make `RouteRef`s useful. The `RouteRef`s no longer have their own path, in
fact the only required parameter is currently a `title`. Instead of assigning a
path to each `RouteRef` and possibly overriding these paths in the app, the
concrete `path` for each `RouteRef` is discovered based on the element tree in
the app. Let's consider the following example:

```tsx
<Routes>
  <Route path="/foo" element={<FooPage />} />
  <Route path="/bar" element={<BarPage />} />
</Routes>
```

We'll assume that `FooPage` and `BarPage` are routable extensions, exported by
the `fooPlugin` and `barPlugin` respectively. Since the `FooPage` is a routable
extension it has a `RouteRef` assigned as its mount point, which we'll refer to
as `fooRootRouteRef`.

Given the above example, the `fooRootRouteRef` will be associated with the
`'/foo'` route. The path is no longer accessible via the `path` property of the
`RouteRef` though, as the routing structure is tied to the app's react tree. We
instead use the new `useRouteRef` hook if we want to create a concrete link to
the page. The `useRouteRef` hook takes a single `RouteRef` as its only
parameter, and returns a function that is called to create the URL.

Now let's assume that we want to link from the `BarPage` to the `FooPage`.
Before the introduction of the new composability system, we would do this by
importing the `fooRootRouteRef` from the `fooPlugin`. This created an
unnecessary dependency on the plugin, and also provided little flexibility
allowing the app to tie plugins together rather than the plugins themselves. To
handle this, we introduce the concept of `ExternalRouteRef`s. Much like regular
route refs, they can be passed to `useRouteRef` to create concrete URLs, but
they can not be used as mount points in routable component and instead have to
be associated with an actual using route bindings in the app.

The `ExternalRouteRef` inside the `barPlugin` should also not be opinionated
about what it is linking to either, allowing the app to decide the final target.
It should however provide context in how the link is presented or used, to make
it easier to understand the flow of the app. If the `BarPage` for example wants
to link to an external page in the header, it might declare an
`ExternalRouteRef` similar to this:

```ts
const headerLinkRouteRef = createExternalRouteRef();
```

### Binding External Routes in the App

The association of external routes are controlled by the app. Each
`ExternalRouteRef` of a plugin is bound to an actual `RouteRef`, usually from
another plugin. The binding process happens once att app startup, and is then
used through the lifetime of the app to help resolve concrete route paths.

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

Given the above binding, using `useRouteRef(external)`

Note that we are not importing and using the `RouteRef`s directly, and instead
rely on the plugin instance to access routes of the plugins. This is a new
convention that was introduced to provide better namespacing and discoverability
of routes, as well as reduce the number of different things exported from each
plugin package. The route references would be supplied to `createPlugin` like
this:

```ts
// In foo-plugin
export const fooPlugin = createPlugin({
  routes: {
    root: fooRootRouteRef,
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

### New Catalog Components

EntitySwitch & EntityLayout, and how to use those in the app

TODO

## Porting Existing Plugins

## Porting Existing Apps
