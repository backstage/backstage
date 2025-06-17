---
'@backstage/backend-plugin-api': minor
---

Added `actionsRegistry` and `actions` experimental services to `/alpha` to allow registration of distributed actions from plugins, and the ability to invoke these actions. You can use these services by including them like the following:

```ts
import {
  actionsRegistryServiceRef,
  actionsServiceRef,
} from '@backstage/backend-plugin-api/alpha';

createBackendPlugin({
  pluginId: 'test-plugin',
  register({ registerInit }) {
    registerInit({
      deps: {
        actions: actionsServiceRef,
        actionsRegistry: actionsRegistryServiceRef,
      },
      async init({ actions, actionsRegistry }) {
        actionsRegistry.register({
          ...,
        });

        await actions.invoke(...);
      },
    });
  },
});
```
