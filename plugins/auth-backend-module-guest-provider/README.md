# Auth Module: Guest Provider

This module provides a guest auth provider implementation for `@backstage/plugin-auth-backend`. This is meant to supersede the existing `'guest'` option for authentication that does not emit tokens and is completely stored as frontend state.

**NOTE**: This provider should only ever be enabled for `development`. This package is explicitly disabled for non-development environments.

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

### Frontend

Add the following to your `SignInPage` providers,

```diff
const providers = [
+  'guest',
   ...
]
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
