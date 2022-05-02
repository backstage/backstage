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
  environment: development
  providers:
    oauth2proxy: {}
```

Right now no configuration options are supported. To make use of the provider,
make sure that your `oauth2-proxy` is configured correctly and provides a custom
`X-OAUTH2-PROXY-ID-TOKEN` header. To do so, enable the
`--set-authorization-header=true` of your `oauth2-proxy` and forward the
`Authorization` header as `X-OAUTH2-PROXY-ID-TOKEN`. For more details check the
[configuration docs](https://oauth2-proxy.github.io/oauth2-proxy/configuration).

_Example for kubernetes ingress:_

```bash
# forward the authorization header from the auth request in the X-OAUTH2-PROXY-ID-TOKEN header
auth_request_set $name_upstream_authorization $upstream_http_authorization;
proxy_set_header X-OAUTH2-PROXY-ID-TOKEN $name_upstream_authorization;
```

## Adding the provider to the Backstage backend

When using `oauth2proxy` auth you can configure it as described
[here](https://backstage.io/docs/auth/identity-resolver).

- use the following code below to introduce changes to
  `packages/backend/plugin/auth.ts`:

```ts
  providerFactories: {
    oauth2proxy: createOauth2ProxyProvider<{
      id: string;
      email: string;
    }>({
      authHandler: async input => {
        const { email } = input.fullProfile;

        return {
          profile: {
            email,
          },
        };
      },
      signIn: {
        resolver: async (signInInfo, ctx) => {
          const { preferred_username: id } = signInInfo.result.fullProfile;
          const sub = `user:default/${id}`;

          const token = await ctx.tokenIssuer.issueToken({
            claims: { sub, ent: [`group:default/optional-user-group`] },
          });

          return { id, token };
        },
      },
    }),
  }
```

## Adding the provider to the Backstage frontend

It is recommended to use the `ProxiedSignInPage` for this provider, which is
installed in `packages/app/src/App.tsx` like this:

```diff
+import { ProxiedSignInPage } from '@backstage/core-components';

 const app = createApp({
   components: {
+    SignInPage: props => <ProxiedSignInPage {...props} provider="oauth2proxy" />,
```

See the [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) section for more information.
