---
id: index
title: Building Backends
sidebar_label: Overview
# prettier-ignore
description: Building backends using the new backend system
---

> **DISCLAIMER: The new backend system is in alpha, and still under active development. While we have reviewed the interfaces carefully, they may still be iterated on before the stable release.**

> NOTE: If you have an existing backend that is not yet using the new backend
> system, see [migrating](./08-migrating.md).

This section covers how to set up and customize your own Backstage backend. It covers some aspects of how backend instances fit into the larger system, but for a more in-depth explanation of the role of backends in the backend system, see [the architecture section](../architecture/02-backends.md).

# Overview

A minimal Backstage backend is very lightweight. It is a single package with a `package.json` file and a `src/index.ts` file, not counting surrounding tooling and documentation. The package is typically placed within the `packages/backend` folder of a Backstage monorepo, but that is up to you. The backend package is part of any project created with `@backstage/create-app`, so you typically do not need to create it yourself.

When you create a new project with `@backstage/create-app`, you'll get a backend package with a `src/index.ts` that looks something like this:

```ts
import { createBackend } from '@backstage/backend-defaults';
import { appPlugin } from '@backstage/plugin-app-backend';
import { catalogPlugin } from '@backstage/plugin-catalog-backend';
import {
  scaffolderPlugin,
  catalogModuleTemplateKind,
} from '@backstage/plugin-scaffolder-backend';

const backend = createBackend();

backend.add(appPlugin());
backend.add(catalogPlugin());
backend.add(catalogModuleTemplateKind());
backend.add(scaffolderPlugin());

backend.start();
```

There will be a couple more plugins and modules in the initial setup, but the overall layout is the same.

What we're doing in this file is creating a new backend using `createBackend`, and then installing a collection of different plugins and modules that we want to be part of that backend. Plugins are standalone features, while modules augment existing plugins. Each module can only target a single plugin, and that plugin must also be present in the same backend. Finally, we start up the backend by calling the `start` method.

## Customization

Apart from installing existing plugins and modules in the backend, there are a couple of different ways in which you can customize your backend installation.

### Configuration

Perhaps the most accessible way is though static configuration, which you can read more about in the documentation for how to [write configuration](../../conf/writing.md). Many different aspects of the backend can be configured, including both the behavior of the backend itself, as well as many plugins or modules. You'll need to refer to the documentation of each plugin or module to see what configuration is available. Also be sure to check out the documentation of the [core services](../core-services/01-index.md), as that also covers how to configure those.

### Services

Speaking of services, they are another important point of customization. Services allow you to make deeper and broader customizations of the backend. They are similar to [Utility APIs](../../api/utility-apis.md) in the frontend system, using dependency injection to make common functionality available to plugins and modules. You can read more about services in the [architecture section](../architecture/03-services.md).

There is a core set of services that must be installed in all backends, for things like logging, database access, serving HTTP, and so on. Luckily, all of these services are installed by default when you use `createBackend` from the `@backstage/backend-defaults` package, which is what you have in a standard setup.

All of these services can be replaced with your own implementations if you need to customize them. The simplest way to do this is to use the existing service implementations but with additional options. Many of the core services can be customized this way, but not all, as they don't all have meaningful options.

For example, let's say we want to customize the core configuration service to enable remote configuration loading. That would look something like this:

```ts
import { configServiceFactory } from '@backstage/backend-app-api';

const backend = createBackend({
  services: [
    configServiceFactory({
      remote: { reloadIntervalSeconds: 60 },
    }),
  ],
});
```

This will make it possible to pass URLs as configuration targets, and those URLs will be polled every 60 seconds for changes.

There is one exception to the above, which is the built-in `PluginMetadataService` that is provided by the framework and is not possible to override.

### Custom Service Implementations

When overriding services you are not limited to the existing implementations, you can also provide your own custom service factories. This will let you globally override services with completely custom implementations, or build on existing implementations to add additional logic.

To override a service, you provide it in the `services` option just like above, but this time we need to use `createServiceFactory` to create our factory. For example, if you want to replace the default `LoggerService` with your own, it might look like this:

```ts
const backend = createBackend({
  services: [
    createServiceFactory({
      service: coreServices.logger,
      deps: {
        rootLogger: coreServices.rootLogger,
        plugin: coreServices.pluginMetadata,
        config: coreServices.config,
      },
      factory({ rootLogger, plugin, config }) {
        const labels = readCustomLogLabelsForPlugin(config, plugin); // custom logic
        return rootLogger.child(labels);
      },
    }),
  ],
});
```

The `LoggerService` is responsible for creating a specialized logger instance for each plugin, while the `RootLoggerService` is the actual logging implementation. The default implementation of `LoggerService` will decorate the logger with a `plugin` label that contains the plugin ID. Here in our custom implementation we read out additional labels from the configuration and add those as well.

This example touches on the fact that services can have different scopes, being either scoped to individual plugins or the root backend instance. To read more about this, see the [architecture section](../architecture/03-services.md).

## Split Into Multiple Backends

> NOTE: Splitting into multiple backends is an advanced deployment pattern that requires significant effort and there are not yet many built-in tools in the framework to help you out. Only use this if necessary.

A more advanced way to deploy Backstage is to split the backend plugins into multiple different backend deployments. Both the [deployment documentation](../../deployment/scaling.md) and [Threat Model](../../overview/threat-model.md#trust-model) explain the benefits of this, so here we'll focus on how to do it.

To create a separate backend we need to create an additional backend package. This package will be built and deployed separately from your existing backend. There is currently no template to create a backend via `yarn new`, so the quickest way is to copy the new package and modify. The naming is up to you and it depends on how you are splitting things and up. For this example we'll just use a simple suffix. You might end up with a directory structure like this:

```text
packages/
  backend-a/
    src/
      index.ts
    package.json <- "name": "backend-a"
  backend-b/
    src/
      index.ts
    package.json <- "name": "backend-b"
```

You can now trim down the `src/index.ts` files to only include the plugins and modules that you want to be part of that backend. For example, if you want to split out the scaffolder plugin, you might end up with something like this:

```ts
// packages/backend-a/src/index.ts, imports omitted
const backend = createBackend();

backend.add(appPlugin());
backend.add(catalogPlugin());
backend.add(catalogModuleTemplateKind());
backend.start();
```

And `backend-b`, don't forget to clean up dependencies in `package.json` as well:

```ts
// packages/backend-b/src/index.ts, imports omitted
const backend = createBackend();

backend.add(scaffolderPlugin());
backend.start();
```

We've now split the backend into two separate deployments, but we still need to make sure that they can communicate with each other. This is the hard and somewhat tedious part, as Backstage currently doesn't provide an out of the box solution that solves this. You'll need to manually configure the two backends with custom implementations of the `DiscoveryService` and have them return the correct URLs for each other. Likewise, you'll also need to provide a custom implementation of the `DiscoveryApi` in the frontend, unless you surface the two backends via a proxy that handles the routing instead.

### Shared Environments

To make it a bit easier to manage multiple backends, it's possible to create a shared environment that can be used across multiple backends. You would typically house it in a separate package that can be referenced by backends in your monorepo, or published to a package registry for broader use.

A shared environment contains a set of service implementations that should be used across all backends. These services will override the default ones, but if a service is provided directly to the backend, it will override the one in the shared environment.

A shared environment is defined using `createSharedEnvironment`. In this example we place it in a new and separate package called `backend-env`:

```ts
// packages/backend-env/src/index.ts
import { createSharedEnvironment } from '@backstage/backend-plugin-api';
import { customDiscoveryServiceFactory } from './customDiscoveryServiceFactory';

export const env = createSharedEnvironment({
  services: [
    customDiscoveryServiceFactory(), // custom DiscoveryService implementation
  ],
});
```

And passed on to backends using the `env` option:

```ts
// packages/backend-b/src/index.ts, imports omitted
import { env } from '@internal/backend-env';

const backend = createBackend({ env });

backend.add(scaffolderPlugin());
backend.start();
```
