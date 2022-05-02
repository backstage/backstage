---
id: provider
title: OAuth 2 Proxy Provider
sidebar_label: OAuth 2 Custom Proxy
description: Adding OAuth2Proxy as an authentication provider in Backstage
---

The Backstage `@backstage/plugin-auth-backend` package comes with an
`oauth2proxy` authentication provider that can authenticate users by using a
[oauth2-proxy](https://github.com/oauth2-proxy/oauth2-proxy) in front of an
actual Backstage instance. This enables to reuse existing authentications within
a cluster. In general the `oauth2-proxy` supports all OpenID Connect providers,
for more details check this
[list of supported providers](https://oauth2-proxy.github.io/oauth2-proxy/docs/configuration/oauth_provider).

## Configuration

The provider configuration can be added to your `app-config.yaml` under the root
`auth` configuration:

```yaml
auth:
  providers:
    oauth2proxy: {}
```

Right now no configuration options are supported, but the empty object is needed
to enable the provider in the auth backend.

To use the `oauth2proxy` provider you must also configure it with a sign-in resolver.
For more information about the sign-in process in general, see the
[Sign-in Identities and Resolvers](../identity-resolver.md) documentation.

For the `oauth2proxy` provider, the sign-in result is quite different than other providers.
Because it's a proxy provider that can be configured to forward information through
arbitrary headers, the auth result simply just gives you access to the HTTP headers
of the incoming request. Using these you can either extract the information directly,
or grab ID or access tokens to look up additional information and/or validate the request.

A simple sign-in resolver might for example look like this:

```ts
providers.oauth2Proxy.create({
  signIn: {
    async resolver({ result }, ctx) {
      const name = result.getHeader('x-forwarded-user');
      if (!name) {
        throw new Error('Request did not contain a user')
      }
      return ctx.signInWithCatalogUser({
        entityRef: { name },
      });
    },
  },
}),
```

## Adding the provider to the Backstage frontend

All Backstage apps need a `SignInPage` to be configured. Its purpose is to
establish who the user is and what their identifying credentials are, blocking
rendering the rest of the UI until that's complete, and then keeping those
credentials fresh.

When using the OAuth2-Proxy, the Backstage UI can only be accessed after the
user has already been authenticated at the proxy. Instead of showing the user
another login page when accessing Backstage, it will handle the login in the
background. Backstage provides for this case the `ProxiedSignInPage` component
which has no UI.

Update your `createApp` call in `packages/app/src/App.tsx`, as follows.

```diff
+import { ProxiedSignInPage } from '@backstage/core-components';
 const app = createApp({
   components: {
+    SignInPage: props => <ProxiedSignInPage {...props} provider="oauth2proxy" />,
```

After this, your app should be ready to leverage the OAuth2-Proxy for
authentication!
