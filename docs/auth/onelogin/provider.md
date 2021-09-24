---
id: provider
title: OneLogin Authentication Provider
sidebar_label: OneLogin
description: Adding OneLogin OIDC as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a OneLogin authentication
provider that can authenticate users using OpenID Connect.

## Create an Application on OneLogin

To support OneLogin authentication, you must create an Application:

1. From the OneLogin Admin portal, choose Applications
2. Click `Add App` and select `OpenID Connect`
   - Display Name: Backstage (or your custom app name)
3. Click Save
4. Go to the Configuration tab for the Application and set:
   - `Login Url`: `http://localhost:3000`
   - `Redirect URIs`: `http://localhost:7000/api/auth/onelogin/handler/frame`
5. Click Save
6. Go to the SSO tab for the Application and set:
   - `Token Endpoint` > `Authentication Method`: `POST`
7. Click Save

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    onelogin:
      development:
        clientId: ${AUTH_ONELOGIN_CLIENT_ID}
        clientSecret: ${AUTH_ONELOGIN_CLIENT_SECRET}
        issuer: https://<company>.onelogin.com/oidc/2
```

The OneLogin provider is a structure with three configuration keys; **these are
found on the SSO tab** for the OneLogin Application:

- `clientId`: The client ID
- `clientSecret`: The client secret
- `issuer`: The issuer URL

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `oneloginAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).
