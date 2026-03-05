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
      # You can customize the header name that contains the jwt token, by default
      # cf-access-jwt-assertion is used
      jwtHeaderName: <my-header>
      # You can customize the authorization cookie name, by default
      # CF_Authorization is used
      authorizationCookieName: <MY_CAUTHORIZATION_COOKIE_NAME>
      ## uncomment to set lifespan of user session
      # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
      # This picks what sign in resolver(s) you want to use.
      signIn:
        resolvers:
          # See https://backstage.io/docs/auth/cloudflare/provider#resolvers for more resolvers
          - resolver: emailMatchingUserEntityProfileEmail
```

This config section must be in place for the provider to load at all.

### Optional

- `sessionDuration`: Lifespan of the user session.

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found, it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found, it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs, you can build a custom resolver; this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend, we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-cloudflare-access-provider
```

Then we will need to add this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-auth-backend-module-cloudflare-access-provider'),
);
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

See [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) for pointers on how to set up the sign-in page and also make it work smoothly for local development. You'll use `cfaccess` as the provider name.

If you [provide a custom sign-in resolver](https://backstage.io/docs/auth/identity-resolver#building-custom-resolvers), you can skip the `signIn` block entirely.
