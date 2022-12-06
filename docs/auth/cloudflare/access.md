---
id: cfaccess
title: Cloudflare Access Provider
sidebar_label: cfaccess
# prettier-ignore
description: Adding Cloudflare Access as an authentication provider in Backstage
---

Similar to GCP IAP Proxy Provider or AWS ALB provider, developers can offload authentication
support to Cloudflare Access.

This tutorial shows how to use authentication on Cloudflare Access sitting in
front of Backstage.

It is assumed a Cloudflare tunnel is already serving traffic in front of a
Backstage instance configured to serve the frontend app from the backend and is
already gated using Cloudflare Access.

## Configuration

Let's start by adding the following `auth` configuration in your
`app-config.yaml` or `app-config.production.yaml` or similar:

```yaml
auth:
  providers:
    cfaccess:
      teamName: <Team Name>
```

You can find the team name in the Cloudflare Zero Trust dashboard.

This config section must be in place for the provider to load at all. Now let's
add the provider itself.

## Backend Changes

Add a `providerFactories` entry to the router in
`packages/backend/plugin/auth.ts`.

```ts
import { providers } from '@backstage/plugin-auth-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    providerFactories: {
      'cfaccess': providers.cfAccess.create({
        // Replace the auth handler if you want to customize the returned user
        // profile info (can be left out; the default implementation is shown
        // below which only returns the email). You may want to amend this code
        // with something that loads additional user profile data out.
        async authHandler({ accessToken }) {
          return { profile: { email: accessToken.email } };
        },
        signIn: {
          // You need to supply an identity resolver, that takes the profile
          // and the access token and produces the Backstage token with the
          // relevant user info.
          async resolver({ profile, result }, ctx) {
            // Somehow compute the Backstage token claims. Just some sample code
            // shown here, but you may want to query your LDAP server, or
            // https://<teamName>.cloudflareaccess.com/cdn-cgi/access/get-identity
            // https://developers.cloudflare.com/cloudflare-one/identity/users/validating-json/#groups-within-a-jwt
            const id = profile.email.split('@')[0];
            const sub = stringifyEntityRef({ kind: 'User', name: id });
            const ent = [sub, stringifyEntityRef({ kind: 'Group', name: 'team-name' });
            return ctx.issueToken({ claims: { sub, ent } });
          },
        },
      }),
    },
  });
}
```

Now the backend is ready to serve auth requests on the
`/api/auth/cfaccess/refresh` endpoint. All that's left is to update the
frontend sign-in mechanism to poll that endpoint through Cloudflare Access, on
the user's behalf.

## Adding the provider to the Backstage frontend

It is recommended to use the `ProxiedSignInPage` for this provider, which is
installed in `packages/app/src/App.tsx` like this:

```diff
+import { ProxiedSignInPage } from '@backstage/core-components';

 const app = createApp({
   components: {
+    SignInPage: props => <ProxiedSignInPage {...props} provider="cfaccess" />,
```

See [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) for pointers on how to set up the sign-in page to also work smoothly for local development.
