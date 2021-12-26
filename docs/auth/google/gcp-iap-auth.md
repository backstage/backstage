---
id: provider
title: Google Identity-Aware Proxy Provider
sidebar_label: Google IAP
# prettier-ignore
description: Adding Google Identity-Aware Proxy as an authentication provider in Backstage
---

# Using Google Identity-Aware Proxy to authenticate requests

Backstage allows offloading the responsibility of authenticating users to the
Google HTTPS Load Balancer & [IAP](https://cloud.google.com/iap), leveraging the
authentication support on the latter.

This tutorial shows how to use authentication on an IAP sitting in front of
Backstage.

It is assumed an IAP is already serving traffic in front of a Backstage instance
configured to serve the frontend app from the backend.

## Frontend Changes

The Backstage app needs a `SignInPage` to be configured. When using IAP Proxy
authentication Backstage will only be loaded once the user has successfully
authenticated; we won't need to display a sign-in page as such, however we will
need to create a dummy `SignInPage` component that can fetch the token and other
information from the backend.

Create a sign-in page component in your app, for example in
`packages/app/src/components/SignInPage.tsx`.

```tsx
import { GcpIapIdentity } from '@backstage/core-app-api';
import { ErrorPanel, Progress } from '@backstage/core-components';
import {
  discoveryApiRef,
  fetchApiRef,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import React from 'react';
import { useAsync } from 'react-use';

export const GcpIapSignInPage = (props: SignInPageProps) => {
  const discovery = useApi(discoveryApiRef);
  const { fetch } = useApi(fetchApiRef);

  const { loading, error } = useAsync(async () => {
    const base = await discovery.getBaseUrl('auth');
    const response = await fetch(`${base}/gcp-iap/refresh`, {
      headers: { 'x-requested-with': 'XMLHttpRequest' },
      credentials: 'include',
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    props.onSignInSuccess(GcpIapIdentity.fromResponse(await response.json()));
  }, []);

  if (loading) return <Progress />;
  if (error) return <ErrorPanel error={error} />;
  return null;
};
```

Pass this sign in page to your `createApp` function, in
`packages/app/src/App.tsx`.

```diff
+import { GcpIapSignInPage } from './components/SignInPage';

 const app = createApp({
   components: {
+    SignInPage: GcpIapSignInPage
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
        // profile info (can be left out; default implementation shown below
        // which only returns the email.
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
