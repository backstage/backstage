# User settings backend

This backend allows to save user specific settings. All requests need to be
authorized, as the user identifier (`userEntityRef`) is resolved using the
authorization token.

## Setup backend

Install the backend plugin

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-user-settings-backend @backstage/plugin-signals-backend
```

Add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
backend.add(import('@backstage/plugin-user-settings-backend'));
// The signals backend is technically optional but enables real-time update of user
// settings across different sessions
backend.add(import('@backstage/plugin-signals-backend'));
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
+import { signalApiRef } from '@backstage/plugin-signals-react';

 export const apis: AnyApiFactory[] = [
+  createApiFactory({
+    api: storageApiRef,
+    deps: {
+      discoveryApi: discoveryApiRef,
+      errorApi: errorApiRef,
+      fetchApi: fetchApiRef,
+      identityApi: identityApiRef,
+      signalApi: signalApiRef, // Optional
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
