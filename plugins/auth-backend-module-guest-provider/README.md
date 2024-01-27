# Auth Module: Guest Provider

This module provides a guest auth provider implementation for `@backstage/plugin-auth-backend`. This is meant to supersede the existing `'guest'` option for authentication that does not emit tokens and is completely stored as frontend state.

**NOTE**:

## Installation

### Backend

#### New Backend

```diff
const backend = createBackend();
...

+backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));

...
backend.start();
```

#### Old Backend

This module was also backported for the old backend and can be used like so,

```diff
+import {
+  providers,
+} from '@backstage/plugin-auth-backend';
    ....
  return await createRouter({
    ...
    providerFactories: {
        gitlab: providers.gitlab(),
+       guest: providers.guest(),
        ...
    }
    ...
```

### Frontend

Add the following to your `SignInPage` providers,

```diff
+import {
+  guestAuthApiRef,
+} from '@backstage/core-plugin-api';

const providers = [
+  {
+    id: 'guest-auth-provider',
+    title: 'Guest',
+    message: 'Sign in as a guest',
+    apiRef: guestAuthApiRef,
+  },
   ...
```

### Config

Similar to the other authentication providers, you have to enable the provider in config. Add the following to your `app-config.local.yaml`,

```diff
auth:
    providers:
+       guest:
+           development: {}
```

We need to specify that the provider is enabled for the given environment, and as there are no config values for this provider yet, you can just specify an empty object.

## Links

- [Backstage](https://backstage.io)
- [Repository](https://github.com/backstage/backstage/tree/master/plugins/auth-backend-module-guest-provider)
