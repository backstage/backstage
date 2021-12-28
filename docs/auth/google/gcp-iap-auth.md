---
id: provider
title: Google Identity-Aware Proxy Provider
sidebar_label: Google IAP
# prettier-ignore
description: Adding Google Identity-Aware Proxy as an authentication provider in Backstage
---

Backstage allows offloading the responsibility of authenticating users to the
Google HTTPS Load Balancer & [IAP](https://cloud.google.com/iap), leveraging the
authentication support on the latter.

This tutorial shows how to use authentication on an IAP sitting in front of
Backstage.

It is assumed an IAP is already serving traffic in front of a Backstage instance
configured to serve the frontend app from the backend.

## Frontend Changes

Any Backstage app needs a `SignInPage` to be configured. When using IAP Proxy
authentication Backstage will only be loaded once the user has already
successfully authenticated. As such, we won't need to display a sign-in page
visually, however we will need to pick a `SignInPage` implementation which knows
how to silently fetch the IAP-injected token and other information via the
backend.

Update your `createApp` call in `packages/app/src/App.tsx`, to pass in the
proper sign-in page implementation.

```diff
+import { DelegatedSignInPage } from '@backstage/core-components';

 const app = createApp({
   components: {
+    SignInPage: props => <DelegatedSignInPage {...props} provider="gcp-iap" />,
```

## Backend Changes

- Add a `providerFactories` entry to the router in
  `packages/backend/plugin/auth.ts`.

```ts
import { createGcpIapProvider } from '@backstage/plugin-auth-backend';

export default async function createPlugin({
  logger,
  database,
  config,
  discovery,
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    logger,
    config,
    database,
    discovery,
    providerFactories: {
      'gcp-iap': createGcpIapProvider({
        // Replace the auth handler if you want to customize the returned user
        // profile info (can be left out; the default implementation is shown
        // below which only returns the email.
        async authHandler({ iapToken }) {
          return { profile: { email: iapToken.email } };
        },
        signIn: {
          // You need to supply an identity resolver, that takes the profile
          // and the IAP token and produces the Backstage token with the
          // relevant user info.
          async resolver({ profile, result: { iapToken } }, ctx) {
            // Somehow compute the Backstage token claims, just some dummy code
            // shown here, but you may want to query your LDAP server, or
            // GSuite or similar, based on the IAP token sub/email claims
            const id = `user:default/${iapToken.email.split('@')[0]}`;
            const fullEnt = ['group:default/team-name'];
            const token = await ctx.tokenIssuer.issueToken({
              claims: { sub: id, ent: fullEnt },
            });
            return { id, token };
          },
        },
      }),
    },
  });
}
```

## Configuration

Use the following `auth` configuration:

```yaml
auth:
  providers:
    gcp-iap:
      audience:
        '/projects/<project number>/global/backendServices/<backend service id>'
```
