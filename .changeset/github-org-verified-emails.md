---
'@backstage/plugin-catalog-backend-module-github': minor
---

The default user transformer now prefers organization verified domain emails over the user's public GitHub email when populating the user entity profile. It also strips plus-addressed routing tags that GitHub adds to these emails.

If you want to retain the old behavior, you can do so with a custom user transformer using the `githubOrgEntityProviderTransformsExtensionPoint`:

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { githubOrgEntityProviderTransformsExtensionPoint } from '@backstage/plugin-catalog-backend-module-github-org';
import { defaultUserTransformer } from '@backstage/plugin-catalog-backend-module-github';

export default createBackendModule({
  pluginId: 'catalog',
  moduleId: 'github-org-custom-transforms',
  register(env) {
    env.registerInit({
      deps: {
        transforms: githubOrgEntityProviderTransformsExtensionPoint,
      },
      async init({ transforms }) {
        transforms.setUserTransformer(async (item, ctx) => {
          const entity = await defaultUserTransformer(item, ctx);
          if (entity && item.email) {
            entity.spec.profile!.email = item.email;
          }
          return entity;
        });
      },
    });
  },
});
```
