---
'@backstage/plugin-scaffolder-backend-module-github': minor
---

**BREAKING CHANGES**

The `createGithubEnvironmentAction` action no longer requires an `AuthService`, and now accepts a `CatalogService` instead of `CatalogClient`.

Unless you're providing your own override action to the default, this should be a non-breaking change.

You can migrate using the following if you're getting typescript errors:

```ts
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

export const myModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'test',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        catalog: catalogServiceRef,
      },
      async init({ scaffolder, catalog }) {
        scaffolder.addActions(
          createGithubEnvironmentAction({
            catalog,
          }),
        );
      },
    });
  },
});
```
