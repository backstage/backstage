---
id: provider
title: Guest Authentication Provider
sidebar_label: Guest
description: Adding a guest authentication provider in Backstage
---

Audience: Admins or developers

## Summary

The goal of this guide is to get you set up with a guest authentication provider that emits tokens. This is different than the old guest authentication that is purely stored on the frontend and does not have tokens. The main reason you'd want to use this provider is to use permissioned plugins.

:::caution
This provider should only ever be enabled for `development`. To prevent unauthorized access to your data, this package is _explicitly_ disabled for non-development environments.
:::

## Installation

### Backend

:::note
This will only work with the new backend system. There is no support for this in the old backend.
:::

Add the `@backstage/plugin-auth-backend-module-guest-provider` to your backend installation.

```
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-guest-provider
```

Then, add it to your backend's `index.ts` file,

```diff
const backend = createBackend();

backend.add('@backstage/plugin-auth-backend');
+backend.add('@backstage/plugin-auth-backend-module-guest-provider');

await backend.start();
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
+           development:
                // new optional property to override the default value.
+               loginAs: user:default/guest
```

We need to specify that the provider is enabled for the given environment, and as there are no config values for this provider yet, you can just specify an empty object.
