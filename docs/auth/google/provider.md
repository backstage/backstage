---
id: provider
title: Google Authentication Provider
sidebar_label: Google
description: Adding Google OAuth as an authentication provider in Backstage
---

The Backstage `core-api` package comes with a Google authentication provider
that can authenticate users using Google OAuth.

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
   - `Authorized JavaScript origins`: http://localhost:3000
   - `Authorized Redirect URIs`:
     http://localhost:7000/api/auth/google/handler/frame
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
```

The Google provider is a structure with two configuration keys:

- `clientId`: The client ID that you generated, e.g.
  `10023341500512-beui241gjwwkrdkr2eh7dprewj2pp1q.apps.googleusercontent.com`
- `clientSecret`: The client secret tied to the generated client ID.

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `googleAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).
