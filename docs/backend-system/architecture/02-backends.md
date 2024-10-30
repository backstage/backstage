---
id: backends
title: Backend Instances
sidebar_label: Backend
# prettier-ignore
description: Backend instances
---

## The Backend Instance

This is the main entry point for creating a backend. It does not have any functionality in and of itself, but is simply responsible for wiring things together.
It is up to you to decide how many different backends you want to deploy. You can have all features in a single one, or split things out into multiple smaller deployments.

Below is a simple example of a backend that installs only the catalog plugin and starts it up.

```ts
import { createBackend } from '@backstage/backend-defaults';
import scaffolderPlugin from '@backstage/plugin-scaffolder-backend';

// Create your backend instance
const backend = createBackend();

// Install desired features
backend.add(import('@backstage/plugin-catalog-backend'));

// Features can also be installed using an explicit reference
backend.add(scaffolderPlugin);

// Start up the backend
backend.start();
```

We call `createBackend` to create a new backend instance, which is responsible for wiring together all of the features that we provide to the app. It also provides default implementations of all [core services](../core-services/01-index.md) for use in plugins. No real work is done at the point of creating the backend though, it's all deferred to the `backend.start()` call.

To add any feature to a backend instance you use the `.add(...)` method. Features are either plugins, modules, or service factories. You can read more about building plugins and modules in the [building plugins and modules docs](../building-plugins-and-modules/01-index.md), as well as how to install services factories in the [building backends docs](../building-backends/01-index.md).

Once you have added all desired features we call the `.start()` method. This causes the backend to start up and initialize all features. When starting up the backend will validate all features to make sure that there are no conflicts. For example making sure that there are no circular dependencies.

Underneath the hood, `createBackend` calls `createSpecializedBackend` from `@backstage/backend-app-api` which is responsible for actually creating the backend instance, without any services or features. You can think of `createBackend` more of a 'batteries included' approach, while `createSpecializedBackend` is more low level.

As mentioned previously there's also the ability to create multiple of these backends in your project so that you can split apart your backend and deploy different backends that can scale independently of each other. For instance you might choose to deploy a backend with only the catalog plugin enabled, and one with just the scaffolder plugin enabled.
