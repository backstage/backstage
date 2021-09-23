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
2. Navigate to Menu >> Applications >> Applications >> `Create App Integration`
3. Fill out the Create a new app integration form:
   - `Sign-in method`: `OIDC - OpenID Connect`
   - `Application type`: `Web Application`
   - Click Next
4. Fill out the New Web App Integration form:
   - `App integration name`: `Backstage` (or your custom app name)
   - `Grant type`: `Authorization Code` & `Refresh Token`
   - `Sign-in redirect URIs`:
     `http://localhost:7000/api/auth/okta/handler/frame`
   - `Sign-out redirect URIs`: `http://localhost:7000`
   - `Controlled access`: (select as appropriate)
   - Click Save

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
