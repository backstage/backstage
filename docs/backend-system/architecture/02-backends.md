---
id: backends
title: Backend Instances
sidebar_label: Backend
# prettier-ignore
description: Backend instances
---

> **DISCLAIMER: The new backend system is in alpha, and still under active development. While we have reviewed the interfaces carefully, they may still be iterated on before the stable release.**

## The Backend Instance

This is the main entry point for creating a backend. It does not have any functionality in and of itself, but is simply responsible for wiring things together.
It is up to you to decide how many different backends you want to deploy. You can have all features in a single one, or split things out into multiple smaller deployments.

Below is a simple example of a backend that installs only the catalog plugin and starts it up.

```ts
import { createBackend } from '@backstage/backend-defaults';
import { catalogPlugin } from '@backstage/plugin-catalog-backend';

// Create your backend instance
const backend = createBackend();

// Install all desired features
backend.add(catalogPlugin());

// Start up the backend
await backend.start();
```

`createBackend` is responsible for creating your backend instance, and wiring up all the services that you have provided. It deals with creating default implementations of all the [core services](../core-services/01-index.md) that are used by the plugins, and also provides a way to override the default implementations with your own. You can read more about creating services and overriding them in the [building backends docs](../building-backends/01-index.md).

The backend instance has the ability to add features to the backend which are done using the `.add` method. Features are either plugins or modules, and you can read more about them in the [building plugins and modules docs](../building-plugins-and-modules/01-index.md). By default, a backend instance has no default features, and the services are responsible for wiring everything together.

At a high level, when you call `createBackend`, it will create a new backend instance, which has a registry of all the services that are currently registered, and by adding features to the backend instance and calling the `.start()` method it will ensure that all the dependencies are wired up correctly and the `registerInit` methods are called in the correct order.

Underneath the hood, `createBackend` calls `createSpecializedBackend` from `@backstage/backend-app-api` which is responsible for actually creating the backend instance, but with no services or no features. You can think of `createBackend` more of a 'batteries included' approach, and `createSpecializedBackend` a little more low level.

As mentioned previously there's also the ability to create multiple of these backends in your project so that you can split apart your backend and deploy different backends that can scale independently of each other. For instance you might choose to deploy a backend with only the catalog plugin enabled, and one with just the scaffolder plugin enabled. We've provided some tools to be able to share services and defaults across your backend system, and you can find out more about that in the [shared environments docs](../building-backends/01-index.md#shared-environments).
