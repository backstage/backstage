---
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-catalog-node': minor
---

Adds support for supplying field validators to the new backend's catalog plugin. If you're using entity policies, you should use the new `transformLegacyPolicyToProcessor` function to install them as processors instead.

```ts
import {
  catalogProcessingExtensionPoint,
  catalogModelExtensionPoint,
} from '@backstage/plugin-catalog-node/alpha';
import {myPolicy} from './my-policy';

export const catalogModulePolicyProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'internal-policy-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        modelExtensions: catalogModelExtensionPoint,
        processingExtensions: catalogProcessingExtensionPoint,
      },
      async init({ modelExtensions, processingExtensions }) {
        modelExtensions.setFieldValidators({
          ...
        });
        processingExtensions.addProcessors(transformLegacyPolicyToProcessor(myPolicy))
      },
    });
  },
});
```
