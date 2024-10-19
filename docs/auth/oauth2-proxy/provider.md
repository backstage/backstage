---
id: provider
title: OAuth 2 Proxy Provider
sidebar_label: OAuth 2 Custom Proxy
description: Adding OAuth2Proxy as an authentication provider in Backstage
---

The Backstage `@backstage/plugin-auth-backend` package comes with an
`oauth2Proxy` authentication provider that can authenticate users by using a
[oauth2-proxy](https://github.com/oauth2-proxy/oauth2-proxy) in front of an
actual Backstage instance. This enables to reuse existing authentications within
a cluster. In general the `oauth2-proxy` supports all OpenID Connect providers,
for more details check this
[list of supported providers](https://oauth2-proxy.github.io/oauth2-proxy/docs/configuration/oauth_provider).

:::note Note

OAuth2 Proxy does not provide a way to authenticate requests, you must instead ensure that your Backstage instance is only accessible through the OAuth2 Proxy. If you need more strict validation, consider using a different provider.

:::

## Configuration

The provider configuration can be added to your `app-config.yaml` under the root
`auth` configuration:

```yaml title="app-config.yaml"
auth:
  environment: development
  providers:
    oauth2Proxy:
      signIn:
        resolvers:
          # See https://backstage.io/docs/auth/oauth2-proxy/provider#resolvers for more resolvers
          - resolver: forwardedUserMatchingUserEntityName
```

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found it will throw a `NotFoundError`.
- `forwardedUserMatchingUserEntityName`: Matches the value in the `x-forwarded-user` header from the auth provider with the User entity that has a matching `name`. If no match is found it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order, but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs you can build a custom resolver, this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-oauth2-proxy-provider
```

Then we will need to this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-auth-backend-module-oauth2-proxy-provider'),
);
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

See [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) for pointers on how to set up the sign-in page, and to also make it work smoothly for local development. You'll use `oauth2Proxy` as the provider name.

If you [provide a custom sign in resolver](https://backstage.io/docs/auth/identity-resolver#building-custom-resolvers), you can skip the `signIn` block entirely.
