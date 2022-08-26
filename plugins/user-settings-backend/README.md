# User settings backend

This backend allows to save user specific settings. All requests need to be
authorized, as the user identifier (`userEntityRef`) is resolved using the
authorization token.

## Setup backend

1. Install the backend plugin:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-user-settings-backend
```

1. Configure the routes by adding a new `userSettings.ts` file in
   `packages/backend/src/plugins/`:

```ts
// packages/backend/src/plugins/userSettings.ts
import { IdentityClient } from '@backstage/plugin-auth-node';
import {
  createRouter,
  createUserSettingsStore,
} from '@backstage/plugin-user-settings-backend';
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
    userSettingsStore: await createUserSettingsStore(database),
    identity,
  });
}
```

3. Add the new routes to your backend by modifying the
   `packages/backend/src/index.ts`:

```diff
// packages/backend/src/index.ts
+ import userSettings from './plugins/userSettings';
async function main() {
+ const userSettingsEnv = useHotMemoize(module, () =>
+   createEnv('userSettings'),
+ );
  const apiRouter = Router();
+ apiRouter.use('/user-settings', await userSettings(userSettingsEnv));
}
```

## Setup app

To make use of the user settings backend, replace the `WebStorage` with the
`PersistentStorage` by using the `storageApiRef`.

```diff
// packages/app/src/apis.ts
import {
  AnyApiFactory,
  createApiFactory,
+  discoveryApiRef,
+  fetchApiRef
  errorApiRef,
+  storageApiRef,
} from '@backstage/core-plugin-api';
+ import { PersistentStorage } from '@backstage/core-app-api';

export const apis: AnyApiFactory[] = [
+  createApiFactory({
+    api: storageApiRef,
+    deps: {
+      discoveryApi: discoveryApiRef,
+      errorApi: errorApiRef,
+      fetchApi: fetchApiRef,
+    },
+    factory: ({ discoveryApi, errorApi, fetchApi }) =>
+      PersistentStorage.create({ discoveryApi, errorApi, fetchApi }),
+  }),
];
```

## Development

Use `yarn start` to start the local dev environment. To simplify the access to
the API, the token will automatically be set to `user:default/john_doe`.

You can change the user by setting a custom `Authorization` header. To keep
things simple, the raw `Bearer` value will directly be used as user.

_Example:_

```bash
curl --request GET 'http://localhost:7007/user-settings' --header 'Authorization: Bearer user:default/custom-user'
```
