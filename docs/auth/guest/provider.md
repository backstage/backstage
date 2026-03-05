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

```sh title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-guest-provider
```

Then, add it to your backend's source,

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

backend.add(import('@backstage/plugin-auth-backend'));
// highlight-add-next-line
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));

await backend.start();
```

### Frontend

Add the following to your `SignInPage` providers,

```ts
const providers = [
  // highlight-add-next-line
  'guest',
  ...
]
```

### Config

Similar to the other authentication providers, you have to enable the provider in config. Add the following to your `app-config.local.yaml`,

```yaml title="app-config.local.yaml"
auth:
  providers:
    # highlight-add-next-line
    guest: {}
```

The above is all you need to get working with the guest provider. However, you can also add additional configuration if you need to such as the following:

```yaml title="app-config.local.yaml"
auth:
  providers:
    guest:
      userEntityRef: user:default/john-smith
      ownershipEntityRefs: [group:default/smith-family]
      dangerouslyAllowOutsideDevelopment: false
```

The `userEntityRef` is used as the entity reference for the guest user and the `ownershipEntityRefs` is a list of entity references to use for ownership of the guest user, if the user is not found in the catalog.

The `dangerouslyAllowOutsideDevelopment` flag is used to allow users to sign in with the guest provider outside of their development environments, e.g. in production.

You can find this information by looking at the config file [here](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-guest-provider/config.d.ts).
