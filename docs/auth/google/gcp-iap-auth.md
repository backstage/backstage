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

## Configuration

Let's start by adding the following `auth` configuration in your
`app-config.yaml` or `app-config.production.yaml` or similar:

```yaml
auth:
  providers:
    gcp-iap:
      audience: '/projects/<project number>/global/backendServices/<backend service id>'
```

You can find the project number and service ID in the Google Cloud Console.

This config section must be in place for the provider to load at all. Now let's
add the provider itself.

## Backend Changes

This provider is not enabled by default in the auth backend code, because
besides the config section above, it also needs to be given one or more
callbacks in actual code as well as described below.

Add a `providerFactories` entry to the router in
`packages/backend/plugin/auth.ts`.

```ts
import { createGcpIapProvider } from '@backstage/plugin-auth-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    providerFactories: {
      'gcp-iap': createGcpIapProvider({
        // Replace the auth handler if you want to customize the returned user
        // profile info (can be left out; the default implementation is shown
        // below which only returns the email). You may want to amend this code
        // with something that loads additional user profile data out of e.g.
        // GSuite or LDAP or similar.
        async authHandler({ iapToken }) {
          return { profile: { email: iapToken.email } };
        },
        signIn: {
          // You need to supply an identity resolver, that takes the profile
          // and the IAP token and produces the Backstage token with the
          // relevant user info.
          async resolver({ profile, result: { iapToken } }, ctx) {
            // Somehow compute the Backstage token claims. Just some dummy code
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

Now the backend is ready to serve auth requests on the
`/api/auth/gcp-iap/refresh` endpoint. All that's left is to update the frontend
sign-in mechanism to poll that endpoint through the IAP, on the user's behalf.

## Frontend Changes

All Backstage apps need a `SignInPage` to be configured. Its purpose is to
establish who the user is and what their identifying credentials are, blocking
rendering the rest of the UI until that's complete, and then keeping those
credentials fresh.

When using IAP Proxy authentication, the Backstage UI will only be loaded once
the user has already successfully completely authenticated themselves with the
IAP and has an active session, so we don't want to make the user have to go
through a _second_ layer of authentication flows after that.

As such, we want to not display a sign-in page visually at all. Instead, we will
pick a `SignInPage` implementation component which knows how to silently make
requests to the backend provider we configured above, and just trusting its
output to properly represent the current user. Luckily, Backstage comes with a
component for this purpose out of the box.

Update your `createApp` call in `packages/app/src/App.tsx`, as follows.

```diff
+import { ProxiedSignInPage } from '@backstage/core-components';

 const app = createApp({
   components: {
+    SignInPage: props => <ProxiedSignInPage {...props} provider="gcp-iap" />,
```

After this, your app should be ready to leverage the Identity-Aware Proxy for
authentication!
