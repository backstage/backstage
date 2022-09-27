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
import { createRouter } from '@backstage/plugin-user-settings-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin(env: PluginEnvironment) {
  return await createRouter({
    database: env.database,
    identity: env.identity,
  });
}
```

3. Add the new routes to your backend by modifying `packages/backend/src/index.ts`:

```diff
 // packages/backend/src/index.ts
+import userSettings from './plugins/userSettings';
 async function main() {
+  const userSettingsEnv = useHotMemoize(module, () => createEnv('user-settings'));
   const apiRouter = Router();
+  apiRouter.use('/user-settings', await userSettings(userSettingsEnv));
}
```

## Setup app

To make use of the user settings backend, replace the `WebStorage` with the
`UserSettingsStorage` by using the `storageApiRef`.

```diff
 // packages/app/src/apis.ts
 import {
   AnyApiFactory,
   createApiFactory,
+  discoveryApiRef,
+  fetchApiRef,
   errorApiRef,
+  identityApiRef,
+  storageApiRef,
 } from '@backstage/core-plugin-api';
+import { UserSettingsStorage } from '@backstage/plugin-user-settings';

 export const apis: AnyApiFactory[] = [
+  createApiFactory({
+    api: storageApiRef,
+    deps: {
+      discoveryApi: discoveryApiRef,
+      errorApi: errorApiRef,
+      fetchApi: fetchApiRef,
+      identityApi: identityApiRef
+    },
+    factory: deps => UserSettingsStorage.create(deps),
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
