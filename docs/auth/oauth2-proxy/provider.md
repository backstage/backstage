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

## Configuration

The provider configuration can be added to your `app-config.yaml` under the root
`auth` configuration:

```yaml
auth:
  providers:
    oauth2Proxy: {}
```

Right now no configuration options are supported, but the empty object is needed
to enable the provider in the auth backend.

To use the `oauth2Proxy` provider you must also configure it with a sign-in resolver.
For more information about the sign-in process in general, see the
[Sign-in Identities and Resolvers](../identity-resolver.md) documentation.

For the `oauth2Proxy` provider, the sign-in result is quite different than other providers.
Because it's a proxy provider that can be configured to forward information through
arbitrary headers, the auth result simply just gives you access to the HTTP headers
of the incoming request. Using these you can either extract the information directly,
or grab ID or access tokens to look up additional information and/or validate the request.

A simple sign-in resolver might for example look like this:

```ts
providerFactories: {
  ...defaultAuthProviderFactories,
  oauth2Proxy: providers.oauth2Proxy.create({
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
},
```

## Adding the provider to the Backstage frontend

It is recommended to use the `ProxiedSignInPage` for this provider, which is
installed in `packages/app/src/App.tsx` like this:

```diff
+import { ProxiedSignInPage } from '@backstage/core-components';

 const app = createApp({
   components: {
+    SignInPage: props => <ProxiedSignInPage {...props} provider="oauth2Proxy" />,
```

See [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) for pointers on how to set up the sign-in page to also work smoothly for local development.
