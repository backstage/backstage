---
id: modules
title: Plugin Modules
sidebar_label: Modules
# prettier-ignore
description: Modules for backend plugins
---

> **DISCLAIMER: The new backend system is in alpha, and still under active development. While we have reviewed the interfaces carefully, they may still be iterated on before the stable release.**

Backend modules are used to extend [plugins](./04-plugins.md) with additional features or change existing behavior. They must always be installed in the same backend instance as the plugin that they extend, and may only extend a single plugin. Modules interact with their target plugin using the [extension points](./05-extension-points.md) registered by the plugin, while also being able to depend on the [services](./03-services.md) of that plugin.

Both modules and plugins register an `init` method that is called during startup. In order to ensure that modules have registered all their extensions before the plugin starts up, all modules for each plugin are completely initialized before the plugin itself is initialized. In practice this means that all promises returned by each `init` method of the modules need to resolve before the plugin `init` method is called. This also means that it is not possible to further interact with the extension points once the `init` method has resolved.

A module depends on the extension points exported by the target plugin's library package, for example `@backstage/plugin-catalog-node`, and does not directly declare a dependency on the plugin package itself. This is to avoid a direct dependency and potentially cause duplicate installations of the plugin package, while duplicate installations of library packages should always be supported.

## A Practical Example

The following is an example on how to create a module that adds a new processor using the `catalogProcessingExtensionPoint`:

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { MyCustomProcessor } from './MyCustomProcessor';

export const catalogModuleExampleCustomProcessor = createBackendModule({
  moduleId: 'exampleCustomProcessor',
  pluginId: 'catalog',
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
```

Notice that we're placing the extension point we want to interact with in the `deps` option, while also depending on the logger service at the same time. When initializing modules we can depend on both extension points and services interchangeably. You can also depend on multiple extension points at once, in case the implementation of the module requires it.

It is typically best to keep modules slim and to each only add a single new feature. It is often the case that it is better to create two separate modules rather than one that provides both features. The one limitation here is that modules can not interact with each other and need to be self contained.
