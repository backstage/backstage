---
id: provider
title: Google Authentication Provider
sidebar_label: Google
description: Adding Google OAuth as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a Google authentication
provider that can authenticate users using Google OAuth.

## Create OAuth Credentials

To support Google authentication, you must create OAuth credentials:

1. Log in to the [Google Console](https://console.cloud.google.com)
2. Select or create a new project from the dropdown menu on the top bar
3. Navigate to
   [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
4. Click **Create Credentials** and choose `OAuth client ID`
5. Configure an OAuth consent screen, if required
   - For local development, you do not need to enter any Authorized domain
   - For scopes, select `openid`, `auth/userinfo.email` and
     `auth/userinfo.profile`
   - Add yourself as a test user, if using External user type
6. Set **Application Type** to `Web Application` with these settings:
   - `Name`: Backstage (or your custom app name)
   - `Authorized JavaScript origins`: <http://localhost:3000>
   - `Authorized Redirect URIs`:
     <http://localhost:7007/api/auth/google/handler/frame>
7. Click Create

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    google:
      development:
        clientId: ${AUTH_GOOGLE_CLIENT_ID}
        clientSecret: ${AUTH_GOOGLE_CLIENT_SECRET}
        ## uncomment to set lifespan of user session
        # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
        signIn:
          resolvers:
            # See https://backstage.io/docs/auth/google/provider#resolvers for more resolvers
            - resolver: emailMatchingUserEntityAnnotation
```

The Google provider is a structure with two configuration keys:

- `clientId`: The client ID that you generated, e.g.
  `10023341500512-beui241gjwwkrdkr2eh7dprewj2pp1q.apps.googleusercontent.com`
- `clientSecret`: The client secret tied to the generated client ID.

### Optional

- `sessionDuration`: Lifespan of the user session.

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found it will throw a `NotFoundError`.
- `emailMatchingUserEntityAnnotation`: Matches the email address from the auth provider with the User entity where the value of the `google.com/email` annotation matches. If no match is found it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order, but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs you can build a custom resolver, this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-google-provider
```

Then we will need to add this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend-module-google-provider'));
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `googleAuthApiRef` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#sign-in-configuration).
