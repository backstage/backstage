---
id: provider
title: Okta Authentication Provider
sidebar_label: Okta
description: Adding Okta OAuth as an authentication provider in Backstage
---

The Backstage `core-api` package comes with a Okta authentication provider that
can authenticate users using Okta OpenID Connect.

## Create an Application on Okta

To add Okta authentication, you must create an Application from Okta:

1. Log into Okta (generally company.okta.com)
2. Navigation to Applications > Applications
3. Click `Add Application`
4. Click `Create New App` and select Web + OpenID Connect
5. Fill out the OpenID Connect App Integration form:
   - `Application name`: Backstage (or your custom app name)
   - `Login redirect URIs`: `Add URI` >
     `http://localhost:7000/api/auth/okta/handler/frame`
6. Click Save
7. Under `General Settings`, click Edit and check the `Refresh Token` box
8. Click Save

## Assign the Application

Okta login is only permitted to those people or groups that have this new
Application **assigned**. This can be done from Okta's Directory.

These are the steps to assign Backstage login permission to **everyone**:

1. Navigate to Directory > Groups on Okta
2. Click on the `Everyone` group
3. Click `Manage Apps` and then `Assign` next to Backstage

# Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    okta:
      development:
        clientId: ${AUTH_OKTA_CLIENT_ID}
        clientSecret: ${AUTH_OKTA_CLIENT_SECRET}
        audience: ${AUTH_OKTA_DOMAIN}
```

The values referenced are found on the Application page on your Okta site.

- `clientId`: The client ID that you generated on Okta, e.g.
  `3abe134ejxzF21HU74c1`
- `clientSecret`: The client secret shown for the Application.
- `audience`: The Okta domain shown for your Application, e.g.
  `https://company.okta.com`

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `oktaAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).
