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

## Component Data

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
be inspected before rendering elements. It's a pattern that is quite common
among React libraries, and used for example by `react-router` and `material-ui`
to discover properties of the child elements before rendering. Although in those
libraries only the element type and props are typically inspected, while our
component data adds more structured access and simplifies evolution by allowing
for multiple different versions of a piece of data to be used at once.

The main use-case

## Extensions

Extensions are what plugins export for use in an app. Most typically they are
React components, but in practice they can be any kind of value. They are
created using `create*Extension` functions, and wrapped with `plugin.provide()`
in order to create the actual exported extension.

The Backstage core API currently provides two different types of extension
creators, `createComponentExtension`, and `createRoutableExtension`.

### Extensions from a plugin's point of view

Extensions are one of the primary methods to traverse the plugin boundary, and
the way that plugins provide concrete content for use within an app. They
replace existing component export concepts such as `Router` or `*Card`s for
display on entity overview pages.

### Using Extensions in an app

TODO

## RouteRefs, useRouteRef, and plugin routes and externalRoutes

TODO

## Binding external routes in the app

TODO

## New catalog components, EntitySwitch & EntityLayout, and how to use those in the app

TODO
