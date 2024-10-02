---
id: index
title: Building Backend Plugins and Modules
sidebar_label: Overview
# prettier-ignore
description: Building backend plugins and modules using the new backend system
---

:::note Note

If you have an existing backend and/or backend plugins that are not yet
using the new backend system, see [migrating](./08-migrating.md).

:::

This section covers how to build your own backend [plugins](../architecture/04-plugins.md) and
[modules](../architecture/06-modules.md). They are sometimes collectively referred to as
backend _features_, and are the building blocks that adopters add to their
[backends](../architecture/02-backends.md).

## Creating a new Plugin

This guide assumes that you already have a Backend project set up. Even if you only want to develop a single plugin for publishing, we still recommend that you do so in a standard Backstage monorepo project, as you often end up needing multiple packages. For instructions on how to set up a new project, see our [getting started](../../getting-started/index.md#prerequisites) documentation.

To create a Backend plugin, run `yarn new`, select `backend-plugin`, and fill out the rest of the prompts. This will create a new package at `plugins/<pluginId>-backend`, which will be the main entrypoint for your plugin.

## Plugins

A basic backend plugin might look as follows:

```ts
// src/plugin.ts
import {
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import { createExampleRouter } from './router';

export const examplePlugin = createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        // Declare dependencies to services that you want to consume
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
      },
      async init({
        // Requested service instances get injected as per above
        logger,
        httpRouter,
      }) {
        // Perform your initialization and access the services as needed
        const example = createExampleRouter(logger);
        logger.info('Hello from example plugin');
        httpRouter.use(example);
      },
    });
  },
});

// src/index.ts
export { examplePlugin as default } from './plugin';
```

When you depend on `plugin` scoped services, you'll receive an instance of them
that's specific to your plugin. In the example above, the logger might tag
messages with your plugin ID, and the HTTP router might prefix API routes with
your plugin ID, depending on the implementation used.

See [the article on naming patterns](../architecture/08-naming-patterns.md) for
details on how to best choose names/IDs for plugins and related backend system
items.

## Modules

Backend modules are used to extend [plugins](../architecture/04-plugins.md) or other modules with
additional features or change existing behavior. They must always be installed
in the same backend instance as the plugin or module that they extend, and may only extend a single plugin and modules from that plugin at a time.
Modules interact with their target plugin or module using the [extension points](../architecture/05-extension-points.md) registered by the plugin, while also being
able to depend on the [services](../architecture/03-services.md) of the target plugin.
That last point is worth reiterating: injected `plugin` scoped services will be
the exact
same ones as the target plugin will receive later, i.e. they will be scoped
using the target `pluginId` of the module.

A module depends on the extension points exported by the target plugin's library
package, for example `@backstage/plugin-catalog-node`, and does not directly
declare a dependency on the plugin package itself. This is to avoid a direct
dependency and potentially cause duplicate installations of the plugin package,
while duplicate installations of library packages should always be supported.
Modules with extension points typically export their extension points from the same
package however, since the extension points are generally only intended for internal
customizations where package versions can be kept in sync.

To create a Backend module, run `yarn new`, select `backend-module`, and fill out the rest of the prompts. This will create a new package at `plugins/<pluginId>-backend-module-<moduleId>`.

The following is an example of how to create a module that adds a new processor
using the `catalogProcessingExtensionPoint`:

```ts
// src/module.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { MyCustomProcessor } from './MyCustomProcessor';

export const catalogModuleExampleCustomProcessor = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'example-custom-processor',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        logger: coreServices.logger,
      },
      async init({ catalog }) {
        catalog.addProcessor(new MyCustomProcessor(logger));
      },
    });
  },
});

// src/index.ts
export { catalogModuleExampleCustomProcessor as default } from './module';
```

See [the article on naming patterns](../architecture/08-naming-patterns.md) for
details on how to best choose names/IDs for modules and related backend system
items.

Notice that we're placing the extension point we want to interact with in the
`deps` option, while also depending on the logger service at the same time. When
initializing modules we can depend on both extension points and services
interchangeably. You can also depend on multiple extension points at once, in
case the implementation of the module requires it.

Each module package should only contain a single module, but this module may
extend multiple extension points. A module may also use configuration to
conditionally enable or disable certain extensions. This pattern should only be
used for extensions that are related to each other, otherwise it is best to
create a separate module package with its own module.

### HTTP Handlers

Since modules have access to the same services as the plugin they extend, they
are also able to register their own HTTP handlers. For more information about
the HTTP service, see [core services](../core-services/01-index.md). When
registering HTTP handlers, it is important to try to avoid any future conflict
with the plugin itself, or other modules. A recommended naming pattern is to
register the handlers under the `/modules/<module-id>` path, where `<module-id>`
is the kebab-case ID of the module, for example
`/modules/example-custom-processor/v1/validators`. In a standard backend setup
the full path would then be
`<backendUrl>/api/catalog/modules/example-custom-processor/v1/validators`.

### Database Access

The same applies for modules that perform their own migrations and interact with
the database. They will run on the same logical database instance as the target
plugin, so care must be taken to choose table names that do not risk colliding
with those of the plugin. A recommended naming pattern is `<package
name>__<table name>`, for example the scheduler core service creates tables named `backstage_backend_tasks__<table>`, because it used to be the case that the service lived in a package named `@backstage/backend-tasks`. Things have since moved around a bit, but the effects of the rule are still visible. If you use the default [`Knex` migration facilities](https://knexjs.org/guide/migrations.html), you will also
want to make sure that it uses similarly prefixed migration state tables for its
internal bookkeeping needs, so they do not collide with the main ones used by
the plugin itself. You can do this as follows:

```ts
await knex.migrate.latest({
  directory: migrationsDir,
  tableName: 'backstage_backend_tasks__knex_migrations',
});
```

## Customization

There are several ways of configuring and customizing plugins and modules.

### Extension Points

Whenever you want to allow modules to configure your plugin dynamically, for
example in the way that the catalog backend lets catalog modules inject
additional entity providers, you can use the extension points mechanism. This is
described in detail with code examples in [the extension points architecture article](../architecture/05-extension-points.md), while the following is a more
slim example of how to implement an extension point for a plugin:

```ts
import { createExtensionPoint } from '@backstage/backend-plugin-api';

// This is the extension point interface, which is how modules interact with your plugin.
export interface ExamplesExtensionPoint {
  addExample(example: Example): void;
}

// This is the extension point reference that encapsulates the above interface.
export const examplesExtensionPoint =
  createExtensionPoint<ExamplesExtensionPoint>({
    id: 'example.examples',
  });

// The following shows how your plugin would register the extension point
// and use the features that other modules have registered.
export const examplePlugin = createBackendPlugin({
  pluginId: 'example',
  register(env) {
    // We can share data between the extension point implementation and our init method.
    const examples = new Array<Example>();

    // This registers the implementation of the extension point, which is internal to your plugin.
    env.registerExtensionPoint(examplesExtensionPoint, {
      addExample(example) {
        examples.push(example);
      },
    });

    env.registerInit({
      deps: { logger: coreServices.logger },
      async init({ logger }) {
        // We can access `examples` directly
        logger.info(`The following examples have been registered: ${examples}`);
      },
    });
  },
});
```

This is a very common type of extension point, one where modules are given the opportunity to register features to be used by the plugin. In this case modules are able to register examples that are then used by our examples plugin.

### Configuration

Your plugin or module can leverage the app configuration to configure its own
internal behavior. You do this by adding a dependency on `coreServices.rootConfig`
and reading from that. This pattern is a good fit especially for customization
that needs to be different across environments.

```ts
import { coreServices } from '@backstage/backend-plugin-api';

export const examplePlugin = createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: { config: coreServices.rootConfig },
      async init({ config }) {
        // Here you can read from the current config as you see fit, e.g.:
        const value = config.getOptionalString('example.value');
      },
    });
  },
});
```

Before adding custom configuration options, make sure to read [the configuration docs](../../conf/index.md), in particular the section on [defining configuration for your own plugins](../../conf/defining.md) which explains how to establish a
configuration schema for your specific plugin.
