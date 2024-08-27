---
'@backstage/backend-defaults': patch
---

Exports the `discoveryFeatureLoader` as a replacement for the deprecated `featureDiscoveryService`.
The `discoveryFeatureLoader` is a new backend system [feature loader](https://backstage.io/docs/backend-system/architecture/feature-loaders/) that discovers backend features from the current `package.json` and its dependencies.
Here is an example using the `discoveryFeatureLoader` loader in a new backend instance:

```ts
import { createBackend } from '@backstage/backend-defaults';
import { discoveryFeatureLoader } from '@backstage/backend-defaults';
//...

const backend = createBackend();
//...
backend.add(discoveryFeatureLoader);
//...
backend.start();
```
