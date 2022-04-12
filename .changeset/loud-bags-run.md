---
'@backstage/plugin-auth-backend': patch
---

**DEPRECATION**: All `create<Provider>Provider` and `<provider>*SignInResolver` have been deprecated. Instead, a single `providers` object is exported which contains all built-in auth providers.

If you have a setup that currently looks for example like this:

```ts
import {
  createRouter,
  defaultAuthProviderFactories,
  createGoogleProvider,
  googleEmailSignInResolver,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    ...env,
    providerFactories: {
      ...defaultAuthProviderFactories,
      google: createGoogleProvider({
        signIn: {
          resolver: googleEmailSignInResolver,
        },
      }),
    },
  });
}
```

You would migrate it to something like this:

```ts
import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    ...env,
    providerFactories: {
      ...defaultAuthProviderFactories,
      google: providers.google.create({
        signIn: {
          resolver:
            providers.google.resolvers.emailMatchingUserEntityAnnotation(),
        },
      }),
    },
  });
}
```
