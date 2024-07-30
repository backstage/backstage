---
id: oidc-proxy-auth
title: OIDC Proxy Provider
sidebar_label: OIDC Proxy
# prettier-ignore
description: Using an OIDC ID token from a request header as an authentication provider in Backstage
---

This tutorial shows how to authenticate and sign in users who access Backstage with an oidc id token already present in the incoming http request from their browser.

Backstage allows offloading the responsibility of authenticating users to a service mesh. The `oidcProxy` provider is developed and intended for use with the [Holos](https://openinfrastructure.co/holos/) platform, which integrates Backstage with Istio [External Authorization](https://istio.io/latest/docs/tasks/security/authorization/authz-custom/).

The authentication and authorization process are generally useful, however, and are not specific to Holos or to Istio. Any HTTP proxy operating as an identity aware proxy (IAP) capable of providing an oidc id token in a requiest header is compatible with this `oidcProxy` provider. For example, [NGINX](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-subrequest-authentication/), [oauth2-proxy](https://github.com/oauth2-proxy/oauth2-proxy), and Envoy [External Authorization](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/ext_authz_filter) are all capable of providing the id token in the http request.

It is assumed an IAP is already serving traffic in front of a Backstage instance configured to serve the frontend app from the backend.

## Configuration

Start by adding the following `auth` configuration in your `app-config.yaml` or
`app-config.production.yaml` or similar:

```yaml
auth:
  providers:
    oidc-proxy:
      # issuer is required, must match the iss claim of the id token.
      issuer: https://login.example.com
      # audience is required, must match one of the aud values listed in the id token.
      audience: 'https://backstage.example.com'
      # oidcIdTokenHeader is optional and may be set to any value except `authorization`.
      # The value of the header is the id token without a "Bearer " prefix.
      oidcIdTokenHeader: 'x-oidc-id-token'
      signIn:
        resolvers:
          # emailMatchingUserEntityProfileEmail resolves the authenticated id
          # token to a catalog entity by matching the email token claim to the
          # User spec.profile.email field of the catalog entity.
          - resolver: emailMatchingUserEntityProfileEmail
          # signInWithoutCatalogUser allows Sign-In without a pre-existing User
          # entity in the catalog.
          - resolver: signInWithoutCatalogUser
```

Consult your identity provider to obtain the value of the `issuer` and `audience` claims. If you have a token you can extract these values using [jwt.io](https://jwt.io).

This config section must be in place for the provider to load at all. Now let's add the provider itself.

### Resolvers

The `oidcProxy` provider supports two resolvers.

- `emailMatchingUserEntityProfileEmail`: Matches the `email` id token claim with the User entity that has a matching `spec.profile.email`.
- `signInWithoutCatalogUser`: allows Sign-In without a pre-existing User entity in the catalog.

:::note Note

The resolvers will be tried in order.

:::

If these resolvers do not fit your needs you can build a custom resolver, this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Changes

There is a module for this provider that you will need to add to your backend.

First you'll want to run this command to add the module:

```sh
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-oidc-proxy-provider
```

Then you will need to add this to your backend:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-auth-backend-module-oidc-proxy-provider'),
);
/* highlight-add-end */
```

## Frontend Changes

This provider is intended for use with the `ProxiedSignInPage`, which is installed in `packages/app/src/App.tsx` like this:

```tsx title="packages/app/src/App.tsx"
/* highlight-add-next-line */
import { ProxiedSignInPage } from '@backstage/core-components';

const app = createApp({
  /* highlight-add-start */
  components: {
    SignInPage: props => <ProxiedSignInPage {...props} provider="oidcProxy" />,
  },
  /* highlight-add-end */
  // ..
});
```

## Verification

With the frontend and backend changes in place, browsing to the Backstage base url should automatically sign in without any user interaction and display the home page. Open `/settings` and check the profile name and email address match your id token name and email claims.

If this plugin is not behaving as expected inspect the request to `/api/auth/oidcProxy/refresh` with the following process:

1. Open your browser network inspector.
2. Clear the backstage cookie.
3. Refresh the page.
4. Find the request to `/api/auth/oidcProxy/refresh`
5. Inspect the Response which should return a json object with a `profile` field, but may return an error message.

Refer to [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) for more information.
