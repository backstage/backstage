---
id: index
title: Frontend System Architecture
sidebar_label: Overview
# prettier-ignore
description: The structure and architecture of the new Frontend System
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Building Blocks

This section introduces the high-level building blocks upon which this new
system is built. Most of these concepts exist in our current system too, although
in some cases you need to squint quite a lot to see the similarity.

Regardless of whether you are setting up your own backstage instance,
developing plugins, or extending plugins with new features, it is
important to understand these concepts.

The diagram below provides an overview of the different building blocks and the other blocks that each of them interacts with.

![frontend system building blocks diagram](../../assets/frontend-system/architecture-building-blocks.drawio.svg)

### App

This is the app instance itself that you create and use as the root of your Backstage frontend application. It does not have any direct functionality in and of itself, but is simply responsible for wiring things together.

### Extensions

Extensions are the building blocks that build out both the visual and non-visual structure of the application. There are both built-in extensions provided by the app itself as well as extensions provided by plugins. Each extension is attached to a parent with which it shares data and can have any number of children of its own. It is up to the app to wire together all extensions into a single tree known as the app extension tree. It is from this structure that the entire app can then be instantiated and rendered.

### Plugins

Plugins provide the actual features inside an app. The size of a plugin can range from a tiny component to an entire new system in which other plugins can be composed and integrated. Plugins can be completely standalone or built on top of each other to extend existing plugins and augment their features. Plugins can communicate with each other by composing their extensions or by sharing Utility APIs and routes.

### Extension Overrides

In addition to the built-in extensions and extensions provided by plugins, it is also possible to install extension overrides. This is a collection of extensions with high priority that can replace existing extensions. They can for example be used to override an individual extension provided by a plugin, or install a completely new extension, such as a new app theme.

### Utility APIs

Utility APIs provide functionality that makes it easier to build plugins, make it possible for plugins to share functionality with other plugins, as well as serve as a customization point for integrators to change the behaviour of the app. Each Utility API is defined by a TypeScript interface as well as a reference used to access the implementations. The implementations of Utility APIs are defined by extensions that are provided and can be overridden the same as any other extension.

### Routes

The Backstage routing system adds a layer of indirection that makes it possible for plugins to route to each other's extensions without explicit knowledge of what URL paths the extensions are rendered at or if they even exist at all. It makes it possible for plugins to share routes with each other and dynamically generate concrete links at runtime. It is the responsibility of the app to resolve these links to actual URLs, but it is also possible for integrators to define their own route bindings that decide how the links should be resolved. The routing system also lets plugins define internal routes, aiding in the linking to different content in the same plugin.

## Package structure

TODO
