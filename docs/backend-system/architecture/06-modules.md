---
id: modules
title: Plugin Modules
sidebar_label: Modules
# prettier-ignore
description: Modules for backend plugins
---

## Creating Modules

Some facts about modules

- A Module is able to extend a plugin with additional functionality using the `ExtensionPoint`s registered by the plugin.
- A module can only extend one plugin but can interact with multiple `ExtensionPoint`s registered by that plugin.
- A module is always initialized before the plugin it extends.

A module depends on the `ExtensionPoint`s exported by the target plugin's library package, for example `@backstage/plugin-catalog-node`, and does not directly declare a dependency on the plugin package itself.

Here's an example on how to create a module that adds a new processor using the `catalogProcessingExtensionPoint`:

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { MyCustomProcessor } from './processor';

export const exampleCustomProcessorCatalogModule = createBackendModule({
  moduleId: 'exampleCustomProcessor',
  pluginId: 'catalog',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addProcessor(new MyCustomProcessor());
      },
    });
  },
});
```
