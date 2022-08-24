# Starred Entities Backend

A backend to persist the starred entities in the database.

The starred entities are stored by default in the `LocalStorage` of the browser
using the `DefaultStarredEntitiesApi`.
That means that the users information are kept private in the browser itself,
but it's not possible to switch the browser / machine without loosing the
starred entities.

To persist the starred entities in the database, use the
`BackendStarredEntitiesApi` and the
`@backstage/plugin-catalog-starred-entities-backend`.

## Setup backend

1. Install the backend plugin:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-starred-entities-backend
```

2. Configure the routes by adding a new `starredEntities.ts` file in
   `packages/backend/src/plugins/`:

```ts
// packages/backend/src/plugins/starredEntities.ts

import {
  IdentityClient,
  getBearerTokenFromAuthorizationHeader,
} from '@backstage/plugin-auth-node';
import {
  createRouter,
  createStarredEntitiesStore,
} from '@backstage/plugin-catalog-starred-entities-backend';
import { Router } from 'express';

import { PluginEnvironment } from '../types';

export default async function createPlugin({
  database,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const identity = IdentityClient.create({
    discovery,
    issuer: await discovery.getExternalBaseUrl('auth'),
  });

  return await createRouter({
    starredEntitiesStore: await createStarredEntitiesStore(database),
    getUserIdFromRequest: async req => {
      try {
        // extract the user id from the token, used for storing the data
        const token = getBearerTokenFromAuthorizationHeader(
          req.headers.authorization,
        );
        const {
          identity: { userEntityRef: id },
        } = await identity.authenticate(token);

        return id;
      } catch {
        // use fallback to allow guests to set starred entities
        return 'guest';
      }
    },
  });
}
```

3. Add the new routes to your backend by modifying the
   `packages/backend/src/index.ts`:

```diff
// packages/backend/src/index.ts

+import starredEntities from './plugins/starredEntities';

async function main() {
+ const starredEntitiesEnv = useHotMemoize(module, () =>
+   createEnv('starredEntities'),
+ );

  const apiRouter = Router();

+ apiRouter.use('/starred-entities', await starredEntities(starredEntitiesEnv));
}
```

## Setup app

To make use of the starred entities backend, replace the
`DefaultStarredEntitiesApi` with the `BackendStarredEntitiesApi` by using the
`starredEntitiesApiRef`.

```diff
// packages/app/src/api.ts
import {
  AnyApiFactory,
  createApiFactory,
  discoveryApiRef,
  errorApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
+ import { starredEntitiesApiRef } from '@backstage/plugin-catalog-react';
+ import { BackendStarredEntitiesApi } from '@backstage/plugin-catalog';

export const apis: AnyApiFactory[] = [
+  createApiFactory({
+    api: starredEntitiesApiRef,
+    deps: {
+      storageApi: storageApiRef,
+      discoveryApi: discoveryApiRef,
+      errorApi: errorApiRef,
+      identityApi: identityApiRef,
+    },
+    factory: ({ storageApi, discoveryApi, errorApi, identityApi }) =>
+      new BackendStarredEntitiesApi({
+        storageApi,
+        discoveryApi,
+        errorApi,
+        identityApi,
+      }),
+  }),
];
```
