---
'@backstage/backend-dynamic-feature-service': patch
---

Deprecate the `dynamicPluginsServiceRef`, `dynamicPluginsServiceFactory` and `dynamicPluginsServiceFactoryWithOptions` in favor of using the `dynamicPluginsFeatureDiscoveryLoader` to discover dynamic features in a new backend system.

See usage examples below:

Example using the `dynamicPluginsFeatureDiscoveryLoader` loader in a backend instance:

```ts
import { createBackend } from '@backstage/backend-defaults';
import { dynamicPluginsFeatureDiscoveryLoader } from '@backstage/backend-dynamic-feature-service';
//...

const backend = createBackend();
backend.add(dynamicPluginsFeatureDiscoveryLoader);
//...
backend.start();
```

Passing options to the `dynamicPluginsFeatureDiscoveryLoader` loader in a backend instance:

```ts
import { createBackend } from '@backstage/backend-defaults';
import { dynamicPluginsFeatureDiscoveryLoader } from '@backstage/backend-dynamic-feature-service';
import { myCustomModuleLoader } from './myCustomModuleLoader';
//...

const backend = createBackend();
backend.add(
  dynamicPluginsFeatureDiscoveryLoader({
    moduleLoader: myCustomModuleLoader,
  }),
);
//...
backend.start();
```
