---
id: provider
title: Cloudflare Access Provider
sidebar_label: Cloudflare Access
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
      # You can find the team name in the Cloudflare Zero Trust dashboard.
      teamName: <Team Name>
      # This service tokens section is optional -- you only need it if you have
      # some Cloudflare Service Tokens that you want to be able to log in to your
      # Backstage instance.
      serviceTokens:
        - token: '1uh2fh19efvfh129f1f919u21f2f19jf2.access'
          subject: 'bot-user@your-company.com'
      # This picks what sign in resolver(s) you want to use.
      signIn:
        resolvers:
          - resolver: emailMatchingUserEntityProfileEmail
```

This config section must be in place for the provider to load at all.

The `signIn` section picks what sign-in resolver(s) to use for sign-in attempts.
It is responsible for matching the upstream provider's sign-in result to a
corresponding Backstage identity, or to throw an error if the attempt should be
rejected for any reason. The `emailMatchingUserEntityProfileEmail` is a common
choice: it tries to match the email of the signed-in user to a `User` kind
entity in the catalog whose profile email matches that.

If the builtin sign in resolvers do not match your needs, you can skip the
`signIn` section and instead [provide a custom resolver](#advanced-custom-sign-in-resolver).

## Backend Changes

We need to add the provider package as a dependency to our backend:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-cloudflare-access-provider
```

And to tell the backend to load it:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-auth-backend-module-cloudflare-access-provider'),
);
/* highlight-add-end */
```

Now the backend is ready to serve auth requests on the
`/api/auth/cfaccess/refresh` endpoint. All that's left is to update the frontend
sign-in mechanism to poll that endpoint through Cloudflare Access, on the user's
behalf.

## Frontend Changes

It is recommended to use the `ProxiedSignInPage` for this provider, which is
installed in your app like this:

```tsx title="in packages/app/src/App.tsx"
/* highlight-add-next-line */
import { ProxiedSignInPage } from '@backstage/core-components';

const app = createApp({
  /* highlight-add-start */
  components: {
    SignInPage: props => <ProxiedSignInPage {...props} provider="cfaccess" />,
  },
  /* highlight-add-end */
  // ...
});
```

See [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) for
pointers on how to set up the sign-in page to also work smoothly for local
development.

## Advanced: Custom Sign-in Resolver

If none of the built-in sign in resolvers fit your needs, you need to provide a
customized version of the module. Now you should _not_
`backend.add(import(...))`, instead you will do the following.

```ts title="in packages/backend/plugin/auth.ts"
/* highlight-add-start */
import { createCloudflareAccessAuthenticator } from '@backstage/plugin-auth-backend-module-cloudflare-access-provider';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createProxyAuthProviderFactory,
} from '@backstage/plugin-auth-node';

const customAuth = createBackendModule({
  // This ID must be exactly "auth" because that's the plugin it targets
  pluginId: 'auth',
  // This ID must be unique, but can be anything
  moduleId: 'custom-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        providers: authProvidersExtensionPoint,
        cache: coreServices.cache,
      },
      async init({ providers, cache }) {
        providers.registerProvider({
          // This ID must match the actual provider config, e.g. addressing
          // auth.providers.github means that this must be "github".
          providerId: 'cfaccess',
          // Use createProxyAuthProviderFactory instead if it's one of the proxy
          // based providers rather than an OAuth based one
          factory: createProxyAuthProviderFactory({
            authenticator: createCloudflareAccessAuthenticator({ cache }),
            async signInResolver(info, ctx) {
              // This is where the body of the sign-in resolver goes!
              const { profile } = info;
              if (!profile.email) {
                throw new Error(
                  'Login failed, user profile does not contain an email',
                );
              }
              return ctx.signInWithCatalogUser({
                filter: {
                  'spec.profile.email': profile.email,
                },
              });
            },
          }),
        });
      },
    });
  },
});
/* highlight-add-end */

backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-remove-start */
backend.add(
  import('@backstage/plugin-auth-backend-module-cloudflare-access-provider'),
);
/* highlight-remove-end */
/* highlight-add-next-line */
backend.add(customAuth);
```

The body of the sign-in resolver is up to you to write! The example code above
is just a copy of what `emailMatchingUserEntityProfileEmail` does. The `info`
parameter contains all of the results of the sign-in attempt so far. The `ctx`
context [has several useful functions](https://backstage.io/docs/reference/plugin-auth-node.authresolvercontext/)
for issuing tokens in various ways.
